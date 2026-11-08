import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package } from "lucide-react";
import { signIn } from "../services/authService";
import nailongImg from "/public/img/nailong.png"; 
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      await signIn(email, password);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error de autenticación:", error);
      setErrorMessage("Correo o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Fondo de pantalla completa para móviles */}
      <div className="login-mobile-bg">
        <img src={nailongImg} alt="Fondo Capulí" />
        <div className="login-mobile-bg__overlay"></div>
      </div>

      <section className="login-card">
        {/* Sidebar visible solo en Escritorio */}
        <div className="login-sidebar">
          <img
            src={nailongImg}
            alt="Capulí Adviento Decoración"
            className="login-sidebar__image"
          />
          <div className="login-sidebar__overlay"></div>
        </div>

        {/* Formulario */}
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@correo.com"
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
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

            {errorMessage && (
              <p className="login-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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