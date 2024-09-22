import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase-config'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify'; // Importamos react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importamos los estilos de react-toastify
import './AdminProducts.css'; // Importa el archivo CSS

const AdminProducts = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null); 
  const [categoria, setCategoria] = useState(''); 
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null); // Estado para controlar el modo de edición

  const categorias = [
    'Accesorios', 'Almacenamiento', 'Periféricos', 'Protección', 
    'Audio', 'Cámaras', 'Smart Home', 'Accesorios Gamer', 
    'Componentes', 'Memorias RAM', 'Microprocesadores', 
    'Tablets', 'Celulares'
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      const productosCollection = await getDocs(collection(db, 'productos'));
      setProductos(productosCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchProductos();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `productos/${file.name}`); 
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef); 
    return imageUrl;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (imagen) {
        imageUrl = await handleImageUpload(imagen);
      }

      if (editId) {
        const productRef = doc(db, 'productos', editId);
        await updateDoc(productRef, {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          categoria,
          ...(imageUrl && { imagen: imageUrl }) // Actualizar imagen solo si hay una nueva
        });
        setEditId(null);
        console.log("Producto actualizado");
        toast.success('Producto actualizado exitosamente.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'custom-toast',
          progressClassName: 'custom-toast-progress',
        });
      } else {
        await addDoc(collection(db, 'productos'), {
          nombre,
          precio: parseFloat(precio),
          descripcion,
          imagen: imageUrl,
          categoria,
        });
        console.log("Producto añadido");
        toast.success('Producto añadido exitosamente.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'custom-toast',
          progressClassName: 'custom-toast-progress',
        });
      }

      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
      setCategoria('');

      const productosCollection = await getDocs(collection(db, 'productos'));
      setProductos(productosCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log("Error al añadir/editar producto: ", error);
      toast.error('Error al añadir/editar producto.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',
        progressClassName: 'custom-toast-progress',
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      setProductos(productos.filter(product => product.id !== id));
      console.log("Producto eliminado");
      toast.success('Producto eliminado exitosamente.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',
        progressClassName: 'custom-toast-progress',
      });
      
    } catch (error) {
      console.log("Error al eliminar producto: ", error);
      toast.error('Error al eliminar producto.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',
        progressClassName: 'custom-toast-progress',
      });
    }
  };

  const handleEditProduct = (producto) => {
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setDescripcion(producto.descripcion);
    setCategoria(producto.categoria);
    setEditId(producto.id);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-header">Gestión de Productos</h2>
      <form className="admin-form" onSubmit={handleAddProduct}>
        <input
          className="admin-input"
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="admin-input"
          type="number"
          placeholder="Precio del producto"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <textarea
          className="admin-input"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>

        <select className="admin-input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="" disabled>Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          className="admin-input"
          type="file"
          onChange={(e) => setImagen(e.target.files[0])} 
        />

        <button className="admin-btn" type="submit">
          {editId ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </form>

      <h3 className="admin-subheader">Lista de Productos</h3>
      <ul className="admin-product-list">
        {productos.map((producto) => (
          <li key={producto.id} className="admin-product-item">
            <div className="admin-product-info">
              <span className="admin-product-name">{producto.nombre} - ${producto.precio}</span>
              <img src={producto.imagen} alt={producto.nombre} className="admin-product-image" />
            </div>
            <div className="admin-btn-container">
              <button className="admin-btn edit-btn" onClick={() => handleEditProduct(producto)}>Editar</button>
              <button className="admin-btn delete-btn" onClick={() => handleDeleteProduct(producto.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer /> {/* Contenedor para las notificaciones */}
    </div>
  );
};

export default AdminProducts;
