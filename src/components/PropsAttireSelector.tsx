import React, { useState } from 'react';
import { Package, Plus, Check, Trash2, Sparkles, X, Copy, CheckCheck } from 'lucide-react';
import { GenreType } from '../types';
import { getPropsForRole } from '../data/taxonomy';

interface PropsAttireSelectorProps {
  genre: GenreType;
  role: string;
  selectedProps: string[];
  onToggleProp: (prop: string) => void;
  onAddCustomProp: (prop: string) => void;
  onClearProps: () => void;
  onSelectRecommended: (props: string[]) => void;
}

export const PropsAttireSelector: React.FC<PropsAttireSelectorProps> = ({
  genre,
  role,
  selectedProps,
  onToggleProp,
  onAddCustomProp,
  onClearProps,
  onSelectRecommended,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);
  const availableProps = getPropsForRole(genre, role);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAddCustomProp(customInput.trim());
      setCustomInput('');
    }
  };

  const handlePickThematic = () => {
    // Pick 4-5 curated items from the role list
    const picks = availableProps.slice(0, 5);
    onSelectRecommended(picks);
  };

  const handleCopyProps = () => {
    const textToCopy =
      selectedProps.length > 0
        ? selectedProps.join(', ')
        : availableProps.slice(0, 5).join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-4 border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(5,150,105,1)]">
            3
          </div>
          <div>
            <h2 className="text-sm font-black text-emerald-950 uppercase tracking-widest flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-500" />
              Role-Specific Props & Attire
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              20 contextual weapons, gear, and garment items tailored for <span className="text-emerald-700 font-bold">{role}</span>
            </span>
          </div>
        </div>

        {/* Quick Helper Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="btn-copy-props-direct"
            onClick={handleCopyProps}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-full transition-all shadow-[0px_2px_0px_0px_rgba(5,150,105,1)] active:scale-95"
            title="Copy all selected props & attire as comma-separated text"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Props!' : 'Copy Props / Attire'}</span>
          </button>

          <button
            type="button"
            onClick={handlePickThematic}
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 px-3.5 py-1.5 rounded-full transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pick Top 5</span>
          </button>

          {selectedProps.length > 0 && (
            <button
              type="button"
              onClick={onClearProps}
              className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 px-3.5 py-1.5 rounded-full transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear ({selectedProps.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 20 Role Contextual Props Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableProps.map((p) => {
          const isSelected = selectedProps.includes(p);
          return (
            <button
              key={p}
              id={`prop-btn-${p.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => onToggleProp(p)}
              className={`text-xs font-bold px-3 py-2 rounded-2xl border-2 transition-all flex items-center gap-1.5 active:scale-95 ${
                isSelected
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0px_3px_0px_0px_rgba(5,150,105,1)]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-900'
              }`}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              )}
              <span>{p}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Prop Form & Selected Loadout Tag Cloud */}
      <div className="pt-4 border-t-2 border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <form onSubmit={handleAddCustom} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom gear or artifact..."
            className="bg-emerald-50/60 border-2 border-emerald-100 text-xs font-bold text-emerald-950 placeholder-emerald-400 rounded-2xl px-3.5 py-2 focus:outline-none focus:border-emerald-300 focus:bg-white w-full md:w-64 transition-all"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-2xl shadow-[0px_3px_0px_0px_rgba(5,150,105,1)] hover:translate-y-0.5 active:translate-y-1 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Selected Loadout Summary */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider">Active Loadout:</span>
          {selectedProps.length === 0 ? (
            <span className="text-slate-400 italic font-medium">Default role gear will apply automatically</span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedProps.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 bg-emerald-100 border-2 border-emerald-200 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => onToggleProp(item)}
                    className="hover:text-rose-600 transition-colors"
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
