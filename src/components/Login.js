import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Importamos Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos de Toastify
import './Login.css'; // Importa el archivo CSS que vamos a crear

const Login = ({ setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Estado para la casilla de "Recordar sesión"
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verificar si el usuario es administrador
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      setIsAdmin(adminDoc.exists());

      navigate('/'); // Redirigir al home después del login

      // Mostrar notificación de éxito al iniciar sesión
      toast.success('Inicio de sesión exitoso', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (!rememberMe) {
        setTimeout(() => {
          auth.signOut();
          console.log('Sesión cerrada automáticamente después de 15 minutos');
          toast.info('Sesión cerrada automáticamente', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 15 * 60 * 1000);
      }

    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
      
      // Mostrar notificación de error
      toast.error('Error al iniciar sesión: ' + error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Iniciar Sesión</h2>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="login-remember">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Recordar mantener sesión activa
        </label>
        <button className="login-btn" type="submit">Iniciar Sesión</button>
      </form>
      <p className="login-register-text">¿No tienes una cuenta?</p>
      <button className="login-register-btn" onClick={handleRegister}>Regístrate</button>

      {/* Contenedor para Toastify */}
      <ToastContainer />
    </div>
  );
};

export default Login;
