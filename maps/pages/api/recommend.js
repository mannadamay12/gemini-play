import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { message } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { temperature: 0.5 }, // Lowered temperature
      tools: [
        {
          functionDeclarations: [
            {
              name: "recommend_place",
              description:
                "Shows a map of the provided place. Includes a location and caption.",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  caption: { type: "string" },
                },
                required: ["location", "caption"],
              },
            },
          ],
        },
      ],
    });

    const functionCall = result.response?.functionCalls?.[0];

    if (functionCall && functionCall.name === "recommend_place") {
      res.status(200).json(functionCall.args);
    } else {
      res.status(200).json({ message: "No recommendation requested." }); // More informative
    }
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" }); // More informative error
  }
}