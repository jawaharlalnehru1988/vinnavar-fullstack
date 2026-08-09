import React, { useState, useRef } from "react";
import { getImageUrl } from "../services/api";

const AmazonProductMagnifier = ({
    imageUrl,
    altText = "Product Image",
    productName = "Product",
    zoomLevel = 2.8,
    galleryImages = [],
    activeImageIndex = 0,
    onPrevImage,
    onNextImage,
    onOpenModal,
    featured = false,
    videoUrl,
    onOpenVideo
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const fullImageUrl = getImageUrl(imageUrl);

    const LENS_SIZE = 140; // width and height of the magnifying lens in px

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate cursor position inside the image container
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Calculate top-left corner of lens box
        let lensX = clientX - LENS_SIZE / 2;
        let lensY = clientY - LENS_SIZE / 2;

        // Constrain lens within image box
        lensX = Math.max(0, Math.min(lensX, rect.width - LENS_SIZE));
        lensY = Math.max(0, Math.min(lensY, rect.height - LENS_SIZE));

        // Percentage for background-position of zoomed preview
        const bgPercentX = (lensX / (rect.width - LENS_SIZE)) * 100;
        const bgPercentY = (lensY / (rect.height - LENS_SIZE)) * 100;

        setLensPos({ x: lensX, y: lensY });
        setBgPos({ x: bgPercentX, y: bgPercentY });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="relative flex-1 bg-white rounded-3xl p-4 sm:p-6 h-[380px] sm:h-[460px] flex items-center justify-center border border-slate-200/80 shadow-sm group">
            
            {/* BADGES */}
            {featured && (
                <span className="z-10 absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    🌱 Organic Best Seller
                </span>
            )}

            {galleryImages.length > 0 && (
                <span className="z-10 absolute top-4 right-4 bg-slate-900/70 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                    {activeImageIndex + 1} / {galleryImages.length}
                </span>
            )}

            {/* MAIN IMAGE CONTAINER WITH HOVER LENS */}
            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center cursor-crosshair overflow-hidden select-none"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={onOpenModal}
            >
                <img
                    src={fullImageUrl}
                    alt={altText}
                    className="max-h-full max-w-full object-contain pointer-events-none"
                />

                {/* AMAZON LENS HIGHLIGHT BOX */}
                {isHovered && (
                    <div
                        className="absolute pointer-events-none border-2 border-emerald-500 bg-emerald-500/20 rounded-lg shadow-lg z-20 transition-transform duration-75 ease-out"
                        style={{
                            width: `${LENS_SIZE}px`,
                            height: `${LENS_SIZE}px`,
                            left: `${lensPos.x}px`,
                            top: `${lensPos.y}px`
                        }}
                    >
                        <div className="w-full h-full border border-white/40 rounded-md" />
                    </div>
                )}
            </div>

            {/* AMAZON FLOATING MAGNIFIED ZOOM PANE (Appears on Hover) */}
            {isHovered && (
                <div
                    className="hidden lg:block fixed top-24 left-[54%] z-50 w-[520px] h-[520px] bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/30 overflow-hidden pointer-events-none transition-opacity duration-200 ease-in-out"
                    style={{
                        backgroundImage: `url(${fullImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${zoomLevel * 100}%`,
                        backgroundPosition: `${bgPos.x}% ${bgPos.y}%`
                    }}
                >
                    <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-500/30 shadow-md">
                        🔍 Amazon High-Res Lens Zoom ({zoomLevel}x)
                    </div>
                </div>
            )}

            {/* MAGNIFY HINT BADGE & FULLSCREEN OPTION */}
            <button
                type="button"
                onClick={onOpenModal}
                className="z-10 absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 hover:scale-105 transition-all"
            >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                Hover to Magnify / Click Lightbox
            </button>

            {/* CAROUSEL ARROWS */}
            {galleryImages.length > 1 && (
                <>
                    <button
                        type="button"
                        className="z-10 absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center font-bold text-lg hover:scale-110 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevImage();
                        }}
                        title="Previous Image"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="z-10 absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center font-bold text-lg hover:scale-110 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNextImage();
                        }}
                        title="Next Image"
                    >
                        ›
                    </button>
                </>
            )}

            {/* VIDEO BUTTON */}
            {videoUrl && (
                <button
                    type="button"
                    className="z-10 absolute bottom-4 left-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenVideo();
                    }}
                >
                    ▶ Watch Video
                </button>
            )}
        </div>
    );
};

export default AmazonProductMagnifier;
