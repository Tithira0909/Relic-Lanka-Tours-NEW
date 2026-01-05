import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';

export const About: React.FC = () => {
  return (
    <div className="pt-20">
      <Section className="text-center max-w-4xl mx-auto mb-10">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8">Our Story</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Founded on the belief that travel should be transformative. We don't just show you Sri Lanka; we invite you to become part of its living history.
        </p>
      </Section>

      <div className="w-full h-[500px] overflow-hidden mb-20 relative">
        <img src="https://picsum.photos/1920/600?random=88" alt="Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">Sustainable Luxury</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We are committed to preserving the natural beauty of our island. Our tours prioritize eco-friendly lodges, support local conservation efforts, and ensure fair wages for all our community partners.
            </p>
            <p className="text-gray-600 leading-relaxed">
               When you travel with Relic Lanka Tours, you leave a positive footprint.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="https://picsum.photos/400/500?random=11" className="rounded-2xl shadow-lg mt-10" />
             <img src="https://picsum.photos/400/500?random=12" className="rounded-2xl shadow-lg" />
          </div>
        </div>
      </Section>
    </div>
  );
};
