import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import PcLogo from '../assets/Pc.png';
import PerfilLogo from '../assets/Perfil.png';
import '../App.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState(''); // Almacena el nombre del usuario
  const [greeting, setGreeting] = useState(''); // Almacena el saludo
  const navigate = useNavigate(); 

  const userRef = useRef(null); // Ref para controlar el estado del usuario

  // Monitorea el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser !== userRef.current) {
        userRef.current = currentUser; // Asegura que se ejecute solo una vez por inicio de sesión
        setUser(currentUser);

        // Obtener el documento del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const firstName = userData.firstName || 'Usuario'; // Obtener el primer nombre o usar "Usuario" por defecto
          setUserName(firstName);

          // Verificar si el usuario es administrador
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());

          // Determinar el saludo según la hora del día
          const currentHour = new Date().getHours();
          if (currentHour < 12) {
            setGreeting('Buenos días');
          } else if (currentHour < 18) {
            setGreeting('Buenas tardes');
          } else {
            setGreeting('Buenas noches');
          }
        }
      } else if (!currentUser) {
        // Usuario ha cerrado sesión
        userRef.current = null; // Reiniciamos el ref para cuando vuelva a iniciar sesión
        setUser(null);
        setIsAdmin(false); 
        setUserName(''); // Restablecer el nombre si no hay usuario
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null); 
    setIsAdmin(false); 
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top navbar-transparent">
      <div className="container-fluid">
        {/* Logo que redirige al home */}
        <Link className="navbar-brand" to="/">
          <img src={PcLogo} alt="Logo" style={{ height: '30px' }} />
        </Link>

        {/* Botón para dispositivos móviles */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Otros links pueden ir aquí */}
          </ul>

          {/* Mostrar saludo y nombre si el usuario está autenticado */}
          {user && (
            <span className="navbar-text mx-3">
              {greeting}, {userName}!
            </span>
          )}

          {/* Icono de perfil con dropdown */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={PerfilLogo} alt="Perfil" style={{ height: '40px' }} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {!user && (
                  <li>
                    <Link className="dropdown-item" to="/login">Iniciar sesión</Link>
                  </li>
                )}

                {user && (
                  <li>
                    <Link className="dropdown-item" to="/cart">Carrito</Link>
                  </li>
                )}

                {isAdmin && user && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/admin/products">Admin Productos</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link>
                    </li>
                  </>
                )}

                {user && (
                  <>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
