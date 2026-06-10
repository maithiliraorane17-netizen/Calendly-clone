import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

function Layout({ children, hideFooter }) {
  return (
    <div className="min-h-screen" style={{ background: "#0B1220" }}>
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/login"  element={<Layout hideFooter><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout hideFooter><SignupPage /></Layout>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout hideFooter><DashboardPage /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
