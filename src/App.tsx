import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import ThreeJSPage from './pages/Threejs';
import CanvasPage from './pages/Canvas';
import RichTextPage from './pages/RichText';
import Dashboard from './pages/Dashboard';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/themes/light.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Dashboard} />
        <Route path="/editor" Component={Home} />
        <Route path="/threejs" Component={ThreeJSPage} />
        <Route path="/canvas" Component={CanvasPage} />
        <Route path="/richtext" Component={RichTextPage} />
      </Routes>
    </Router>
  );
}

export default App;
