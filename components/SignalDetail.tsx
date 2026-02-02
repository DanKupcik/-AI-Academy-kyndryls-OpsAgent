import React, { useEffect, useState } from 'react';
import { Signal, AIAnalysis } from '../types';
import { analyzeSignal } from '../services/geminiService';
import { Icons, COLORS } from '../constants';

interface SignalDetailProps {
  signal: Signal | null;
  onClose: () => void;
}

const SignalDetail: React.FC<SignalDetailProps> = ({ signal, onClose }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signal) {
      setLoading(true);
      setAnalysis(null);
      analyzeSignal(signal)
        .then(setAnalysis)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [signal]);

  if (!signal) {
    return (
      <div className={`h-full flex flex-col items-center justify-center ${COLORS.TEXT_MUTED}`}>
        <Icons.Brain />
        <p className="mt-4">Select a signal to view Copilot analysis</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-800 border-l border-slate-700 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex justify-between items-start">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            signal.calculatedSeverity === 'P1' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {signal.calculatedSeverity}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <h2 className="text-xl font-bold text-white mt-2 mb-1 leading-tight">{signal.subject}</h2>
        <div className="flex gap-2 text-xs text-slate-400">
          <span>{signal.source}</span>
          <span>•</span>
          <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Original Message</h3>
          <p className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded border border-slate-700">
            {signal.body}
          </p>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 relative overflow-hidden">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-8 text-indigo-300 animate-pulse">
                <Icons.Brain />
                <span className="text-sm mt-2">Ops Copilot is analyzing...</span>
             </div>
          ) : analysis ? (
            <>
              <div className="flex items-center gap-2 mb-4 text-indigo-300">
                <Icons.Brain />
                <span className="font-semibold">Copilot Analysis</span>
                <span className="ml-auto text-xs opacity-70">Conf: {(analysis.confidenceScore * 100).toFixed(0)}%</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-indigo-200/60 block mb-1">Executive Summary</label>
                  <p className="text-sm text-indigo-100">{analysis.summary}</p>
                </div>

                <div>
                  <label className="text-xs text-indigo-200/60 block mb-1">Root Cause Hypothesis</label>
                  <p className="text-sm text-indigo-100 italic">"{analysis.rootCauseHypothesis}"</p>
                </div>

                <div>
                  <label className="text-xs text-indigo-200/60 block mb-1">ITIL Classification</label>
                  <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded border border-indigo-500/50">
                    {analysis.itilClassification}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-indigo-200/60 block mb-1">Recommended Actions</label>
                  <ul className="space-y-2">
                    {analysis.recommendedActions.map((action, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-indigo-100 items-start">
                         <span className="mt-0.5 text-indigo-400">→</span>
                         {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-400 text-sm">Analysis failed.</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
           <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2">
             <span>Draft Ticket (ServiceNow)</span>
           </button>
           <div className="flex gap-3">
             <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-sm transition-colors">
               Suppress 24h
             </button>
             <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-medium text-sm transition-colors">
               Ack & Resolve
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignalDetail;
