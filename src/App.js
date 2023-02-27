import "./App.css";
import "../src/styles/style.scss"
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import SpeechToText from "./pages/speechToText";
// import SpeechToText from "./pages/speechToText2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SpeechToText/>} />
      </Routes>
    </Router>
  );
}

export default App;
