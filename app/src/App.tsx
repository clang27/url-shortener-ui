import './App.css'
import Generator from "./pages/Generator.tsx";
import TotalClicks from "./pages/TotalClicks.tsx";
import DayClicks from "./pages/DayClicks.tsx";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';

function App() {
  return (
      <>
          <BrowserRouter>
              <nav>
                  <Link to="/">Generator</Link>
                  <Link to="/total-clicks">Total Clicks</Link>
                  <Link to="/day-clicks">Day Clicks</Link>
              </nav>
              <Routes>
                  <Route path="/" element=<Generator/> />
                  <Route path="/total-clicks" element=<TotalClicks/> />
                  <Route path="/day-clicks" element=<DayClicks/> />
              </Routes>
          </BrowserRouter>
      </>
  )
}

export default App
