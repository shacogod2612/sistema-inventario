import { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Products from "./pages/Products";

function PublicRoute() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <p>Verificando acceso...</p>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

function App() {
  // Si el navegador entra directo a una subruta sin '#', la redirige al formato HashRouter
  useEffect(() => {
    const repoBase = "/sistema-inventario"; 
    const path = window.location.pathname;

    if (path !== "/" && path !== `${repoBase}/` && path !== repoBase && !window.location.hash) {
      const subPath = path.replace(repoBase, "");
      window.history.replaceState(null, "", `${repoBase}/#${subPath}`);
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicRoute />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Products />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;