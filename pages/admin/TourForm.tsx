import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Tour, TourDestination, TourActivity } from '../../types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '../../components/common/ImageUpload';

export const TourForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tours, addTour, updateTour } = useData();

  const isEdit = Boolean(id);

  const initialTour: Tour = {
    id: '',
    title: '',
    location: '',
    price: 0,
    days: 1,
    nights: 0,
    category: 'Nature',
    rating: 5,
    reviews: 0,
    image: '',
    description: '',
    highlights: [],
    itinerary: [],
    inclusions: [],
    includedActivities: [],
    destinations: [],
    activities: [],
  };

  const [formData, setFormData] = useState<Tour>(initialTour);

  useEffect(() => {
    if (isEdit && id) {
      const existingTour = tours.find(t => t.id === id);
      if (existingTour) {
        setFormData({
            ...existingTour,
            inclusions: existingTour.inclusions || [],
            includedActivities: existingTour.includedActivities || [],
            destinations: existingTour.destinations || [],
            activities: existingTour.activities || []
        });
      }
    }
  }, [id, isEdit, tours]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'days' || name === 'nights' ? Number(value) : value }));
  };

  const handleArrayChange = (field: 'highlights' | 'inclusions' | 'includedActivities', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'includedActivities') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'highlights' | 'inclusions' | 'includedActivities', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  // Itinerary Handlers
  const handleItineraryChange = (index: number, field: keyof typeof formData.itinerary[0], value: string | number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }))
    }));
  };

  // Destination Handlers
  const handleDestinationChange = (index: number, field: keyof TourDestination, value: string) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = { ...newDestinations[index], [field]: value };
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { name: '', description: '', image: '' }]
    }));
  };

  const removeDestination = (index: number) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }));
  };

    // Activity Handlers
  const handleActivityChange = (index: number, field: keyof TourActivity, value: string) => {
    const newActivities = [...formData.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setFormData(prev => ({ ...prev, activities: newActivities }));
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { name: '', image: '' }]
    }));
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateTour(formData);
    } else {
      addTour({ ...formData, id: Date.now().toString() });
    }
    navigate('/admin/tours');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/admin/tours')} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-serif font-bold text-gray-800">{isEdit ? 'Edit Tour' : 'Create New Tour'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input required name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none">
                    <option value="Nature">Nature</option>
                    <option value="Culture">Culture</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Adventure">Adventure</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <input required type="number" name="days" value={formData.days} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                <input required type="number" name="nights" value={formData.nights} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
             <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                <ImageUpload value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} />
            </div>
             <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
            </div>
          </div>
        </section>

        {/* Arrays: Highlights, Inclusions, Activities */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
             <h2 className="text-xl font-bold border-b pb-2 mb-4">Details</h2>

             {/* Highlights */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                {formData.highlights.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input value={item} onChange={(e) => handleArrayChange('highlights', idx, e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
                        <button type="button" onClick={() => removeArrayItem('highlights', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('highlights')} className="text-ceylon-700 text-sm font-medium hover:underline flex items-center mt-2"><Plus size={16} className="mr-1"/> Add Highlight</button>
             </div>

             {/* Inclusions */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                {formData.inclusions.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input value={item} onChange={(e) => handleArrayChange('inclusions', idx, e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
                        <button type="button" onClick={() => removeArrayItem('inclusions', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('inclusions')} className="text-ceylon-700 text-sm font-medium hover:underline flex items-center mt-2"><Plus size={16} className="mr-1"/> Add Inclusion</button>
             </div>

             {/* Included Activities */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Included Activities (List)</label>
                {formData.includedActivities.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input value={item} onChange={(e) => handleArrayChange('includedActivities', idx, e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" />
                        <button type="button" onClick={() => removeArrayItem('includedActivities', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('includedActivities')} className="text-ceylon-700 text-sm font-medium hover:underline flex items-center mt-2"><Plus size={16} className="mr-1"/> Add Included Activity</button>
             </div>
        </section>

        {/* Complex Arrays: Destinations, Activities, Itinerary */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Detailed Content</h2>

            {/* Destinations */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Destinations (with Images)</h3>
                {formData.destinations.map((dest, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500">Destination {idx + 1}</span>
                            <button type="button" onClick={() => removeDestination(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Name" value={dest.name} onChange={(e) => handleDestinationChange(idx, 'name', e.target.value)} className="px-4 py-2 border rounded-lg" />
                            <ImageUpload placeholder="Destination Image" value={dest.image} onChange={(url) => handleDestinationChange(idx, 'image', url)} />
                            <input placeholder="Description" value={dest.description} onChange={(e) => handleDestinationChange(idx, 'description', e.target.value)} className="col-span-2 px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={addDestination} className="px-4 py-2 border border-dashed border-ceylon-500 text-ceylon-700 rounded-lg w-full hover:bg-ceylon-50">+ Add Destination</button>
            </div>

            {/* Activities */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Activities (with Images)</h3>
                {formData.activities.map((act, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                         <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500">Activity {idx + 1}</span>
                            <button type="button" onClick={() => removeActivity(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Name" value={act.name} onChange={(e) => handleActivityChange(idx, 'name', e.target.value)} className="px-4 py-2 border rounded-lg" />
                            <ImageUpload placeholder="Activity Image" value={act.image} onChange={(url) => handleActivityChange(idx, 'image', url)} />
                        </div>
                    </div>
                ))}
                 <button type="button" onClick={addActivity} className="px-4 py-2 border border-dashed border-ceylon-500 text-ceylon-700 rounded-lg w-full hover:bg-ceylon-50">+ Add Activity</button>
            </div>

             {/* Itinerary */}
             <div>
                <h3 className="font-semibold text-gray-800 mb-2">Itinerary</h3>
                {formData.itinerary.map((day, idx) => (
                     <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                         <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-500">Day {day.day}</span>
                            <button type="button" onClick={() => removeItineraryDay(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        </div>
                        <div className="space-y-2">
                            <input placeholder="Title (e.g., Arrival in Colombo)" value={day.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            <textarea placeholder="Description" rows={2} value={day.description} onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItineraryDay} className="px-4 py-2 border border-dashed border-ceylon-500 text-ceylon-700 rounded-lg w-full hover:bg-ceylon-50">+ Add Day</button>
             </div>

        </section>

        <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/tours')} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors font-medium">
                {isEdit ? 'Update Tour' : 'Create Tour'}
            </button>
        </div>

      </form>
    </div>
  );
};
