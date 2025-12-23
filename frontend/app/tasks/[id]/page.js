"use client"
import { useParams } from "next/navigation"
import { useTask } from "../../../src/lib/hooks/useTask"

export default function TaskPage() {
  const { id } = useParams()
  const { data, isLoading, error } = useTask(id)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading task</p>

  return (
    <div>
      <p>Status: {data.status}</p>
      <p>URL: {data.url}</p>
      <p>Question: {data.question}</p>

      {data.status === "PENDING" && <p>Queued</p>}
      {data.status === "PROCESSING" && <p>Scraping & analyzing...</p>}
      {data.status === "COMPLETED" && <pre>{data.aiResponse}</pre>}
      {data.status === "FAILED" && <p>{data.errorMessage}</p>}
    </div>
  )
}
