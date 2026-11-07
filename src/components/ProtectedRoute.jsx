
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  // Esperar a que Supabase compruebe la sesión
  if (isLoading) {
    return <p>Verificando acceso...</p>;
  }

  // Si no existe sesión, regresar al login
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, mostrar la ruta solicitada
  return <Outlet />;
}

export default ProtectedRoute;
