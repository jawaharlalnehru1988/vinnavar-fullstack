import React, { useState } from "react";
import { Link } from "react-router-dom";

const COURIER_PROVIDERS = [
  {
    id: "amazon",
    name: "Amazon Shipping",
    logoText: "📦",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    url: "https://track.amazon.in",
    searchUrl: (awb) => `https://track.amazon.in/tracking/${encodeURIComponent(awb)}`,
    description: "Track packages shipped via Amazon Shipping & Logistics network.",
  },
  {
    id: "xpressbees",
    name: "Xpressbees Courier",
    logoText: "🐝",
    badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
    url: "https://www.xpressbees.com/track",
    searchUrl: (awb) => `https://www.xpressbees.com/shipment/tracking?awb=${encodeURIComponent(awb)}`,
    description: "Fast express delivery status tracking across India.",
  },
  {
    id: "delhivery",
    name: "Delhivery Express",
    logoText: "🚚",
    badgeBg: "bg-red-100 text-red-900 border-red-300",
    url: "https://www.delhivery.com/tracking",
    searchUrl: (awb) => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`,
    description: "Real-time location updates for Delhivery courier services.",
  },
  {
    id: "indiapost",
    name: "India Post",
    logoText: "📮",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
    url: "https://www.indiapost.gov.in/",
    searchUrl: (awb) => `https://www.indiapost.gov.in/`,
    description: "Official India Post consignment tracking portal.",
  },
];

const TrackOrder = () => {
  const [selectedCourier, setSelectedCourier] = useState(COURIER_PROVIDERS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleOpenTracking = (e) => {
    e?.preventDefault();
    const targetUrl = trackingNumber.trim()
      ? selectedCourier.searchUrl(trackingNumber.trim())
      : selectedCourier.url;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const getDirectUrl = (provider) => {
    return trackingNumber.trim()
      ? provider.searchUrl(trackingNumber.trim())
      : provider.url;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-slate-500 space-x-2">
          <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Track Order</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              Live Order Tracking
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Track Your Package & Shipment
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto">
              Enter your AWB / Tracking number or select your courier partner below to open the official live tracking page in one click.
            </p>
          </div>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100">
          <form onSubmit={handleOpenTracking} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label htmlFor="trackingInput" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Enter AWB / Tracking ID / Order Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 text-lg">🔍</span>
                <input
                  type="text"
                  id="trackingInput"
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. SF123456789IN / 14002938102"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                {trackingNumber && (
                  <button
                    type="button"
                    className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setTrackingNumber("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 active:scale-95"
            >
              <span>Track on {selectedCourier.name}</span>
              <span className="text-lg">↗</span>
            </button>
          </form>
        </div>

        {/* Courier Provider Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Select Logistics / Courier Provider
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COURIER_PROVIDERS.map((provider) => {
              const isSelected = selectedCourier.id === provider.id;
              const directUrl = getDirectUrl(provider);
              return (
                <div
                  key={provider.id}
                  onClick={() => setSelectedCourier(provider)}
                  className={`group relative bg-white rounded-3xl p-6 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-6 ${
                    isSelected
                      ? "border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1"
                      : "border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                        isSelected ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
                      }`}>
                        {provider.logoText}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${provider.badgeBg}`}>
                        {isSelected ? "Active" : "Select"}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {provider.description}
                      </p>
                    </div>
                  </div>

                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Go to {provider.name} Tracking</span>
                    <span>↗</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Redirect Banner Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-md border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔗
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Direct Official Tracking Portal Access
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Logistics companies (Amazon Shipping, Xpressbees, Delhivery) enforce security restrictions (<code>X-Frame-Options</code>). Click below to view live shipment updates directly on the official <strong>{selectedCourier.name}</strong> portal.
            </p>
          </div>
          <div>
            <a
              href={getDirectUrl(selectedCourier)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-95"
            >
              <span>Open {selectedCourier.name} Portal in New Tab</span>
              <span className="text-lg">↗</span>
            </a>
          </div>
        </div>

        {/* FAQs & Quick Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="text-2xl">📩</div>
            <h4 className="font-bold text-slate-900 text-sm">Where is my AWB Number?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check your SMS or order confirmation email sent right after dispatch. The AWB / Tracking number is listed next to your delivery partner details.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="text-2xl">⚡</div>
            <h4 className="font-bold text-slate-900 text-sm">Real-Time Transit Updates</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Logistics status updates automatically every few hours as your organic products move through regional fulfillment hubs.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="text-2xl">🎧</div>
            <h4 className="font-bold text-slate-900 text-sm">Need Delivery Help?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If your order status hasn't updated in 48 hours, reach out to our Vinnavar support desk or contact customer service via WhatsApp.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
