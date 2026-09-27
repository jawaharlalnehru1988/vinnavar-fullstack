import React, { useState } from "react";

const AdminAnalytics = () => {
    const analyticsUrl = "https://analytics.askharekrishna.com/share/vinnavar";
    const [isLoading, setIsLoading] = useState(true);
    const [iframeKey, setIframeKey] = useState(Date.now());
    const [copied, setCopied] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setIframeKey(Date.now());
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(analyticsUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>📈</span> Live Store Analytics
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
                            Real-time
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                        Audience statistics, real-time visitors, page views, locations, devices, and traffic sources for{" "}
                        <span className="font-semibold text-slate-700">vinnavar.com</span>
                    </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl border border-slate-300 shadow-sm transition-all duration-150 flex items-center gap-1.5"
                        title="Copy direct share URL"
                    >
                        <span>{copied ? "✓" : "📋"}</span>
                        <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5"
                    >
                        <span>🔄</span>
                        <span>Refresh Data</span>
                    </button>

                    <a
                        href={analyticsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5"
                    >
                        <span>↗️</span>
                        <span>Open in New Tab</span>
                    </a>
                </div>
            </div>

            {/* Quick status banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                    <span>
                        Connected to <strong>AskHareKrishna Analytics Cloud</strong> (Privacy-friendly Umami engine). Data is updated automatically as customers browse.
                    </span>
                </div>
                <div className="text-slate-500 text-[11px] font-mono">
                    Target: <span className="text-emerald-700 font-semibold">vinnavar.com</span>
                </div>
            </div>

            {/* Embed Container with Loading State */}
            <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden min-h-[820px] transition-all">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-600 font-semibold text-xs">Loading analytics dashboard...</span>
                    </div>
                )}

                <iframe
                    key={iframeKey}
                    src={analyticsUrl}
                    title="Vinnavar Analytics Dashboard"
                    className="w-full h-[850px] border-0"
                    onLoad={() => setIsLoading(false)}
                    allow="clipboard-write"
                />
            </div>
        </div>
    );
};

export default AdminAnalytics;
