import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Champions from '../components/Champions';
import './PageStyle.css';

const ChampionsPage = () => {
  const { t } = useTranslation();
  const [transformations, setTransformations] = useState([]);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "champions"));
        if (!querySnapshot.empty) {
          setTransformations(querySnapshot.docs.map(doc => doc.data()));
        } else {
          setTransformations([
            { image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
            { image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' }
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransformations();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('champions.title')}
        </motion.h1>
      </div>
      <div className="page-content">
        <Champions />
        
        <div className="extra-info section-padding">
          <h2>{t('champions.transformTitle')}</h2>
          <p>{t('champions.transformDesc')}</p>
          
          <div className="image-grid mt-4">
            {transformations.map((champ, index) => (
              <img key={index} src={champ.image} alt={`Transformation ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionsPage;
