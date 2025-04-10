import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PhotoBooth from "./components/PhotoBooth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo-booth" element={<PhotoBooth />} />
      </Routes>
    </Router>
  );
}

export default App;
