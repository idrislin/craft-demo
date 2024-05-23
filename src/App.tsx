import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import ThreeJSPage from "./pages/Threejs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/threejs" Component={ThreeJSPage} />
      </Routes>
    </Router>
  );
}

export default App;
