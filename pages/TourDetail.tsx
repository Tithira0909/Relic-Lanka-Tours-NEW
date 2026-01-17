import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, CheckCircle, ChevronDown, User, ArrowLeft, Camera, Flag } from 'lucide-react';
import { useData } from '../context/DataContext'; // Changed to useData
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Section';
import { TourCard } from '../components/features/TourCard';

export const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'destinations' | 'activities'>('overview');
  const { tours } = useData();
  
  // Find tour
  const tour = tours.find(t => t.id === id);
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!tour) return <div className="p-20 text-center">Tour Not Found</div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        <div className="absolute top-24 left-4 md:left-8">
          <Link to="/tours" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Tours
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-ceylon-600 text-white rounded-full text-sm font-medium">{tour.category}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center">
                <Clock className="w-3 h-3 mr-2" /> {tour.days} Days / {tour.nights} Nights
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2">{tour.title}</h1>
            <div className="flex items-center text-white/90 text-lg">
              <MapPin className="w-5 h-5 mr-2" /> {tour.location}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
              {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'itinerary', label: 'Itinerary' },
                  { id: 'destinations', label: 'Destinations' },
                  { id: 'activities', label: 'Activities' },
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-4 font-medium text-lg relative transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? 'text-ceylon-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ceylon-700" />}
                  </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-primary">About this tour</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{tour.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-primary">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-ceylon-600 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tour.inclusions && tour.inclusions.length > 0 && (
                      <div className="bg-paper p-6 rounded-2xl">
                        <h3 className="font-bold text-primary mb-4 text-xl">Includes</h3>
                        <div className="text-sm text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tour.inclusions.map((inc, i) => (
                              <span key={i} className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> {inc}</span>
                          ))}
                        </div>
                         {tour.includedActivities && tour.includedActivities.length > 0 && (
                             <div className="mt-4 pt-4 border-t border-gray-100">
                                 <h4 className="font-bold text-primary mb-2">Included Activities</h4>
                                 <div className="flex flex-wrap gap-2">
                                     {tour.includedActivities.map((act, i) => (
                                         <span key={i} className="px-3 py-1 bg-ceylon-50 text-ceylon-700 rounded-full text-xs font-medium">{act}</span>
                                     ))}
                                 </div>
                             </div>
                         )}
                      </div>
                  )}
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-0">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="relative pl-8 pb-12 border-l border-gray-200 last:border-0 last:pb-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-ceylon-600" />
                      <span className="text-sm font-bold text-ceylon-700 uppercase tracking-wider mb-1 block">Day {item.day}</span>
                      <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'destinations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tour.destinations && tour.destinations.length > 0 ? (
                        tour.destinations.map((dest, idx) => (
                            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                <div className="h-48 overflow-hidden">
                                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <h4 className="text-xl font-bold text-primary mb-2 flex items-center">
                                        <Flag className="w-4 h-4 mr-2 text-ceylon-600" /> {dest.name}
                                    </h4>
                                    <p className="text-gray-600 text-sm">{dest.description}</p>
                                </div>
                            </div>
                        ))
                      ) : (
                          <div className="col-span-2 text-center text-gray-500 py-10">No detailed destination info available.</div>
                      )}
                  </div>
              )}

              {activeTab === 'activities' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {tour.activities && tour.activities.length > 0 ? (
                           tour.activities.map((act, idx) => (
                               <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                                   <div className="h-40 overflow-hidden">
                                       <img src={act.image} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                   </div>
                                   <div className="p-4 text-center">
                                       <h4 className="font-bold text-primary flex items-center justify-center">
                                           <Camera className="w-4 h-4 mr-2 text-ceylon-600" /> {act.name}
                                       </h4>
                                   </div>
                               </div>
                           ))
                       ) : (
                           <div className="col-span-3 text-center text-gray-500 py-10">No detailed activity info available.</div>
                       )}
                  </div>
              )}

            </motion.div>
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
               <div className="mb-6">
                 <span className="text-gray-400 text-sm">Starting from</span>
                 <div className="flex items-baseline">
                   <span className="text-4xl font-serif font-bold text-primary">${tour.price}</span>
                   <span className="text-gray-500 ml-2">/ person</span>
                 </div>
               </div>

               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none appearance-none">
                       <option>2 Adults</option>
                       <option>1 Adult</option>
                       <option>2 Adults, 1 Child</option>
                       <option>Group (4+)</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                 </div>

                 <Button size="lg" className="w-full mt-2">Request Quote</Button>
                 <p className="text-xs text-center text-gray-400 mt-3">No payment required yet.</p>
               </form>
               
               <div className="mt-8 pt-6 border-t border-gray-100">
                 <h5 className="font-semibold text-sm text-center mb-4">Why book with us?</h5>
                 <div className="space-y-3">
                   <div className="flex items-center text-sm text-gray-600">
                     <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Best Price Guarantee
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> No Hidden Fees
                   </div>
                   <div className="flex items-center text-sm text-gray-600">
                     <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 24/7 Local Support
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Related Tours */}
      <div className="bg-paper py-20">
        <Section>
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.filter(t => t.id !== tour.id).slice(0, 3).map(t => (
               <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};
