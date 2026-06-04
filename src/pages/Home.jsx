import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SuccessStories from '../components/SuccessStories';
import About from '../components/About';
import Subscribe from '../components/Subscribe';
import Packages from '../components/Packages';
import Champions from '../components/Champions';
import Program from '../components/Program';
import BMI from '../components/BMI';
import FAQ from '../components/FAQ';

const Home = () => {
  const { theme, toggleTheme, lang, toggleLang } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <>
      <Hero />
      <Features />
      <About linkTo="/about" />
      <SuccessStories />
      <Subscribe />
      <Packages linkTo="/packages" />
      <Champions linkTo="/champions" />
      <Program />
      <FAQ linkTo="/faq" />
    </>
  );
};

export default Home;
