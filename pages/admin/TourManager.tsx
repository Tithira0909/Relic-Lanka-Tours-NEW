import React from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const TourManager: React.FC = () => {
  const { tours, deleteTour } = useData();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800">Tours</h1>
        <Link
          to="/admin/tours/new"
          className="bg-ceylon-700 text-white px-6 py-2.5 rounded-lg hover:bg-ceylon-800 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add New Tour
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Location</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{tour.title}</td>
                  <td className="px-6 py-4 text-gray-600">{tour.location}</td>
                  <td className="px-6 py-4 text-gray-600">${tour.price}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-ceylon-50 text-ceylon-800 rounded-full text-xs font-medium">
                      {tour.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/tours/edit/${tour.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this tour?')) {
                            deleteTour(tour.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tours.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tours found. Create your first tour to get started.
          </div>
        )}
      </div>
    </div>
  );
};
