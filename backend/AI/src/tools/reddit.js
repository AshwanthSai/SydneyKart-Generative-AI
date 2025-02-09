import fetch from 'node-fetch'

export const redditToolDefinition = {
  name: 'getRedditPost',
  description: 'get the latest posts from Reddit',
}

export const getRedditPost = async () => {
  const { data } = await fetch('https://www.reddit.com/r/sydney/.json').then(
    (res) => res.json()
  )

  // Cleans up and supplies only relevant data from JSON
  const relevantInfo = data.children.map((child) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }))

  return JSON.stringify(relevantInfo, null, 2)
}
