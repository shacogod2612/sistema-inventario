
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  LogOut,
} from "lucide-react";

import "../../styles/components/Sidebar.css";

function Sidebar({ onLogout, isLoggingOut }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Package size={25} />
        </div>

        <div className="sidebar__brand-text">
          <h2>CAPULÍ</h2>
          <span>GESTIÓN DE INVENTARIO</span>
        </div>
      </div>

      <div className="sidebar__section">
        <span className="sidebar__section-title">
          MENÚ PRINCIPAL
        </span>

        <nav className="sidebar__nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Resumen</span>
          </NavLink>

         <NavLink
          to="/productos"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <Package size={20} />
          <span>Productos</span>
        </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <button
          type="button"
          className="sidebar__logout"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut size={20} />
          <span>
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </span>
        </button>

        <div className="sidebar__footer">
          <span>Capulí Adviento</span>
          <small>Sistema administrativo</small>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
