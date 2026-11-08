
import { CalendarDays, Pencil, Package, Wallet } from "lucide-react";

import "../../styles/components/CalendarCard.css";

function CalendarCard({ calendar, onEdit, isLoading }) {
  const price = Number(calendar?.price ?? 0);
  const quantity = Number(calendar?.quantity ?? 0);
  const totalValue = price * quantity;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);

  return (
    <section className="calendar-card">
      <div className="calendar-card__header">
        <div className="calendar-card__heading">
          <div className="calendar-card__icon">
            <CalendarDays size={23} />
          </div>

          <div>
            <span className="calendar-card__eyebrow">
              PRODUCTO PRINCIPAL
            </span>
            <h2>Calendario</h2>
            <p>Producto final de venta</p>
          </div>
        </div>

        {onEdit && (
            <button
                type="button"
                className="calendar-card__edit"
                onClick={onEdit}
                disabled={isLoading || !calendar}
            >
                <Pencil size={17} />
                <span>Editar</span>
            </button>
        )}
      </div>

      {isLoading ? (
        <p className="calendar-card__message">
          Cargando información del Calendario...
        </p>
      ) : (
        <div className="calendar-card__details">
          <div className="calendar-card__item">
            <div className="calendar-card__item-icon">
              <Wallet size={19} />
            </div>

            <div>
              <span>Precio de venta unitario</span>
              <strong>{formatCurrency(price)}</strong>
            </div>
          </div>

          <div className="calendar-card__item">
            <div className="calendar-card__item-icon">
              <Package size={19} />
            </div>

            <div>
              <span>Unidades disponibles</span>
              <strong>{quantity}</strong>
            </div>
          </div>

          <div className="calendar-card__total">
            <span>Valor total del inventario</span>
            <strong>{formatCurrency(totalValue)}</strong>
            <small>Precio unitario × cantidad disponible</small>
          </div>
        </div>
      )}
    </section>
  );
}

export default CalendarCard;
