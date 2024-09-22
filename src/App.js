import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminProducts from './components/AdminProducts';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';



function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Accesorios', 'Almacenamiento', 'Periféricos', 'Protección',
    'Audio', 'Cámaras', 'Smart Home', 'Accesorios Gamer',
    'Componentes', 'Memorias RAM', 'Microprocesadores',
    'Tablets', 'Celulares'
  ];

  const addToCart = (product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Router>
      <div className="App">
        <Navbar isAdmin={isAdmin} />
        
        {/* Main content */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="container mt-3">
                    <div className="row justify-content-center">
                      <div className="col-md-3">
                        <CategoryList
                          categories={categories}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                        />
                      </div>
                      <div className="col-md-9">
                        <Banner />
                      </div>
                    </div>

                    {/* Ofertas del día */}
                    <div className="row justify-content-center mt-4">
  {selectedCategory === '' && (
    <>
      <div className="col-md-12 text-center">
        <h2 className="mb-4">Ofertas en tienda fisica</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card card-product">
            <img src={require('./assets/promo1.jpeg')} className="card-img-top" alt="Timon y Pedales" />
            <div className="card-body">
              <h5 className="card-title">KIT TIMON Y PEDALES DRIVING FORCE LOGITECH G923 PC y PS4 941-000147</h5>
              <p className="card-text">Consulta en nuestra sucursal Plaza Mundo Apopa.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-product">
            <img src={require('./assets/promo2.jpeg')} className="card-img-top" alt="Tarjeta de Video" />
            <div className="card-body">
              <h5 className="card-title">TARJETA DE VIDEO ASUS DUAL RTX3060 12GB GDDR6 90YV0GB2-MVAA10 V2</h5>
              <p className="card-text">Consulta en nuestra sucursal Plaza Mundo Soyapango.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-product">
            <img src={require('./assets/promo3.png')} className="card-img-top" alt="Carro a Control Remoto" />
            <div className="card-body">
              <h5 className="card-title">CARRO A CONTROL REMOTO XDJ-C121</h5>
              <p className="card-text">Consulta en nuestra sucursal MetroCentro.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
</div>


                    {/* Listado de productos */}
                    <div className="row justify-content-center mt-4">
                      <div className="col-md-12">
                        <ProductList addToCart={addToCart} selectedCategory={selectedCategory} />
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas para administradores */}
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>Sobre Nosotros</h5>
                <p>Somos una empresa de ventas de productos hardware para computadoras.
                  Nuestro slogan es: "Si lo busca lo entuentra".</p>
              </div>
              <div className="col-md-4">
                <h5>Contacto</h5>
                <p>Email: contacto@pccomponentes.com</p>
                <p>Teléfono: 123-456-789</p>
              </div>
              <div className="col-md-4">
                <h5>Desarrolladores</h5>
                <p>Nombre: Elmer Cardoza, <a href="mailto:pc0482032019@unab.edu.sv">pc0482032019@unab.edu.sv</a></p>
                <p>Nombre: Dennis Landaverde, <a href="mailto:fl0368032019@unab.edu.sv">fl0368032019@unab.edu.sv</a></p>
                <p>Nombre: Roberto Guevara, <a href="mailto:gs0126032019@unab.edu.sv">gs0126032019@unab.edu.sv</a></p>
                <p>Nombre: Oscar Rodriguez, <a href="mailto:ra0203032019@unab.edu.sv">ra0203032019@unab.edu.sv</a></p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
