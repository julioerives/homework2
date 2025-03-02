import React, { useState, useEffect } from 'react';

interface PokemonProps {
  pokemon: {
    id: number;
    name: string;
    url: string;
  };
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonProps> = ({ pokemon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format Pokémon name
  const formatName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Synchronous function to handle mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
        isHovered ? 'shadow-xl transform -translate-y-1' : ''
      } hover-lift cursor-pointer`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative pt-[100%] bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={imageUrl}
          alt={pokemon.name}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-xs mb-1">#{pokemon.id.toString().padStart(3, '0')}</p>
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{formatName(pokemon.name)}</h3>
        <div className={`w-full h-1 bg-blue-500 rounded-full transform origin-left transition-transform duration-300 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}></div>
      </div>
    </div>
  );
};

export default PokemonCard;