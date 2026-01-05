import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Star } from 'lucide-react';
import { Tour } from '../../types';

interface TourCardProps {
  tour: Tour;
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-ceylon-800">
          {tour.category}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-gray-400 text-sm mb-3 space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tour.days} Days / {tour.nights} Nights
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
            {tour.rating}
          </div>
        </div>
        
        <h3 className="text-xl font-serif font-semibold text-primary mb-2 group-hover:text-ceylon-700 transition-colors">
          <Link to={`/tours/${tour.id}`}>
            {tour.title}
          </Link>
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 text-ceylon-600" />
          {tour.location}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">From</span>
            <span className="text-lg font-bold text-primary">${tour.price}</span>
          </div>
          <Link to={`/tours/${tour.id}`}>
            <span className="text-sm font-medium text-ceylon-700 hover:text-ceylon-900 border-b border-ceylon-200 hover:border-ceylon-700 transition-colors pb-0.5">
              View Details
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
