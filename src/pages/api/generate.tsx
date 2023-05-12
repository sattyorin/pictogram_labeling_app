import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi, CreateChatCompletionRequest, CreateCompletionResponse } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface ErrorData {
  error: {
    message: string;
  };
}

interface OpenAIError {
  response: {
    status: number;
    data: ErrorData;
  };
  message: string;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const message = req.body.message || '';
  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion_chat = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt(message) }],
    } as CreateChatCompletionRequest);
    console.log(message);
    const result = completion_chat.data.choices?.[0]?.message?.["content"];
    if (!result) {
      throw new Error("Response from OpenAI API does not contain expected data");
    }
    console.log(result);
    res.status(200).json({ result });
  } catch (error: any) {
    const openAIError = error as OpenAIError;
    if (openAIError.response) {
      console.error(openAIError.response.status, openAIError.response.data);
      res.status(openAIError.response.status).json(openAIError.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${openAIError.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(message: string): string {
  return `
  I would like to find a pictogram that meets the following requirements, please read the following text and give me five appropriate keywords.
  If you do not understand the meaning of the request, please output "Input is not appropriate".
 
  Requirements: Cover of the presentation "What is Machine Learning?"
  Answer: Machine Learning, Artificial Intelligence, Algorithm, Data Analysis, Neural Network
  Requirements: Material about cosmetics sales
  Answer: Cosmetics, Sales, Beauty, Products, Retail, Makeup
  Requirements: ${message}
  Answer:
  `;
}

