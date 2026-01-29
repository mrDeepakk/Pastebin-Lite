import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreatePaste from './pages/CreatePaste';
import ViewPaste from './pages/ViewPaste';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatePaste />} />
        <Route path="/p/:id" element={<ViewPaste />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
