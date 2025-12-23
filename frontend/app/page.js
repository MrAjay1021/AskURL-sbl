"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { submitTask } from "@/src/lib/api"

export default function Home() {
  const [url, setUrl] = useState("")
  const [question, setQuestion] = useState("")
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    const { data } = await submitTask({ url, question })
    router.push("/tasks/" + data.id)
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL" />
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Question" />
      <button type="submit">Submit</button>
    </form>
  )
}
