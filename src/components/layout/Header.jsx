
import { Bell, UserRound } from "lucide-react";
import "../../styles/components/Header.css";

function Header({ title, description, userEmail }) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__heading">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="dashboard-header__actions">
        <button
          type="button"
          className="dashboard-header__notification"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
        </button>

        <div className="dashboard-header__profile">
          <div className="dashboard-header__avatar">
            <UserRound size={20} />
          </div>

          <div className="dashboard-header__user-info">
            <span>Administrador</span>
            <small>{userEmail}</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
