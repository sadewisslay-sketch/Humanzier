import { useState, useCallback } from 'react';
import { humanizeText, getHumanizationStats } from '../utils/humanizer';

export default function Humanizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{ wordCount: number; changesMade: number; readability: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [passCount, setPassCount] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  }, []);

  const runHumanizer = useCallback((multiPass = false) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setPassCount(prev => multiPass ? prev + 1 : 1);
    
    const steps = [
      'Analyzing AI patterns...',
      'Replacing formal vocabulary...',
      'Adding natural contractions...',
      'Restructuring sentences...',
      'Injecting human voice...',
      'Varying rhythm & flow...',
      'Breaking detection patterns...',
      'Finalizing output...',
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 250);
    
    setTimeout(() => {
      clearInterval(stepInterval);
      
      let result = humanizeText(input);
      
      // If multi-pass, run again on the output for more aggressive humanization
      if (multiPass) {
        result = humanizeText(result);
      }
      
      setOutput(result);
      setStats(getHumanizationStats(input, result));
      setIsProcessing(false);
      setProcessingStep('');
    }, 2200);
  }, [input]);

  const handleHumanize = useCallback(() => runHumanizer(false), [runHumanizer]);
  const handleRehumanize = useCallback(() => runHumanizer(true), [runHumanizer]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setStats(null);
    setPassCount(0);
  }, []);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Humanizer</h1>
        <p className="text-gray-500 text-lg">Transform AI-generated text into natural, undetectable human writing</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Input Text</label>
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
            placeholder="Paste your AI-generated text here..."
            className="flex-1 min-h-[300px] p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-gray-800 text-[15px] leading-relaxed placeholder:text-gray-400 bg-white shadow-sm"
          />
        </div>

        {/* Output Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Humanized Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[300px] p-4 border border-gray-200 rounded-xl bg-gray-50/50 relative overflow-auto">
            {isProcessing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                </div>
                <p className="mt-4 text-sm text-gray-700 font-medium">{processingStep || 'Humanizing your content...'}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {passCount > 1 ? `Pass ${passCount} — Extra deep humanization` : 'Applying 10 transformation layers'}
                </p>
              </div>
            ) : output ? (
              <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">{output}</p>
            ) : (
              <p className="text-gray-400 text-[15px]">Your humanized text will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        <button
          onClick={handleClear}
          disabled={!input && !output}
          className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Clear All
        </button>
        <button
          onClick={handleHumanize}
          disabled={!input.trim() || isProcessing}
          className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Humanize Text'
          )}
        </button>
        {output && (
          <button
            onClick={handleRehumanize}
            disabled={!input.trim() || isProcessing}
            className="px-6 py-3 text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-Humanize
            </span>
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{stats.wordCount}</p>
            <p className="text-xs text-gray-500 mt-1">Words</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{stats.changesMade}+</p>
            <p className="text-xs text-gray-500 mt-1">Changes Made</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-emerald-600">{stats.readability}%</p>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Human Score</p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mt-12">
        <h2 className="text-center text-lg font-bold text-gray-900 mb-6">How It Bypasses Detection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🔄', title: '10-Pass Engine', desc: 'Vocabulary, structure, rhythm, voice — all transformed' },
            { icon: '🎯', title: 'Pattern Breaking', desc: 'Destroys AI sentence patterns detectors look for' },
            { icon: '💬', title: 'Natural Voice', desc: 'Adds contractions, fillers, and human speech patterns' },
            { icon: '📊', title: 'Burstiness Injection', desc: 'Varies sentence length to mimic human writing rhythm' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-semibold text-gray-900 mt-2 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Re-humanize tip */}
      {output && passCount < 2 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">💡 Tip:</span> If the output still feels AI-like, click <strong>Re-Humanize</strong> for an extra-deep transformation pass.
          </p>
        </div>
      )}
    </div>
  );
}
