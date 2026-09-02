import React, { useState, useMemo } from 'react';
import {
  User,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Plus,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  X,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { PHYSICAL_TRAITS } from '../data/taxonomy';
import { TraitItem } from '../types';

interface PhysicalTraitsAccordionProps {
  selectedTraits: Record<string, string[]>;
  customTraits: Record<string, string[]>;
  onToggleTrait: (category: string, traitText: string) => void;
  onAddCustomTrait: (category: string, traitText: string) => void;
  onClearAllTraits: () => void;
  onAutoPickHarmonious: () => void;
}

export const PhysicalTraitsAccordion: React.FC<PhysicalTraitsAccordionProps> = ({
  selectedTraits,
  customTraits,
  onToggleTrait,
  onAddCustomTrait,
  onClearAllTraits,
  onAutoPickHarmonious,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Ethnic / Ancestral Background': true,
    Age: true,
    'Body Build': true,
    'Facial Structure': true,
  });
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const categories = Object.keys(PHYSICAL_TRAITS);

  // Total selected traits count
  const totalSelectedCount = useMemo(() => {
    let count = 0;
    (Object.values(selectedTraits) as string[][]).forEach((arr) => {
      count += Array.isArray(arr) ? arr.length : 0;
    });
    (Object.values(customTraits) as string[][]).forEach((arr) => {
      count += Array.isArray(arr) ? arr.length : 0;
    });
    return count;
  }, [selectedTraits, customTraits]);

  // Handle copying all physical traits
  const handleCopyTraits = () => {
    const list: string[] = [];
    Object.values(selectedTraits).forEach((arr) => {
      if (Array.isArray(arr)) list.push(...arr);
    });
    Object.values(customTraits).forEach((arr) => {
      if (Array.isArray(arr)) list.push(...arr);
    });

    const textToCopy =
      list.length > 0
        ? list.join(', ')
        : 'striking appearance, expressive eyes, balanced facial structure';

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    categories.forEach((c) => (allOpen[c] = true));
    setOpenCategories(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenCategories({});
  };

  const handleCustomSubmit = (cat: string, e: React.FormEvent) => {
    e.preventDefault();
    const val = customInputs[cat]?.trim();
    if (val) {
      onAddCustomTrait(cat, val);
      setCustomInputs((prev) => ({ ...prev, [cat]: '' }));
    }
  };

  return (
    <div className="bg-white border-4 border-pink-100 rounded-3xl p-5 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(219,39,119,1)]">
            4
          </div>
          <div>
            <h2 className="text-sm font-black text-pink-950 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-4 h-4 text-pink-500" />
              Physical Traits & Biological Dimensions
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              15 fine-grained anatomical categories ({totalSelectedCount} active selections)
            </span>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-copy-traits-direct"
            onClick={handleCopyTraits}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-pink-600 hover:bg-pink-700 px-3.5 py-1.5 rounded-full transition-all shadow-[0px_2px_0px_0px_rgba(219,39,119,1)] active:scale-95"
            title="Copy all selected physical traits as comma-separated text"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Traits!' : 'Copy Physical Traits'}</span>
          </button>

          <button
            type="button"
            onClick={onAutoPickHarmonious}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 px-3.5 py-1.5 rounded-full transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Auto-Match Visuals</span>
          </button>
          <button
            type="button"
            onClick={handleExpandAll}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 px-2 py-1 transition-colors"
          >
            Collapse All
          </button>
          {totalSelectedCount > 0 && (
            <button
              type="button"
              onClick={onClearAllTraits}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 px-2 py-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Trait Global Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter any trait (e.g. high cheekbones, scars, emerald eyes, athletic...)"
          className="w-full bg-pink-50/60 border-2 border-pink-100 text-xs font-bold text-pink-950 placeholder-pink-400 rounded-2xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-pink-300 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-pink-400 hover:text-pink-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 15 Collapsible Categories */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {categories.map((category) => {
          const items = PHYSICAL_TRAITS[category] || [];
          const activeSelected = selectedTraits[category] || [];
          const activeCustom = customTraits[category] || [];
          const categoryCount = activeSelected.length + activeCustom.length;

          // Filter by search term
          const filteredItems = searchTerm
            ? items.filter(
                (item) =>
                  item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.text.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : items;

          // If searching and this category has no matches, hide it
          if (searchTerm && filteredItems.length === 0 && activeCustom.length === 0) {
            return null;
          }

          const isOpen = Boolean(openCategories[category] || searchTerm);

          return (
            <div
              key={category}
              className={`rounded-2xl border-2 transition-all ${
                categoryCount > 0
                  ? 'border-pink-300 bg-pink-50/40'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                id={`accordion-btn-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-pink-50/70 rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                    {category}
                  </span>
                  {categoryCount > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500 text-white uppercase tracking-wider">
                      {categoryCount} active
                    </span>
                  )}
                </div>
                <div className="text-slate-400">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-pink-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 border-t-2 border-slate-100">
                  {/* Trait Chips */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {filteredItems.map((item) => {
                      const isSelected = activeSelected.includes(item.text);
                      return (
                        <button
                          key={item.text}
                          type="button"
                          id={`trait-chip-${item.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => onToggleTrait(category, item.text)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-all flex items-center gap-1.5 active:scale-95 ${
                            isSelected
                              ? 'bg-pink-500 border-pink-600 text-white shadow-[0px_2px_0px_0px_rgba(219,39,119,1)]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    {/* Custom traits in this category */}
                    {activeCustom.map((customText) => (
                      <span
                        key={customText}
                        className="inline-flex items-center gap-1 bg-pink-100 border-2 border-pink-200 text-pink-900 text-xs font-bold px-2.5 py-1 rounded-xl"
                      >
                        <Check className="w-3.5 h-3.5 text-pink-500" />
                        <span>{customText}</span>
                        <button
                          type="button"
                          onClick={() => onToggleTrait(category, customText)}
                          className="hover:text-rose-600 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Custom Trait Adder */}
                  <form
                    onSubmit={(e) => handleCustomSubmit(category, e)}
                    className="flex items-center gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={customInputs[category] || ''}
                      onChange={(e) =>
                        setCustomInputs((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      placeholder={`Add custom ${category.toLowerCase()} descriptor...`}
                      className="bg-white border-2 border-pink-100 text-xs font-bold text-pink-950 placeholder-pink-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-pink-300 flex-1 transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all shadow-[0px_2px_0px_0px_rgba(219,39,119,1)] flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
