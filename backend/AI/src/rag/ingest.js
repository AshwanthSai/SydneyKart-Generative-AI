import 'dotenv/config'
import { Index } from '@upstash/vector'
import ora from 'ora'
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config({ path: "../../backend/config/config.env" });

// Initialize Upstash Vector client
const index = new Index({
  url: `${process.env.UPSTASH_VECTOR_REST_URL}`,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})



export async function indexMovieData() {
  // Read the CSV file and store the results in an array
  const spinner = ora('Reading product data...').start()
  // Read and parse CSV file
  // process.cwd fetches the present working directory
  let response;
  try {
    response = await axios.get(`${process.env.BACKEND_URL}/api/v1/products?`);
  } catch (error){
    console.error(`There was an Error fetching the data: ${error}`);

  }

  
  spinner.text = 'Starting product indexing...'
  for (const product of response.data.products) {
    spinner.text = `Indexing Product: ${product.name}`
    const text = `${product.name}. ${product.category}. ${product.price}. ${product.description}`
    try {
      await index.upsert({
        id: product.name, // Using Rank as unique ID
        data: text, // Text will be automatically embedded
        metadata: {
          ratings: Number(product.ratings),
          seller: product.seller,
          category: product.category,
          numOfReviews: Number(product.numOfReviews),
          stock: Number(product.stock),
        },
      })
    } catch (error) {
      spinner.fail(`Error indexing product ${product.name}`)
      console.error(error)
    }
  }
  spinner.succeed('Finished indexing product data')
}

indexMovieData()
