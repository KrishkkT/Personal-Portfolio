import dataStore from "../../dataStore" // Assuming dataStore is imported from a relative path

const CertificatesPage = async () => {
  const data = await dataStore.getAllCertificates() // Updated data loading call

  // Render the certificates data here
  return (
    <div>
      <h1>Certificates</h1>
      {/* Display certificates data */}
    </div>
  )
}

export default CertificatesPage
