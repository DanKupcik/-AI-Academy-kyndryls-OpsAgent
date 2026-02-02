import React, { useState, useMemo } from 'react';
import { Signal, FocusMode, Severity, SignalSource } from './types';
import { MOCK_SIGNALS } from './services/mockData';
import { Icons, COLORS } from './constants';
import FocusControl from './components/FocusControl';
import SignalDetail from './components/SignalDetail';
import DashboardStats from './components/DashboardStats';

// Helper for icons
const getSourceIcon = (source: SignalSource) => {
  switch (source) {
    case SignalSource.Outlook: return <Icons.Outlook />;
    case SignalSource.Teams: return <Icons.Teams />;
    case SignalSource.GLPI: return <Icons.GLPI />;
    case SignalSource.SharePoint: return <Icons.SharePoint />;
    default: return <Icons.Alert />;
  }
};

const App: React.FC = () => {
  const [focusMode, setFocusMode] = useState<FocusMode>(FocusMode.Normal);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);

  // Filter Logic based on Focus Mode
  const filteredSignals = useMemo(() => {
    return signals.filter(signal => {
      if (focusMode === FocusMode.DeepFocus) {
        // In Deep Focus, only show P1 or Security related
        const isCritical = signal.calculatedSeverity === Severity.P1;
        const isSecurity = signal.tags.includes('Security');
        return isCritical || isSecurity;
      }
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [signals, focusMode]);

  const selectedSignal = useMemo(() => 
    signals.find(s => s.id === selectedSignalId) || null
  , [signals, selectedSignalId]);

  return (
    <div className={`flex h-screen w-full ${COLORS.BG_DARK} ${COLORS.TEXT_MAIN} overflow-hidden font-sans`}>
      
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 flex-shrink-0 border-r border-slate-700 bg-slate-900 flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-slate-700 h-16">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
             <Icons.Shield />
          </div>
          <span className="font-bold tracking-tight hidden md:block">Ops Focus</span>
        </div>
        
        <nav className="flex-1 p-2 space-y-1 mt-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-slate-800 text-indigo-300 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            <span className="hidden md:block text-sm font-medium">Live Feed</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="hidden md:block text-sm font-medium">Analytics</span>
          </button>
           <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <span className="hidden md:block text-sm font-medium">Policy Config</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">JD</div>
             <div className="hidden md:block">
               <div className="text-xs font-medium">John Doe</div>
               <div className="text-[10px] text-slate-500">SRE Lead</div>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        
        {/* Top Bar */}
        <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur">
          <h1 className="text-lg font-semibold text-slate-200">Operations Control Center</h1>
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500">
                Environment: <span className="text-green-400 font-mono">PROD</span>
             </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Feed Column */}
          <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ${selectedSignalId ? 'w-1/2' : 'w-full'}`}>
            
            <FocusControl mode={focusMode} setMode={setFocusMode} />
            <DashboardStats />

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                Incoming Signals ({filteredSignals.length})
              </h3>
              {focusMode === FocusMode.DeepFocus && (
                 <span className="text-xs text-amber-500 animate-pulse">● Filtering Active</span>
              )}
            </div>

            <div className="space-y-3">
              {filteredSignals.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  <p>No signals match current focus criteria.</p>
                  <button onClick={() => setFocusMode(FocusMode.Normal)} className="mt-2 text-indigo-400 text-sm hover:underline">Switch to Normal Mode</button>
                </div>
              ) : (
                filteredSignals.map(signal => (
                  <div 
                    key={signal.id}
                    onClick={() => setSelectedSignalId(signal.id)}
                    className={`group relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg
                      ${selectedSignalId === signal.id ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(signal.source)}
                        <span className="text-xs font-semibold text-slate-400">{signal.source}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded 
                        ${signal.calculatedSeverity === Severity.P1 ? 'bg-red-500 text-white' : 
                          signal.calculatedSeverity === Severity.P2 ? 'bg-orange-500 text-white' :
                          'bg-slate-700 text-slate-300'}
                      `}>
                        {signal.calculatedSeverity}
                      </span>
                    </div>
                    
                    <h4 className={`font-medium mb-1 line-clamp-1 ${signal.isRead ? 'text-slate-400' : 'text-slate-100'}`}>
                      {signal.subject}
                    </h4>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                      {signal.body}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex gap-2">
                          {signal.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                              {tag}
                            </span>
                          ))}
                       </div>
                       <span className="text-xs text-slate-600">
                         {new Date(signal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail Slide-over Panel */}
          {selectedSignalId && (
            <div className="w-[450px] border-l border-slate-800 h-full flex-shrink-0 bg-slate-900 transition-all duration-300 ease-in-out shadow-2xl z-20">
               <SignalDetail signal={selectedSignal} onClose={() => setSelectedSignalId(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
