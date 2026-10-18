import { useState, useCallback } from 'react';
import { humanizeText, getHumanizationStats } from '../utils/humanizer';

export default function Humanizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{ wordCount: number; changesMade: number; readability: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  }, []);

  const handleHumanize = useCallback(() => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing time for realistic UX
    setTimeout(() => {
      const result = humanizeText(input);
      setOutput(result);
      setStats(getHumanizationStats(input, result));
      setIsProcessing(false);
    }, 1500 + Math.random() * 1000);
  }, [input]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setStats(null);
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
                <p className="mt-4 text-sm text-gray-500 font-medium">Humanizing your content...</p>
                <p className="mt-1 text-xs text-gray-400">Bypassing AI detection patterns</p>
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
      <div className="flex items-center justify-center gap-4 mt-6">
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
      </div>

      {/* Stats */}
      {stats && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{stats.wordCount}</p>
            <p className="text-xs text-gray-500 mt-1">Words</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{stats.changesMade}</p>
            <p className="text-xs text-gray-500 mt-1">Changes Made</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{stats.readability}%</p>
            <p className="text-xs text-gray-500 mt-1">Readability Score</p>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-indigo-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Bypass Detection</h3>
          <p className="text-sm text-gray-500">Engineered to pass ZeroGPT, GPTZero, QuillBot and more</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-purple-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Instant Processing</h3>
          <p className="text-sm text-gray-500">Get humanized content in seconds with no wait time</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Natural Output</h3>
          <p className="text-sm text-gray-500">Maintains meaning while sounding authentically human</p>
        </div>
      </div>
    </div>
  );
}
