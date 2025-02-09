import { useState } from 'react'
import ExperimentGraph from './components/ExperimentGraph'
import resultsData from '../../results.json'
import './App.css'

const App = () => {
  const results = resultsData
  // Manage the drop down selection
  const [selectedExperiment, setSelectedExperiment] = useState(
    results.experiments[0].name
  )

  const currentExperiment = results.experiments.find(
    (exp) => exp.name === selectedExperiment
  )

  /* 
    If no runs, do not render the graph
  */
  const limitedExperiment = currentExperiment
    ? {
        ...currentExperiment,
        // Fetch the latest 10 runs only
        sets: currentExperiment.sets.slice(-10),
      }
    : null

  return (
    <div className="app">
      <h1>Experiment Results Viewer</h1>
      <div className="controls">
        <label htmlFor="experiment-select">Select Experiment: </label>
        <select
          id="experiment-select"
          value={selectedExperiment}
          onChange={(e) => setSelectedExperiment(e.target.value)}
        >
          {results.experiments.map((exp) => (
            <option key={exp.name} value={exp.name}>
              {exp.name}
            </option>
          ))}
        </select>
      </div>

      {limitedExperiment && <ExperimentGraph experiment={limitedExperiment} />}
    </div>
  )
}

export default App
