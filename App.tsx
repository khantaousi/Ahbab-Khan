
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './components/Portfolio';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { INITIAL_DATA, TRANSLATIONS } from './constants';
import { PortfolioData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_logged_in') === 'true';
  });

  const [lang, setLang] = useState<'en' | 'bn'>(() => {
    return (localStorage.getItem('app_lang') as 'en' | 'bn') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const handleUpdateData = (newData: PortfolioData) => {
    setData(newData);
  };

  const handleLogin = (status: boolean) => {
    setIsLoggedIn(status);
    localStorage.setItem('is_admin_logged_in', status.toString());
  };

  const t = TRANSLATIONS[lang];

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Portfolio data={data} lang={lang} setLang={setLang} t={t} />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={() => handleLogin(true)} lang={lang} t={t} />} 
        />
        <Route 
          path="/admin" 
          element={
            isLoggedIn ? (
              <AdminDashboard data={data} onUpdate={handleUpdateData} onLogout={() => handleLogin(false)} lang={lang} t={t} />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
