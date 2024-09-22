import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore'; // Importamos funciones para manejar Firestore
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importa el archivo CSS que hemos creado

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // Estado para el nombre
  const [lastName, setLastName] = useState(''); // Estado para el apellido
  const [address, setAddress] = useState(''); // Estado para la dirección
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); // Inicializamos Firestore

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Creamos un documento en Firestore para almacenar la información adicional del usuario
      await setDoc(doc(db, "users", user.uid), {
        firstName, // Almacenamos el nombre
        lastName, // Almacenamos el apellido
        address // Almacenamos la dirección
      });

      console.log('Account created:', userCredential);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-header">Crear Cuenta</h2>
      {error && <p className="register-error">{error}</p>}
      <form className="register-form" onSubmit={handleRegister}>
        <input
          className="register-input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          placeholder="Nombres"
          maxLength="20"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          placeholder="Apellidos"
          maxLength="20"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="register-btn" type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
