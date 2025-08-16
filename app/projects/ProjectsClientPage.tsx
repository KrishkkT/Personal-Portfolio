"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { DataStore } from "../data/DataStore"
import type { Project } from "../models/Project"
import ProjectList from "./ProjectList"

const ProjectsClientPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const dataStore = new DataStore()

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataStore.getAllProjects() // Updated line to remove the 'true' parameter
      setProjects(data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Projects</h1>
      <ProjectList projects={projects} />
    </div>
  )
}

export default ProjectsClientPage
