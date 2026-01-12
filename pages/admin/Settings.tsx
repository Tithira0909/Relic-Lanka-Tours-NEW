import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ImageUpload } from '../../components/common/ImageUpload';
import { Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    socialMedia, heroImages, whyChooseUsImages, adventureBanner,
    updateSocialMedia, updateHeroImages, updateWhyChooseUsImages, updateAdventureBanner
  } = useData();
  const [formData, setFormData] = useState(socialMedia);
  const [localHeroImages, setLocalHeroImages] = useState<string[]>([]);
  const [localWhyChooseUsImages, setLocalWhyChooseUsImages] = useState<string[]>([]);
  const [localAdventureBanner, setLocalAdventureBanner] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
      setLocalHeroImages(heroImages);
      setLocalWhyChooseUsImages(whyChooseUsImages);
      setLocalAdventureBanner(adventureBanner || '');
  }, [heroImages, whyChooseUsImages, adventureBanner]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialMedia(formData);
    updateHeroImages(localHeroImages);
    updateWhyChooseUsImages(localWhyChooseUsImages);
    updateAdventureBanner(localAdventureBanner);
    setMessage('Settings updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const addHeroImage = (url: string) => {
      if (url && localHeroImages.length < 5) {
          setLocalHeroImages([...localHeroImages, url]);
      }
  };

  const removeHeroImage = (index: number) => {
      setLocalHeroImages(localHeroImages.filter((_, i) => i !== index));
  };

  const addWhyChooseUsImage = (url: string) => {
      if (url && localWhyChooseUsImages.length < 5) {
          setLocalWhyChooseUsImages([...localWhyChooseUsImages, url]);
      }
  };

  const removeWhyChooseUsImage = (index: number) => {
      setLocalWhyChooseUsImages(localWhyChooseUsImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Social Media */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
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

      <div className="space-y-8">
        {/* Hero Images */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Hero Images</h2>
            <p className="text-sm text-gray-500 mb-4">Upload up to 5 images for the homepage slider. They will cycle randomly.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {localHeroImages.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden h-32 border border-gray-200">
                        <img src={url} alt={`Hero ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeHeroImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {localHeroImages.length < 5 && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Image</label>
                    <ImageUpload value="" onChange={addHeroImage} placeholder="Upload hero image..." />
                </div>
            )}
        </div>

        {/* Adventure Banner Image */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Adventure Banner Image</h2>
            <p className="text-sm text-gray-500 mb-4">Upload a custom image for the "Ready for your adventure?" section.</p>

            {localAdventureBanner && (
                 <div className="relative group rounded-lg overflow-hidden h-48 border border-gray-200 mb-6">
                    <img src={localAdventureBanner} alt="Adventure Banner" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => setLocalAdventureBanner('')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {localAdventureBanner ? "Change Image" : "Upload Image"}
                </label>
                <ImageUpload value="" onChange={setLocalAdventureBanner} placeholder="Upload banner image..." />
            </div>
        </div>

        {/* Why Choose Us Images */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">"Why Relic Lanka" Images</h2>
            <p className="text-sm text-gray-500 mb-4">Upload up to 5 images for the 'Experience' section. They will cycle randomly.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {localWhyChooseUsImages.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden h-32 border border-gray-200">
                        <img src={url} alt={`Why Us ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeWhyChooseUsImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {localWhyChooseUsImages.length < 5 && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Image</label>
                    <ImageUpload value="" onChange={addWhyChooseUsImage} placeholder="Upload image..." />
                </div>
            )}
        </div>
      </div>

      </div>
    </div>
  );
};
