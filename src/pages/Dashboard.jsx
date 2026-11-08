
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Boxes,
  AlertTriangle,
  Plus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import {
  getCalendar,
  updateCalendar,
} from "../services/calendarService";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import StatCard from "../components/inventory/StatCard";
import ProductTable from "../components/inventory/ProductTable";
import ProductForm from "../components/inventory/ProductForm";
import EditProductForm from "../components/inventory/EditProductForm";
import DeleteProductModal from "../components/inventory/DeleteProductModal";
import CalendarCard from "../components/inventory/CalendarCard";
import CalendarForm from "../components/inventory/CalendarForm";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // =====================================
  // ESTADOS PRINCIPALES
  // =====================================

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // =====================================
  // ESTADOS DEL CALENDARIO
  // =====================================

  const [calendar, setCalendar] = useState(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState("");
  const [isCalendarFormOpen, setIsCalendarFormOpen] = useState(false);

  // =====================================
  // ESTADOS DE ARTÍCULOS
  // =====================================

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =====================================
  // ESTADOS DE ELIMINACIÓN
  // =====================================

  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // =====================================
  // CARGAR ARTÍCULOS
  // =====================================

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Error al cargar artículos:", error);

        setErrorMessage(
          "No se pudieron cargar los artículos. Inténtalo nuevamente."
        );
      } finally {
        setIsLoading(false);
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
  // ESTADÍSTICAS DE ARTÍCULOS
  // =====================================

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      product.quantity > 0 && product.quantity <= 4
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.quantity === 0
  ).length;

  // =====================================
  // REGISTRAR ARTÍCULO
  // =====================================

  const handleCreateProduct = async (productData) => {
    const newProduct = await createProduct(productData);

    setProducts((currentProducts) => [
      newProduct,
      ...currentProducts,
    ]);

    setIsFormOpen(false);
  };

  // =====================================
  // EDITAR ARTÍCULO
  // =====================================

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleUpdateProduct = async (productData) => {
    const updatedProduct = await updateProduct(
      productData.id,
      productData
    );

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    setSelectedProduct(null);
  };

  // =====================================
  // ELIMINAR ARTÍCULO
  // =====================================

  const handleDelete = (productId) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (product) {
      setDeleteError("");
      setSelectedProductToDelete(product);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      await deleteProduct(selectedProductToDelete.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== selectedProductToDelete.id
        )
      );

      setSelectedProductToDelete(null);
    } catch (error) {
      console.error("Error al eliminar artículo:", error);

      setDeleteError(
        "No se pudo eliminar el artículo. Inténtalo nuevamente."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================
  // ACTUALIZAR CALENDARIO
  // =====================================

  const handleUpdateCalendar = async (calendarData) => {
    const updatedCalendar = await updateCalendar(calendarData);

    setCalendar(updatedCalendar);
    setIsCalendarFormOpen(false);
  };

  // =====================================
  // CERRAR SESIÓN
  // =====================================

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

          {/* =================================
              PRODUCTO PRINCIPAL: CALENDARIO
          ================================== */}

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

          {/* =================================
              ESTADÍSTICAS DE ARTÍCULOS
          ================================== */}

          <section className="dashboard-stats">

            <StatCard
              title="Total de artículos"
              value={totalProducts}
              description="Artículos registrados"
              icon={Package}
              variant="primary"
            />

            <StatCard
              title="Unidades disponibles"
              value={totalUnits}
              description="Unidades en inventario"
              icon={Boxes}
              variant="success"
            />

            <StatCard
              title="Stock bajo"
              value={lowStockProducts}
              description="Artículos con 1 a 4 unidades"
              icon={AlertTriangle}
              variant="gold"
            />

            <StatCard
              title="Agotados"
              value={outOfStockProducts}
              description="Artículos sin existencias"
              icon={Package}
              variant="danger"
            />

          </section>

          {/* =================================
              TABLA DE ARTÍCULOS
          ================================== */}

          <section className="dashboard-products" id="productos">

            <div className="dashboard-section-heading">

              <div>
                <h2>Inventario de artículos</h2>

                <p>
                  Consulta y administra los artículos de tus cajas de adviento.
                </p>
              </div>

              <button
                type="button"
                className="dashboard-add-button"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus size={18} />
                <span>Agregar artículo</span>
              </button>

            </div>

            {isLoading ? (
              <p className="dashboard-message">
                Cargando inventario...
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

      {/* =====================================
          FORMULARIO: REGISTRAR ARTÍCULO
      ====================================== */}

      {isFormOpen && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* =====================================
          FORMULARIO: EDITAR ARTÍCULO
      ====================================== */}

      {selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      {/* =====================================
          MODAL: ELIMINAR ARTÍCULO
      ====================================== */}

      {selectedProductToDelete && (
        <DeleteProductModal
          product={selectedProductToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) {
              setSelectedProductToDelete(null);
              setDeleteError("");
            }
          }}
          isDeleting={isDeleting}
        />
      )}

      {/* =====================================
          FORMULARIO: EDITAR CALENDARIO
      ====================================== */}

      {isCalendarFormOpen && calendar && (
        <CalendarForm
          calendar={calendar}
          onSubmit={handleUpdateCalendar}
          onCancel={() => setIsCalendarFormOpen(false)}
        />
      )}

      {/* =====================================
          MENSAJE DE ERROR AL ELIMINAR
      ====================================== */}

      {deleteError && (
        <div className="dashboard-delete-error" role="alert">
          {deleteError}

          <button
            type="button"
            onClick={() => setDeleteError("")}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
