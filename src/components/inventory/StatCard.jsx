
import "../../styles/components/StatCard.css";

function StatCard({ title, value, description, icon: Icon, variant = "primary" }) {
  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${variant}`}>
        <Icon size={22} />
      </div>

      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>

        <h2 className="stat-card__value">{value}</h2>

        <p className="stat-card__description">
          {description}
        </p>
      </div>
    </article>
  );
}

export default StatCard;
