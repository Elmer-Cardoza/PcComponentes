import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './AdminDashboard.css'; // Importa el archivo CSS

const AdminDashboard = () => {
  const [compras, setCompras] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    // Función para obtener todas las compras realizadas
    const fetchCompras = async () => {
      const comprasCollection = await getDocs(collection(db, 'compras'));
      const comprasData = comprasCollection.docs.map((doc) => doc.data());
      setCompras(comprasData);

      const total = comprasData.reduce((acc, compra) => acc + compra.total, 0);
      setTotalVentas(total);
    };

    // Función para obtener el contador de visitas
    const fetchVisitas = async () => {
      const visitasDoc = await getDoc(doc(db, 'visitas', 'contador'));
      if (visitasDoc.exists()) {
        setVisitas(visitasDoc.data().count || 0);
      }
    };

    fetchCompras();
    fetchVisitas();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-header">Panel de Administración</h2>
      <h3 className="admin-dashboard-total">Total de Ventas: ${totalVentas}</h3>
      <h3 className="admin-dashboard-visitas">Total de Visitas: {visitas}</h3>
      <ul className="admin-dashboard-list">
        {compras.map((compra, index) => (
          <li key={index} className="admin-dashboard-list-item">
            Compra realizada el {new Date(compra.fecha.seconds * 1000).toLocaleDateString()} - Total: ${compra.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
