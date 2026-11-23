import React from 'react';
import { ActionRecommendation, RecommendationResponse } from '@/types';
import { Sparkles, Clock, ShieldAlert, BookOpen, MessageSquare } from 'lucide-react';
import { APPROVED_PUBLIC_GUIDANCE } from '@/lib/constants';

interface ActionListProps {
  recommendations: RecommendationResponse | null;
  isLoading: boolean;
  onOpenChat: () => void;
}

export const ActionList: React.FC<ActionListProps> = ({ recommendations, isLoading, onOpenChat }) => {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 animate-pulse space-y-4">
        <div className="h-5 bg-slate-800 rounded w-1/4"></div>
        <div className="h-20 bg-slate-800 rounded"></div>
        <div className="h-20 bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (!recommendations || recommendations.actions.length === 0) {
    return null;
  }

  const getActionTypeBadge = (type: ActionRecommendation['type']) => {
    switch (type) {
      case 'outdoor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">Outdoor Routine</span>;
      case 'indoor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Indoor Environment</span>;
      case 'commute':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Commute Choice</span>;
      case 'source_reduction':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Source Reduction</span>;
    }
  };

  const getEvidenceTitle = (evidenceId: string) => {
    const doc = APPROVED_PUBLIC_GUIDANCE.find((g) => g.id === evidenceId);
    return doc ? doc.title : evidenceId;
  };

  return (
    <section className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Today's Practical Recommendations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evidence-linked actions grounded in current provider facts and your routine preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
            Engine: {recommendations.generated_by === 'gemini' ? 'Gemini AI (Closed Context)' : 'Deterministic Rules'}
          </span>
          <button
            onClick={onOpenChat}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium ml-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask Assistant
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-3.5 rounded-xl bg-navy-900/90 border border-teal-500/20 text-xs text-slate-200 leading-relaxed">
        <strong>Context Overview:</strong> {recommendations.summary}
      </div>

      {/* Action Cards List */}
      <div className="grid gap-3.5">
        {recommendations.actions.map((action, idx) => (
          <div
            key={action.id || idx}
            className="p-4 rounded-xl bg-navy-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-white">{action.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {getActionTypeBadge(action.type)}
                {action.when && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {action.when}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{action.reason}</p>

            {/* Evidence & Caveats Row */}
            <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Evidence Basis:</span>
                {action.evidence_ids.map((evId) => (
                  <span
                    key={evId}
                    className="px-2 py-0.5 rounded bg-slate-800/90 text-teal-300 border border-slate-700 text-[10px] flex items-center gap-1"
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    {getEvidenceTitle(evId)}
                  </span>
                ))}
              </div>

              {action.caveats && (
                <span className="text-[10px] text-amber-300/90 italic flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-400 flex-shrink-0" />
                  {action.caveats}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Limitations & Medical Caveat Footer */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
          {recommendations.data_limitations.map((limit, i) => (
            <li key={i}>{limit}</li>
          ))}
        </ul>
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-500/80 flex-shrink-0" />
          <span>
            <strong>Public Health Disclaimer:</strong> {recommendations.medical_caveat}
          </span>
        </div>
      </div>
    </section>
  );
};
