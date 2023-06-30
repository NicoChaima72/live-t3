import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextApiRequest } from "next";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

export default async function handler(req: NextApiRequest) {
  // Extract the `messages` from the body of the request
  const { messages } = req.body;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  console.log("response", response);
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onStart: async () => {
      console.log("Started streaming");
    },
    onToken: async (token) => {
      console.log("Received token", token);
    },
    onCompletion: async (completion) => {
      console.log("Completed streaming", completion);
    },
  });

  // Respond with the stream
  const finalResponse = new StreamingTextResponse(stream);

  console.log({ finalResponse });

  return finalResponse;
}
