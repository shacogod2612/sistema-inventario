
import { useRef, useState } from "react";
import { X, Pencil, Plus, Trash2 } from "lucide-react";

import "../../styles/components/ProductForm.css";

function EditProductForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState(product.name);

  const [variants, setVariants] = useState(
    product.variants?.map((variant, index) => ({
      ...variant,
      quantity: String(variant.quantity),
      localId: index + 1,
    })) ?? []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nextId = useRef(variants.length + 1);

  // Agregar una nueva variante
  const handleAddVariant = () => {
    setVariants((currentVariants) => [
      ...currentVariants,
      {
        localId: nextId.current++,
        color: "",
        quantity: "0",
      },
    ]);
  };

  // Modificar una variante
  const handleVariantChange = (variantId, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((variant) =>
        variant.localId === variantId
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  // Eliminar una variante
  const handleRemoveVariant = (variantId) => {
    setVariants((currentVariants) =>
      currentVariants.filter(
        (variant) => variant.localId !== variantId
      )
    );
  };

  // Calcular stock total
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
      setErrorMessage("El artículo debe tener al menos una variante.");
      return;
    }

    // Validar variantes
    for (const variant of variants) {
      if (!variant.color.trim()) {
        setErrorMessage("Todas las variantes deben tener un nombre o color.");
        return;
      }

      const quantity = Number(variant.quantity);

      if (
        variant.quantity === "" ||
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        setErrorMessage(
          "Las cantidades deben ser números enteros iguales o mayores a 0."
        );
        return;
      }
    }

    // Evitar nombres de variantes duplicados
    const normalizedColors = variants.map((variant) =>
      variant.color.trim().toLocaleLowerCase()
    );

    if (new Set(normalizedColors).size !== normalizedColors.length) {
      setErrorMessage(
        "No puedes tener dos variantes con el mismo nombre."
      );
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        id: product.id,
        name: trimmedName,
        variants: variants.map((variant) => ({
          ...(variant.id && { id: variant.id }),
          color: variant.color.trim(),
          quantity: Number(variant.quantity),
        })),
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
              <p>Modifica el artículo y sus variantes.</p>
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
          {/* Nombre del artículo */}
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
              disabled={isSaving}
            />
          </div>

          {/* Variantes */}
          <div className="product-form__variants">
            <div className="product-form__variants-header">
              <div>
                <h3>Variantes y stock</h3>
                <p>Modifica colores y cantidades disponibles.</p>
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
                key={variant.localId}
              >
                <div className="product-form__variant-field">
                  <label htmlFor={`edit-color-${variant.localId}`}>
                    {index === 0 ? "Color o variante" : `Variante ${index + 1}`}
                  </label>

                  <input
                    type="text"
                    id={`edit-color-${variant.localId}`}
                    value={variant.color}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.localId,
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
                  <label htmlFor={`edit-quantity-${variant.localId}`}>
                    Cantidad
                  </label>

                  <input
                    type="number"
                    id={`edit-quantity-${variant.localId}`}
                    min="0"
                    step="1"
                    value={variant.quantity}
                    onChange={(event) =>
                      handleVariantChange(
                        variant.localId,
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
                  onClick={() =>
                    handleRemoveVariant(variant.localId)
                  }
                  disabled={isSaving || variants.length === 1}
                  aria-label={`Eliminar variante ${index + 1}`}
                  title="Eliminar variante"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          {/* Stock total */}
          <div className="product-form__total">
            <span>Stock total del artículo</span>
            <strong>{totalQuantity} unidades</strong>
          </div>

          {/* Errores */}
          {errorMessage && (
            <p className="product-form__error" role="alert">
              {errorMessage}
            </p>
          )}

          {/* Acciones */}
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
