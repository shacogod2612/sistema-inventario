
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Plus } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { signOut } from "../services/authService";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MobileNavigation from "../components/layout/MobileNavigation";

import ProductTable from "../components/inventory/ProductTable";
import ProductForm from "../components/inventory/ProductForm";
import EditProductForm from "../components/inventory/EditProductForm";
import DeleteProductModal from "../components/inventory/DeleteProductModal";

import "../styles/Dashboard.css";

function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principales
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Estados de formularios
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estados de eliminación
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Cargar artículos
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

  // Registrar artículo
  const handleCreateProduct = async (productData) => {
    const newProduct = await createProduct(productData);

    setProducts((currentProducts) => [
      newProduct,
      ...currentProducts,
    ]);

    setIsFormOpen(false);
  };

  // Abrir edición
  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  // Actualizar artículo
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

  // Abrir confirmación de eliminación
  const handleDelete = (productId) => {
    const product = products.find(
      (item) => item.id === productId
    );

    if (product) {
      setDeleteError("");
      setSelectedProductToDelete(product);
    }
  };

  // Confirmar eliminación
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

  // Cerrar sesión
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

  return (
    <div className="dashboard-layout">

      <Sidebar
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="dashboard-main">

        <Header
          title="Productos"
          description="Administra los artículos de tus cajas de adviento."
          userEmail={user?.email}
        />

        <div className="dashboard-content">

          <section className="dashboard-products">

            {/* ENCABEZADO */}
            <div className="dashboard-section-heading">
              <div>
                <h2>Inventario de artículos</h2>

                <p>
                  Consulta y administra todos tus artículos.
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

            {/* TABLA */}
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

      {/* REGISTRAR ARTÍCULO */}
      {isFormOpen && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* EDITAR ARTÍCULO */}
      {selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      {/* ELIMINAR ARTÍCULO */}
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

      {/* ERROR DE ELIMINACIÓN */}
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

        <MobileNavigation />
    </div>
  );
}

export default Products;
