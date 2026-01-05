import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const WhatsAppBubble: React.FC = () => {
  const { socialMedia } = useData();
  const phoneNumber = socialMedia.whatsapp.replace(/\D/g, ''); // Remove non-numeric characters
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
};
