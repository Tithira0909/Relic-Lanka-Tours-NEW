import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface Review {
    id: string;
    name: string;
    role: string;
    rating: number;
    comment: string;
    image: string;
}

export const TravelerStories: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/reviews');
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('role', role);
        formData.append('rating', rating.toString());
        formData.append('comment', comment);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('/api/reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitSuccess(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitSuccess(false);
                resetForm();
            }, 2000);
        } catch (err) {
            console.error("Failed to submit review", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setName('');
        setRole('');
        setRating(5);
        setComment('');
        setImage(null);
    };

    return (
        <section className="bg-paper rounded-[3rem] my-10 py-16 px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl font-serif font-medium text-primary mb-4">Traveler Stories</h2>
                <p className="text-gray-500 mb-8">Hear from those who have experienced the magic of Sri Lanka with us.</p>

                <Button onClick={() => setIsModalOpen(true)}>
                    Share Your Story
                </Button>
             </div>

             {reviews.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((t, idx) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col"
                      >
                         <div className="flex text-yellow-400 mb-4">
                            {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                         </div>
                         <p className="text-gray-600 mb-6 italic leading-relaxed flex-grow">"{t.comment}"</p>
                         <div className="flex items-center mt-auto">
                            {t.image ? (
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-ceylon-100 flex items-center justify-center mr-4 text-ceylon-700 font-bold">
                                    {t.name.charAt(0)}
                                </div>
                            )}
                            <div>
                               <h4 className="font-bold text-sm text-primary">{t.name}</h4>
                               <span className="text-xs text-gray-400">{t.role}</span>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </div>
             ) : (
                 <p className="text-center text-gray-400 italic">No stories yet. Be the first to share yours!</p>
             )}

             {/* Modal */}
             <AnimatePresence>
                 {isModalOpen && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                         <motion.div
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             onClick={() => setIsModalOpen(false)}
                             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                         />
                         <motion.div
                             initial={{ opacity: 0, y: 50 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 50 }}
                             className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                         >
                             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                 <h3 className="text-xl font-serif font-bold text-ceylon-800">Share Your Experience</h3>
                                 <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                     <X size={24} />
                                 </button>
                             </div>

                             {submitSuccess ? (
                                 <div className="p-12 text-center">
                                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                         <Star className="fill-current w-8 h-8" />
                                     </div>
                                     <h4 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h4>
                                     <p className="text-gray-600">Your story has been submitted and is pending approval.</p>
                                 </div>
                             ) : (
                                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                     <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                         <input
                                             type="text"
                                             required
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ceylon-500 focus:outline-none"
                                             value={name}
                                             onChange={e => setName(e.target.value)}
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role (Optional)</label>
                                         <input
                                             type="text"
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ceylon-500 focus:outline-none"
                                             placeholder="e.g. Honeymooner, Backpacker"
                                             value={role}
                                             onChange={e => setRole(e.target.value)}
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                         <div className="flex gap-2">
                                             {[1, 2, 3, 4, 5].map((star) => (
                                                 <button
                                                     key={star}
                                                     type="button"
                                                     onClick={() => setRating(star)}
                                                     className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                 >
                                                     ★
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                                         <textarea
                                             required
                                             rows={4}
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ceylon-500 focus:outline-none"
                                             value={comment}
                                             onChange={e => setComment(e.target.value)}
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
                                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-ceylon-500 transition-colors relative">
                                             <input
                                                 type="file"
                                                 accept="image/*"
                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                 onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
                                             />
                                             {image ? (
                                                 <span className="text-ceylon-600 font-medium">{image.name}</span>
                                             ) : (
                                                 <div className="flex flex-col items-center text-gray-500">
                                                     <Upload size={24} className="mb-2" />
                                                     <span className="text-sm">Click to upload image</span>
                                                 </div>
                                             )}
                                         </div>
                                     </div>

                                     <div className="pt-4">
                                         <Button type="submit" className="w-full" disabled={isSubmitting}>
                                             {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Story'}
                                         </Button>
                                     </div>
                                 </form>
                             )}
                         </motion.div>
                     </div>
                 )}
             </AnimatePresence>
        </section>
    );
};
