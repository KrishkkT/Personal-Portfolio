import dataStore from "@/app/dataStore"

async function loadExperience() {
  const data = await dataStore.getAllExperience() // Updated to remove the 'true' parameter
  return data
}

const ExperiencePage = async () => {
  const experienceData = await loadExperience()
  return (
    <div>
      {/* Render experience data here */}
      {experienceData.map((experience) => (
        <div key={experience.id}>
          <h2>{experience.title}</h2>
          <p>{experience.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ExperiencePage
