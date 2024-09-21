import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import ThreeJSPage from './pages/Threejs';
import CanvasPage from './pages/Canvas';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/light.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor" Component={Home} />
        <Route path="/threejs" Component={ThreeJSPage} />
        <Route path="/canvas" Component={CanvasPage} />
      </Routes>
    </Router>
  );
}

export default App;
