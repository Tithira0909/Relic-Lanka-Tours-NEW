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
  const { tours } = useData();
  const [selectedPackage, setSelectedPackage] = useState<'luxury' | 'semi_luxury'>('luxury');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  // Find tour
  const tour = tours.find(t => t.id === id);
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!tour) return <div className="p-20 text-center">Tour Not Found</div>;

  const getPrice = () => {
      let total = 0;
      const extra = selectedPackage === 'luxury' ? (tour.price_luxury || 0) : (tour.price_semi_luxury || 0);

      const adultPrice = tour.price + extra;
      const childPrice = (tour.price_child || 0) + extra;

      total += adults * adultPrice;
      total += children * childPrice;

      return total;
  };

  const currentHotels = selectedPackage === 'luxury' ? tour.hotels_luxury : selectedPackage === 'semi_luxury' ? tour.hotels_semi_luxury : [];

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
          <div className="lg:col-span-2 space-y-12">

            {/* Overview Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-primary">About this tour</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{tour.description}</p>
              </div>

              {tour.video_url && (
                <div className="mt-8">
                  <h3 className="text-2xl font-serif font-bold mb-4 text-primary">Tour Video</h3>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <iframe
                      src={tour.video_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Tour Video"
                    ></iframe>
                  </div>
                </div>
              )}

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
            </motion.div>

            {/* Combined Itinerary & Images */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <h3 className="text-2xl font-serif font-bold mb-6 text-primary border-b pb-4">Itinerary</h3>
              <div className="space-y-12">
                {tour.itinerary.map((item, idx) => (
                  <div key={idx} className="relative pl-8 border-l border-gray-200">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-ceylon-600" />
                    <span className="text-sm font-bold text-ceylon-700 uppercase tracking-wider mb-1 block">Day {item.day}</span>
                    <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-4">{item.description}</p>

                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {item.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="h-40 overflow-hidden rounded-xl shadow-sm">
                            <img src={imgUrl} alt={`Day ${item.day} image ${imgIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Destinations & Activities Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t pt-12">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-serif font-bold mb-6 text-primary">Destinations</h3>
                <div className="space-y-4">
                  {tour.destinations && tour.destinations.length > 0 ? (
                    tour.destinations.map((dest, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">{dest.name}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{dest.description}</p>
                            </div>
                        </div>
                    ))
                  ) : (
                      <div className="text-gray-500 text-sm">No destination info available.</div>
                  )}
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-2xl font-serif font-bold mb-6 text-primary">Activities</h3>
                <div className="grid grid-cols-2 gap-4">
                    {tour.activities && tour.activities.length > 0 ? (
                        tour.activities.map((act, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-24 overflow-hidden">
                                    <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-2 text-center">
                                    <h4 className="font-bold text-xs text-primary">{act.name}</h4>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-gray-500 text-sm">No activity info available.</div>
                    )}
                </div>
              </motion.div>
            </div>

            {/* Hotels Section */}
            {currentHotels && currentHotels.length > 0 && (
                <div className="mt-8 border-t pt-12">
                    <h3 className="text-2xl font-serif font-bold mb-4 text-primary">
                        {selectedPackage === 'luxury' ? 'Luxury Hotels' : 'Semi-Luxury Hotels'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentHotels.map((hotel, idx) => (
                            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-48 overflow-hidden">
                                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-primary">{hotel.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* Sidebar Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
               <div className="mb-6">
                 <span className="text-gray-500 text-sm uppercase tracking-wider block mb-1">Starting at</span>
                 <div className="flex items-baseline mb-1">
                   <span className="text-4xl font-serif font-bold text-primary">LKR {getPrice().toLocaleString()}</span>
                 </div>
                 <span className="text-gray-400 text-sm">Per Person</span>
               </div>

               <div className="flex items-center mb-6 mt-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src="https://ui-avatars.com/api/?name=Devmini+Gunaratne&background=random" alt="Devmini Gunaratne" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h5 className="font-bold text-sm text-primary">Hello! I'm Devmini Gunaratne</h5>
                    <p className="text-xs text-gray-500 leading-tight">Your dedicated Destination Expert. Let's plan your dream getaway!</p>
                 </div>
               </div>

               <div className="mb-6 space-y-3">
                   <label className="block text-sm font-medium text-gray-700">Select Hotel Package</label>

                   {/* Luxury Option */}
                   {(tour.price_luxury || (tour.hotels_luxury && tour.hotels_luxury.length > 0) || true) && (
                       <div
                           onClick={() => setSelectedPackage('luxury')}
                           className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedPackage === 'luxury' ? 'border-ceylon-600 bg-ceylon-50' : 'border-gray-200 hover:border-ceylon-300'}`}
                       >
                           <div className="flex justify-between items-center">
                               <span className="font-medium text-gray-700">Luxury Package</span>
                               {tour.price_luxury ? (
                                   <span className="text-sm font-bold text-ceylon-700">+${tour.price_luxury} per person</span>
                               ) : null}
                           </div>
                       </div>
                   )}

                   {/* Semi-Luxury Option */}
                   {(tour.price_semi_luxury || (tour.hotels_semi_luxury && tour.hotels_semi_luxury.length > 0) || true) && (
                       <div
                           onClick={() => setSelectedPackage('semi_luxury')}
                           className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedPackage === 'semi_luxury' ? 'border-ceylon-600 bg-ceylon-50' : 'border-gray-200 hover:border-ceylon-300'}`}
                       >
                           <div className="flex justify-between items-center">
                               <span className="font-medium text-gray-700">Semi-Luxury Package</span>
                               {tour.price_semi_luxury ? (
                                   <span className="text-sm font-bold text-ceylon-700">+${tour.price_semi_luxury} per person</span>
                               ) : null}
                           </div>
                       </div>
                   )}
               </div>

               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                       <div className="relative">
                         <input
                            type="number"
                            min="1"
                            value={adults}
                            onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                       <div className="relative">
                         <input
                            type="number"
                            min="0"
                            value={children}
                            onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none"
                         />
                       </div>
                     </div>
                 </div>

                 <div className="pt-2">
                     <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white border-0 shadow-md">Book Now</Button>
                     <div className="text-center mt-3">
                         <a href="#" className="text-xs text-gray-500 italic hover:text-gray-700 underline">Have a coupon?</a>
                     </div>
                 </div>
                 <p className="text-xs text-center text-gray-400 mt-4">*Our reply time is almost instant</p>
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
