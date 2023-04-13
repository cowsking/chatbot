import { OpenAI } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { HNSWLib, SupabaseVectorStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant and a Shopping guide according to context. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only use hyperlinks as references that are explicitly listed as a source in the context below. Do NOT make up a hyperlink that is not listed. 
Don't reply link when you can't find the answer in the context below.
Check avaiblility of the products by the keyword following soldout. If the keyword following soldout is Yes, the product is sold out. If the keyword following soldout is No, the product is available.
if the hyperlink you can provide is href='/' as prefix, you should add the prefix to the hyperlink, the prefix is http://jcrew.com. You should be aware this link is the product link. The product link should be following the keyword source.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
When you are asked to provide a price, soldout or not, description or title name, you should provide the answer for the product you talk just now.
If the question is not related to description of the product, price, source, whether soldout or the context provided, politely inform them that you are tuned to only answer questions that are related to J.Crew.
Choose the most relevant link that matches the context provided:

Question: {question}
=========
context: {context}
=========
Answer in Markdown:`,
);

export const makeChain = (
  vectorstore: SupabaseVectorStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0,
      streaming: Boolean(onTokenStream),
      callbackManager: {
        handleNewToken: onTokenStream,
      },
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
  });
};
