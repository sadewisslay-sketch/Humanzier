import { useState, useCallback } from 'react';
import { detectAI } from '../utils/detector';

interface DetectionResult {
  score: number;
  classification: 'human' | 'mixed' | 'ai-generated';
  signals: {
    type: string;
    label: string;
    severity: 'low' | 'medium' | 'high';
    detail: string;
  }[];
}

export default function Detector() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const detectionResult = detectAI(input);
      setResult(detectionResult);
      setIsAnalyzing(false);
    }, 2000 + Math.random() * 1000);
  }, [input]);



  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
  }, []);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  const getScoreColor = (score: number) => {
    if (score >= 65) return 'text-red-600';
    if (score >= 35) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 65) return 'from-red-500 to-red-600';
    if (score >= 35) return 'from-amber-500 to-amber-600';
    return 'from-emerald-500 to-emerald-600';
  };

  const getScoreRing = (score: number) => {
    if (score >= 65) return 'ring-red-500/20';
    if (score >= 35) return 'ring-amber-500/20';
    return 'ring-emerald-500/20';
  };

  const getClassificationLabel = (classification: string) => {
    switch (classification) {
      case 'ai-generated': return 'AI Generated';
      case 'mixed': return 'Mixed (Human + AI)';
      case 'human': return 'Human Written';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Detector</h1>
        <p className="text-gray-500 text-lg">Analyze text to determine if it was written by AI or a human</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Text to Analyze</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{wordCount} words</span>
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text you want to check for AI generation..."
            className="flex-1 min-h-[350px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-gray-800 text-[15px] leading-relaxed placeholder:text-gray-400 bg-white shadow-sm"
          />
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handleClear}
              disabled={!input && !result}
              className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Detect AI Content'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[350px] flex flex-col">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Analysis Results</label>
            
            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-gray-500 font-medium">Analyzing patterns...</p>
                <p className="mt-1 text-xs text-gray-400">Checking perplexity, burstiness & more</p>
              </div>
            ) : result ? (
              <div className="flex-1 flex flex-col">
                {/* Score Display */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${getScoreBg(result.score)} ring-4 ${getScoreRing(result.score)} mb-3`}>
                    <span className="text-2xl font-bold text-white">{result.score}%</span>
                  </div>
                  <p className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                    {getClassificationLabel(result.classification)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {result.score >= 65 
                      ? 'High probability of AI generation' 
                      : result.score >= 35 
                        ? 'Mixed signals detected' 
                        : 'Likely written by a human'}
                  </p>
                </div>

                {/* Signals */}
                {result.signals.length > 0 ? (
                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Detected Signals</p>
                    {result.signals.map((signal, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${getSeverityColor(signal.severity)}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{signal.label}</span>
                          <span className="text-[10px] uppercase font-bold opacity-70">{signal.severity}</span>
                        </div>
                        <p className="text-xs opacity-80">{signal.detail}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 bg-emerald-50 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">No AI signals detected</p>
                      <p className="text-xs text-gray-400">Text appears to be human-written</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Results will appear here</p>
                  <p className="text-xs text-gray-300 mt-1">Paste text and click analyze</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">How Our Detection Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Perplexity Analysis</h3>
            <p className="text-xs text-gray-500">Measures how predictable word choices are — AI tends to be too consistent</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Burstiness Detection</h3>
            <p className="text-xs text-gray-500">Analyzes sentence length variation — humans write with more natural rhythm</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Pattern Recognition</h3>
            <p className="text-xs text-gray-500">Identifies vocabulary and structures commonly produced by language models</p>
          </div>
        </div>
      </div>
    </div>
  );
}
