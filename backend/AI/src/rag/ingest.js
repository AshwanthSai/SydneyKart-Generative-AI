import 'dotenv/config'
import { Index } from '@upstash/vector'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import ora from 'ora'

// Initialize Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
})

export async function indexMovieData() {
  // Read the CSV file and store the results in an array
  const spinner = ora('Reading movie data...').start()
  // Read and parse CSV file
  // process.cwd fetches the present working directory
  const csvPath = path.join(process.cwd(), 'src/rag/imdb_movie_dataset.csv')
  const csvData = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  spinner.text = 'Starting movie indexing...'
  for (const movie of records) {
    spinner.text = `Indexing movie: ${movie.Title}`
    const text = `${movie.Title}. ${movie.Genre}. ${movie.Description}`
    try {
      await index.upsert({
        id: movie.Title, // Using Rank as unique ID
        data: text, // Text will be automatically embedded
        metadata: {
          title: movie.Title,
          year: Number(movie.Year),
          genre: movie.Genre,
          director: movie.Director,
          actors: movie.Actors,
          rating: Number(movie.Rating),
          votes: Number(movie.Votes),
          revenue: Number(movie.Revenue),
          metascore: Number(movie.Metascore),
        },
      })
    } catch (error) {
      spinner.fail(`Error indexing movie ${movie.Title}`)
      console.error(error)
    }
  }
  spinner.succeed('Finished indexing movie data')
}

indexMovieData()
