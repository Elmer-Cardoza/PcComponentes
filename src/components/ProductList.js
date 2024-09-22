import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify'; // Importamos react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos de react-toastify
import '../App.css';

const ProductList = ({ addToCart, selectedCategory }) => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosCollection = await getDocs(collection(db, 'productos'));
      setProductos(productosCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchProductos();
  }, []);

  const handleCardClick = (producto) => {
    setSelectedProduct(producto);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (producto) => {
    if (user) {
      addToCart(producto);
      toast.success(`${producto.nombre} añadido al carrito`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',  // Clase personalizada para el contenedor
        progressClassName: 'custom-toast-progress',  // Clase para la barra de progreso
      });
    } else {
      toast.error('Por favor, inicia sesión para agregar productos al carrito.', {
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

const filteredProducts = selectedCategory !== ''  // Comparamos de forma explícita
  ? productos.filter((producto) => producto.categoria === selectedCategory)
  : [];  // No muestra ningún producto si no hay categoría seleccionada


  return (
    <div className="container mt-4">
      <div className="row">
        {filteredProducts.map((producto) => (
          <div
            key={producto.id}
            className="col-md-4 mb-4"
            onClick={() => handleCardClick(producto)}
          >
            <div className="card card-product h-100">
              <img
                src={producto.imagen || "https://via.placeholder.com/150"}
                className="card-img-top"
                alt={producto.nombre}
              />
              <div className="card-body">
                <h5 className="card-title product-title">{producto.nombre}</h5>
                <p className="card-text">Precio: ${producto.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header justify-content-center">
                <h5 className="modal-title product-title">{selectedProduct.nombre}</h5>
              </div>
              <div className="modal-body">
                <img src={selectedProduct.imagen} alt={selectedProduct.nombre} className="img-fluid mb-3" />
                <p>{selectedProduct.descripcion}</p>
                <p><strong>Precio: ${selectedProduct.precio}</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={() => handleAddToCart(selectedProduct)}>
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer /> {/* Contenedor para las notificaciones */}
    </div>
  );
};

export default ProductList;
