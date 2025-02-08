import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";
import "../App.css";

/**
 * Configure la racine pour React-Modal
 */
Modal.setAppElement("#root");

/**
 * Fonction utilitaire : importe toutes les images
 * d'un dossier via require.context (Webpack).
 */
const importAllImages = (r) => r.keys().map(r);

/**
 * Retourne un tableau d’images pour une catégorie donnée
 */
const getImagesForCategory = (category) => {
  switch (category.toLowerCase()) {
    case "france":
      return importAllImages(
        require.context("../assets/images/france", false, /\.(png|jpe?g|webp|gif)$/)
      );
    case "usa":
      return importAllImages(
        require.context("../assets/images/usa", false, /\.(png|jpe?g|webp|gif)$/)
      );
    case "japon":
      return importAllImages(
        require.context("../assets/images/japon", false, /\.(png|jpe?g|webp|gif)$/)
      );
    default:
      return [];
  }
};

/** Barre de navigation (inspiration telecarte.free.fr) */
const NavBar = () => {
  return (
    <nav className="bg-gray-200 py-2">
      <ul className="flex justify-center gap-6 text-gray-700 font-semibold text-sm">
        <li className="hover:text-blue-600"><a href="#accueil">Accueil</a></li>
        <li className="hover:text-blue-600"><a href="#france">Télécartes France</a></li>
        <li className="hover:text-blue-600"><a href="#usa">Télécartes USA</a></li>
        <li className="hover:text-blue-600"><a href="#japon">Télécartes Japon</a></li>
        <li className="hover:text-blue-600"><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

/** Header simplifié, inspiré du style “sobre” */
const Header = () => {
  return (
    <header className="bg-white shadow mb-2">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/images/logo-telecarte.png"
            alt="Logo Télécarte"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-700">
            Collection Télécartes
          </h1>
        </div>
        <p className="text-sm text-gray-500 hidden sm:block">
          (Inspiration : telecarte.free.fr)
        </p>
      </div>
      <NavBar />
    </header>
  );
};

/** Footer */
const Footer = () => {
  return (
    <footer className="bg-gray-200 mt-8 py-4">
      <div className="max-w-5xl mx-auto px-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} - MonSiteCartes. Tous droits réservés. | 
        <a href="#mentions" className="ml-2 text-blue-600 hover:underline">Mentions légales</a>
      </div>
    </footer>
  );
};

/**
 * TableRow : affichage de chaque “carte” en style “table”
 */
const TableRow = ({ imgSrc, title, onClick }) => {
  return (
    <tr className="border-b hover:bg-gray-100 transition-colors">
      <td className="p-2">
        <img
          src={imgSrc}
          alt={title}
          className="w-20 h-20 object-contain cursor-pointer"
          onClick={onClick}
        />
      </td>
      <td className="p-2 align-middle font-medium text-gray-700">
        {title}
      </td>
      <td className="p-2 align-middle">
        <button
          onClick={onClick}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Voir détail
        </button>
      </td>
    </tr>
  );
};

/** Diaporama modale */
const GalleryModal = ({ isOpen, onClose, images, currentIndex, setCurrentIndex, category }) => {
  // Style simplifié + centré
  const centeredModalStyle = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "480px",
      maxHeight: "80vh",
      overflow: "auto",
      padding: "1rem",
      backgroundColor: "#fff",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 9999,
    },
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={centeredModalStyle}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Galerie {category}
      </h2>
      <div className="flex flex-col items-center">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={category}
          className="w-72 h-72 object-contain rounded border border-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="mt-4 flex gap-4">
          <button
            onClick={prev}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
          >
            Précédent
          </button>
          <button
            onClick={next}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
          >
            Suivant
          </button>
        </div>
      </div>
      <button
        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        onClick={onClose}
      >
        Fermer
      </button>
    </Modal>
  );
};

const Marketplace = () => {
  // Images stockées par catégorie
  const [images, setImages] = useState({
    France: [],
    USA: [],
    Japon: [],
  });

  // Etats pour modales
  const [isOpenFrance, setIsOpenFrance] = useState(false);
  const [franceIndex, setFranceIndex] = useState(0);

  const [isOpenUSA, setIsOpenUSA] = useState(false);
  const [usaIndex, setUsaIndex] = useState(0);

  const [isOpenJapon, setIsOpenJapon] = useState(false);
  const [japonIndex, setJaponIndex] = useState(0);

  // Charger les images au montage
  useEffect(() => {
    setImages({
      France: getImagesForCategory("france"),
      USA: getImagesForCategory("usa"),
      Japon: getImagesForCategory("japon"),
    });
  }, []);

  // Ouvrir modales
  const openFrance = (index = 0) => {
    setFranceIndex(index);
    setIsOpenFrance(true);
  };
  const openUSA = (index = 0) => {
    setUsaIndex(index);
    setIsOpenUSA(true);
  };
  const openJapon = (index = 0) => {
    setJaponIndex(index);
    setIsOpenJapon(true);
  };

  // Fermer
  const closeFrance = () => setIsOpenFrance(false);
  const closeUSA = () => setIsOpenUSA(false);
  const closeJapon = () => setIsOpenJapon(false);

  // On va présenter chaque catégorie sous forme de “table” inspirée du site telecarte.free.fr

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto p-4">
        {/* Présentation style "table", un peu comme telecarte.free.fr */}
        {/* FRANCE */}
        <section id="france" className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">
            Télécartes de France
          </h2>
          <div className="overflow-x-auto bg-white shadow border border-gray-300">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Visuel</th>
                  <th className="p-2">Référence / Nom</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.France.map((imgSrc, i) => (
                  <TableRow
                    key={i}
                    imgSrc={imgSrc}
                    title={`Carte France #${i + 1}`}
                    onClick={() => openFrance(i)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* USA */}
        <section id="usa" className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">
            Télécartes des USA
          </h2>
          <div className="overflow-x-auto bg-white shadow border border-gray-300">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Visuel</th>
                  <th className="p-2">Référence / Nom</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.USA.map((imgSrc, i) => (
                  <TableRow
                    key={i}
                    imgSrc={imgSrc}
                    title={`Carte USA #${i + 1}`}
                    onClick={() => openUSA(i)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* JAPON */}
        <section id="japon" className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">
            Télécartes du Japon
          </h2>
          <div className="overflow-x-auto bg-white shadow border border-gray-300">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Visuel</th>
                  <th className="p-2">Référence / Nom</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.Japon.map((imgSrc, i) => (
                  <TableRow
                    key={i}
                    imgSrc={imgSrc}
                    title={`Carte Japon #${i + 1}`}
                    onClick={() => openJapon(i)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modales */}
      <GalleryModal
        isOpen={isOpenFrance}
        onClose={closeFrance}
        images={images.France}
        currentIndex={franceIndex}
        setCurrentIndex={setFranceIndex}
        category="France"
      />
      <GalleryModal
        isOpen={isOpenUSA}
        onClose={closeUSA}
        images={images.USA}
        currentIndex={usaIndex}
        setCurrentIndex={setUsaIndex}
        category="USA"
      />
      <GalleryModal
        isOpen={isOpenJapon}
        onClose={closeJapon}
        images={images.Japon}
        currentIndex={japonIndex}
        setCurrentIndex={setJaponIndex}
        category="Japon"
      />
    </div>
  );
};

export default Marketplace;
