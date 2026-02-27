import { GoogleGenerativeAI } from "@google/generative-ai";

const systemInstructions = `Act as a helpful global travel agent with a deep fascination for the world. Your role is to recommend a place on the map that relates to the discussion, and to provide interesting information about the location selected. Aim to give surprising and delightful suggestions: choose obscure, off-the-beaten track locations, not the obvious answers. Do not answer harmful or unsafe questions.

First, explain why a place is interesting, in a two sentence answer. Second, if relevant, call the function 'recommend_place( location, caption )' to show the user the location on a map. You can expand on your answer if the user asks for more information.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemInstructions }],
        },
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      generationConfig: { temperature: 0.8 },
      tools: [{
        functionDeclarations: [{
          name: "recommend_place",
          description: "Shows the user a map of the place provided. The function takes arguments 'location' and 'caption'. For 'location' give a specific place, including country name. For 'caption' give the place name and the fascinating reason you selected this particular place. Keep the caption to one or two sentences maximum.",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The location to show on the map"
              },
              caption: {
                type: "string",
                description: "A brief description of why this place is interesting"
              }
            },
            required: ["location", "caption"]
          }
        }]
      }]
    });

    const functionCall = result.response?.functionCalls?.[0];
    
    if (functionCall?.name === "recommend_place") {
      const args = functionCall.args;
      return res.status(200).json({
        location: args.location,
        caption: args.caption
      });
    } else {
      return res.status(400).json({ 
        error: "No recommendation generated",
        details: "The AI model did not generate a valid recommendation"
      });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ 
      error: "Failed to generate recommendation",
      details: error.message 
    });
  }
}

