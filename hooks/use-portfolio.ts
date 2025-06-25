"use client"

import { useState, useEffect, useCallback } from "react"
import type { Certificate, Project, Skill } from "@/types/portfolio"

// Certificates hook
export function useCertificates(limit?: number, category?: string) {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (limit) params.append("limit", limit.toString())
      if (category) params.append("category", category)

      const response = await fetch(`/api/certificates?${params}`)
      if (!response.ok) throw new Error("Failed to fetch certificates")

      const data = await response.json()
      setCertificates(data.certificates || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch certificates")
    } finally {
      setLoading(false)
    }
  }, [limit, category])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const createCertificate = async (certificateData: Partial<Certificate>) => {
    const response = await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certificateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create certificate")
    }

    const data = await response.json()
    setCertificates((prev) => [data.certificate, ...prev])
    return data.certificate
  }

  const updateCertificate = async (id: string, certificateData: Partial<Certificate>) => {
    const response = await fetch(`/api/certificates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certificateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update certificate")
    }

    const data = await response.json()
    setCertificates((prev) => prev.map((cert) => (cert.id === id ? data.certificate : cert)))
    return data.certificate
  }

  const deleteCertificate = async (id: string) => {
    const response = await fetch(`/api/certificates/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete certificate")
    }

    setCertificates((prev) => prev.filter((cert) => cert.id !== id))
  }

  return {
    certificates,
    loading,
    error,
    refresh: fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  }
}

// Projects hook
export function useProjects(limit?: number, category?: string, featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (limit) params.append("limit", limit.toString())
      if (category) params.append("category", category)
      if (featured !== undefined) params.append("featured", featured.toString())

      const response = await fetch(`/api/projects?${params}`)
      if (!response.ok) throw new Error("Failed to fetch projects")

      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }, [limit, category, featured])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = async (projectData: Partial<Project>) => {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create project")
    }

    const data = await response.json()
    setProjects((prev) => [data.project, ...prev])
    return data.project
  }

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update project")
    }

    const data = await response.json()
    setProjects((prev) => prev.map((proj) => (proj.id === id ? data.project : proj)))
    return data.project
  }

  const deleteProject = async (id: string) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete project")
    }

    setProjects((prev) => prev.filter((proj) => proj.id !== id))
  }

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}

// Skills hook
export function useSkills(category?: string) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append("category", category)

      const response = await fetch(`/api/skills?${params}`)
      if (!response.ok) throw new Error("Failed to fetch skills")

      const data = await response.json()
      setSkills(data.skills || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skills")
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const createSkill = async (skillData: Partial<Skill>) => {
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create skill")
    }

    const data = await response.json()
    setSkills((prev) => [...prev, data.skill].sort((a, b) => a.name.localeCompare(b.name)))
    return data.skill
  }

  const updateSkill = async (id: string, skillData: Partial<Skill>) => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update skill")
    }

    const data = await response.json()
    setSkills((prev) =>
      prev.map((skill) => (skill.id === id ? data.skill : skill)).sort((a, b) => a.name.localeCompare(b.name)),
    )
    return data.skill
  }

  const deleteSkill = async (id: string) => {
    const response = await fetch(`/api/skills/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete skill")
    }

    setSkills((prev) => prev.filter((skill) => skill.id !== id))
  }

  return {
    skills,
    loading,
    error,
    refresh: fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  }
}
