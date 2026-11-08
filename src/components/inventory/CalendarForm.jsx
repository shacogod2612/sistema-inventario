
import { useState } from "react";
import { X, CalendarDays } from "lucide-react";

import "../../styles/components/ProductForm.css";

function CalendarForm({ calendar, onSubmit, onCancel }) {
  const [price, setPrice] = useState(String(calendar.price));
  const [quantity, setQuantity] = useState(String(calendar.quantity));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (
      price.trim() === "" ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      setErrorMessage("Ingresa un precio válido igual o mayor a 0.");
      return;
    }

    if (
      quantity.trim() === "" ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      setErrorMessage("Ingresa una cantidad entera igual o mayor a 0.");
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        price: parsedPrice,
        quantity: parsedQuantity,
      });
    } catch (error) {
      console.error("Error al actualizar Calendario:", error);

      setErrorMessage(
        "No se pudo actualizar el Calendario. Inténtalo nuevamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="product-form__overlay">
      <section
        className="product-form__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-form-title"
      >
        <div className="product-form__header">
          <div className="product-form__heading">
            <div className="product-form__icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 id="calendar-form-title">
                Editar Calendario
              </h2>
              <p>Actualiza el precio y las unidades disponibles.</p>
            </div>
          </div>

          <button
            type="button"
            className="product-form__close"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="product-form__field">
            <label htmlFor="calendar-name">
              Nombre del producto
            </label>

            <input
              type="text"
              id="calendar-name"
              value="Calendario"
              disabled
            />

            <small>Este nombre es permanente y no se puede modificar.</small>
          </div>

          <div className="product-form__field">
            <label htmlFor="calendar-price">
              Precio de venta unitario (S/)
            </label>

            <input
              type="number"
              id="calendar-price"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Ej. 150.00"
              required
            />
          </div>

          <div className="product-form__field">
            <label htmlFor="calendar-quantity">
              Cantidad disponible
            </label>

            <input
              type="number"
              id="calendar-quantity"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />

            <small>
              Puedes ingresar 0 si no tienes calendarios disponibles.
            </small>
          </div>

          {errorMessage && (
            <p className="product-form__error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="product-form__actions">
            <button
              type="button"
              className="product-form__cancel"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="product-form__submit"
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CalendarForm;
