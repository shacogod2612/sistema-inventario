
import { useState } from "react";
import { X, Pencil } from "lucide-react";

import "../../styles/components/ProductForm.css";

function EditProductForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(String(product.quantity));
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const parsedQuantity = Number(quantity);

    if (!trimmedName) {
      setErrorMessage("Ingresa el nombre del artículo.");
      return;
    }

    if (
      quantity === "" ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      setErrorMessage("Ingresa una cantidad entera igual o mayor a 0.");
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        id: product.id,
        name: trimmedName,
        quantity: parsedQuantity,
      });
    } catch (error) {
      console.error("Error al actualizar artículo:", error);

      setErrorMessage(
        "No se pudo actualizar el artículo. Inténtalo nuevamente."
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
        aria-labelledby="edit-product-title"
      >
        <div className="product-form__header">
          <div className="product-form__heading">
            <div className="product-form__icon">
              <Pencil size={22} />
            </div>

            <div>
              <h2 id="edit-product-title">Editar artículo</h2>
              <p>Modifica los datos de este artículo.</p>
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
            <label htmlFor="edit-product-name">
              Nombre del artículo
            </label>

            <input
              type="text"
              id="edit-product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Chocolates"
              maxLength={100}
              required
            />
          </div>

          <div className="product-form__field">
            <label htmlFor="edit-product-quantity">
              Cantidad disponible
            </label>

            <input
              type="number"
              id="edit-product-quantity"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />

            <small>
              Puedes ingresar 0 si el artículo está agotado.
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

export default EditProductForm;
