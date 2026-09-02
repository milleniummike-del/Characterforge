import React, { useState } from 'react';
import {
  Shirt,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Copy,
  CheckCheck,
  X,
  Layers,
  Crown,
  Scissors,
  Shield,
  Footprints,
  Eye,
  Feather,
  Flame,
  Coffee,
} from 'lucide-react';
import { GenreType, CharacterOutfitEnsemble } from '../types';
import {
  getCharacterFiveEnsembles,
  MIX_AND_MATCH_CATEGORIES,
} from '../data/costumes';

interface CostumeWardrobeSelectorProps {
  characterName?: string;
  genre: GenreType;
  role: string;
  selectedCostumes: string[];
  onToggleCostume: (costumeText: string) => void;
  onAddCustomCostume: (costumeText: string) => void;
  onClearCostumes: () => void;
  onSelectRecommendedCostume?: (costumes: string[]) => void;
  onSelectEnsemble?: (ensembleText: string) => void;
}

export const CostumeWardrobeSelector: React.FC<CostumeWardrobeSelectorProps> = ({
  characterName,
  genre,
  role,
  selectedCostumes,
  onToggleCostume,
  onAddCustomCostume,
  onClearCostumes,
  onSelectRecommendedCostume,
  onSelectEnsemble,
}) => {
  const [activeTab, setActiveTab] = useState<'ensembles' | 'mixmatch'>('ensembles');
  const [selectedCategory, setSelectedCategory] = useState<string>('outerwear');
  const [customInput, setCustomInput] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedEnsembleId, setCopiedEnsembleId] = useState<string | null>(null);

  // Retrieve the tailored 5 full outfit ensembles for the active character & role
  const fiveEnsembles: CharacterOutfitEnsemble[] = getCharacterFiveEnsembles(genre, role, characterName);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddCustomCostume(customInput.trim());
      setCustomInput('');
    }
  };

  const handleEquipEnsemble = (ens: CharacterOutfitEnsemble) => {
    if (onSelectEnsemble) {
      onSelectEnsemble(ens.text);
    } else if (onSelectRecommendedCostume) {
      onSelectRecommendedCostume([ens.text]);
    } else {
      onToggleCostume(ens.text);
    }
  };

  const handleCopySingleEnsemble = (ens: CharacterOutfitEnsemble, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ens.text);
    setCopiedEnsembleId(ens.id);
    setTimeout(() => setCopiedEnsembleId(null), 2000);
  };

  const handleCopyAllFiveEnsembles = () => {
    const formatted = fiveEnsembles
      .map((ens, idx) => `Outfit ${idx + 1} (${ens.themeBadge} - ${ens.label}):\n${ens.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyEquippedCostumes = () => {
    const textToCopy =
      selectedCostumes.length > 0
        ? selectedCostumes.join(', ')
        : fiveEnsembles[0]?.text || 'No costume selected';
    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getThemeIcon = (themeType: CharacterOutfitEnsemble['themeType']) => {
    switch (themeType) {
      case 'signature':
        return <Crown className="w-3.5 h-3.5 text-amber-500" />;
      case 'stealth':
        return <Eye className="w-3.5 h-3.5 text-indigo-400" />;
      case 'formal':
        return <Feather className="w-3.5 h-3.5 text-pink-500" />;
      case 'heavy':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'downtime':
        return <Coffee className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-violet-500" />;
    }
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'outerwear':
        return <Shield className="w-3.5 h-3.5" />;
      case 'tops':
        return <Shirt className="w-3.5 h-3.5" />;
      case 'bottoms':
        return <Scissors className="w-3.5 h-3.5" />;
      case 'headwear':
        return <Crown className="w-3.5 h-3.5" />;
      case 'footwear':
        return <Footprints className="w-3.5 h-3.5" />;
      case 'materials':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white border-4 border-violet-100 rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-violet-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(109,40,217,1)]">
            3
          </div>
          <div>
            <h2 className="text-sm font-black text-violet-950 uppercase tracking-widest flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-violet-600" />
              Wardrobe, Costumes & 5 Full Ensembles
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              5 Copyable Thematic Full Outfits & Modular Separates for{' '}
              <span className="text-violet-700 font-bold">
                {characterName ? `${characterName} (${role})` : `${genre} • ${role}`}
              </span>
            </span>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy All 5 Outfits button */}
          <button
            type="button"
            id="btn-copy-all-five-ensembles"
            onClick={handleCopyAllFiveEnsembles}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 px-3.5 py-1.5 rounded-full transition-all shadow-[0px_2px_0px_0px_rgba(109,40,217,1)] active:scale-95"
            title="Copy all 5 full outfit ensembles formatted as a complete wardrobe spec"
          >
            {copiedAll ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied 5 Outfits!' : 'Copy All 5 Outfits'}</span>
          </button>

          {/* Copy Active Equipped Outfits */}
          <button
            type="button"
            id="btn-copy-costumes-direct"
            onClick={handleCopyEquippedCostumes}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 px-3.5 py-1.5 rounded-full transition-all active:scale-95"
            title="Copy currently equipped costume prompt text"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span>Copy Equipped</span>
          </button>

          {selectedCostumes.length > 0 && (
            <button
              type="button"
              id="btn-clear-costumes"
              onClick={onClearCostumes}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 px-3.5 py-1.5 rounded-full transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear ({selectedCostumes.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          id="tab-costumes-five-ensembles"
          onClick={() => setActiveTab('ensembles')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl border-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'ensembles'
              ? 'bg-violet-600 border-violet-700 text-white shadow-[0px_3px_0px_0px_rgba(109,40,217,1)]'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-900'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>5 Full Outfit Ensembles (Copyable)</span>
        </button>

        <button
          type="button"
          id="tab-costumes-mix-match"
          onClick={() => setActiveTab('mixmatch')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-2xl border-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'mixmatch'
              ? 'bg-violet-600 border-violet-700 text-white shadow-[0px_3px_0px_0px_rgba(109,40,217,1)]'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-violet-50 hover:text-violet-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mix & Match Pieces (75+ Garments)</span>
        </button>
      </div>

      {/* Tab 1: The 5 Full Outfit Ensembles */}
      {activeTab === 'ensembles' && (
        <div className="space-y-4">
          {/* Quick Ensembles Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 shrink-0">
              Quick Equip:
            </span>
            {fiveEnsembles.map((ens, idx) => {
              const isEquipped = selectedCostumes.includes(ens.text);
              return (
                <button
                  key={ens.id}
                  type="button"
                  onClick={() => handleEquipEnsemble(ens)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap border-2 ${
                    isEquipped
                      ? 'bg-violet-700 border-violet-800 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-300'
                  }`}
                >
                  <span className="text-[10px] opacity-75">#{idx + 1}</span>
                  {getThemeIcon(ens.themeType)}
                  <span>{ens.themeBadge}</span>
                </button>
              );
            })}
          </div>

          {/* 5 Distinct Ensemble Cards */}
          <div className="grid grid-cols-1 gap-3">
            {fiveEnsembles.map((ens, idx) => {
              const isEquipped = selectedCostumes.includes(ens.text);
              const isCopied = copiedEnsembleId === ens.id;

              return (
                <div
                  key={ens.id}
                  id={`card-ensemble-${idx + 1}`}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isEquipped
                      ? 'bg-violet-50/90 border-violet-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50 hover:border-violet-200'
                  }`}
                >
                  {/* Left: Number & Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                        isEquipped
                          ? 'bg-violet-600 text-white shadow-[0px_2px_0px_0px_rgba(109,40,217,1)]'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          {ens.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white border border-violet-200 text-violet-800 uppercase tracking-wider">
                          {getThemeIcon(ens.themeType)}
                          {ens.themeBadge}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-700 leading-relaxed select-all">
                        {ens.text}
                      </p>

                      <span className="text-[11px] font-medium text-slate-400 block italic">
                        {ens.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions (1-Click Copy & Equip) */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Copy Ensemble Button */}
                    <button
                      type="button"
                      id={`btn-copy-ensemble-${idx + 1}`}
                      onClick={(e) => handleCopySingleEnsemble(ens, e)}
                      className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border-2 transition-all active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 border-emerald-700 text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-violet-400 hover:text-violet-900 hover:bg-violet-50'
                      }`}
                      title={`Copy outfit #${idx + 1} (${ens.label}) to clipboard`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied Outfit!' : 'Copy Outfit'}</span>
                    </button>

                    {/* Equip / Toggle Button */}
                    <button
                      type="button"
                      id={`btn-equip-ensemble-${idx + 1}`}
                      onClick={() => handleEquipEnsemble(ens)}
                      className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border-2 transition-all active:scale-95 ${
                        isEquipped
                          ? 'bg-violet-600 border-violet-700 text-white shadow-[0px_2px_0px_0px_rgba(109,40,217,1)]'
                          : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-100 hover:border-violet-300'
                      }`}
                    >
                      {isEquipped ? <Check className="w-3.5 h-3.5 font-bold" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isEquipped ? 'Equipped' : 'Equip'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Mix & Match Categories */}
      {activeTab === 'mixmatch' && (
        <div className="space-y-4">
          {/* Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {MIX_AND_MATCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`btn-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-violet-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({cat.items.length})</span>
              </button>
            ))}
          </div>

          {/* Current Category Items Grid */}
          {MIX_AND_MATCH_CATEGORIES.filter((c) => c.id === selectedCategory).map((cat) => (
            <div key={cat.id} className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 italic">{cat.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {cat.items.map((item) => {
                  const isSelected = selectedCostumes.includes(item.text);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      id={`btn-item-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => onToggleCostume(item.text)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-violet-500 border-violet-600 text-white shadow-[0px_3px_0px_0px_rgba(109,40,217,1)]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-white text-violet-700' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 font-bold" /> : <Plus className="w-2.5 h-2.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black tracking-tight">{item.label}</div>
                        <div
                          className={`text-[11px] leading-tight line-clamp-2 mt-0.5 ${
                            isSelected ? 'text-violet-100' : 'text-slate-500'
                          }`}
                        >
                          {item.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Costume Input & Active Wardrobe Layer Tags */}
      <div className="pt-4 border-t-2 border-violet-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <form onSubmit={handleAddCustom} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom garment, fabric, or costume piece..."
            className="bg-violet-50/60 border-2 border-violet-100 text-xs font-bold text-violet-950 placeholder-violet-400 rounded-2xl px-3.5 py-2 focus:outline-none focus:border-violet-300 focus:bg-white w-full md:w-72 transition-all"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-2xl shadow-[0px_3px_0px_0px_rgba(109,40,217,1)] hover:translate-y-0.5 active:translate-y-1 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Selected Wardrobe Summary */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider">Equipped Wardrobe:</span>
          {selectedCostumes.length === 0 ? (
            <span className="text-slate-400 italic font-medium">Default archetype costume will apply automatically</span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedCostumes.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 bg-violet-100 border-2 border-violet-200 text-violet-900 text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  <span className="truncate max-w-[180px]">{item}</span>
                  <button
                    type="button"
                    onClick={() => onToggleCostume(item)}
                    className="hover:text-rose-600 transition-colors ml-0.5"
                    title="Remove costume layer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
