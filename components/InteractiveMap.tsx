import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin as MapPinIcon, X, ArrowRight, Quote, Palmtree, CloudSun, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPin {
    id: string;
    name: string;
    description: string;
    image: string;
    x: number;
    y: number;
}

const QUOTES = [
    {
        text: "Undoubtedly the finest island of its size in the world.",
        author: "Marco Polo"
    },
    {
        text: "The pearl of the Indian Ocean, a land like no other.",
        author: ""
    }
];

const SriLankaQuotes: React.FC = () => (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-center relative overflow-hidden min-h-[500px]">
        {/* Background Icons */}
        <div className="absolute top-10 right-10 text-ceylon-100 opacity-50">
            <Palmtree size={120} />
        </div>
        <div className="absolute bottom-10 left-10 text-ceylon-100 opacity-50">
             <Coffee size={100} />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-ceylon-50 opacity-80">
             <CloudSun size={300} />
        </div>

        <div className="relative z-10 text-center">
             <div className="flex justify-center mb-6">
                 <div className="p-4 bg-ceylon-50 rounded-full">
                    <Quote className="text-ceylon-600 w-8 h-8" />
                 </div>
             </div>

             <h3 className="text-3xl md:text-4xl font-serif font-bold text-ceylon-900 mb-8 italic leading-snug">
                 "{QUOTES[0].text}"
             </h3>
             <p className="text-xl text-gray-500 font-serif">
                 — {QUOTES[0].author}
             </p>

             <div className="mt-12 flex justify-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-ceylon-600"></div>
                 <div className="w-2 h-2 rounded-full bg-gray-300"></div>
             </div>

             <p className="mt-8 text-gray-500 max-w-md mx-auto">
                 Click on the map markers to discover the hidden gems and iconic landmarks of our paradise island.
             </p>
        </div>
    </div>
);

const PinDetail: React.FC<{ pin: MapPin; onClose: () => void }> = ({ pin, onClose }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full relative"
    >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-500 transition-colors z-20"
        >
            <X size={20} />
        </button>

        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            {pin.image && (
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 shadow-md relative group">
                    <img src={pin.image} alt={pin.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            )}

            <h3 className="text-3xl font-serif font-bold text-ceylon-800 mb-3">{pin.name}</h3>

            <div className="flex items-center gap-2 mb-6">
                 <div className="h-1 w-12 bg-ceylon-500 rounded-full"></div>
                 <span className="text-sm font-medium text-ceylon-600 uppercase tracking-wider">Destination</span>
            </div>

            <div className="prose prose-ceylon text-gray-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{pin.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <button className="w-full py-3 bg-ceylon-700 hover:bg-ceylon-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    Plan a Trip Here <ArrowRight size={18} />
                </button>
            </div>
        </div>
    </motion.div>
);

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[600px]">
                    {/* Column 1: Interactive Map */}
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden p-2 flex items-center bg-gray-100">
                        <div className="relative w-full">
                            <img
                                src="/assets/interactive-map.png"
                                alt="Interactive Map of Sri Lanka"
                                className="w-full h-auto object-cover rounded-xl"
                            />

                            {pins.map(pin => (
                                <button
                                    key={pin.id}
                                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300 ${selectedPin?.id === pin.id ? 'scale-125 z-20' : ''}`}
                                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                    onClick={() => setSelectedPin(pin)}
                                >
                                    <div className="relative">
                                        <div className={`w-4 h-4 rounded-full animate-ping absolute opacity-75 ${selectedPin?.id === pin.id ? 'bg-ceylon-600' : 'bg-ceylon-500'}`}></div>
                                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center transition-transform group-hover:scale-125 ${selectedPin?.id === pin.id ? 'bg-ceylon-800 scale-125' : 'bg-ceylon-600'}`}>
                                        </div>
                                        {/* Tooltip on hover */}
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            {pin.name}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Dynamic Content (Quotes or Detail) */}
                    <div className="relative">
                         <AnimatePresence mode="wait">
                            {selectedPin ? (
                                <PinDetail
                                    key="detail"
                                    pin={selectedPin}
                                    onClose={() => setSelectedPin(null)}
                                />
                            ) : (
                                <motion.div
                                    key="quotes"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="h-full"
                                >
                                    <SriLankaQuotes />
                                </motion.div>
                            )}
                         </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};
