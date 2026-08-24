import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// Current OpenAI models (previously a fine-tuned gpt-3.5-turbo-0125
// checkpoint that no longer matches what we advertise elsewhere).
const CHAT_MODEL = "gpt-4o";
const EMBEDDING_MODEL = "text-embedding-3-small";

const template = `You are an expert in tailoring resumes to specific job descriptions and user inputs.
Using the context provided, craft a detailed, professional, and personalized resume that aligns closely with the job description.
Leverage the dataset provided by the fine-tuned model and use your expertise to generate creative and tailored content.
If the context or data does not provide enough information, respond with "I don't know" and suggest additional details or clarifications to proceed.

  {context}
  Question: {question}
  Tailored Answer:`;

// `session` is the per-request state created in server.js
// ({ filePath, vectorStore }), one entry per uploaded file/client.
// We only build the vector store once per uploaded file and cache it on
// the session so repeated questions against the same PDF don't re-load,
// re-split, and re-embed the whole document on every single query.
const chat = async (session, query) => {
  if (!session.vectorStore) {
    // step 1:
    const loader = new PDFLoader(session.filePath);
    const data = await loader.load();

    // step 2:
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500, //  (in terms of number of characters)
      chunkOverlap: 0,
    });
    const splitDocs = await textSplitter.splitDocuments(data);

    // step 3
    const embeddings = new OpenAIEmbeddings({
      modelName: EMBEDDING_MODEL,
      openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    session.vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );
  }

  // step 4/5: retrieval + qa w/ customized prompt
  const model = new ChatOpenAI({
    modelName: CHAT_MODEL,
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const chain = RetrievalQAChain.fromLLM(
    model,
    session.vectorStore.asRetriever(),
    {
      prompt: PromptTemplate.fromTemplate(template),
      // returnSourceDocuments: true,
    }
  );

  const response = await chain.call({
    query,
  });

  return response;
};

export default chat;
