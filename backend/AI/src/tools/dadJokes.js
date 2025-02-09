import fetch from 'node-fetch'

export const dadJokeDefinition = {
  name: 'getDadJokes',
  description: 'Get a random dad joke from the Internet',
}

export const getDadJokes = async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })
  const data = await response.json()
  return data['joke']
}
