import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SocialBubbles: React.FC = () => {
  const { socialMedia } = useData();
  const whatsappNumber = socialMedia.whatsapp;
  const wechatId = socialMedia.wechat_id;
  const wechatQr = socialMedia.wechat_qr;
  const [isWeChatOpen, setIsWeChatOpen] = useState(false);

  const hasWeChat = wechatId || wechatQr;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        {/* WeChat Bubble */}
        {hasWeChat && (
            <>
                <AnimatePresence>
                    {isWeChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="absolute bottom-20 right-0 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-72"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-800">WeChat</h3>
                                <button onClick={() => setIsWeChatOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            {wechatQr && (
                                <div className="mb-4 bg-gray-50 p-2 rounded-xl">
                                    <img src={wechatQr} alt="WeChat QR" className="w-full h-auto rounded-lg" />
                                </div>
                            )}

                            {wechatId && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-1">WeChat ID</p>
                                    <p className="font-mono font-bold text-gray-800 bg-gray-100 py-2 rounded-lg select-all cursor-text">{wechatId}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsWeChatOpen(!isWeChatOpen)}
                    className="bg-white text-white p-2 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative border border-gray-100 overflow-hidden w-16 h-16"
                    aria-label="Chat on WeChat"
                >
                    <img src="/assets/wechat-icon.png" alt="WeChat" className="w-full h-full object-cover" />
                </button>
            </>
        )}

        {/* WhatsApp Bubble */}
        {whatsappNumber && (
            <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={32} />
            </a>
        )}
    </div>
  );
};
