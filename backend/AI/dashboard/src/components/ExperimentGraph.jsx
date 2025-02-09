import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const ExperimentGraph = ({ experiment }) => {
  const data = experiment.sets.map((set, index) => ({
    name: `Set ${index + 1}`,
    score: set.score,
  }))

  return (
    <div>
      <h2>{experiment.name} Scores</h2>
      <LineChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#8884d8" />
      </LineChart>
    </div>
  )
}

export default ExperimentGraph
