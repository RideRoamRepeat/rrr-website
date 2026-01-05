import React, { useState } from 'react';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SectionHeading from '../components/SectionHeading';

export default function Accessories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Accessories', icon: '🛍️' },
    { id: 'riding-boots', name: 'Riding Boots', icon: '👢' },
    { id: 'riding-pants', name: 'Riding Pants', icon: '👖' },
    { id: 'helmets', name: 'Helmets', icon: '🪖' },
    { id: 'gloves', name: 'Riding Gloves', icon: '🧤' },
    { id: 'jackets', name: 'Riding Jackets', icon: '🧥' },
    { id: 'bike-accessories', name: 'Bike Accessories', icon: '🔧' },
    { id: 'protection', name: 'Protection Gear', icon: '🛡️' }
  ];

  const accessories = [
    // Riding Boots
    { id: 1, name: 'Adventure Riding Boots', category: 'riding-boots', price: 4999, image: 'https://www.mxstore.in/cdn/shop/files/Boots-Cross-White_0fdc4678-c2fa-4c7c-af47-4490a4dcbd67.webp?v=1725960901&width=1214', brand: 'MX Pro', features: ['Waterproof', 'Ankle Protection', 'Steel Toe'] },
    { id: 2, name: 'Sport Racing Boots', category: 'riding-boots', price: 6999, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70', brand: 'Speed Gear', features: ['Carbon Fiber', 'Ventilated', 'Quick Lace'] },
    { id: 3, name: 'Urban Commuter Boots', category: 'riding-boots', price: 3499, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'City Rider', features: ['Casual Style', 'Slip-Resistant', 'Comfort Fit'] },
    
    // Riding Pants
    { id: 4, name: 'Adventure Riding Pants', category: 'riding-pants', price: 5999, image: 'https://images.unsplash.com/photo-1571069477240-1b3c6f5b7c7?auto=format&fit=crop&w=800&q=70', brand: 'Trail Pro', features: ['Knee Armor', 'Waterproof', 'Adjustable Fit'] },
    { id: 5, name: 'Sport Racing Pants', category: 'riding-pants', price: 7999, image: 'https://images.unsplash.com/photo-1551698635-3e938e5e6b0?auto=format&fit=crop&w=800&q=70', brand: 'Race Tech', features: ['Aerodynamic', 'Knee Sliders', 'Stretch Panels'] },
    { id: 6, name: 'Denim Riding Pants', category: 'riding-pants', price: 4499, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=70', brand: 'Urban Style', features: ['Kevlar Lined', 'Casual Look', 'Removable Armor'] },
    
    // Helmets
    { id: 7, name: 'Full Face Racing Helmet', category: 'helmets', price: 8999, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70', brand: 'Safe Ride', features: ['DOT Certified', 'Anti-Scratch', 'Ventilation'] },
    { id: 8, name: 'Modular Helmet', category: 'helmets', price: 10999, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'Flexi Ride', features: ['Flip-Up Chin', 'Bluetooth Ready', 'Sun Visor'] },
    { id: 9, name: 'Open Face Helmet', category: 'helmets', price: 6999, image: 'https://images.unsplash.com/photo-1571069477240-1b3c6f5b7c7?auto=format&fit=crop&w=800&q=70', brand: 'Cruise Pro', features: ['Lightweight', 'Classic Style', 'UV Protection'] },
    
    // Gloves
    { id: 10, name: 'Sport Racing Gloves', category: 'gloves', price: 1999, image: 'https://images.unsplash.com/photo-1551698635-3e938e5e6b0?auto=format&fit=crop&w=800&q=70', brand: 'Grip Pro', features: ['Carbon Knuckles', 'Touch Screen', 'Ventilated'] },
    { id: 11, name: 'Touring Gloves', category: 'gloves', price: 2499, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'Comfort Ride', features: ['Waterproof', 'Long Cuff', 'Heated Option'] },
    { id: 12, name: 'Summer Gloves', category: 'gloves', price: 1499, image: 'https://images.unsplash.com/photo-1571069477240-1b3c6f5b7c7?auto=format&fit=crop&w=800&q=70', brand: 'Cool Ride', features: ['Mesh Design', 'Lightweight', 'Non-Slip Palm'] },
    
    // Jackets
    { id: 13, name: 'Adventure Jacket', category: 'jackets', price: 9999, image: 'https://planetdsg.com/cdn/shop/files/dsg-race-pro-v2-yellow-fluo-riding-jacket2.jpg?v=1761829540&width=1400', brand: 'Trail Master', features: ['Waterproof', 'Removable Liner', 'Armor Pockets'] },
    { id: 14, name: 'Sport Racing Jacket', category: 'jackets', price: 11999, image: 'https://images.unsplash.com/photo-1551698635-3e938e5e6b0?auto=format&fit=crop&w=800&q=70', brand: 'Speed Pro', features: ['Aerodynamic', 'Hump Back', 'Stretch Panels'] },
    { id: 15, name: 'Urban Commuter Jacket', category: 'jackets', price: 7999, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'City Style', features: ['Casual Look', 'Reflective', 'Lightweight'] },
    
    // Bike Accessories
    { id: 16, name: 'Phone Mount', category: 'bike-accessories', price: 999, image: 'https://images.unsplash.com/photo-1571069477240-1b3c6f5b7c7?auto=format&fit=crop&w=800&q=70', brand: 'Tech Mount', features: ['Waterproof', 'Vibration Damp', 'Universal Fit'] },
    { id: 17, name: 'Saddle Bags', category: 'bike-accessories', price: 2999, image: 'https://images.unsplash.com/photo-1551698635-3e938e5e6b0?auto=format&fit=crop&w=800&q=70', brand: 'Cargo Pro', features: ['Waterproof', 'Quick Release', 'Large Capacity'] },
    { id: 18, name: 'LED Lights Kit', category: 'bike-accessories', price: 1999, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'Bright Ride', features: ['USB Rechargeable', 'Multi-Mode', 'Easy Install'] },
    
    // Protection Gear
    { id: 19, name: 'Knee & Elbow Guards', category: 'protection', price: 2499, image: 'https://images.unsplash.com/photo-1571069477240-1b3c6f5b7c7?auto=format&fit=crop&w=800&q=70', brand: 'Safe Guard', features: ['CE Certified', 'Adjustable Straps', 'Breathable'] },
    { id: 20, name: 'Back Protector', category: 'protection', price: 3499, image: 'https://images.unsplash.com/photo-1551698635-3e938e5e6b0?auto=format&fit=crop&w=800&q=70', brand: 'Spine Guard', features: ['Level 2 Protection', 'Flexible Design', 'Lightweight'] },
    { id: 21, name: 'Chest Protector', category: 'protection', price: 2999, image: 'https://images.unsplash.com/photo-1549298916-b83d96f649d4?auto=format&fit=crop&w=800&q=70', brand: 'Chest Guard', features: ['Impact Absorbing', 'Comfort Fit', 'Under Jacket'] }
  ];

  const filteredAccessories = selectedCategory === 'all' 
    ? accessories 
    : accessories.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="py-14">
        <Container>
          <div className="mb-12 text-center">
            <SectionHeading
              id="accessories"
              eyebrow="Riding Gear & Accessories"
              title="Complete Your Riding Setup"
              description="From helmets to boots, find everything you need for a safe and comfortable ride."
            />
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? 'border-white bg-white text-zinc-950'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAccessories.map(item => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/7">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 text-xs text-white/60">{item.brand}</div>
                  <h3 className="mb-2 font-semibold leading-tight">{item.name}</h3>
                  <div className="mb-3 text-lg font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                        {feature}
                      </span>
                    ))}
                    {item.features.length > 2 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                        +{item.features.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAccessories.length === 0 && (
            <div className="py-12 text-center text-white/60">
              <p>No accessories found in this category.</p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
