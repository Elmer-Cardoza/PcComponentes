import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore'; // Importamos 'addDoc' y 'collection'
import { getAuth } from 'firebase/auth';
import './Cart.css';
import { ToastContainer, toast } from 'react-toastify'; // Importamos react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos de react-toastify

const Cart = ({ cartItems, setCartItems }) => {
  const [user, setUser] = useState(null); // Estado para manejar el usuario logueado
  const auth = getAuth();

  // Función para cargar el carrito desde Firestore
  const loadCart = useCallback(async (uid) => {
    try {
      const cartDoc = await getDoc(doc(db, 'carts', uid));
      if (cartDoc.exists()) {
        setCartItems(cartDoc.data().items || []);
        console.log('Carrito cargado desde Firestore:', cartDoc.data().items);
      } else {
        console.log('No se encontró carrito en Firestore para este usuario.');
      }
    } catch (error) {
      console.error('Error al cargar el carrito desde Firestore:', error);
    }
  }, [setCartItems]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadCart(user.uid); // Cargar el carrito cuando el usuario inicia sesión
      } else {
        setUser(null);
        setCartItems([]); // Limpiar el carrito si no hay usuario
      }
    });

    return () => unsubscribe();
  }, [auth, loadCart, setCartItems]);

  // Guardar el carrito en Firestore
  const saveCart = async (uid, items) => {
    try {
      console.log('Guardando carrito en Firestore:', items); // Log para ver lo que estamos guardando
      await setDoc(doc(db, 'carts', uid), { items }, { merge: true }); // Guardar los items del carrito en Firestore
      console.log('Carrito guardado exitosamente en Firestore:', items);
    } catch (error) {
      console.error('Error al guardar el carrito en Firestore:', error);
    }
  };

  // Guardar el carrito en Firestore cada vez que cambie
  useEffect(() => {
    if (user) {
      saveCart(user.uid, cartItems); // Guardar en Firestore cada vez que cambie el carrito
    }
  }, [cartItems, user]);

  // Eliminar un producto del carrito
  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1); // Eliminar el producto por índice
    setCartItems(updatedCartItems); // Actualizamos el estado del carrito
  };

  // Manejar la compra y vaciar el carrito
  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      toast.error("El carrito está vacío.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',  // Clase personalizada para el contenedor
        progressClassName: 'custom-toast-progress',  // Clase para la barra de progreso
      });
      return;
    }

    try {
      const total = cartItems.reduce((acc, item) => acc + item.precio, 0);
      const docRef = await addDoc(collection(db, 'compras'), {
        productos: cartItems,
        total: total,
        fecha: new Date(),
      });

      console.log("Compra realizada con éxito. ID de compra: ", docRef.id);
      toast.success(`Compra realizada con éxito. Total: $${total}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',  // Clase personalizada para el contenedor
        progressClassName: 'custom-toast-progress',  // Clase para la barra de progreso
      });

      // Vaciar el carrito y actualizar en Firestore
      setCartItems([]);
      saveCart(user.uid, []); // Guardamos el carrito vacío en Firestore
    } catch (error) {
      console.error("Error al realizar la compra: ", error);
      toast.error("Hubo un error al procesar la compra. Intenta nuevamente.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',  // Clase personalizada para el contenedor
        progressClassName: 'custom-toast-progress',  // Clase para la barra de progreso
      });
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-header">Carrito</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty">No hay productos en el carrito.</p>
      ) : (
        <div>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="cart-item-image-container">
                  <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.nombre}</span>
                  <span className="cart-item-price">${item.precio}</span>
                </div>
                <button onClick={() => removeFromCart(index)} className="cart-item-remove">Eliminar</button>
              </li>
            ))}
          </ul>
          <p className="cart-total">
            <strong>Total: ${cartItems.reduce((acc, item) => acc + item.precio, 0)}</strong>
          </p>
          <button className="cart-purchase-btn" onClick={handlePurchase}>Finalizar Compra</button>
        </div>
      )}

      <ToastContainer /> {/* Contenedor para las notificaciones */}
    </div>
  );
};

export default Cart;