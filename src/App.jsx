import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster
            position="bottom-left"
            toastOptions={{
              className: 'glass-thick border border-black/5 font-black tracking-widest text-[10px] uppercase py-5 px-8 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center gap-4',
              duration: 3500,
              style: {
                background: 'rgba(36, 35, 35, 0.98)',
                color: '#fff',
                backdropFilter: 'blur(40px)',
                minWidth: '320px',
              }
            }}
          />
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/browse" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<div className="container py-12">Product Details Coming Soon</div>} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
