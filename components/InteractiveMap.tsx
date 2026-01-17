import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin as MapPinIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPin {
    id: string;
    name: string;
    description: string;
    image: string;
    x: number;
    y: number;
}

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
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-ceylon-800 mb-4">Explore Our Destinations</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the hidden gems and iconic landmarks of Sri Lanka. Click on the map markers to explore.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-2">
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
                                className="absolute top-0 right-0 bottom-0 w-full md:w-80 bg-white/95 backdrop-blur shadow-2xl p-6 border-l border-gray-100 z-20 overflow-y-auto"
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
            </div>
        </section>
    );
};
