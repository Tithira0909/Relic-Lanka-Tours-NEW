import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin as MapPinIcon, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPin {
    id: string;
    name: string;
    description: string;
    image: string;
    x: number;
    y: number;
}

const FAMOUS_PLACES = [
    {
        name: "Sigiriya Rock Fortress",
        description: "The 5th-century ancient rock fortress and palace built by King Kashyapa, known as the 'Lion Rock'.",
        image: "https://images.unsplash.com/photo-1625413340578-83141df9042c?q=80&w=800&auto=format&fit=crop"
    },
    {
        name: "Temple of the Tooth",
        description: "A sacred Buddhist temple in the city of Kandy, which houses the relic of the tooth of the Buddha.",
        image: "https://images.unsplash.com/photo-1588258524675-c61921385419?q=80&w=800&auto=format&fit=crop"
    },
    {
        name: "Nine Arch Bridge",
        description: "A magnificent stone bridge in Ella, surrounded by lush green tea plantations and misty mountains.",
        image: "https://images.unsplash.com/photo-1588663884877-f269d06dd00e?q=80&w=800&auto=format&fit=crop"
    }
];

export const InteractiveMap: React.FC = () => {
    const [pins, setPins] = useState<MapPin[]>([]);
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/map_pins')
            .then(res => setPins(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="py-20 bg-ceylon-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-ceylon-800 mb-4">Explore Our Destinations</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the hidden gems and iconic landmarks of Sri Lanka.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Column 1: Interactive Map */}
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-2">
                        <div className="relative">
                            <img
                                src="/assets/interactive-map.png"
                                alt="Interactive Map of Sri Lanka"
                                className="w-full h-auto object-cover rounded-xl"
                            />

                            {pins.map(pin => (
                                <button
                                    key={pin.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                    onClick={() => setSelectedPin(pin)}
                                >
                                    <div className="relative">
                                        <div className="w-4 h-4 bg-ceylon-500 rounded-full animate-ping absolute opacity-75"></div>
                                        <div className="w-4 h-4 bg-ceylon-600 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center transition-transform group-hover:scale-125">
                                        </div>
                                        {/* Tooltip on hover */}
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {pin.name}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedPin && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-0 right-0 bottom-0 w-full bg-white/95 backdrop-blur shadow-2xl p-6 border-l border-gray-100 z-20 overflow-y-auto"
                                >
                                    <button
                                        onClick={() => setSelectedPin(null)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="mt-8">
                                        {selectedPin.image && (
                                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 shadow-md">
                                                <img src={selectedPin.image} alt={selectedPin.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-serif font-bold text-ceylon-800 mb-2">{selectedPin.name}</h3>
                                        <div className="w-16 h-1 bg-ceylon-400 mb-4"></div>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {selectedPin.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Column 2: Famous Places */}
                    <div className="flex flex-col space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                             <h3 className="text-2xl font-serif font-bold text-ceylon-800 mb-6 flex items-center">
                                 Most Famous Places in Sri Lanka
                             </h3>
                             <div className="space-y-6">
                                 {FAMOUS_PLACES.map((place, index) => (
                                     <div key={index} className="flex gap-4 items-start group">
                                         <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                             <img src={place.image} alt={place.name} className="w-full h-full object-cover transform transition-transform group-hover:scale-110 duration-500" />
                                         </div>
                                         <div>
                                             <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-ceylon-700 transition-colors">
                                                 {place.name}
                                             </h4>
                                             <p className="text-sm text-gray-600 line-clamp-2">
                                                 {place.description}
                                             </p>
                                             <button className="mt-2 text-ceylon-600 text-sm font-medium flex items-center hover:underline">
                                                 Learn more <ArrowRight className="w-3 h-3 ml-1" />
                                             </button>
                                         </div>
                                     </div>
                                 ))}
                             </div>

                             <div className="mt-8 pt-6 border-t border-gray-100">
                                 <p className="text-sm text-gray-500 italic text-center">
                                     "Sri Lanka is the pearl of the Indian Ocean, offering diverse landscapes from pristine beaches to misty mountains."
                                 </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
