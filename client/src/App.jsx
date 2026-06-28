import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="*"
              element={
                <div className="container-page" style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h1>
                  <p className="section-sub" style={{ fontSize: '1.125rem' }}>Page not found.</p>
                  <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                    Go home
                  </Link>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}