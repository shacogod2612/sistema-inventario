
import { Package, Pencil, Trash2 } from "lucide-react";

import "../../styles/components/ProductTable.css";

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="product-table__empty">
        <Package size={35} />
        <h3>No hay artículos registrados</h3>
        <p>Cuando agregues artículos, aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="product-table__container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isOutOfStock = product.quantity === 0;
            const isLowStock = product.quantity <= 4;

            let status = "Disponible";
            let statusClass = "product-status--available";

            if (isOutOfStock) {
              status = "Agotado";
              statusClass = "product-status--empty";
            } else if (isLowStock) {
              status = "Stock bajo";
              statusClass = "product-status--low";
            }

            return (
              <tr key={product.id}>
                <td>
                  <div className="product-table__name">
                    <span className="product-table__product-icon">
                      <Package size={18} />
                    </span>
                    <span>{product.name}</span>
                  </div>
                </td>

                <td>{product.quantity}</td>

                <td>
                  <span className={`product-status ${statusClass}`}>
                    {status}
                  </span>
                </td>

                <td>
                  <div className="product-table__actions">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      aria-label={`Editar ${product.name}`}
                      title="Editar artículo"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      aria-label={`Eliminar ${product.name}`}
                      title="Eliminar artículo"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
