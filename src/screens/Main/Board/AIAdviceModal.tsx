import React from 'react';
import { X, AlertTriangle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { PriorityRecommendation } from '../../../types/api';
import { AIAdviceModalProps } from '../../../types/api';

const PriorityBadge: React.FC<{ priority: PriorityRecommendation }> = ({ priority }) => {
  const colors = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  const icons = {
    High: '🔥',
    Medium: '⚡',
    Low: '📋'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colors[priority.level]}`}>
      <span>{icons[priority.level]}</span>
      <span className="font-medium capitalize">{priority.level} Priority</span>
      <span className="text-xs">({priority.estimated_days.toFixed(1)} days)</span>
    </div>
  );
};

const AdviceSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  items: string[];
  variant?: 'default' | 'steps';
}> = ({ icon, title, items, variant = 'default' }) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      {variant === 'steps' ? (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-gray-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export const AIAdviceModal: React.FC<AIAdviceModalProps> = ({ advice, onClose, taskName }) => {
  if (!advice.success || !advice.advice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AI Advice Error</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {advice.error || 'Failed to generate AI advice. Please try again later.'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { advice: aiAdvice } = advice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">🤖 AI Task Advice</h2>
            <p className="text-sm text-gray-600 mt-1 truncate">{taskName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Status and Priority */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm text-gray-600">Predicted Status:</span>
                <p className="font-semibold text-lg text-gray-800">{aiAdvice.status_prediction}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Confidence:</span>
                <p className="font-semibold text-lg text-gray-800">
                  {(aiAdvice.confidence_score * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <PriorityBadge priority={aiAdvice.priority_recommendation} />
            <p className="text-sm text-gray-600 mt-2">{aiAdvice.priority_recommendation.message}</p>
          </div>

          {/* Advice Sections */}
          <AdviceSection
            icon={<Lightbulb className="w-5 h-5 text-yellow-500" />}
            title="Actionable Suggestions"
            items={aiAdvice.actionable_suggestions}
          />

          <AdviceSection
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
            title="Risk Factors"
            items={aiAdvice.risk_factors}
          />

          <AdviceSection
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            title="Optimization Tips"
            items={aiAdvice.optimization_tips}
          />

          <AdviceSection
            icon={<Target className="w-5 h-5 text-blue-500" />}
            title="Next Steps"
            items={aiAdvice.next_steps}
            variant="steps"
          />

          {/* Metadata */}
          {advice.metadata && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Generated on {new Date(advice.metadata.generated_at).toLocaleString()}
                {advice.metadata.model_version && ` • Model v${advice.metadata.model_version}`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};