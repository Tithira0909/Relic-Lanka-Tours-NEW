import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export const Settings: React.FC = () => {
  const { socialMedia, updateSocialMedia } = useData();
  const [formData, setFormData] = useState(socialMedia);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialMedia(formData);
    setMessage('Settings updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Settings</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
              placeholder="94771234567"
            />
            <p className="text-xs text-gray-500 mt-1">Enter number with country code, no symbols (e.g., 94771234567)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors"
            >
              Save Changes
            </button>
            {message && <span className="ml-4 text-green-600">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};
