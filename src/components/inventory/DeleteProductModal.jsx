
import { AlertTriangle, X, Trash2 } from "lucide-react";

import "../../styles/components/DeleteProductModal.css";

function DeleteProductModal({
  product,
  onConfirm,
  onCancel,
  isDeleting,
}) {
  return (
    <div className="delete-modal__overlay">
      <section
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <button
          type="button"
          className="delete-modal__close"
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Cerrar ventana"
        >
          <X size={20} />
        </button>

        <div className="delete-modal__icon">
          <AlertTriangle size={27} />
        </div>

        <h2 id="delete-modal-title">
          ¿Eliminar artículo?
        </h2>

        <p>
          Estás a punto de eliminar{" "}
          <strong>{product.name}</strong> de tu inventario.
          Esta acción no se puede deshacer.
        </p>

        <div className="delete-modal__actions">
          <button
            type="button"
            className="delete-modal__cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="delete-modal__confirm"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={17} />
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteProductModal;
