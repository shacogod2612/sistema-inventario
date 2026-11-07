
import { Package, Pencil, Trash2 } from "lucide-react";

import "../../styles/components/ProductTable.css";

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="product-table__empty">
        <Package size={35} />
        <h3>No hay productos registrados</h3>
        <p>Cuando agregues productos, aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="product-table__container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-table__name">
                  <span className="product-table__product-icon">
                    <Package size={18} />
                  </span>
                  <span>{product.name}</span>
                </div>
              </td>

              <td>{product.category}</td>

              <td>S/ {Number(product.price).toFixed(2)}</td>

              <td>{product.stock}</td>

              <td>
                <span
                  className={`product-status ${
                    product.stock > 0
                      ? "product-status--available"
                      : "product-status--empty"
                  }`}
                >
                  {product.stock > 0 ? "Disponible" : "Agotado"}
                </span>
              </td>

              <td>
                <div className="product-table__actions">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    aria-label={`Editar ${product.name}`}
                    title="Editar producto"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    aria-label={`Eliminar ${product.name}`}
                    title="Eliminar producto"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
