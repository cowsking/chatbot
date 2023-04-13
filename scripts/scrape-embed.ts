import { Document } from 'langchain/document';
import * as fs from 'fs/promises';
import { CustomWebLoader } from '@/utils/custom_web_loader';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { supabaseClient } from '@/utils/supabase-client';
import { urls } from '@/config/notionurls';
import { extractProductDetails } from "@/utils/crawler_loader";
import * as fs from 'fs';
async function extractDataFromUrl(url: string): Promise<Document[]> {
  try {
    const loader = new CustomWebLoader(url);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.error(`Error while extracting data from ${url}: ${error}`);
    return [];
  }
}

async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
  console.log('extracting data from urls...');


  const documents: Document[] = [];
  for (const url of urls) {
    const docs = await extractProductDetails(url);
    console.log(url);
    try {
    documents.push(...docs);}
    catch(error){
      console.log("error", error);
    }
  }
  console.log('data extracted from urls');
  const json = JSON.stringify(documents);
  await fs.promises.writeFile('franknotion.json', json);
  console.log('json file containing data saved on disk');
  return documents;
}

async function extractDataFromUrlsMulti(urls: string[]): Promise<Document[]> {
  console.log('extracting data from urls...');

  const documents: Document[] = [];
  const urlChunks = chunkArray(urls, 8);

  for (const urlChunk of urlChunks) {
    const promises = urlChunk.map(url => extractProductDetails(url));
    const results = await Promise.all(promises);

    for (const docs of results) {
      try {
        documents.push(...docs);
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  console.log('data extracted from urls');
  const json = JSON.stringify(documents);
  await fs.promises.writeFile('franknotion.json', json);
  console.log('json file containing data saved on disk');
  return documents;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let index = 0; index < array.length; index += chunkSize) {
    chunks.push(array.slice(index, index + chunkSize));
  }
  return chunks;
}


async function embedDocuments(
  client: SupabaseClient,
  docs: Document[],
  embeddings: Embeddings,
) {
  console.log('creating embeddings...');
  await SupabaseVectorStore.fromDocuments(client, docs, embeddings);
  console.log('embeddings successfully stored in supabase');
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

(async function run(urls: string[]) {
  //get urls from utils/pdp_urls.txt each line is a url save in array

// Read the file with the URLs
  const urlsFile = fs.readFileSync('utils/pdp_urls.txt', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });
  

// Split the file content by new line characters to get an array of URLs
  const urlsArray = (await urlsFile).split('\n');

// Remove any empty or whitespace-only strings from the array
  const cleanUrlsArray = urlsArray.filter(url => url.trim() !== '');
  try {
    //load data from each url
    // console.log('cleanUrlsArray', cleanUrlsArray);
    // console.log(urls)
    const rawDocs = await extractDataFromUrlsMulti(cleanUrlsArray);
    // console.log('raw docs', rawDocs);
    // split docs into chunks for openai context window
    const docs = await splitDocsIntoChunks(rawDocs);
    //embed docs into supabase
    await embedDocuments(supabaseClient, docs, new OpenAIEmbeddings());
  } catch (error) {
    console.log('error occured:', error);
  }
})(urls);
