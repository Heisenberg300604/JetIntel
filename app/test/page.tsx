"use client"

import { useEffect, useState } from "react"

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jets`)
      .then(res => res.json())
      .then(res => {
        console.log("Backend response:", res)
        setData(res)
      })
      .catch(err => {
        console.error(err)
        setError("Failed to fetch")
      })
  }, [])

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Backend Test</h1>
//       {error && <p>{error}</p>}
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   )
// }

return (
  <div style={{ padding: 40 }}>
    <h1>Backend Test</h1>

    {error && <p>{error}</p>}

    {!data && <p>Loading...</p>}

    {data && data.map((jet: any) => (
      <div key={jet._id} style={{ marginBottom: 40 }}>
        <h2>
          {jet.manufacturer} {jet.model}
        </h2>

        <img
          src="/def-jet.png"
          alt="Default Jet"
          style={{
            width: 300,
            height: 200,
            objectFit: "cover",
            borderRadius: 8
          }}
        />
      </div>
    ))}
  </div>
)
}