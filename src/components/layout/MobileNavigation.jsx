    
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ChartColumn,
} from "lucide-react";

import "../../styles/components/MobileNavigation.css";

function MobileNavigation() {
  return (
    <nav className="mobile-navigation" aria-label="Navegación principal">

      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `mobile-navigation__item ${
            isActive ? "mobile-navigation__item--active" : ""
          }`
        }
      >
        <LayoutDashboard size={21} />
        <span>Resumen</span>
      </NavLink>

      <NavLink
        to="/productos"
        className={({ isActive }) =>
          `mobile-navigation__item ${
            isActive ? "mobile-navigation__item--active" : ""
          }`
        }
      >
        <Package size={21} />
        <span>Productos</span>
      </NavLink>

      <button
        type="button"
        className="mobile-navigation__item mobile-navigation__item--disabled"
        disabled
        aria-label="Ventas, próximamente"
      >
        <ChartColumn size={21} />
        <span>Ventas</span>
        <small>Próximamente</small>
      </button>

    </nav>
  );
}

export default MobileNavigation;
