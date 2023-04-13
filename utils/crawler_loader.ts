// productScraper.ts
import axios from "axios";
import cheerio from "cheerio";
import { Document } from 'langchain/document';
interface Product {
  title: string;
  price: number;
  description: string;
}

export async function extractProductDetails(url: string): Promise<Product | undefined> {
  try {
    // const headers = {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    //   };

    // const response = await axios.get(url, {headers});
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const scriptTag = $("script[type='application/json']");

    if (!scriptTag) {
      console.log("skip");
      return;
    }

    const jsonData = JSON.parse(scriptTag.html());
    const productData = Object.values(
      jsonData.props.initialState.products.productsByProductCode
    )[0];

    const title = $(".product__name").text().trim();
    // console.log("productData:", productData);
    const listPrice = productData.listPrice;
    const description = productData.productDescriptionRomance;

    // console.log("title:", title);
    // console.log("price:", price);
    // console.log("description:", description);
    // console.log("url:", url);
    //if price is null, save as null
    let price;
    let soldOut = "no";
    if(listPrice == null){
        price = 'sold out';
        soldOut = "yes";
    }
    else{
        price = listPrice.amount;
    }
    

    let content = '';
    content ='title: ' + title + ' price: ' + price + ' description: ' + description + ' sold out: ' + soldOut + ' source: ' + url;
    // const cleanedContent = description.replace(/\s+/g, ' ').trim();

    const contentLength = description?.match(/\b\w+\b/g)?.length ?? 0;

    const metadata = { source: url, title, price, soldOut, contentLength };

    return [new Document({ pageContent: content, metadata })];
  } catch (error) {
    console.error(`Error while extracting data from ${url}: ${error}`);
    return;
  }
}