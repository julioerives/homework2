import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import PokemonCard from './components/PokemonCard';
import PokemonDetail from './components/PokemonDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

interface Pokemon {
  name: string;
  url: string;
  id: number;
}

interface PokemonDetails {
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
}

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        const data = await response.json();
        
        const pokemonsWithId = data.results.map((pokemon: Pokemon) => {
          const id = parseInt(pokemon.url.split('/')[6]);
          return { ...pokemon, id };
        });
        
        setPokemons(pokemonsWithId);
        setFilteredPokemons(pokemonsWithId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '' && typeFilter === '') {
      setFilteredPokemons(pokemons);
      return;
    }
    
    const filtered = pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term)
    );
    
    setFilteredPokemons(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (typeFilter === '') {
      setFilteredPokemons(pokemons);
    } else {
      const filtered = pokemons.filter(pokemon => {
        if (selectedPokemon && selectedPokemon.id === pokemon.id) {
          return selectedPokemon.types.some(t => t.type.name === typeFilter);
        }
        return true; 
      });
      setFilteredPokemons(filtered);
    }
  };

  const fetchPokemonDetails = async (id: number) => {
    try {
      setLoadingDetail(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokémon details');
      }
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetails = () => {
    setSelectedPokemon(null);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">Pokémon Explorer</h1>
          <p className="text-center text-gray-600 mb-8">Descubre y explora el mundo Pokémon</p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Buscar Pokémon..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={clearSearch}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="mt-4">
              <button 
                className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleFilters}
              >
                <span className="font-medium text-gray-700">Filtros</span>
                {showFilters ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </button>
              
              {showFilters && (
                <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg animate-slideDown">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground'].map(type => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded-full text-sm capitalize ${
                          typeFilter === type 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors duration-200`}
                        onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <span className="ml-2 text-xl text-gray-600">Cargando Pokémon...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPokemons.map(pokemon => (
                <PokemonCard 
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => fetchPokemonDetails(pokemon.id)}
                />
              ))}
              
              {filteredPokemons.length === 0 && !loading && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">No se encontraron Pokémon con ese nombre.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {selectedPokemon && (
        <PokemonDetail 
          pokemon={selectedPokemon} 
          onClose={closeDetails}
          loading={loadingDetail}
        />
      )}
    </div>
  );
}

export default App;