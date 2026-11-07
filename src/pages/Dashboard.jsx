
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/inventory/StatCard";
import ProductTable from "../components/inventory/ProductTable";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Funciones provisionales.
  // Implementaremos la edición y eliminación más adelante.
  const handleEdit = (product) => {
    console.log("Editar producto:", product);
  };

  const handleDelete = (productId) => {
    console.log("Eliminar producto:", productId);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="dashboard-main">
        <Header
          title="Resumen general"
          description="Bienvenida a tu panel de gestión de inventario."
          userEmail={user?.email}
        />

        <div className="dashboard-content">
          <section className="dashboard-stats">
            <StatCard
              title="Total de productos"
              value="—"
              description="Productos registrados"
              icon={Package}
              variant="primary"
            />

            <StatCard
              title="Unidades disponibles"
              value="—"
              description="Unidades en inventario"
              icon={Boxes}
              variant="success"
            />

            <StatCard
              title="Stock bajo"
              value="—"
              description="Productos por reponer"
              icon={AlertTriangle}
              variant="danger"
            />

            <StatCard
              title="Valor del inventario"
              value="—"
              description="Valor total de existencias"
              icon={Wallet}
              variant="gold"
            />
          </section>

          <section className="dashboard-products">
            <div className="dashboard-section-heading">
              <div>
                <h2>Productos recientes</h2>
                <p>Consulta y administra tus productos registrados.</p>
              </div>
            </div>

            <ProductTable
              products={[]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
