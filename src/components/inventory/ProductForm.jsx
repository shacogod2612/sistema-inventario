
import { useRef, useState } from "react";
import { X, PackagePlus, Plus, Trash2 } from "lucide-react";

import "../../styles/components/ProductForm.css";

function ProductForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState([
    { id: 1, color: "Único", quantity: "1" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nextId = useRef(2);

  // Agregar una nueva variante
  const handleAddVariant = () => {
    setVariants((currentVariants) => [
      ...currentVariants,
      {
        id: nextId.current++,
        color: "",
        quantity: "0",
      },
    ]);
  };

  // Actualizar un campo de una variante
  const handleVariantChange = (variantId, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.id === variantId
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  // Eliminar una variante
  const handleRemoveVariant = (variantId) => {
    setVariants((currentVariants) =>
      currentVariants.filter((variant) => variant.id !== variantId)
    );
  };

  // Calcular el stock total
  const totalQuantity = variants.reduce(
    (total, variant) => total + (Number(variant.quantity) || 0),
    0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Ingresa el nombre del artículo.");
      return;
    }

    if (variants.length === 0) {
      setErrorMessage("Agrega al menos una variante.");
      return;
    }

    // Validar nombres y cantidades
    for (const variant of variants) {
      if (!variant.color.trim()) {
        setErrorMessage("Todas las variantes deben tener un color o nombre.");
        return;
      }

      const quantity = Number(variant.quantity);

      if (
        variant.quantity === "" ||
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        setErrorMessage("Las cantidades deben ser números enteros iguales o mayores a 0.");
        return;
      }
    }

    // Evitar variantes duplicadas
    const normalizedColors = variants.map((variant) =>
      variant.color.trim().toLocaleLowerCase()
    );

    if (new Set(normalizedColors).size !== normalizedColors.length) {
      setErrorMessage("No puedes registrar dos variantes con el mismo nombre.");
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        name: trimmedName,
        variants: variants.map((variant) => ({
          color: variant.color.trim(),
          quantity: Number(variant.quantity),
        })),
      });
    } catch (error) {
      console.error("Error al registrar artículo:", error);
      setErrorMessage(
        "No se pudo registrar el artículo. Inténtalo nuevamente."
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
        aria-labelledby="product-form-title"
      >
        <div className="product-form__header">
          <div className="product-form__heading">
            <div className="product-form__icon">
              <PackagePlus size={22} />
            </div>

            <div>
              <h2 id="product-form-title">Nuevo artículo</h2>
              <p>Registra un artículo y sus variantes.</p>
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
            <label htmlFor="product-name">
              Nombre del artículo
            </label>

            <input
              type="text"
              id="product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Medias"
              maxLength={100}
              autoFocus
              required
            />
          </div>

          <div className="product-form__variants">
            <div className="product-form__variants-header">
              <div>
                <h3>Variantes y stock</h3>
                <p>Agrega los colores o presentaciones disponibles.</p>
              </div>

              <button
                type="button"
                className="product-form__add-variant"
                onClick={handleAddVariant}
                disabled={isSaving}
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>

            {variants.map((variant, index) => (
              <div
                className="product-form__variant-row"
                key={variant.id}
              >
                <div className="product-form__variant-field">
                  <label htmlFor={`variant-color-${variant.id}`}>
                    {index === 0 ? "Color o variante" : `Variante ${index + 1}`}
                  </label>

                  <input
                    type="text"
                    id={`variant-color-${variant.id}`}
                    value={variant.color}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "color",
                        event.target.value
                      )
                    }
                    placeholder="Ej. Negro"
                    maxLength={50}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="product-form__variant-field">
                  <label htmlFor={`variant-quantity-${variant.id}`}>
                    Cantidad
                  </label>

                  <input
                    type="number"
                    id={`variant-quantity-${variant.id}`}
                    min="0"
                    step="1"
                    value={variant.quantity}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.id,
                        "quantity",
                        event.target.value
                      )
                    }
                    required
                    disabled={isSaving}
                  />
                </div>

                <button
                  type="button"
                  className="product-form__remove-variant"
                  onClick={() => handleRemoveVariant(variant.id)}
                  disabled={isSaving || variants.length === 1}
                  aria-label={`Eliminar variante ${index + 1}`}
                  title="Eliminar variante"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <div className="product-form__total">
            <span>Stock total del artículo</span>
            <strong>{totalQuantity} unidades</strong>
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
              {isSaving ? "Guardando..." : "Registrar artículo"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProductForm;
