import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SelectService } from './components/SelectService';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { XeroxSection } from './components/XeroxSection';
import { StationerySection } from './components/StationerySection';
import { FancySection } from './components/FancySection';
import { AdminDashboard } from './components/AdminDashboard';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView } = useShop();

  // If in admin dashboard view, render full admin portal
  if (activeView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#4A0000] text-amber-50 selection:bg-[#FFDF73] selection:text-[#4A0000]">
      {/* 2. Single horizontal header bar: Maroon background, golden sparkle in circle, shop name, language switcher, WhatsApp */}
      <Header />

      <main className="flex-1">
        {/* HOMEPAGE VIEW */}
        {activeView === 'home' && (
          <>
            {/* 4. Hero Section */}
            <Hero />

            {/* 5. Select the Service (Exactly three service boxes) */}
            <SelectService onSelectService={(id) => setActiveView(id)} />

            {/* 11. Our Gallery (Uploaded by Admin or clean state) */}
            <GallerySection />

            {/* 10. Shop Location & Directions */}
            <LocationSection />
          </>
        )}

        {/* 6. Dedicated Xerox & Printing Selection */}
        {activeView === 'xerox' && <XeroxSection />}

        {/* 7. Dedicated Books & Stationery Selection */}
        {activeView === 'stationery' && <StationerySection />}

        {/* 8. Dedicated Fancy Items Selection */}
        {activeView === 'fancy' && <FancySection />}
      </main>

      {/* Footer with tiny discreet Admin Login at the very bottom */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
