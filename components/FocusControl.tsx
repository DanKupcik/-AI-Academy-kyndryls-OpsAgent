import React from 'react';
import { FocusMode } from '../types';
import { Icons, COLORS } from '../constants';

interface FocusControlProps {
  mode: FocusMode;
  setMode: (mode: FocusMode) => void;
}

const FocusControl: React.FC<FocusControlProps> = ({ mode, setMode }) => {
  return (
    <div className={`${COLORS.BG_CARD} p-4 rounded-xl border border-slate-700 shadow-lg mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`${COLORS.TEXT_MAIN} font-semibold flex items-center gap-2`}>
          <Icons.Focus /> Hyperfocus Guardian
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          mode === FocusMode.DeepFocus ? 'bg-purple-900 text-purple-200' : 'bg-slate-700 text-slate-300'
        }`}>
          {mode === FocusMode.DeepFocus ? 'NOISE FILTER ACTIVE' : 'STANDARD MONITORING'}
        </span>
      </div>
      
      <div className="flex bg-slate-900 rounded-lg p-1">
        {(Object.values(FocusMode) as FocusMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              mode === m 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {m === FocusMode.DeepFocus ? 'Deep Focus' : m}
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-slate-400">
        {mode === FocusMode.DeepFocus 
          ? "Filtering all non-critical signals. Only P1 & Security incidents will surface."
          : "Standard filtering rules applied. All subscribed feeds visible."}
      </div>
    </div>
  );
};

export default FocusControl;
