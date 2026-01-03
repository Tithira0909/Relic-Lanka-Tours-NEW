import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-paper min-h-screen">
      <Section>
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">Get in Touch</h1>
           <p className="text-gray-500">We'd love to craft your perfect itinerary.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
           {/* Form */}
           <div>
              <h3 className="text-2xl font-serif font-bold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none transition-all" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ceylon-500 outline-none transition-all"></textarea>
                </div>

                <Button className="w-full md:w-auto">
                   <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
           </div>

           {/* Info */}
           <div className="lg:pl-12 lg:border-l border-gray-100">
              <h3 className="text-2xl font-serif font-bold mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-ceylon-50 flex items-center justify-center text-ceylon-700 flex-shrink-0 mr-4">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 mb-1">Head Office</h4>
                     <p className="text-gray-500 leading-relaxed">
                       123 Galle Road, Colombo 03<br/>
                       Sri Lanka
                     </p>
                   </div>
                </div>

                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-ceylon-50 flex items-center justify-center text-ceylon-700 flex-shrink-0 mr-4">
                      <Phone className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                     <p className="text-gray-500">
                       +94 11 234 5678<br/>
                       <span className="text-xs text-gray-400">Mon - Fri, 9am - 6pm</span>
                     </p>
                   </div>
                </div>

                <div className="flex items-start">
                   <div className="w-12 h-12 rounded-full bg-ceylon-50 flex items-center justify-center text-ceylon-700 flex-shrink-0 mr-4">
                      <Mail className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                     <p className="text-gray-500">
                       hello@ceylon.travel<br/>
                       bookings@ceylon.travel
                     </p>
                   </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-10 w-full h-48 bg-gray-200 rounded-2xl overflow-hidden relative">
                 <img src="https://picsum.photos/600/300?blur=2" className="w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold">View on Google Maps</span>
                 </div>
              </div>
           </div>
        </div>
      </Section>
    </div>
  );
};
