import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { TourCard } from '../components/features/TourCard';
import { Button } from '../components/ui/Button';
import { TOURS } from '../data/mockData';
import { Tour } from '../types';

export const Tours: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'Culture', 'Nature', 'Luxury', 'Adventure'];

  const filteredTours = TOURS.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) || tour.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory && selectedCategory !== 'All' ? tour.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-paper pb-16 pt-10 px-4">
        <div className="max-w-7xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center max-w-3xl mx-auto mb-10"
           >
             <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4">Find Your Journey</h1>
             <p className="text-gray-500 text-lg">Curated itineraries designed to immerse you in the authentic beauty of Sri Lanka.</p>
           </motion.div>

           {/* Search & Filter Bar */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
           >
              <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-ceylon-500 focus:outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                        ? 'bg-ceylon-700 text-white shadow-md' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
           </motion.div>
        </div>
      </div>

      {/* Results */}
      <Section>
        <div className="flex justify-between items-center mb-8">
           <span className="text-gray-500">{filteredTours.length} tours found</span>
           <div className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-ceylon-700">
             Sort by: Featured <ChevronDown className="w-4 h-4" />
           </div>
        </div>

        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
};
