import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Trash2, Clock, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Review {
    id: string;
    name: string;
    role: string;
    rating: number;
    comment: string;
    image: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
}

export const ReviewManager: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/admin/reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await axios.put(`/api/admin/reviews/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await axios.delete(`/api/admin/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const pendingReviews = reviews.filter(r => r.status === 'pending');
    const processedReviews = reviews.filter(r => r.status !== 'pending');

    return (
        <div className="p-6">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Review Management</h2>

            {/* Pending Reviews */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-ceylon-700 mb-4 flex items-center gap-2">
                    <Clock size={20} /> Pending Approvals ({pendingReviews.length})
                </h3>

                {pendingReviews.length === 0 ? (
                    <p className="text-gray-500 italic">No pending reviews.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingReviews.map(review => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                onApprove={() => updateStatus(review.id, 'approved')}
                                onReject={() => updateStatus(review.id, 'rejected')}
                                onDelete={() => deleteReview(review.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* History */}
            <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Review History</h3>
                 <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {processedReviews.map(review => (
                                <tr key={review.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 mr-3">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{review.name}</div>
                                                <div className="text-xs text-gray-500">{review.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex text-yellow-400">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(review.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {review.status === 'rejected' && (
                                            <button onClick={() => updateStatus(review.id, 'approved')} className="text-ceylon-600 hover:text-ceylon-900 mr-4">Approve</button>
                                        )}
                                        {review.status === 'approved' && (
                                            <button onClick={() => updateStatus(review.id, 'rejected')} className="text-red-600 hover:text-red-900 mr-4">Reject</button>
                                        )}
                                        <button onClick={() => deleteReview(review.id)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

const ReviewCard: React.FC<{
    review: Review,
    onApprove: () => void,
    onReject: () => void,
    onDelete: () => void
}> = ({ review, onApprove, onReject, onDelete }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
                 {review.image ? (
                     <img src={review.image} className="w-10 h-10 rounded-full object-cover mr-3" />
                 ) : (
                     <div className="w-10 h-10 rounded-full bg-ceylon-50 flex items-center justify-center text-ceylon-700 font-bold mr-3">
                         {review.name.charAt(0)}
                     </div>
                 )}
                 <div>
                     <h4 className="font-bold text-gray-800">{review.name}</h4>
                     <p className="text-xs text-gray-500">{review.role}</p>
                 </div>
            </div>
            <div className="flex text-yellow-400">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded-lg italic">
            "{review.comment}"
        </p>

        <div className="flex gap-2">
            <Button size="sm" onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check size={16} className="mr-1" /> Approve
            </Button>
            <Button size="sm" onClick={onReject} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <X size={16} className="mr-1" /> Reject
            </Button>
             <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
            </button>
        </div>
    </div>
);
