
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";

import { getProducts } from "../services/productService";

import {
  getCalendar,
  updateCalendar,
} from "../services/calendarService";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MobileNavigation from "../components/layout/MobileNavigation";

import StatCard from "../components/inventory/StatCard";
import CalendarCard from "../components/inventory/CalendarCard";
import CalendarForm from "../components/inventory/CalendarForm";

import "../styles/Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // =====================================
  // ESTADO DEL CIERRE DE SESIÓN
  // =====================================

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await signOut();

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      alert("No se pudo cerrar la sesión. Inténtalo nuevamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // =====================================
  // ESTADOS DE ARTÍCULOS
  // =====================================

  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // =====================================
  // ESTADOS DEL CALENDARIO
  // =====================================

  const [calendar, setCalendar] = useState(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState("");
  const [isCalendarFormOpen, setIsCalendarFormOpen] = useState(false);

  // =====================================
  // CARGAR ARTÍCULOS
  // =====================================

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsProductsLoading(true);
        setProductsError("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Error al cargar artículos:", error);

        setProductsError(
          "No se pudieron cargar las estadísticas de artículos."
        );
      } finally {
        setIsProductsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // =====================================
  // CARGAR CALENDARIO
  // =====================================

  useEffect(() => {
    async function loadCalendar() {
      try {
        setIsCalendarLoading(true);
        setCalendarError("");

        const data = await getCalendar();

        setCalendar(data);
      } catch (error) {
        console.error("Error al cargar Calendario:", error);

        setCalendarError(
          "No se pudo cargar la información del Calendario."
        );
      } finally {
        setIsCalendarLoading(false);
      }
    }

    loadCalendar();
  }, []);

  // =====================================
  // CALCULAR STOCK POR ARTÍCULO
  // =====================================

  const productsWithStock = products.map((product) => {
    const totalQuantity = (product.variants ?? []).reduce(
      (total, variant) => total + Number(variant.quantity),
      0
    );

    return {
      ...product,
      totalQuantity,
    };
  });

  // =====================================
  // ESTADÍSTICAS DE ARTÍCULOS
  // =====================================

  // Cantidad de artículos registrados
  const totalProducts = productsWithStock.length;

  // Artículos con stock total entre 1 y 4 unidades
  const lowStockProducts = productsWithStock.filter(
    (product) =>
      product.totalQuantity > 0 &&
      product.totalQuantity <= 4
  ).length;

  // Artículos cuyo stock total es igual a cero
  const outOfStockProducts = productsWithStock.filter(
    (product) => product.totalQuantity === 0
  ).length;

  // =====================================
  // ACTUALIZAR CALENDARIO
  // =====================================

  const handleUpdateCalendar = async (calendarData) => {
    try {
      const updatedCalendar = await updateCalendar(calendarData);

      setCalendar(updatedCalendar);
      setIsCalendarFormOpen(false);
    } catch (error) {
      console.error("Error al actualizar Calendario:", error);

      alert("No se pudo actualizar la información del Calendario.");
    }
  };

  // =====================================
  // RENDERIZADO
  // =====================================

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

          {/* PRODUCTO PRINCIPAL */}

          <section className="dashboard-calendar">
            {calendarError ? (
              <p className="dashboard-error" role="alert">
                {calendarError}
              </p>
            ) : (
              <CalendarCard
                calendar={calendar}
                isLoading={isCalendarLoading}
                onEdit={() => setIsCalendarFormOpen(true)}
              />
            )}
          </section>

          {/* ESTADÍSTICAS GENERALES */}

          <section className="dashboard-stats">
            {productsError ? (
              <p className="dashboard-error" role="alert">
                {productsError}
              </p>
            ) : (
              <>
                <StatCard
                  title="Total de artículos"
                  value={isProductsLoading ? "..." : totalProducts}
                  description="Artículos registrados"
                  icon={Package}
                  variant="primary"
                />

                <StatCard
                  title="Calendarios disponibles"
                  value={
                    isCalendarLoading
                      ? "..."
                      : calendar?.quantity ?? 0
                  }
                  description="Calendarios terminados listos para vender"
                  icon={Package}
                  variant="success"
                />

                <StatCard
                  title="Stock bajo"
                  value={isProductsLoading ? "..." : lowStockProducts}
                  description="Artículos con 1 a 4 unidades"
                  icon={AlertTriangle}
                  variant="gold"
                />

                <StatCard
                  title="Agotados"
                  value={isProductsLoading ? "..." : outOfStockProducts}
                  description="Artículos sin existencias"
                  icon={Package}
                  variant="danger"
                />
              </>
            )}
          </section>

        </div>
      </main>

      {/* FORMULARIO DE EDICIÓN DEL CALENDARIO */}

      {isCalendarFormOpen && calendar && (
        <CalendarForm
          calendar={calendar}
          onSubmit={handleUpdateCalendar}
          onCancel={() => setIsCalendarFormOpen(false)}
        />
      )}

      {/* NAVEGACIÓN MÓVIL */}

      <MobileNavigation />
    </div>
  );
}

export default Dashboard;
