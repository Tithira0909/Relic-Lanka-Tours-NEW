import React from 'react';
import { useData } from '../../context/DataContext';

export const Dashboard: React.FC = () => {
  const { tours, gallery } = useData();

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Tours</h3>
          <p className="text-4xl font-bold text-ceylon-800">{tours.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Gallery Images</h3>
          <p className="text-4xl font-bold text-ceylon-800">{gallery.length}</p>
        </div>
        {/* Add more stats if needed */}
      </div>
    </div>
  );
};
