import 'dotenv/config'
import { Index } from '@upstash/vector'
import ora from 'ora'
import axios from 'axios';
import dotenv from "dotenv";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars with absolute path
dotenv.config({ path: join(__dirname, '../config/config.env') });

// Initialize Upstash Vector client
const index = new Index({
  url: `${process.env.UPSTASH_VECTOR_REST_URL}`,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

// Ingest all product data into RAG Database
export async function indexProductData() {
  const spinner = ora('Reading product data...').start()
  let response;
  try {
    // response = await axios.get(`${process.env.BACKEND_URL}/api/v1/ingest/products`);
    response = await axios.get(`${process.env.BACKEND_URL}/ingest/products`);
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
          _id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          ratings: product.ratings,
          images: product.images,
          numOfReviews: product.numOfReviews
        },
      })
    } catch (error) {
      spinner.fail(`Error indexing product ${product.name}`)
      console.error(error)
    }
  }
  spinner.succeed('Finished indexing product data')
}


indexProductData()
