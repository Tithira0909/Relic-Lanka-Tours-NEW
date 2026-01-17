import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className, placeholder = "Image URL" }) => {
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.imageUrl); // This should be the relative URL returned by backend
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
            placeholder={placeholder}
        />
        <div className="relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
            />
            <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center min-w-[100px]"
            >
                {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Upload className="w-5 h-5 mr-2" /> Upload</>}
            </button>
        </div>
      </div>
      {value && (
          <div className="relative w-full h-32 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
              >
                  <X className="w-4 h-4" />
              </button>
          </div>
      )}
    </div>
  );
};
