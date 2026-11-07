import { useEffect } from "react";
import { supabase } from "../services/supabase";

function Dashboard() {
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
    </main>
  );
}

export default Dashboard;