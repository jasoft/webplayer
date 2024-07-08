import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function getGroqChatCompletion(messages) {
    return groq.chat.completions.create({
        messages: messages,

        model: "llama3-8b-8192",
    })
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" })
        return
    }

    const { q } = req.body

    try {
        const response = await getGroqChatCompletion([
            {
                role: "user",
                content: q,
            },
        ])
        res.status(200).json({ response })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
