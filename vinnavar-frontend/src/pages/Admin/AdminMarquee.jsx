import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import Swal from "sweetalert2";

const PRESETS = [
    {
        title: "🌱 Pure Organic & Free Delivery",
        text: "🌱 100% Certified Pure Natural Organic Staples & Cold-Pressed Oils delivered directly to your doorstep! 🚚 Free Doorstep Delivery Across India"
    },
    {
        title: "🌾 Farm-Fresh Heritage Rice & Cold-Pressed Oils",
        text: "🌾 Farm-Fresh Traditional Heritage Rice (Mapillai Samba, Karuppu Kavuni, Seeraga Samba) & Cold-Pressed Wood-Chekku Oils! 🚚 Doorstep Delivery Across India"
    },
    {
        title: "🎉 Special Festive Season Offer",
        text: "🎉 Festival Special: 100% Pure Chemical-Free Organic Groceries with Zero Extra Shipping Charges! Order Online Today 🚚"
    }
];

const AdminMarquee = () => {
    const [marqueeText, setMarqueeText] = useState("");
    const [initialText, setInitialText] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadMarqueeSetting = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/settings`);
            if (res.ok) {
                const data = await res.json();
                const text = data.top_marquee || data.header_announcement || "🌱 100% Certified Pure Natural Organic Staples & Cold-Pressed Oils delivered directly to your doorstep! 🚚 Free Doorstep Delivery Across India";
                setMarqueeText(text);
                setInitialText(text);
            }
        } catch (err) {
            console.error("Failed to load marquee settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMarqueeSetting();
    }, []);

    const handleSave = async () => {
        if (!marqueeText.trim()) {
            Swal.fire("Warning", "Marquee text cannot be empty.", "warning");
            return;
        }

        setSaving(true);
        try {
            // Update both top_marquee and header_announcement for maximum compatibility
            const res1 = await fetch(`${API_BASE_URL}/admin/settings/top_marquee`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: marqueeText.trim(),
                    description: "Top Header Running Marquee Text",
                    group: "LABELS"
                })
            });

            await fetch(`${API_BASE_URL}/admin/settings/header_announcement`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: marqueeText.trim(),
                    description: "Top Header Banner Text",
                    group: "LABELS"
                })
            });

            if (res1.ok) {
                setInitialText(marqueeText);
                Swal.fire({
                    icon: "success",
                    title: "Published Successfully!",
                    text: "Top Marquee announcement has been updated live across the entire website.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                throw new Error("Server responded with error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update top marquee. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleInsertEmoji = (emoji) => {
        setMarqueeText((prev) => prev + " " + emoji + " ");
    };

    if (loading) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto my-6">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 font-semibold text-sm">Loading Top Marquee settings...</p>
            </div>
        );
    }

    const hasChanges = marqueeText.trim() !== initialText.trim();

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-2">
                            Header Navigation Bar
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                            <span>📢</span> Top Marquee Announcement
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Directly control and update the scrolling ticker banner displayed at the very top of the store website.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 self-start sm:self-auto ${
                            hasChanges
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-600/30"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        {saving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span>Publishing...</span>
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                <span>Publish Marquee Live</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Store Preview (Real-Time)
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">Scroll Speed: Normal</span>
                </div>

                <div className="w-full py-2.5 px-4 bg-emerald-800 text-white font-medium text-xs tracking-wide rounded-2xl overflow-hidden shadow-inner border border-emerald-700">
                    {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
                    <marquee behavior="scroll" direction="left" scrollamount="6" className="m-0 align-middle">
                        {marqueeText || "Enter text below to preview..."}
                    </marquee>
                </div>
            </div>

            {/* EDITING FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                            Marquee Running Message
                        </label>
                        <span className="text-xs font-bold text-slate-400">
                            {marqueeText.length} characters
                        </span>
                    </div>

                    <textarea
                        rows={3}
                        value={marqueeText}
                        onChange={(e) => setMarqueeText(e.target.value)}
                        placeholder="e.g. 🌱 100% Certified Pure Natural Organic Staples & Cold-Pressed Oils delivered directly to your doorstep! 🚚 Free Doorstep Delivery Across India"
                        className="w-full p-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 font-medium text-sm transition-all"
                    />
                </div>

                {/* Quick Emoji Helper */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Insert Popular Icons & Emojis
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {["🌱", "🚚", "🌾", "🌿", "⭐", "✨", "🛍️", "🛡️", "📦", "🔥", "📞"].map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleInsertEmoji(emoji)}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-base flex items-center justify-center transition-all active:scale-95"
                                title={`Insert ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Presets */}
                <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
                        ⚡ Quick Templates & Inspiration
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PRESETS.map((preset, idx) => (
                            <div
                                key={idx}
                                onClick={() => setMarqueeText(preset.text)}
                                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-all group"
                            >
                                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 mb-1">
                                    {preset.title}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {preset.text}
                                </div>
                                <div className="mt-2 text-[10px] font-bold text-emerald-600 group-hover:underline">
                                    Apply Template ➔
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={loadMarqueeSetting}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        ↺ Reset to Current Published
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 ${
                            hasChanges
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 shadow-emerald-600/30"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >
                        {saving ? "Publishing..." : "💾 Save & Publish Marquee"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMarquee;
