
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
    <div className="product-cards">
      {products.map((product) => {
        const variants = product.variants ?? [];

        const totalQuantity = variants.reduce(
          (total, variant) => total + Number(variant.quantity),
          0
        );

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
          <article className="product-card" key={product.id}>
            {/* ENCABEZADO */}
            <div className="product-card__header">
              <div className="product-card__identity">
                <span className="product-card__icon">
                  <Package size={20} />
                </span>

                <h3 className="product-card__name">
                  {product.name}
                </h3>
              </div>

              <span className={`product-status ${statusClass}`}>
                {status}
              </span>
            </div>

            {/* VARIANTES */}
            <div className="product-card__variants-section">
              <span className="product-card__label">
                Variantes registradas
              </span>

              {variants.length > 0 ? (
                <div className="product-card__variants">
                  {variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="product-card__variant"
                    >
                      <span>{variant.color}</span>
                      <strong>{variant.quantity}</strong>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="product-card__no-variants">
                  Sin variantes registradas
                </p>
              )}
            </div>

            {/* PIE DE TARJETA */}
            <div className="product-card__footer">
              <div className="product-card__stock">
                <span className="product-card__label">
                  Stock total
                </span>

                <strong className="product-card__quantity">
                  {totalQuantity}
                  <span> unidades</span>
                </strong>
              </div>

              <div className="product-card__actions">
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
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductTable;
