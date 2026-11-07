import { useState } from "react";
import { Eye, EyeOff, Package } from "lucide-react";
import "../styles/Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Próximamente conectaremos Supabase Auth.
  };

  return (
    <main className="login-page">
      <section className="login-card">

        {/* Panel lateral con la imagen */}
        <div className="login-sidebar">
          <img 
            src="/img/nailong.png" 
            alt="Capulí Adviento Decoración" 
            className="login-sidebar__image"
          />
          <div className="login-sidebar__overlay"></div>
        </div>

        {/* Formulario a la derecha */}
        <div className="login-content">
          <div className="login-brand">
            <div className="login-brand__icon">
              <Package size={24} />
            </div>
            <span>INVENTARIO</span>
          </div>

          <div className="login-heading">
            <h1>Bienvenida</h1>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>

          <p className="login-footer">
            Sistema privado de gestión de inventario
          </p>
        </div>

      </section>
    </main>
  );
}

export default Login;