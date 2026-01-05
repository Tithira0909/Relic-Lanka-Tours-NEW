import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppBubble } from './components/common/WhatsAppBubble';

import { Home } from './pages/Home';
import { Tours } from './pages/Tours';
import { TourDetail } from './pages/TourDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { TourManager } from './pages/admin/TourManager';
import { TourForm } from './pages/admin/TourForm';
import { GalleryManager } from './pages/admin/GalleryManager';
import { Settings } from './pages/admin/Settings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col min-h-screen font-sans text-primary">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
            {children}
        </main>
        <Footer />
        <WhatsAppBubble />
    </div>
);


const App: React.FC = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <DataProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/tours" element={<Layout><Tours /></Layout>} />
              <Route path="/tours/:id" element={<Layout><TourDetail /></Layout>} />
              <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="tours" element={<TourManager />} />
                  <Route path="tours/new" element={<TourForm />} />
                  <Route path="tours/edit/:id" element={<TourForm />} />
                  <Route path="gallery" element={<GalleryManager />} />
                  <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Layout><div className="h-screen flex items-center justify-center text-3xl font-serif">404 - Not Found</div></Layout>} />
            </Routes>
          </AnimatePresence>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
