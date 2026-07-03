import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/config';
import { ImageUpload } from '../../components/common/ImageUpload';
import { Trash2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const {
    socialMedia, heroImages, whyChooseUsImages, adventureBanner,
    aboutBanner, aboutImage1, aboutImage2,
    contactAddress, contactPhone, contactEmail1, contactEmail2, contactMapIframe,
    updateSocialMedia, updateHeroImages, updateWhyChooseUsImages, updateAdventureBanner,
    updateSettingsData
  } = useData();
  const { token } = useAuth();

  const [formData, setFormData] = useState(socialMedia);
  const [localHeroImages, setLocalHeroImages] = useState<string[]>([]);
  const [localWhyChooseUsImages, setLocalWhyChooseUsImages] = useState<string[]>([]);
  const [localAdventureBanner, setLocalAdventureBanner] = useState<string>('');
  
  const [aboutSettings, setAboutSettings] = useState({
      about_banner: aboutBanner || '',
      about_image_1: aboutImage1 || '',
      about_image_2: aboutImage2 || ''
  });

  const [contactSettings, setContactSettings] = useState({
      contact_address: contactAddress || '',
      contact_phone: contactPhone || '',
      contact_email_1: contactEmail1 || '',
      contact_email_2: contactEmail2 || '',
      contact_map_iframe: contactMapIframe || ''
  });

  const [qrCode, setQrCode] = useState('');
  const [twoFaSecret, setTwoFaSecret] = useState('');
  const [twoFaToken, setTwoFaToken] = useState('');
  const [twoFaMessage, setTwoFaMessage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
      setLocalHeroImages(heroImages);
      setLocalWhyChooseUsImages(whyChooseUsImages);
      setLocalAdventureBanner(adventureBanner || '');
      setAboutSettings({
          about_banner: aboutBanner || '',
          about_image_1: aboutImage1 || '',
          about_image_2: aboutImage2 || ''
      });
      setContactSettings({
          contact_address: contactAddress || '',
          contact_phone: contactPhone || '',
          contact_email_1: contactEmail1 || '',
          contact_email_2: contactEmail2 || '',
          contact_map_iframe: contactMapIframe || ''
      });
  }, [heroImages, whyChooseUsImages, adventureBanner, aboutBanner, aboutImage1, aboutImage2, contactAddress, contactPhone, contactEmail1, contactEmail2, contactMapIframe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (name: string, url: string) => {
      setFormData(prev => ({ ...prev, [name]: url }));
  };

  const handleAboutChange = (name: string, url: string) => {
      setAboutSettings(prev => ({ ...prev, [name]: url }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setContactSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveAboutSettings = () => {
      updateSettingsData(aboutSettings);
      setMessage('About Us Settings saved!');
      setTimeout(() => setMessage(''), 3000);
  };

  const saveContactSettings = () => {
      updateSettingsData(contactSettings);
      setMessage('Contact Settings saved!');
      setTimeout(() => setMessage(''), 3000);
  };

  const setup2FA = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/admin/2fa/setup`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.qrCode) {
              setQrCode(data.qrCode);
              setTwoFaSecret(data.secret);
              setTwoFaMessage('');
          }
      } catch(e) { console.error(e); }
  };

  const verify2FA = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/admin/2fa/verify`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: twoFaToken, secret: twoFaSecret })
          });
          if (res.ok) {
              setTwoFaMessage('2FA Enabled Successfully!');
              setQrCode('');
          } else {
              setTwoFaMessage('Invalid token. Try again.');
          }
      } catch(e) { console.error(e); }
  };

  const disable2FA = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/api/admin/2fa/disable`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              setTwoFaMessage('2FA Disabled Successfully!');
              setQrCode('');
          }
      } catch(e) { console.error(e); }
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
      
      {message && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Security (2FA) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
        <h2 className="text-xl font-bold mb-6">Security Settings</h2>
        <div className="space-y-4">
            <p className="text-gray-600">Protect your admin account with Two-Factor Authentication (Google Authenticator).</p>
            <div className="flex gap-4">
                <button type="button" onClick={setup2FA} className="px-4 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors">
                    Setup / Reset 2FA
                </button>
                <button type="button" onClick={disable2FA} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disable 2FA
                </button>
            </div>
            
            {qrCode && (
                <div className="mt-6 border p-6 rounded-lg inline-block text-center">
                    <p className="font-bold mb-2">1. Scan this QR Code with Google Authenticator</p>
                    <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
                    <p className="font-bold mb-2">2. Enter the 6-digit token to verify</p>
                    <div className="flex justify-center gap-2">
                        <input type="text" value={twoFaToken} onChange={(e) => setTwoFaToken(e.target.value)} className="border rounded px-4 py-2 w-32 text-center text-lg" placeholder="123456" />
                        <button type="button" onClick={verify2FA} className="px-4 py-2 bg-ceylon-700 text-white rounded-lg">Verify & Save</button>
                    </div>
                </div>
            )}
            {twoFaMessage && <p className="text-green-600 font-bold mt-2">{twoFaMessage}</p>}
        </div>
      </div>

      {/* About Us Page Settings */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">About Us Page</h2>
          <div className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Top Banner Image (1920x600 recommended)</label>
                  <ImageUpload value={aboutSettings.about_banner} onChange={(url) => handleAboutChange('about_banner', url)} placeholder="Upload Top Banner..." />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side Image 1 (400x500 recommended)</label>
                  <ImageUpload value={aboutSettings.about_image_1} onChange={(url) => handleAboutChange('about_image_1', url)} placeholder="Upload Image 1..." />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side Image 2 (400x500 recommended)</label>
                  <ImageUpload value={aboutSettings.about_image_2} onChange={(url) => handleAboutChange('about_image_2', url)} placeholder="Upload Image 2..." />
              </div>
              <div className="pt-4 flex justify-end">
                  <button type="button" onClick={saveAboutSettings} className="px-6 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors">
                      Save About Us
                  </button>
              </div>
          </div>
      </div>

      {/* Contact Page Settings */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Contact Page</h2>
          <div className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address (supports HTML e.g. &lt;br/&gt;)</label>
                  <textarea name="contact_address" rows={2} value={contactSettings.contact_address} onChange={handleContactChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" placeholder="123 Galle Road..."></textarea>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers (supports HTML)</label>
                  <textarea name="contact_phone" rows={2} value={contactSettings.contact_phone} onChange={handleContactChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" placeholder="+94 11..."></textarea>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                  <input type="text" name="contact_email_1" value={contactSettings.contact_email_1} onChange={handleContactChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" placeholder="hello@ceylon.travel" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                  <input type="text" name="contact_email_2" value={contactSettings.contact_email_2} onChange={handleContactChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" placeholder="bookings@ceylon.travel" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed iframe (Paste entire iframe HTML)</label>
                  <textarea name="contact_map_iframe" rows={3} value={contactSettings.contact_map_iframe} onChange={handleContactChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none" placeholder='<iframe src="..."></iframe>'></textarea>
              </div>
               <div className="pt-4 flex justify-end">
                  <button type="button" onClick={saveContactSettings} className="px-6 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors">
                      Save Contact Info
                  </button>
              </div>
          </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
        <div className="space-y-6">
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

          <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-gray-800 mb-4">WeChat Configuration</h3>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WeChat ID</label>
                    <input
                      type="text"
                      name="wechat_id"
                      value={formData.wechat_id || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ceylon-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WeChat QR Code</label>
                    <ImageUpload
                        value={formData.wechat_qr || ''}
                        onChange={(url) => handleImageChange('wechat_qr', url)}
                        placeholder="Upload WeChat QR Code"
                    />
                  </div>
              </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => { updateSocialMedia(formData); setMessage('Social Media saved!'); setTimeout(() => setMessage(''), 3000); }}
              className="px-6 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors"
            >
              Save Social Media
            </button>
          </div>
        </div>
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
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => { updateHeroImages(localHeroImages); setMessage('Hero Images saved!'); setTimeout(() => setMessage(''), 3000); }}
                    className="px-4 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors"
                >
                    Save Hero Images
                </button>
            </div>
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
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => { updateAdventureBanner(localAdventureBanner); setMessage('Adventure Banner saved!'); setTimeout(() => setMessage(''), 3000); }}
                    className="px-4 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors"
                >
                    Save Banner
                </button>
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
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => { updateWhyChooseUsImages(localWhyChooseUsImages); setMessage('Why Choose Us Images saved!'); setTimeout(() => setMessage(''), 3000); }}
                    className="px-4 py-2 bg-ceylon-700 text-white rounded-lg hover:bg-ceylon-800 transition-colors"
                >
                    Save Why Choose Us Images
                </button>
            </div>
        </div>
      </div>

      </div>
    </div>
  );
};
