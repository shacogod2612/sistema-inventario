
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { signOut } from "../services/authService";
import { supabase } from "../services/supabase";

function Dashboard() {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setLogoutError(
        "No se pudo cerrar la sesión. Inténtalo nuevamente."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.log("Respuesta de Supabase:", error.message);
        return;
      }

      console.log("Conexión correcta:", data);
    }

    testConnection();
  }, []);

  return (
    <main>
      <h1>Panel de inventario</h1>
      <p>Conexión con Supabase en pruebas.</p>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="logout-button"
      >
        <LogOut size={18} />
        <span>
          {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </span>
      </button>

      {logoutError && (
        <p role="alert" className="logout-error">
          {logoutError}
        </p>
      )}
    </main>
  );
}

export default Dashboard;
