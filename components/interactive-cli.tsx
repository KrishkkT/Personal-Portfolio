"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Command {
  input: string
  output: string[]
  timestamp: string
}

interface DeviceInfo {
  os: string
  browser: string
  deviceType: string
  userAgent: string
}

export default function InteractiveCLI() {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent
    let os = "Unknown OS"
    let browser = "Unknown Browser"
    let deviceType = "Desktop"

    // Detect OS
    if (userAgent.includes("Windows")) os = "Windows"
    else if (userAgent.includes("Mac")) os = "macOS"
    else if (userAgent.includes("Linux")) os = "Linux"
    else if (userAgent.includes("Android")) os = "Android"
    else if (userAgent.includes("iOS")) os = "iOS"

    // Detect Browser
    if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"
    else if (userAgent.includes("Edge")) browser = "Edge"
    else if (userAgent.includes("Opera")) browser = "Opera"

    // Detect Device Type
    if (/Mobi|Android/i.test(userAgent)) deviceType = "Mobile"
    else if (/Tablet|iPad/i.test(userAgent)) deviceType = "Tablet"

    return { os, browser, deviceType, userAgent }
  }

  const fetchIPAddress = async (format = "text", callback?: string): Promise<string[]> => {
    try {
      let url = `https://api64.ipify.org`
      if (format !== "text") {
        url += `?format=${format}`
        if (callback && format === "jsonp") {
          url += `&callback=${callback}`
        }
      }

      const response = await fetch(url)
      const data = await response.text()

      if (format === "text") {
        return [`Your IP Address: ${data}`]
      } else if (format === "json") {
        const parsed = JSON.parse(data)
        return [`IP Address (JSON format):`, `{`, `  "ip": "${parsed.ip}"`, `}`]
      } else if (format === "jsonp") {
        return [`IP Address (JSONP format):`, data]
      }

      return [`IP Address: ${data}`]
    } catch (error) {
      return [`Error fetching IP address: ${error instanceof Error ? error.message : "Unknown error"}`]
    }
  }

  const executeCommand = async (input: string) => {
    const trimmedInput = input.trim().toLowerCase()
    const timestamp = new Date().toLocaleTimeString()
    let output: string[] = []

    setIsLoading(true)

    try {
      switch (true) {
        case trimmedInput === "whoami":
          output = [
            "User Identity Information:",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "Username: visitor",
            "User ID: guest-user",
            "Role: Portfolio Visitor",
            "Session: Temporary (no data stored)",
            "Access Level: Public",
            `Timestamp: ${new Date().toISOString()}`,
          ]
          break

        case trimmedInput === "ip address" || trimmedInput === "ip":
          output = await fetchIPAddress()
          break

        case trimmedInput.startsWith("ip address --format="):
          const format = trimmedInput.split("--format=")[1]
          if (["text", "json", "jsonp"].includes(format)) {
            output = await fetchIPAddress(format)
          } else {
            output = ["Error: Invalid format. Use: text, json, or jsonp"]
          }
          break

        case trimmedInput.startsWith("ip address --format=jsonp --callback="):
          const parts = trimmedInput.split("--callback=")
          const callbackName = parts[1]
          output = await fetchIPAddress("jsonp", callbackName)
          break

        case trimmedInput === "device information" || trimmedInput === "device":
          const deviceInfo = getDeviceInfo()
          output = [
            "Device Information:",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            `Operating System: ${deviceInfo.os}`,
            `Browser: ${deviceInfo.browser}`,
            `Device Type: ${deviceInfo.deviceType}`,
            `Screen Resolution: ${window.screen.width}x${window.screen.height}`,
            `Viewport: ${window.innerWidth}x${window.innerHeight}`,
            `Language: ${navigator.language}`,
            `Platform: ${navigator.platform}`,
            `Cookies Enabled: ${navigator.cookieEnabled ? "Yes" : "No"}`,
            `Online Status: ${navigator.onLine ? "Online" : "Offline"}`,
            "",
            "User Agent:",
            deviceInfo.userAgent,
          ]
          break

        case trimmedInput === "help" || trimmedInput === "?":
          output = [
            "Available Commands:",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "whoami                           - Display user identity",
            "ip                               - Get IP address (text format)",
            "device                           - Display device information",
            "clear                            - Clear terminal",
            "help                             - Show this help message",
            "",
            "Note: No data is stored when you exit the website.",
          ]
          break

        case trimmedInput === "clear":
          setCommands([])
          setIsLoading(false)
          return

        case trimmedInput === "":
          setIsLoading(false)
          return

        default:
          output = [`Command not found: ${input}`, "Type 'help' to see available commands."]
          break
      }
    } catch (error) {
      output = [`Error executing command: ${error instanceof Error ? error.message : "Unknown error"}`]
    }

    const newCommand: Command = {
      input,
      output,
      timestamp,
    }

    setCommands((prev) => [...prev, newCommand])
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim()) {
      executeCommand(currentInput)
      setCurrentInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for common commands
      const commonCommands = ["whoami", "ip", "device", "help", "clear"]
      const matches = commonCommands.filter((cmd) => cmd.startsWith(currentInput.toLowerCase()))
      if (matches.length === 1) {
        setCurrentInput(matches[0])
      }
    }
  }

  return (
    <section ref={sectionRef} className="royal-spacing royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold mb-6 text-white">
            Interactive <span className="gradient-text">CLI</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore system information and network details through the secure command-line interface.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto kali-terminal"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="kali-terminal-header">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-300 font-mono">kt@cli:~</span>
            </div>
            <div className="w-16"></div>
          </div>

          <div ref={terminalRef} className="kali-terminal-body max-h-96 overflow-y-auto">
            <div className="mb-4">
              <div className="text-cyan-400 font-mono text-sm mb-2">[kt㉿cli]~</div>
              <div className="text-gray-300 font-mono text-sm">Welcome to the Interactive CLI</div>
              <div className="text-gray-300 font-mono text-sm mb-4">
                Type 'help' to see available commands. No data is stored.
              </div>
            </div>

            {commands.map((command, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-1">
                  <span className="text-blue-400 font-mono font-bold text-sm">[</span>
                  <span className="text-red-400 font-mono font-bold text-sm">kt</span>
                  <span className="text-cyan-400 font-mono text-sm">㉿</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">cli</span>
                  <span className="text-cyan-400 font-mono text-sm">]</span>
                  <span className="text-white font-mono font-bold text-sm">~</span>
                  <span className="text-gray-400 font-mono text-xs ml-2">{command.timestamp}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-red-400 font-mono text-sm">$ </span>
                  <span className="text-white font-mono text-sm">{command.input}</span>
                </div>
                <div className="ml-4">
                  {command.output.map((line, i) => (
                    <div key={i} className="font-mono text-sm text-green-400 leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="flex items-center">
                <span className="text-cyan-400 font-mono text-sm">[</span>
                <span className="text-red-400 font-mono font-bold text-sm">kt</span>
                <span className="text-cyan-400 font-mono text-sm">㉿</span>
                <span className="text-blue-400 font-mono font-bold text-sm">cli</span>
                <span className="text-cyan-400 font-mono text-sm">]</span>
                <span className="text-white font-mono font-bold text-sm">~</span>             
              </div>
              <br />
              <div className="flex items-center w-full">
                <span className="text-red-400 font-mono text-sm">$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white font-mono text-sm outline-none ml-1"
                  placeholder={isLoading ? "Processing..." : "Type a command..."}
                  disabled={isLoading}
                  autoFocus
                />
                {isLoading && <div className="text-yellow-400 font-mono text-sm animate-pulse">⏳</div>}
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-sm text-gray-400">
            🔒 Privacy Notice: No commands or data are stored. All information is processed locally and discarded when
            you leave.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
