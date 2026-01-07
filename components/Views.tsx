import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChevronRight, MapPin, Calendar, Shield, Ticket, Gamepad2, Loader, ShoppingCart, Plus, Star, Instagram } from 'lucide-react';
import { getDoc, doc, collection, onSnapshot, query, addDoc, updateDoc } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { JidoBudiLogo } from './Layout';
import { LanguageContext } from '../LanguageContext';
import { DEFAULT_HOME_CONFIG, DEFAULT_ADS_CONFIG, INITIAL_PRODUCTS } from '../constants';
import { UserProfile, AdsConfig, HomeConfig } from '../types';
import { useCart } from '../CartContext';

export const Hero = ({ onPlay }: { onPlay: () => void }) => {
  const { t } = useContext(LanguageContext);
  const [config, setConfig] = useState<HomeConfig>(DEFAULT_HOME_CONFIG);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => { 
      const fetchConfig = async () => {
        try {
            const s = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'home'));
            if(s.exists()) {
                const data = s.data();
                setConfig({ ...DEFAULT_HOME_CONFIG, ...data } as HomeConfig);
            }
        } catch(e) {}
      };
      fetchConfig();
  }, []);

  const activeMediaUrl = config.mediaUrl || config.heroImage || DEFAULT_HOME_CONFIG.mediaUrl;
  
  useEffect(() => {
      if (videoRef.current && config.mediaType === 'video') {
          videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      }
  }, [activeMediaUrl, config.mediaType]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden text-white pt-24">
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                  <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase animate-pulse">Jido Budi Arcade</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200">{config.title}</h1>
                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">{config.subtitle}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={onPlay} className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-full shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] hover:scale-105 transition-all duration-300 group">
                    <span className="flex items-center tracking-widest uppercase text-sm">{t('play_now')} <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  </button>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center relative">
              <div className="relative w-72 h-[450px] md:w-80 md:h-[540px] bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-6 shadow-2xl border border-white/10 transform rotate-y-12 hover:rotate-y-0 hover:scale-105 transition-all duration-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
                <div className="w-full h-3/5 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner flex items-center justify-center p-1 overflow-hidden relative">
                    {config.mediaType === 'video' ? (
                        <video 
                            ref={videoRef}
                            src={activeMediaUrl} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover rounded-xl" 
                        />
                    ) : (
                        <img src={activeMediaUrl} alt="Vending" className="w-full h-full object-cover rounded-xl" />
                    )}
                </div>
                <div className="mt-8 space-y-4">
                  <div className="h-1 bg-white/5 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-1/3 shadow-[0_0_10px_#06b6d4]"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
                    <div className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </section>
  );
};

