import React from 'react';
import { motion } from 'framer-motion';
import { REGIONS } from '../../data/mockData';
import { MapPin } from 'lucide-react';

export const SriLankaMap: React.FC = () => {
  return (
    <div className="relative w-full aspect-[4/5] md:aspect-square bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden p-8 flex items-center justify-center bg-ceylon-50/20">
      {/* Abstract Map Representation */}
      <div className="relative w-[60%] h-[80%]">
        
        {/* Simple SVG Shape for Sri Lanka Outline - stylized */}
        <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-xl text-white fill-current">
            <path d="M45,5 C55,10 65,25 65,35 C70,40 85,50 80,70 C75,90 70,110 60,130 C50,145 40,140 30,120 C20,100 15,80 20,60 C25,40 35,0 45,5 Z" fill="white" />
        </svg>

        {/* Region Dots */}
        {REGIONS.map((region) => (
          <motion.button
            key={region.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + parseInt(region.id) * 0.1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
          >
            <div className="relative flex items-center justify-center">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ceylon-400 opacity-75"></span>
               <div className="relative inline-flex rounded-full h-4 w-4 bg-ceylon-600 border-2 border-white shadow-sm z-10 group-hover:scale-125 transition-transform" />
               
               {/* Tooltip */}
               <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl transform translate-y-1 group-hover:translate-y-0 duration-200">
                  <div className="font-semibold">{region.name}</div>
                  <div className="text-[10px] text-gray-300">{region.description}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary" />
               </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur px-4 py-2 rounded-xl text-xs font-medium text-gray-500 border border-gray-100">
        Interactive Map
      </div>
    </div>
  );
};
