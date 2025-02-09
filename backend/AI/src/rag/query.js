import { Index as UpstashIndex } from '@upstash/vector'

const index = new UpstashIndex()

export const queryVectorDB = async (query, topK = 5) => {
  return await index.query({
    data: query,
    topK: topK,
    includeVectors: true,
    includeMetadata: true,
  })
}
