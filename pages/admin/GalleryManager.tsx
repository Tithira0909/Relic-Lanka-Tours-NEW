import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Trash2, Plus } from 'lucide-react';
import { ImageUpload } from '../../components/common/ImageUpload';

export const GalleryManager: React.FC = () => {
  const { gallery, addToGallery, removeFromGallery } = useData();
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl) {
      addToGallery({
        id: Date.now().toString(),
        url: newUrl,
        caption: newCaption,
      });
      setNewUrl('');
      setNewCaption('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Gallery Manager</h1>

      {/* Add New Image */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold mb-4">Add New Image</h2>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUpload value={newUrl} onChange={setNewUrl} />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
              placeholder="Description..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" /> Add
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gallery.map((img) => (
          <div key={img.id} className="relative group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="aspect-w-4 aspect-h-3">
              <img src={img.url} alt={img.caption} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="text-sm text-gray-600 truncate">{img.caption || 'No caption'}</p>
              <button
                onClick={() => removeFromGallery(img.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
