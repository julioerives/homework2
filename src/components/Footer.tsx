import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">PokéExplorer</h3>
            <p className="text-gray-300 mb-4">
              Explora el fascinante mundo de los Pokémon con nuestra aplicación interactiva.
              Descubre información detallada sobre tus Pokémon favoritos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {['Inicio', 'Pokédex', 'Tipos', 'Regiones', 'Habilidades'].map(item => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              {['API de Pokémon', 'Documentación', 'Política de Privacidad', 'Términos de Uso'].map(item => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} PokéExplorer. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Desarrollado con React, TypeScript y TailwindCSS. Datos proporcionados por la API de Pokémon.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;