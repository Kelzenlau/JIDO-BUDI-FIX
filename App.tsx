import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth';
import { Loader } from 'lucide-react';
import { auth } from './services/firebase';
import { UserProfile } from './types';
import { LanguageProvider } from './LanguageContext';
import { CartProvider } from './CartContext';

// Components
import { Navbar, Footer, AnnouncementBar, WhatsAppFloat } from './components/Layout';
import { LoginPage } from './components/Auth';
import { Hero, ProductShowcase, AboutUs, LeaderboardPage, ProfilePage, AdsSection } from './components/Views';
import { GameSelection, Match3Game, SnackSwipeGame } from './components/Game';
import { CartDrawer } from './components/Cart';

const QuantumBackground = () => {
  // 生成随机粒子以增加细节感
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 5}s`
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      {/* 核心光球 1 - 蓝青色 */}
      <div 
        className="quantum-sphere bg-cyan-500/20" 
        style={{ width: '60vw', height: '60vw', top: '-10%', left: '-10%', animationDelay: '0s' }}
      />
      {/* 核心光球 2 - 紫色 */}
      <div 
        className="quantum-sphere bg-purple-600/15" 
        style={{ width: '70vw', height: '70vw', bottom: '-15%', right: '-10%', animationDelay: '-5s' }}
      />
      {/* 核心光球 3 - 靛蓝色 */}
      <div 
        className="quantum-sphere bg-indigo-500/10" 
        style={{ width: '40vw', height: '40vw', top: '30%', left: '40%', animationDelay: '-12s' }}
      />
      
      {/* 粒子层 */}
      {particles.map(p => (
        <div 
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `particle-twinkle ${p.duration} infinite ease-in-out`,
            animationDelay: p.delay,
            boxShadow: `0 0 10px white`
          }}
        />
      ))}

      {/* 磨砂玻璃叠加层，增加高级感 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]"></div>
    </div>
  );
};

function AppContent() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeGameMode, setActiveGameMode] = useState<string | null>(null); 
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => { if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { await signInWithCustomToken(auth, __initial_auth_token); } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser as unknown as UserProfile); setAuthLoading(false); });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { await signOut(auth); setUser(null); };

  if (authLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <QuantumBackground />
      <div className="relative z-10 flex flex-col items-center">
        <Loader className="animate-spin text-cyan-400 mb-4" size={48} />
        <span className="text-cyan-400 font-bold tracking-widest animate-pulse">SYSTEM INITIALIZING...</span>
      </div>
    </div>
  );

  if (!user) return <LoginPage setUser={setUser} />;

  const renderPage = () => {
    switch(currentPage) {
        case 'home': return <><Hero onPlay={() => setCurrentPage('game')} /><AdsSection /></>;
        case 'products': return <div className="pt-20"><ProductShowcase /></div>;
        case 'game': return (
          <div className="pt-24 pb-20 min-h-screen flex flex-col items-center relative z-10">
            {!activeGameMode ? (
              <GameSelection onSelectGame={setActiveGameMode} />
            ) : (
              activeGameMode === 'match3' ? 
                <Match3Game user={user} onOpenAuth={() => setIsAuthOpen(true)} onBack={() => setActiveGameMode(null)} /> : 
                <SnackSwipeGame user={user} onOpenAuth={() => setIsAuthOpen(true)} onBack={() => setActiveGameMode(null)} />
            )}
          </div>
        );
        case 'leaderboard': return <div className="pt-20"><LeaderboardPage /></div>;
        case 'about': return <div className="pt-20"><AboutUs /></div>;
        case 'profile': return <div className="pt-20"><ProfilePage user={user} /></div>;
        default: return <Hero onPlay={() => setCurrentPage('game')} />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-200 overflow-x-hidden w-full flex flex-col min-h-screen relative">
      <QuantumBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        {!activeGameMode && <AnnouncementBar />}
        {!activeGameMode && (
          <Navbar 
            user={user} 
            onOpenAuth={() => setIsAuthOpen(true)} 
            onLogout={handleLogout} 
            activePage={currentPage} 
            setActivePage={(page) => { 
              setCurrentPage(page); 
              setActiveGameMode(null); 
            }} 
          />
        )}
        <main className="flex-grow">{renderPage()}</main>
        {!activeGameMode && <Footer />}
        {!activeGameMode && <WhatsAppFloat />}
        <CartDrawer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LanguageProvider>
  );
}
