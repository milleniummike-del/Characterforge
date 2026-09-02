import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { GenreType } from '../types';

interface HeaderProps {
  characterName: string;
  onNameChange: (name: string) => void;
  genre: GenreType;
  role: string;
  onGenerateNewCharacter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  characterName,
  onNameChange,
  genre,
  role,
  onGenerateNewCharacter,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-indigo-200 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand Identity & Active Spec */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(67,56,202,1)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black italic tracking-tighter text-indigo-900 uppercase flex items-center gap-1.5">
                  Character Forge
                  <span className="text-xs font-black text-pink-500 bg-pink-50 border-2 border-pink-200 px-2 py-0.5 rounded-full not-italic tracking-normal">
                    Persona v2.0
                  </span>
                </h1>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Visual AI Image Prompt Generator
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs bg-indigo-50 border-2 border-indigo-100 rounded-2xl px-3 py-1.5 text-indigo-900 font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="font-black text-indigo-700 uppercase tracking-wide">{genre}</span>
            <span className="text-indigo-300 font-black">/</span>
            <span className="text-pink-600 font-black uppercase tracking-wide">{role}</span>
          </div>
        </div>

        {/* Center: Character Name Input */}
        <div className="flex items-center gap-2 w-full md:w-80 bg-pink-50 border-2 border-pink-100 rounded-2xl px-3.5 py-2 focus-within:border-pink-300 focus-within:bg-white transition-all shadow-sm">
          <label htmlFor="char-name-input" className="text-xs font-black text-pink-500 uppercase tracking-wider whitespace-nowrap">
            Persona:
          </label>
          <input
            id="char-name-input"
            type="text"
            value={characterName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Kira Takahashi..."
            className="w-full bg-transparent text-sm font-bold text-pink-950 placeholder-pink-300 focus:outline-none"
          />
        </div>

        {/* Right: Only the Generate Character Button */}
        <div className="flex items-center justify-end w-full md:w-auto">
          <button
            id="btn-generate-character"
            type="button"
            onClick={onGenerateNewCharacter}
            title="Randomize all elements to generate a completely new character"
            className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full shadow-[0px_4px_0px_0px_rgba(79,70,229,1)] active:translate-y-0.5 active:shadow-[0px_2px_0px_0px_rgba(79,70,229,1)] transition-all cursor-pointer group"
          >
            <Wand2 className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Generate New Character</span>
          </button>
        </div>
      </div>
    </header>
  );
};
