import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, PlayCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { TourCard } from '../components/features/TourCard';
import { SriLankaMap } from '../components/features/SriLankaMap';
import { TESTIMONIALS } from '../data/mockData';

import { useState, useEffect } from 'react';

export const Home: React.FC = () => {
  const { tours, heroImages } = useData();
  const featuredTours = tours.slice(0, 3);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Fallback hero images if none uploaded
  const displayImages = heroImages.length > 0
      ? heroImages
      : ['https://picsum.photos/1920/1080?random=99'];

  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
        setCurrentHeroIndex(prev => (prev + 1) % displayImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [displayImages]);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
              <motion.img
                key={currentHeroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                src={displayImages[currentHeroIndex]}
                alt="Sri Lanka Coast"
                className="w-full h-full object-cover absolute inset-0"
              />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm tracking-widest uppercase mb-6 backdrop-blur-sm">
              Explore the Wonder of Asia
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
              Unveil the Soul <br/> of <span className="italic text-ceylon-300">Sri Lanka</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Experience pristine beaches, ancient ruins, and misty mountains. Curated luxury journeys tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tours">
                <Button size="lg" className="min-w-[180px]">
                  Explore Tours
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="min-w-[180px] border-white text-white hover:bg-white hover:text-primary">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Video
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tours */}
      <Section className="bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-ceylon-700 font-semibold tracking-wider text-sm uppercase block mb-2">Curated Journeys</span>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary">Signature Collections</h2>
          </div>
          <Link to="/tours" className="hidden md:flex items-center text-ceylon-700 hover:text-ceylon-900 font-medium transition-colors mt-4 md:mt-0">
            View All Tours <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTours.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 md:hidden flex justify-center">
           <Link to="/tours">
            <Button variant="outline">View All Tours</Button>
           </Link>
        </div>
      </Section>

      {/* Experience / Editorial Section */}
      <section className="py-24 bg-paper overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
             >
                <div className="relative">
                  <img 
                    src="https://picsum.photos/600/800?random=50" 
                    alt="Tea Plantation" 
                    className="rounded-3xl shadow-2xl object-cover h-[600px] w-full"
                  />
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white rounded-3xl p-6 shadow-xl hidden md:block">
                     <p className="font-serif text-2xl italic text-gray-800 leading-snug mb-4">
                       "Sri Lanka is not just a destination; it's a feeling that stays with you forever."
                     </p>
                     <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                          <img src="https://picsum.photos/100/100?random=1" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-primary">Marco P.</p>
                          <p className="text-gray-500">Travel Editor</p>
                        </div>
                     </div>
                  </div>
                </div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
               <span className="text-ceylon-700 font-semibold tracking-wider text-sm uppercase block mb-4">Why Relic Lanka?</span>
               <h2 className="text-4xl md:text-6xl font-serif font-medium text-primary mb-8">
                 A Land Like <br/> No Other
               </h2>
               <p className="text-gray-500 text-lg leading-relaxed mb-6">
                 From the golden sandy beaches of the south to the misty tea plantations of the central highlands, Sri Lanka offers a diverse tapestry of experiences within a compact island.
               </p>
               <p className="text-gray-500 text-lg leading-relaxed mb-10">
                 Our local experts craft personalized itineraries that go beyond the guidebook. Taste authentic spices, meet local artisans, and walk through history in the Cultural Triangle.
               </p>
               
               <div className="grid grid-cols-2 gap-6 mb-10">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-3xl font-bold text-ceylon-700 mb-1">8</h3>
                    <p className="text-gray-600 font-medium">UNESCO Sites</p>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-3xl font-bold text-ceylon-700 mb-1">100+</h3>
                    <p className="text-gray-600 font-medium">Waterfalls</p>
                 </div>
               </div>

               <Button>Read Our Story</Button>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
             <span className="text-ceylon-700 font-semibold tracking-wider text-sm uppercase block mb-2">Destinations</span>
             <h2 className="text-4xl md:text-5xl font-serif font-medium text-primary mb-6">Explore the Island</h2>
             <p className="text-gray-500 mb-8 leading-relaxed">
               Click through the interactive map to discover the unique regions of Sri Lanka. From the colonial fort of Galle to the sacred city of Kandy.
             </p>
             <div className="space-y-4">
                {['Culture & Heritage', 'Wildlife & Nature', 'Beaches & Relaxation'].map((item, i) => (
                  <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-100">
                     <div className="w-10 h-10 rounded-full bg-ceylon-100 flex items-center justify-center text-ceylon-700 mr-4">
                        <MapPin className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-lg text-gray-800">{item}</span>
                     <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
                  </div>
                ))}
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <SriLankaMap />
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-paper rounded-[3rem] my-10">
         <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-medium text-primary mb-4">Traveler Stories</h2>
            <p className="text-gray-500">Hear from those who have experienced the magic of Sri Lanka with us.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
              >
                 <div className="flex text-yellow-400 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                 </div>
                 <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.text}"</p>
                 <div className="flex items-center">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                    <div>
                       <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                       <span className="text-xs text-gray-400">{t.role}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </Section>

      {/* CTA */}
      <section className="py-20 px-4">
         <div className="max-w-7xl mx-auto bg-ceylon-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-ceylon-800 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-ceylon-600 rounded-full translate-x-1/3 translate-y-1/3 opacity-30 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Ready for your adventure?</h2>
              <p className="text-ceylon-100 text-lg mb-10 max-w-2xl mx-auto">
                Let us help you plan the perfect itinerary. Whether you seek relaxation or adventure, Sri Lanka awaits.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-ceylon-900 hover:bg-gray-100 shadow-none">
                  Start Planning
                </Button>
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
};
