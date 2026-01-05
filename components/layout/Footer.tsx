import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, Youtube } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Footer: React.FC = () => {
  const { socialMedia } = useData();

  const socialLinks = [
    { Icon: Instagram, url: socialMedia.instagram },
    { Icon: Facebook, url: socialMedia.facebook },
    { Icon: Twitter, url: socialMedia.twitter },
    { Icon: Youtube, url: socialMedia.youtube },
  ].filter(link => link.url);

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter text-primary mb-6 block">
              Relic Lanka Tours
            </Link>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Curating exceptional journeys through the paradise island of Sri Lanka. Luxury, culture, and nature combined.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-ceylon-700 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/tours" className="hover:text-ceylon-700 transition-colors">All Tours</Link></li>
              <li><Link to="/about" className="hover:text-ceylon-700 transition-colors">Our Story</Link></li>
              <li><Link to="#" className="hover:text-ceylon-700 transition-colors">Destinations</Link></li>
              <li><Link to="#" className="hover:text-ceylon-700 transition-colors">Experiences</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/contact" className="hover:text-ceylon-700 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-ceylon-700 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-ceylon-700 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-ceylon-700 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-ceylon-700 flex-shrink-0" />
                <span>123 Galle Road,<br/>Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-ceylon-700 flex-shrink-0" />
                <span>hello@reliclankatours.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-ceylon-700 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Relic Lanka Tours. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            Designed with <span className="text-red-400">♥</span> in Sri Lanka
          </div>
        </div>
      </div>
    </footer>
  );
};
