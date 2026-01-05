import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Tour, SocialMedia, GalleryImage } from '../types';
import { TOURS } from '../data/mockData';

// Initial Mock Data for other parts
const INITIAL_SOCIAL_MEDIA: SocialMedia = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: '94771234567',
};

const INITIAL_GALLERY: GalleryImage[] = [
  { id: '1', url: 'https://picsum.photos/800/600?random=20', caption: 'Beautiful Sunset' },
  { id: '2', url: 'https://picsum.photos/800/600?random=21', caption: 'Mountain View' },
  { id: '3', url: 'https://picsum.photos/800/600?random=22', caption: 'Safari Jeep' },
];

interface DataContextType extends AppData {
  addTour: (tour: Tour) => void;
  updateTour: (tour: Tour) => void;
  deleteTour: (id: string) => void;
  updateSocialMedia: (social: SocialMedia) => void;
  addToGallery: (image: GalleryImage) => void;
  removeFromGallery: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const savedData = localStorage.getItem('ceylon-travel-data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    return {
      tours: TOURS, // Note: TOURS needs to be updated in mockData.ts to match new type
      socialMedia: INITIAL_SOCIAL_MEDIA,
      gallery: INITIAL_GALLERY,
    };
  });

  useEffect(() => {
    localStorage.setItem('ceylon-travel-data', JSON.stringify(data));
  }, [data]);

  const addTour = (tour: Tour) => {
    setData(prev => ({ ...prev, tours: [...prev.tours, tour] }));
  };

  const updateTour = (updatedTour: Tour) => {
    setData(prev => ({
      ...prev,
      tours: prev.tours.map(t => (t.id === updatedTour.id ? updatedTour : t)),
    }));
  };

  const deleteTour = (id: string) => {
    setData(prev => ({
      ...prev,
      tours: prev.tours.filter(t => t.id !== id),
    }));
  };

  const updateSocialMedia = (social: SocialMedia) => {
    setData(prev => ({ ...prev, socialMedia: social }));
  };

  const addToGallery = (image: GalleryImage) => {
    setData(prev => ({ ...prev, gallery: [...prev.gallery, image] }));
  };

  const removeFromGallery = (id: string) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(img => img.id !== id),
    }));
  };

  return (
    <DataContext.Provider
      value={{
        ...data,
        addTour,
        updateTour,
        deleteTour,
        updateSocialMedia,
        addToGallery,
        removeFromGallery,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
