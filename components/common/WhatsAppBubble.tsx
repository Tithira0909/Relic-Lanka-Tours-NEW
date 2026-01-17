import React from 'react';
import { useData } from '../../context/DataContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppBubble: React.FC = () => {
  const { socialMedia } = useData();
  const whatsappNumber = socialMedia.whatsapp;

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
};
