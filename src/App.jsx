import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/product/:id" element={<div className="container py-12">Product Details Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
