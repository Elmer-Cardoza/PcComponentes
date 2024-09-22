import React, { useEffect } from 'react';
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import { db } from '../firebase-config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './Banner.css';

const Banner = () => {
  useEffect(() => {
    const incrementVisits = async () => {
      if (!localStorage.getItem('hasVisited')) {
        const docRef = doc(db, 'visitas', 'contador');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentVisits = docSnap.data().count || 0;
          await setDoc(docRef, { count: currentVisits + 1 }, { merge: true });
          console.log("Visita registrada. Total visitas: ", currentVisits + 1);
        } else {
          await setDoc(docRef, { count: 1 });
          console.log("El documento de visitas no existía. Creado nuevo con 1 visita.");
        }
        localStorage.setItem('hasVisited', 'true');
      }
    };

    incrementVisits();
  }, []);

  return (
    <div id="carouselExampleIndicators" className="carousel slide custom-carousel" data-bs-ride="carousel">
      {/* Eliminamos el ol y usamos solo los li para los indicadores */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src={banner1} alt="Banner 1" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Play Station 5</h5>
            <p>Descubre nuestras grandes promociones en ps5</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src={banner2} alt="Banner 2" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Tarjetas gráficas</h5>
            <p>Dale ese empujón que necesita tu PC</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src={banner3} alt="Banner 3" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Procesadores AMD Ryzen</h5>
            <p>Juega y haz trabajos sin problemas con los Ryzen</p>
          </div>
        </div>
      </div>
      <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </a>
    </div>
  );
};

export default Banner;
