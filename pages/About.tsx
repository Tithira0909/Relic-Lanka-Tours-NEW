import React from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { useData } from '../context/DataContext';

export const About: React.FC = () => {
  const { aboutBanner, aboutImage1, aboutImage2 } = useData();

  return (
    <div className="pt-20">
      <Section className="text-center max-w-4xl mx-auto mb-10">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8">Our Story</h1>
        <p className="text-xl text-gray-600 leading-relaxed text-justify">
          Welcome to Relic Lanka Tours, where your island adventure is backed by a decade and a half of local expertise. We don’t just show you the sights; we reveal the soul of Sri Lanka. From the mist-covered tea plantations of the Hill Country to the golden shores of our southern coast, we’ve spent 15 years perfecting the art of the private tour. Whether you’re seeking ancient heritage, wild safaris, or hidden gems only a local knows, we ensure every moment is seamless, authentic, and uniquely yours.
        </p>
      </Section>

      <div className="w-full h-[500px] overflow-hidden mb-20 relative">
        <img src={aboutBanner || "images/IMG_0724.jpg"} alt="Team" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">15 + Years of excellence in Tourism</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-justify">
              Where Ancient Wonders Meet Timeless Luxury.
              Sri Lanka is not merely a destination — it is a living tapestry of civilisations, landscapes, and stories woven across millennia. At Relic Lanka Tours, we are the trusted curators of that story, crafting journeys that reveal the island's most extraordinary soul.
              Born from a deep reverence for Sri Lanka's rich heritage and natural splendour, Relic Lanka Tours was founded on a singular belief: that travel, at its finest, is a transformative experience. We go beyond itineraries. We design discoveries.
            </p>

            <h2 className="text-3xl font-serif font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-justify">
              We are passionate explorers, seasoned guides, and dedicated hosts — united by an intimate knowledge of the Pearl of the Indian Ocean. From the mist-veiled ancient cities of Anuradhapura and Polonnaruwa, to the emerald wilderness of Yala and Wilpattu, to the sun-kissed shores of the South Coast — we unlock every facet of this remarkable island with elegance and care.
            </p>

            <h2 className="text-3xl font-serif font-bold mb-6">What We Offer</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-justify">
              🏛️ <b>Cultural & Heritage Journeys</b> <br /> Walk among ancient temples, royal citadels, and UNESCO World Heritage Sites guided by those who know their secrets.<br />
              🐘 <b>Wildlife & Nature Experiences</b>  <br /> Witness Sri Lanka's magnificent elephants, leopards, and exotic birdlife in their natural habitats, in comfort and style.<br />
              🌊 <b>Beach & Luxury Retreats</b> <br />  Unwind on pristine coastlines with bespoke stays that blend tropical serenity with refined indulgence.<br />
              🌿 <b>Adventure Escapes</b> <br /> Trek through lush highlands, explore hidden waterfalls, and embrace the thrill of a land as wild as it is beautiful.
            </p>

            <h2 className="text-3xl font-serif font-bold mb-6">Why Relic Lanka Tours</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-justify">
              Every journey with us is private, personalised, and purposeful. We take the time to understand you — your passions, your pace, your vision of the perfect escape — and craft an experience that is uniquely yours. Our handpicked network of luxury properties, expert naturalists, and cultural guides ensures that every moment exceeds expectation.
              With Relic Lanka Tours, you are never just a tourist. You are a privileged guest of an ancient island, welcomed with warmth, guided with expertise, and left with memories that endure long after the journey ends.
            </p>

          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={aboutImage1 || "/images/MG_5725.jpg"} className="rounded-2xl shadow-lg mt-10" />
            <img src={aboutImage2 || "/images/1000298461.jpg"} className="rounded-2xl shadow-lg" />
          </div>
        </div>
      </Section>
    </div>
  );
};
