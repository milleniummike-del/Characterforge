import React, { useState } from 'react';
import { Film, UserCheck, Sparkles, Shuffle, Search, Tag, ChevronRight } from 'lucide-react';
import { GenreType } from '../types';
import { GENRES, GENRE_DESCRIPTIONS, ROLES_BY_GENRE } from '../data/taxonomy';

interface GenreRoleSelectorProps {
  genre: GenreType;
  role: string;
  onGenreChange: (genre: GenreType) => void;
  onRoleChange: (role: string) => void;
}

export const GenreRoleSelector: React.FC<GenreRoleSelectorProps> = ({
  genre,
  role,
  onGenreChange,
  onRoleChange,
}) => {
  const [genreSearch, setGenreSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [customRoleInput, setCustomRoleInput] = useState('');

  const filteredGenres = GENRES.filter((g) =>
    g.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const availableRoles = ROLES_BY_GENRE[genre] || [];
  const filteredRoles = availableRoles.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handleRandomRole = () => {
    if (availableRoles.length > 0) {
      const random = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      onRoleChange(random);
    }
  };

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoleInput.trim()) {
      onRoleChange(customRoleInput.trim());
      setCustomRoleInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Step 1: Genre Selection (5 cols) */}
      <div className="lg:col-span-5 bg-white border-4 border-amber-100 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(217,119,6,1)]">
                1
              </div>
              <h2 className="text-sm font-black text-amber-950 uppercase tracking-widest flex items-center gap-1.5">
                <Film className="w-4 h-4 text-amber-500" />
                Hollywood Genre
              </h2>
            </div>
            <span className="text-[11px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              20 Universes
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">
            Scopes narrative lore, visual conventions, and unlocks specialized archetypes.
          </p>

          {/* Genre Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="Search 20 narrative genres..."
              className="w-full bg-amber-50/60 border-2 border-amber-100 text-xs font-bold text-amber-950 placeholder-amber-400 rounded-2xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-amber-300 focus:bg-white transition-all"
            />
          </div>

          {/* Genre Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredGenres.map((g) => {
              const isSelected = g === genre;
              return (
                <button
                  key={g}
                  id={`genre-btn-${g.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onGenreChange(g)}
                  className={`text-left text-xs font-black px-3 py-2.5 rounded-2xl border-2 transition-all flex items-center justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-600 text-white shadow-[0px_3px_0px_0px_rgba(217,119,6,1)]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-900'
                  }`}
                >
                  <span className="truncate">{g}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Genre description card */}
        <div className="mt-4 pt-3 border-t-2 border-amber-100">
          <div className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {genre} Universe
          </div>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            {GENRE_DESCRIPTIONS[genre]}
          </p>
        </div>
      </div>

      {/* Step 2: Dynamic Role / Archetype Selection (7 cols) */}
      <div className="lg:col-span-7 bg-white border-4 border-cyan-100 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(6,182,212,1)]">
                2
              </div>
              <h2 className="text-sm font-black text-cyan-950 uppercase tracking-widest flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-500" />
                Dynamic Archetype / Role
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-random-role"
                onClick={handleRandomRole}
                title="Randomize role in this genre"
                className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-200 px-3 py-1 rounded-full transition-all active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-500" />
                <span>Randomize</span>
              </button>
              <span className="text-[11px] font-black uppercase text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                {availableRoles.length} Roles
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-3 leading-relaxed">
            Filtered specifically for <span className="text-cyan-700 font-bold">{genre}</span>. Unlocks 20 curated thematic props and armaments.
          </p>

          {/* Role Search & Custom Input */}
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                placeholder={`Search roles in ${genre}...`}
                className="w-full bg-cyan-50/60 border-2 border-cyan-100 text-xs font-bold text-cyan-950 placeholder-cyan-400 rounded-2xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-300 focus:bg-white transition-all"
              />
            </div>
            <form onSubmit={handleAddCustomRole} className="flex gap-1.5">
              <input
                type="text"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                placeholder="Custom archetype..."
                className="bg-cyan-50/60 border-2 border-cyan-100 text-xs font-bold text-cyan-950 placeholder-cyan-400 rounded-2xl px-3.5 py-2 focus:outline-none focus:border-cyan-300 focus:bg-white w-40"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-2xl shadow-[0px_3px_0px_0px_rgba(6,182,212,1)] hover:translate-y-0.5 active:translate-y-1 transition-all shrink-0"
              >
                Add
              </button>
            </form>
          </div>

          {/* Roles Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredRoles.map((r) => {
              const isSelected = r.toLowerCase() === role.toLowerCase();
              return (
                <button
                  key={r}
                  id={`role-btn-${r.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onRoleChange(r)}
                  className={`text-left text-xs font-black px-3 py-2.5 rounded-2xl border-2 transition-all flex items-center justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-600 text-white shadow-[0px_3px_0px_0px_rgba(6,182,212,1)]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-900'
                  }`}
                >
                  <span className="truncate">{r}</span>
                  {isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-white shrink-0"></span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Role Summary */}
        <div className="mt-4 pt-3 border-t-2 border-cyan-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Archetype:</span>
            <span className="text-xs font-black text-cyan-800 px-3 py-1 rounded-full bg-cyan-50 border-2 border-cyan-200 uppercase tracking-wider">
              {role}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Unlocks <strong className="text-cyan-700">20</strong> context items
          </span>
        </div>
      </div>
    </div>
  );
};
