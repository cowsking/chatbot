import { extractProductDetails } from "@/utils/crawler_loader";
import * as fs from 'fs';
async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
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


const urls = [
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',
  'https://www.jcrew.com/p/BC014',
  'https://www.jcrew.com/p/BN111',
  'https://www.jcrew.com/p/BP437',
  'https://www.jcrew.com/p/BU466',
  'https://www.jcrew.com/p/J4392',
  'https://www.jcrew.com/p/J4440',
  'https://www.jcrew.com/p/K1818',
  'https://www.jcrew.com/p/K1848',
  'https://www.jcrew.com/p/K1859',
  'https://www.jcrew.com/p/K2051',

];

console.log(extractDataFromUrls(urls));
