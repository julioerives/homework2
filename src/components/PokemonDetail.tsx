import React, { useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface PokemonDetailProps {
  pokemon: {
    id: number;
    name: string;
    sprites: {
      front_default: string;
      other: {
        'official-artwork': {
          front_default: string;
        }
      }
    };
    types: Array<{
      type: {
        name: string;
      }
    }>;
    stats: Array<{
      base_stat: number;
      stat: {
        name: string;
      }
    }>;
    height: number;
    weight: number;
    abilities: Array<{
      ability: {
        name: string;
      }
    }>;
  };
  onClose: () => void;
  loading: boolean;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose, loading }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Format Pokémon name
  const formatName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format stat name
  const formatStatName = (stat: string) => {
    const statNames: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Atq. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'
    };
    return statNames[stat] || stat;
  };

  // Calculate stat percentage for progress bar
  const calculateStatPercentage = (value: number) => {
    const maxStat = 255; // Maximum possible stat value
    return Math.min((value / maxStat) * 100, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scaleIn"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="relative">
              <button 
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                onClick={onClose}
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
              
              <div className={`h-48 flex items-center justify-center relative ${pokemon.types[0]?.type.name ? `type-${pokemon.types[0].type.name}` : 'bg-gray-200'}`}>
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="h-56 w-56 object-contain absolute bottom-0 transform translate-y-10 animate-bounce"
                />
              </div>
              
              <div className="p-6 pt-16">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">#{pokemon.id.toString().padStart(3, '0')}</p>
                    <h2 className="text-2xl font-bold text-gray-800">{formatName(pokemon.name)}</h2>
                  </div>
                  <div className="flex gap-2">
                    {pokemon.types.map(type => (
                      <span 
                        key={type.type.name}
                        className={`px-3 py-1 rounded-full text-white text-sm capitalize type-${type.type.name}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Estadísticas</h3>
                    <div className="space-y-3">
                      {pokemon.stats.map(stat => (
                        <div key={stat.stat.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{formatStatName(stat.stat.name)}</span>
                            <span className="text-sm font-medium text-gray-800">{stat.base_stat}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full animate-slideRight" 
                              style={{ width: `${calculateStatPercentage(stat.base_stat)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Detalles</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Altura</p>
                        <p className="text-lg font-medium">{pokemon.height / 10} m</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Peso</p>
                        <p className="text-lg font-medium">{pokemon.weight / 10} kg</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 mb-2">Habilidades</p>
                        <div className="flex flex-wrap gap-2">
                          {pokemon.abilities.map(ability => (
                            <span 
                              key={ability.ability.name}
                              className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize"
                            >
                              {formatName(ability.ability.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;