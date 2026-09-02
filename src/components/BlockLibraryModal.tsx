import React, { useState } from 'react';
import { X, Trash2, Download, Upload, Plus, Check, Layers, Sparkles } from 'lucide-react';
import { CharacterSubBlock, CharacterInputs } from '../types';

interface BlockLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBlocks: CharacterSubBlock[];
  onLoadBlock: (block: CharacterSubBlock) => void;
  onDeleteBlock: (id: string) => void;
  onSaveCurrentAsBlock: (name: string, type: 'traits' | 'props' | 'costumes' | 'environment') => void;
  onExportAllJson: () => void;
  onImportJson: (imported: CharacterSubBlock[]) => void;
}

export const BlockLibraryModal: React.FC<BlockLibraryModalProps> = ({
  isOpen,
  onClose,
  savedBlocks,
  onLoadBlock,
  onDeleteBlock,
  onSaveCurrentAsBlock,
  onExportAllJson,
  onImportJson,
}) => {
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockType, setNewBlockType] = useState<'traits' | 'props' | 'costumes' | 'environment'>('traits');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (!isOpen) return null;

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlockName.trim()) {
      onSaveCurrentAsBlock(newBlockName.trim(), newBlockType);
      setNewBlockName('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportJson(json);
        }
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const filteredBlocks = savedBlocks.filter((b) =>
    selectedFilter === 'all' ? true : b.type === selectedFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm">
      <div className="bg-white border-4 border-indigo-100 w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
                Modular Persona Block Library
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Save, import, and recombine modular character blocks across generations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Block from Current Setup */}
        <form
          onSubmit={handleCreateBlock}
          className="bg-indigo-50/60 border-2 border-indigo-100 rounded-2xl p-3.5 flex flex-col sm:flex-row gap-2.5 items-center justify-between"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <input
              type="text"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              placeholder="Save current setup as block name..."
              className="bg-white border-2 border-indigo-100 text-xs font-bold text-slate-800 placeholder-indigo-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-300 w-full transition-colors"
            />
            <select
              value={newBlockType}
              onChange={(e) => setNewBlockType(e.target.value as any)}
              className="bg-white border-2 border-indigo-100 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-300 transition-colors"
            >
              <option value="traits">Physical Traits</option>
              <option value="costumes">Outfits & Costumes</option>
              <option value="props">Loadout Props</option>
              <option value="environment">Environment</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all shadow-[0px_3px_0px_0px_rgba(16,185,129,1)] active:scale-95 flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Save Block</span>
          </button>
        </form>

        {/* Filter & Import/Export Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-indigo-50/80 p-1 rounded-2xl border-2 border-indigo-100 text-xs">
            {['all', 'traits', 'costumes', 'props', 'environment'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-xl capitalize font-black text-xs transition-all ${
                  selectedFilter === f
                    ? 'bg-indigo-500 text-white shadow-[0px_2px_0px_0px_rgba(67,56,202,1)]'
                    : 'text-slate-500 hover:text-indigo-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full border-2 border-slate-200 cursor-pointer transition-colors shadow-sm active:scale-95">
              <Upload className="w-3.5 h-3.5 text-cyan-600" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={onExportAllJson}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full border-2 border-slate-200 transition-colors shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Blocks List */}
        <div className="overflow-y-auto flex-1 space-y-2.5 max-h-80 pr-1">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-semibold text-xs">
              No saved modular blocks yet. Create a block above to reuse traits, gear, or environment palettes.
            </div>
          ) : (
            filteredBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-indigo-50/40 border-2 border-indigo-100 rounded-2xl p-3.5 flex items-start justify-between gap-3 hover:border-indigo-200 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-950 group-hover:text-indigo-600 transition-colors">
                      {block.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase font-black tracking-wider">
                      {block.type}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 mt-1 line-clamp-2">
                    {block.text}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadBlock(block);
                      onClose();
                    }}
                    className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-wider px-3 py-1 rounded-full transition-colors shadow-sm"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteBlock(block.id)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
