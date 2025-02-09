import 'dotenv/config'
import chalk from 'chalk'
import { JSONFilePreset } from 'lowdb/node'

/* 
  We store eval results in results.json
  In order to plot a graph, we need present result + old results
*/
const getDb = async () => {
  const defaultData = {
    experiments: [],
  }
  const db = await JSONFilePreset('results.json', defaultData)
  return db
}

/* 
  Calculate average score of a run
  To show in CLI
*/
const calculateAvgScore = (runs) => {
  const totalScores = runs.reduce((sum, run) => {
    const runAvg =
      run.scores.reduce((sum, score) => sum + score.score, 0) /
      run.scores.length
    return sum + runAvg
  }, 0)
  return totalScores / runs.length
}

/* 
  Find all runs of a particular experiment
  "Reddit Experiment"
*/
export const loadExperiment = async (experimentName) => {
  const db = await getDb()
  return db.data.experiments.find((e) => e.name === experimentName)
}

/* 
  Save new run of test into experiment list
*/
export const saveSet = async (experimentName, runs) => {
  const db = await getDb()
  const runsWithTimestamp = runs.map((run) => ({
    ...run,
    createdAt: new Date().toISOString(),
  }))

  const newSet = {
    runs: runsWithTimestamp,
    score: calculateAvgScore(runsWithTimestamp),
    createdAt: new Date().toISOString(),
  }

  const existingExperiment = db.data.experiments.find(
    (e) => e.name === experimentName
  )

  if (existingExperiment) {
    existingExperiment.sets.push(newSet)
  } else {
    db.data.experiments.push({
      name: experimentName,
      sets: [newSet],
    })
  }
  await db.write()
}

/*
  Run task for each item of dataset
*/
export const runEval = async (experiment, { task, data, scorers }) => {
  const results = await Promise.all(
    data.map(async ({ input, expected, reference }) => {
      // Array of result of each task run.
      const results = await task(input)
      let context
      let output

      if (results.context) {
        context = results.context
        output = results.response
      } else {
        output = results
      }

      // Use result array to calculate scores
      const scores = await Promise.all(
        scorers.map(async (scorer) => {
          const score = await scorer({
            input,
            output: results,
            expected,
            reference,
            context,
          })
          return {
            name: score.name,
            score: score.score,
          }
        })
      )

      // Return result with array of scores.
      const result = {
        input,
        output,
        expected,
        scores,
      }

      return result
    })
  )

  /* Aux to find Difference in Score */
  const previousExperiment = await loadExperiment(experiment)
  const previousScore =
    previousExperiment?.sets[previousExperiment.sets.length - 1]?.score || 0
  const currentScore = calculateAvgScore(results)

  const scoreDiff = currentScore - previousScore

  // Setting conditions for CLI response.
  const color = previousExperiment
    ? scoreDiff > 0
      ? chalk.green
      : scoreDiff < 0
      ? chalk.red
      : chalk.blue
    : chalk.blue

  console.log(`Experiment: ${experiment}`)
  console.log(`Previous score: ${color(previousScore.toFixed(2))}`)
  console.log(`Current score: ${color(currentScore.toFixed(2))}`)
  console.log(
    `Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}`
  )
  console.log()

  // Save results to results.json
  await saveSet(experiment, results)
  return results
}
