import axios from "axios";
import cheerio from "cheerio";
import { Document } from 'langchain/document';
interface Product {
  title: string;
  price: number;
  description: string;
}

async function extractProductDetails(url: string): Promise<Product | undefined> {
  try {
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
    const price = productData.listPrice.amount;
    const description = productData.productDescriptionRomance;

    console.log("title:", title);
    console.log("price:", price);
    console.log("description:", description);
    console.log("url:", url);


    

    const cleanedContent = description.replace(/\s+/g, ' ').trim();

    const contentLength = description?.match(/\b\w+\b/g)?.length ?? 0;

    const metadata = { source: url, title, date, contentLength };

    return [new Document({ pageContent: cleanedContent, metadata })];

  } catch (error) {
    console.error(`Error while extracting data from ${url}: ${error}`);
    return;
  }
}

(async function run(url: string) {
  try {
    await extractProductDetails(url);
  } catch (error) {
    console.log("error occured:", error);
  }
})("https://www.jcrew.com/p/mens/categories/clothing/shirts/secret-wash/secret-wash-cotton-poplin-shirt/BJ706?display=standard&fit=Classic&color_name=black&colorProductCode=BJ706");