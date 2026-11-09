
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
            <th>Stock total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            // Obtener las variantes del artículo
            const variants = product.variants ?? [];

            // Calcular el stock total
            const totalQuantity = variants.reduce(
              (total, variant) => total + Number(variant.quantity),
              0
            );

            // Determinar el estado del artículo
            const isOutOfStock = totalQuantity === 0;
            const isLowStock = totalQuantity > 0 && totalQuantity <= 4;

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
                {/* ARTÍCULO Y VARIANTES */}
                <td>
                  <div className="product-table__name">
                    <span className="product-table__product-icon">
                      <Package size={18} />
                    </span>

                    <div className="product-table__product-info">
                      <span className="product-table__product-title">
                        {product.name}
                      </span>

                      <div className="product-table__variants">
                        {variants.map((variant) => (
                          <span
                            key={variant.id}
                            className="product-table__variant"
                          >
                            {variant.color}: {variant.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>

                {/* STOCK TOTAL */}
                <td>
                  <strong className="product-table__quantity">
                    {totalQuantity}
                  </strong>
                </td>

                {/* ESTADO */}
                <td>
                  <span className={`product-status ${statusClass}`}>
                    {status}
                  </span>
                </td>

                {/* ACCIONES */}
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