export const AdsSection = () => {
    const [config, setConfig] = useState<AdsConfig>(DEFAULT_ADS_CONFIG);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'ads'), (d) => {
            if(d.exists()) setConfig(d.data() as AdsConfig);
        });
        return () => unsub();
    }, []);

    const DynamicAdContent = () => (
        <div className="w-full max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative group bg-black/40 backdrop-blur-md">
            {config.type === 'video' ? (
                <video src={config.url} autoPlay loop muted playsInline className="w-full h-auto max-h-[500px] object-contain" />
            ) : (
                <img src={config.url} alt="Ad" className="w-full h-auto max-h-[500px] object-contain" />
            )}
            <div className="absolute top-6 right-6 bg-cyan-500/80 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">PROMOTION</div>
        </div>
    );

    const SOCIAL_REELS = [
        "https://www.instagram.com/reel/DTLCf6LE1PL/embed/",
        "https://www.instagram.com/reel/DTLErezE1PK/embed/"
    ];

    return (
        <div className="flex flex-col space-y-16 py-16">
            {/* Dynamic Ads from Firebase */}
            {config.active && config.url && (
                <section className="px-6">
                    {config.link ? (
                        <a href={config.link} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-[1.01]">
                            <DynamicAdContent />
                        </a>
                    ) : (
                        <DynamicAdContent />
                    )}
                </section>
            )}

            {/* Fixed Social Ads Grid: Instagram Reels */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                        <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                            <Instagram size={16} className="text-pink-500" />
                            <span className="text-xs font-black text-white/80 uppercase tracking-[0.3em]">Trending on Social</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                        {SOCIAL_REELS.map((reelUrl, idx) => (
                            <div key={idx} className="relative group w-full max-w-[360px] transform transition-all duration-500 hover:-translate-y-2">
                                {/* Decorative Glow */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                
                                <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-[2.2rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                                    <div className="h-8 bg-slate-800/50 flex items-center px-5 gap-1.5 border-b border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-red-400/30"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400/30"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400/30"></div>
                                        <div className="flex-1"></div>
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">POST {idx + 1}</span>
                                    </div>
                                    <div className="relative aspect-[9/16] bg-slate-950/50">
                                        <iframe 
                                            src={reelUrl} 
                                            className="w-full h-full border-none absolute inset-0"
                                            allowTransparency={true}
                                            scrolling="no"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export const ProductShowcase = () => {
  const { t } = useContext(LanguageContext);
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'products'), (snap) => {
        if (!snap.empty) {
            const dbProducts = snap.docs.map(d => ({id: d.id, ...d.data()}));
            const combined = [...INITIAL_PRODUCTS];
            dbProducts.forEach(dbP => {
                if (!combined.find(p => p.name.toLowerCase() === dbP.name.toLowerCase())) {
                    combined.push(dbP);
                }
            });
            setProducts(combined);
        } else {
            setProducts(INITIAL_PRODUCTS);
        }
    }, () => setProducts(INITIAL_PRODUCTS));
    return () => unsub();
  }, []);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] mb-4">{t('restocked')}</h2>
            <h3 className="text-5xl font-black text-white mb-4 tracking-tight">VENDING SELECTION</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">{t('grab_snacks')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
                <div key={product.id || Math.random()} className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden">
                    <div className="absolute top-6 left-6 z-20 bg-cyan-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.5)] uppercase tracking-tighter">
                        RM {parseFloat(product.price).toFixed(2)}
                    </div>
                    <div className="h-48 flex items-center justify-center mb-6 relative bg-slate-950/50 rounded-3xl overflow-hidden p-4">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" 
                            onError={(e: any) => { 
                                e.target.onerror = null; 
                                e.target.src = `https://placehold.co/400x400/0f172a/6366f1?text=${encodeURIComponent(product.name)}`; 
                            }} 
                        />
                    </div>
                    <div className="text-center flex-1 flex flex-col">
                        <h4 className="text-lg font-black text-white mb-4 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{product.name}</h4>
                        <button 
                            onClick={() => addToCart(product)}
                            className="w-full py-4 bg-white/5 hover:bg-cyan-500 text-white hover:text-slate-950 font-black rounded-2xl border border-white/10 hover:border-cyan-500 transition-all flex items-center justify-center gap-3 active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                        >
                            <ShoppingCart size={14} />
                            <span>Select Item</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export const AboutUs = () => {
  const { t } = useContext(LanguageContext);
  const DEFAULT_TEAM = [
    { name: "Livis Kumar A/L Selva Kumar", role: "CEO", photo: "https://drive.google.com/thumbnail?id=1YYJZ-6ysxeXMsABwG9fAtsBF0XJsfuRg&sz=w1000" },
    { name: "Lau Yuan Kang", role: "CFO", photo: "https://drive.google.com/thumbnail?id=1f2rSdb-9TLysV6aAbuDsNzCiUMtRzbBj&sz=w1000" },
    { name: "Muhammad Nur Aiman", role: "COO", photo: "https://drive.google.com/thumbnail?id=1Udkhw2XWiTnmP36IPbOrWEEF4EyBsgSD&sz=w1000" },
    { name: "Premi A/P Karunanithi", role: "CMO", photo: "https://drive.google.com/thumbnail?id=1Ryt57nOk3FmQJi6A1qln9gc5u0-5tu-P&sz=w1000" },
    { name: "Yong Yi Han", role: "CPO", photo: "https://drive.google.com/thumbnail?id=1vA046bqlxrHWGIICsSxqvIzgCKmMRA-_&sz=w1000" },
  ];

  return (
    <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">{t('about_title')}</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">{t('about_desc')}</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full border border-white/10 text-slate-300 font-bold backdrop-blur-md">
                    <MapPin size={18} className="text-cyan-400" />
                    <span className="text-xs uppercase tracking-widest">Faculty of Economics and Management (FEP)</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {DEFAULT_TEAM.map((member, index) => (
                    <div key={index} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center hover:-translate-y-4 transition-all duration-500 group">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-slate-950 border-2 border-white/10 shadow-2xl group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                            <img 
                                src={member.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
                                alt={member.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">{member.name}</h3>
                        <span className="px-4 py-1 bg-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-full group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                            {member.role}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-20 bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] p-12 text-center text-white border border-white/5 shadow-2xl">
                <h3 className="text-3xl font-black mb-6 tracking-tight uppercase">{t('mission_title')}</h3>
                <p className="max-w-3xl mx-auto text-slate-400 text-xl leading-relaxed font-medium">{t('mission_desc')}</p>
                 <p className="mt-6 max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed relative z-10">
                     Our mission is to combine smart vending technology with engaging gamification,
                     creating a fun, rewarding, and convenient experience for students and communities.
                </p>
            </div>

            <div className="mt-24">
                <h3 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-widest">{t('visit_us')}</h3>
                <div className="w-full h-[500px] bg-slate-950 rounded-[3rem] overflow-hidden border-8 border-slate-900 shadow-2xl relative">
                    <iframe 
                        title="Jido Budi Vending Machine Location" 
                        width="100%" 
                        height="100%" 
                        src="https://maps.google.com/maps?q=Faculty%20of%20Economics%20%26%20Management%2C%2043600%20Bangi%2C%20Selangor&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                        frameBorder="0" 
                        className="absolute inset-0 grayscale invert opacity-60 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-1000"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
  );
};

export const LeaderboardPage = () => {
    const { t } = useContext(LanguageContext);
    const [leaders, setLeaders] = useState<any[]>([]);
    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'leaderboard')), (s) => {
             let data = s.docs.map(d => ({ id: d.id, ...d.data() }));
             data.sort((a: any,b: any) => b.score - a.score);
             setLeaders(data.slice(0,10));
        }, () => {});
        return () => unsub();
    }, []);
    return (
        <section className="py-24 px-6 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">{t('top_snackers')}</h2>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">{t('compete_spot')}</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
                  <div className="p-8 space-y-2">
                    {leaders.length > 0 ? leaders.map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between py-5 px-6 rounded-2xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-6">
                          <span className={`font-black text-xl w-8 ${i < 3 ? 'text-cyan-400' : 'text-slate-600'}`}>{i + 1}</span>
                          <img src={p.photoURL} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-cyan-500/50 transition-all" />
                          <span className="text-lg font-bold text-white uppercase tracking-tight">{p.name}</span>
                        </div>
                        <span className="text-md font-black text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">{p.score}</span>
                      </div>
                    )) : <div className="text-center py-12 text-slate-500 font-bold uppercase tracking-widest">{t('no_scores')}</div>}
                  </div>
                </div>
            </div>
        </section>
    );
};

export const ProfilePage = ({ user }: { user: UserProfile }) => {
    const { t } = useContext(LanguageContext);
    const [userVouchers, setUserVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [redeemCode, setRedeemCode] = useState('');

    useEffect(() => {
        if (user?.uid) {
            const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'vouchers'));
            onSnapshot(q, (s) => {
                let vouchers = s.docs.map(d => ({id: d.id, ...d.data()}));
                vouchers.sort((a: any,b: any) => (b.sentAt?.toDate ? b.sentAt.toDate() : 0) - (a.sentAt?.toDate ? a.sentAt.toDate() : 0));
                setUserVouchers(vouchers);
                setLoading(false); 
            }, () => setLoading(false));
        }
    }, [user]);

    const handleRedeem = async () => {
        if(!redeemCode) return;
        try {
            const codeRef = doc(db, 'artifacts', appId, 'public', 'data', 'flash_codes', redeemCode);
            const codeSnap = await getDoc(codeRef);
            if(codeSnap.exists() && codeSnap.data().active && codeSnap.data().used < codeSnap.data().limit) {
                const reward = codeSnap.data().reward;
                await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'vouchers'), {
                    code: `FLASH-${redeemCode}`, name: user.displayName, email: user.email, score: 0, sentAt: new Date(), status: 'redeemed', gameType: 'flash-event', reward
                });
                await updateDoc(codeRef, { used: (Number(codeSnap.data().used) || 0) + 1 });
                alert(t('code_success'));
                setRedeemCode('');
            } else {
                alert(t('invalid_code'));
            }
        } catch(e) { alert("Error redeeming"); }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-cyan-400" /></div>;

    return (
        <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">{t('profile_title')}</h2>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{t('profile_desc')}</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 mb-12">
                    <div className="h-40 bg-gradient-to-r from-cyan-600/30 to-purple-600/30"></div>
                    <div className="px-12 pb-12">
                        <div className="relative -mt-20 mb-8 flex justify-center">
                          <div className="p-3 bg-slate-950 rounded-full border border-white/10 shadow-2xl">
                            <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="P" className="w-36 h-36 rounded-full bg-slate-800" />
                          </div>
                        </div>
                        <div className="text-center mb-12">
                          <h3 className="text-3xl font-black text-white mb-2 uppercase">{user.displayName}</h3>
                          <p className="text-slate-500 font-medium">{user.email}</p>
                          <span className="inline-block mt-4 px-6 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Gamer Status: Elite</span>
                        </div>
                        
                        <div className="max-w-md mx-auto mb-12 flex gap-3">
                             <input type="text" placeholder={t('redeem_code')} value={redeemCode} onChange={e => setRedeemCode(e.target.value)} className="flex-1 bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 text-white font-bold transition-all" />
                             <button onClick={handleRedeem} className="bg-cyan-500 text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]">Redeem</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center gap-6">
                              <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl"><Calendar size={28} /></div>
                              <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t('member_since')}</p>
                                <p className="text-xl font-bold text-white">JAN 2025</p>
                              </div>
                            </div>
                            <div className="p-8 bg-slate-950/50 rounded-3xl border border-white/5 flex items-center gap-6">
                              <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl"><Shield size={28} /></div>
                              <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t('account_type')}</p>
                                <p className="text-xl font-bold text-white">MEMBER</p>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/5 p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-2xl"><Ticket size={32}/></div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">{t('my_vouchers')}</h3>
                  </div>
                  {userVouchers.length === 0 ? (
                    <div className="text-center py-20 bg-slate-950/50 rounded-[2rem] border-2 border-dashed border-white/5">
                      <p className="text-slate-500 font-black uppercase tracking-widest mb-6">{t('no_vouchers')}</p>
                      <Gamepad2 size={64} className="text-slate-800 mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userVouchers.map((v) => (
                        <div key={v.id} className="relative p-6 bg-slate-950/80 border border-white/10 rounded-3xl flex flex-col justify-between overflow-hidden group hover:border-cyan-500/50 transition-all">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Ticket size={120} /></div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{t('voucher_code')}</p>
                            <p className="text-2xl font-mono font-black text-white tracking-[0.2em]">{v.code}</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-end">
                            <div>
                              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{t('voucher_won')}</p>
                              <p className="text-xs font-bold text-slate-400 uppercase">24.01.2025</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{t('game_played')}</p>
                              <p className="text-xs font-bold text-cyan-500 uppercase">{v.gameType || 'Arcade'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>
        </section>
    );
};
