"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRef } from "react"

type Command = {
  command: string
  response: string[]
}

const commands: Command[] = [
  {
    command: "whoami",
    response: ["kt - Elite Full Stack Developer & Cybersecurity Specialist"],
  },
  {
    command: "ls -la /skills",
    response: [
      "total 64",
      "drwxr-xr-x  8 kt kt 4096 Dec  5 2024 .",
      "drwxr-xr-x  3 kt kt 4096 Dec  5 2024 ..",
      "drwxr-xr-x  2 kt kt 4096 Dec  5 2024 frontend/",
      "drwxr-xr-x  2 kt kt 4096 Dec  5 2024 backend/",
      "drwxr-xr-x  2 kt kt 4096 Dec  5 2024 design/",
      "drwxr-xr-x  2 kt kt 4096 Dec  5 2024 security/",
      "drwxr-xr-x  2 kt kt 4096 Dec  5 2024 devops/",
      "-rw-r--r--  1 kt kt  256 Dec  5 2024 expertise.txt",
    ],
  },
  {
    command: "cat /about/profile.txt",
    response: [
      "========================================",
      "         ELITE DEVELOPER PROFILE       ",
      "========================================",
      "Name: KT",
      "Role: Full Stack Developer & UI/UX Designer",
      "Specialization: Premium Digital Experiences",
      "Years of Experience: 5+",
      "Mission: Crafting extraordinary solutions",
      "Status: Available for elite projects",
      "========================================",
    ],
  },
  {
    command: "nmap -sS localhost",
    response: [
      "Starting Nmap scan on localhost...",
      "PORT     STATE SERVICE",
      "22/tcp   open  ssh",
      "80/tcp   open  http",
      "443/tcp  open  https",
      "3000/tcp open  node",
      "5432/tcp open  postgresql",
      "",
      "Scan complete. All services secured.",
    ],
  },
  {
    command: "sudo systemctl status creativity.service",
    response: [
      "● creativity.service - Creative Innovation Engine",
      "   Loaded: loaded (/etc/systemd/system/creativity.service; enabled)",
      "   Active: active (running) since Mon 2024-01-01 00:00:00 UTC",
      "   Main PID: 1337 (innovation)",
      "   Memory: ∞ (unlimited creative potential)",
      "   CGroup: /system.slice/creativity.service",
      "           └─1337 /usr/bin/innovation --mode=premium",
      "",
      "Status: Ready to transform ideas into reality",
    ],
  },
]

export default function Terminal() {
  const [displayedCommands, setDisplayedCommands] = useState<Command[]>([])
  const [currentCommand, setCurrentCommand] = useState(0)
  const [typing, setTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
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
    if (!isVisible || currentCommand >= commands.length) {
      return
    }

    if (typing) {
      if (charIndex < commands[currentCommand].command.length) {
        const timer = setTimeout(() => {
          setCharIndex(charIndex + 1)
        }, 80)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setTyping(false)
          setDisplayedCommands((prev) => [
            ...prev,
            {
              command: commands[currentCommand].command,
              response: commands[currentCommand].response,
            },
          ])
        }, 500)
        return () => clearTimeout(timer)
      }
    } else {
      const timer = setTimeout(() => {
        setCurrentCommand(currentCommand + 1)
        setTyping(true)
        setCharIndex(0)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentCommand, typing, charIndex, isVisible])

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
            Elite <span className="gradient-text">Terminal</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore my capabilities through the command line interface - where precision meets power.
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
              <span className="text-sm text-gray-300 font-mono">kt@kali-elite:~</span>
            </div>
            <div className="w-16"></div>
          </div>

          <div className="kali-terminal-body">
            <div className="mb-4">
              <div className="text-cyan-400 font-mono text-sm mb-2">┌──(kt㉿kali-elite)-[~]</div>
              <div className="text-gray-300 font-mono text-sm">Welcome to Kali Linux Elite Edition</div>
              <div className="text-gray-300 font-mono text-sm mb-4">
                Last login: {new Date().toLocaleDateString()} from premium.terminal
              </div>
            </div>

            {displayedCommands.map((cmd, index) => (
              <motion.div
                key={index}
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="kali-terminal-line">
                  <span className="text-cyan-400 font-mono">┌──(</span>
                  <span className="text-red-400 font-mono font-bold">kt</span>
                  <span className="text-cyan-400 font-mono">㉿</span>
                  <span className="text-blue-400 font-mono font-bold">kali-elite</span>
                  <span className="text-cyan-400 font-mono">)-[</span>
                  <span className="text-white font-mono font-bold">~</span>
                  <span className="text-cyan-400 font-mono">]</span>
                </div>
                <div className="kali-terminal-line">
                  <span className="text-cyan-400 font-mono">└─</span>
                  <span className="text-red-400 font-mono">$ </span>
                  <span className="text-white font-mono">{cmd.command}</span>
                </div>
                <div className="mt-2">
                  {cmd.response.map((line, i) => (
                    <motion.div
                      key={i}
                      className="font-mono text-sm text-green-400 leading-relaxed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {currentCommand < commands.length && isVisible && (
              <div className="kali-terminal-line">
                <span className="text-cyan-400 font-mono">┌──(</span>
                <span className="text-red-400 font-mono font-bold">kt</span>
                <span className="text-cyan-400 font-mono">㉿</span>
                <span className="text-blue-400 font-mono font-bold">kali-elite</span>
                <span className="text-cyan-400 font-mono">)-[</span>
                <span className="text-white font-mono font-bold">~</span>
                <span className="text-cyan-400 font-mono">]</span>
                <br />
                <span className="text-cyan-400 font-mono">└─</span>
                <span className="text-red-400 font-mono">$ </span>
                <span className="text-white font-mono">
                  {commands[currentCommand].command.substring(0, charIndex)}
                  {typing && <span className="kali-terminal-cursor"></span>}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
