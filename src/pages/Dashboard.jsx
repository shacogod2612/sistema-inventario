import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";
import { getProducts } from "../services/productService";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/inventory/StatCard";
import ProductTable from "../components/inventory/ProductTable";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleEdit = (product) => {
    console.log("Editar producto:", product);
  };

  const handleDelete = (productId) => {
    console.log("Eliminar producto:", productId);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getProducts();

        setProducts(data || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);

        setErrorMessage(
          "No se pudieron cargar los productos. Inténtalo nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Métricas calculadas dinámicamente desde el estado `products`
  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (acc, item) => acc + (Number(item.stock) || 0),
    0
  );

  const lowStockCount = products.filter(
    (item) => (Number(item.stock) || 0) <= 5
  ).length;

  const totalValue = products.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.stock) || 0),
    0
  );

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
          {/* Tarjetas de Estadísticas Conectadas */}
          <section className="dashboard-stats">
            <StatCard
              title="Total de productos"
              value={isLoading ? "..." : totalProducts}
              description="Productos registrados"
              icon={Package}
              variant="primary"
            />

            <StatCard
              title="Unidades disponibles"
              value={isLoading ? "..." : totalUnits}
              description="Unidades en inventario"
              icon={Boxes}
              variant="success"
            />

            <StatCard
              title="Stock bajo"
              value={isLoading ? "..." : lowStockCount}
              description="Productos por reponer (<= 5)"
              icon={AlertTriangle}
              variant="danger"
            />

            <StatCard
              title="Valor del inventario"
              value={
                isLoading
                  ? "..."
                  : `S/ ${totalValue.toLocaleString("es-PE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
              }
              description="Valor total de existencias"
              icon={Wallet}
              variant="gold"
            />
          </section>

          {/* Tabla de Productos */}
          <section className="dashboard-products">
            <div className="dashboard-section-heading">
              <div>
                <h2>Productos recientes</h2>
                <p>Consulta y administra tus productos registrados.</p>
              </div>
            </div>

            {isLoading ? (
              <p className="dashboard-message">
                Cargando productos...
              </p>
            ) : errorMessage ? (
              <p className="dashboard-error" role="alert">
                {errorMessage}
              </p>
            ) : (
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;