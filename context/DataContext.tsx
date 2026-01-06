import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Tour, SocialMedia, GalleryImage } from '../types';
import { useAuth } from './AuthContext';

// Initial Empty Data - Will be fetched
const INITIAL_SOCIAL_MEDIA: SocialMedia = {
  facebook: '',
  instagram: '',
  whatsapp: '',
};

interface DataContextType extends AppData {
  addTour: (tour: Tour) => Promise<void>;
  updateTour: (tour: Tour) => Promise<void>;
  deleteTour: (id: string) => Promise<void>;
  updateSocialMedia: (social: SocialMedia) => Promise<void>;
  addToGallery: (image: GalleryImage) => Promise<void>;
  removeFromGallery: (id: string) => Promise<void>;
  updateHeroImages: (images: string[]) => Promise<void>;
  updateWhyChooseUsImages: (images: string[]) => Promise<void>;
  updateAdventureBanner: (url: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [data, setData] = useState<AppData>({
    tours: [],
    socialMedia: INITIAL_SOCIAL_MEDIA,
    gallery: [],
    heroImages: [],
    whyChooseUsImages: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/tours');
      const tours = await res.json();
      setData(prev => ({ ...prev, tours }));
    } catch (err) {
      console.error('Failed to fetch tours', err);
    }
  };

  const fetchGallery = async () => {
      try {
          const res = await fetch('/api/gallery');
          const gallery = await res.json();
          setData(prev => ({ ...prev, gallery }));
      } catch (err) {
          console.error(err);
      }
  };

  const fetchSettings = async () => {
      try {
          const res = await fetch('/api/settings');
          const settings = await res.json();
          setData(prev => ({
              ...prev,
              socialMedia: {
                  facebook: settings.facebook || '',
                  instagram: settings.instagram || '',
                  whatsapp: settings.whatsapp || '',
                  twitter: settings.twitter,
                  youtube: settings.youtube
              },
              heroImages: settings.hero_images ? JSON.parse(settings.hero_images) : [],
              whyChooseUsImages: settings.why_choose_us_images ? JSON.parse(settings.why_choose_us_images) : [],
              adventureBanner: settings.adventure_banner || ''
          }));
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    Promise.all([fetchTours(), fetchGallery(), fetchSettings()]).finally(() => setLoading(false));
  }, []);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const addTour = async (tour: Tour) => {
    try {
        const res = await fetch('/api/tours', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(tour)
        });
        if (res.ok) {
            fetchTours();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const updateHeroImages = async (images: string[]) => {
      try {
          const res = await fetch('/api/settings', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({ hero_images: JSON.stringify(images) })
          });
          if (res.ok) {
              fetchSettings();
          }
      } catch (e) {
          console.error(e);
      }
  };

  const updateWhyChooseUsImages = async (images: string[]) => {
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ why_choose_us_images: JSON.stringify(images) })
        });
        if (res.ok) {
            fetchSettings();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const updateAdventureBanner = async (url: string) => {
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ adventure_banner: url })
        });
        if (res.ok) {
            fetchSettings();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const updateTour = async (updatedTour: Tour) => {
     try {
        const res = await fetch(`/api/tours/${updatedTour.id}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(updatedTour)
        });
        if (res.ok) {
            fetchTours();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const deleteTour = async (id: string) => {
     try {
        const res = await fetch(`/api/tours/${id}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        if (res.ok) {
            fetchTours();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const updateSocialMedia = async (social: SocialMedia) => {
     try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(social)
        });
        if (res.ok) {
            fetchSettings();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const addToGallery = async (image: GalleryImage) => {
     try {
        const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(image)
        });
        if (res.ok) {
            fetchGallery();
        }
    } catch (e) {
        console.error(e);
    }
  };

  const removeFromGallery = async (id: string) => {
     try {
        const res = await fetch(`/api/gallery/${id}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        if (res.ok) {
            fetchGallery();
        }
    } catch (e) {
        console.error(e);
    }
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
        updateHeroImages,
        updateWhyChooseUsImages,
        updateAdventureBanner,
        loading
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
