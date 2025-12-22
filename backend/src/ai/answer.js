import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export async function answerQuestion({ content, question }) {
  try {
    const prompt = `
Answer this question based on the following content.

Content:
${content}

Question:
${question}
`

    const result = await model.generateContent(prompt) // Calling model
    const answer = result.response.text() // Getting text response

    return { success: true, answer } // Return
  } catch (err) {
    return {
      success: false,
      error: err.message || 'AI error occurred', // Catch errors, return
    }
  }
}
