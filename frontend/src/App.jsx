import TetrisGame from './components/TetrisGame'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Tetris</h1>
      </header>
      <main className="main-content">
        <TetrisGame />
      </main>
    </div>
  )
}

export default App