import "./App.css"
import { DrinkCard } from "./components/DrinkCard/DrinkCard.tsx"

function App() {
  return (
    <>
      <div>
        <head>
          <title>Dose Perfeita</title>
        </head>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <DrinkCard />
      </div>
    </>
  )
}

export default App
