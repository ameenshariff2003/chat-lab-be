import dotenv from "dotenv"
dotenv.config()

import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq";

import readline from "readline/promises"
import { AIMessage, HumanMessage,SystemMessage} from "@langchain/core/messages"




const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})
const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
    apiKey: process.env.GOOGLE_API_KEY

    // other params...
})
const gorqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GORQ_API_KEY,
});

export async function generateResponse(messages) {
  
    const response = await geminiModel.invoke(messages.map(msg=>{
        if(msg.role == "user"){
            return new HumanMessage(msg.content)
        }else if(msg.role == "ai"){
            return new AIMessage(msg.content)
        }
    }))

    return response.text


}

export async function generateTitle(message) {

     const response = await gorqModel.invoke([
        new HumanMessage(`
            Generate a short and relevant title for the following conversation.

            Rules:
            - words length min 3 and max 4
            - Do not use quotation marks
            - Return only the title
            - Do not add explanations

            Conversation:
            ${message}
        `),
    ]);

    return response.text

    
}