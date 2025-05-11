import React from 'react';
import MapGlobe from '@/components/MapGlobe';
import { Globe } from 'lucide-react';

const GlobePage = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-gradient">
            <Globe className="h-8 w-8" /> Interactive World Globe
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our interactive 3D globe. Drag to rotate, scroll to zoom, and discover countries across the world.
          </p>
        </div>
        
        <div className="glass-card overflow-hidden my-8">
          {/* Adjusted height and width to make the map frame more proportional */}
          <div className="w-full h-[80vh]"> {/* Adjusted to 80% of the viewport height */}
            <MapGlobe />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
