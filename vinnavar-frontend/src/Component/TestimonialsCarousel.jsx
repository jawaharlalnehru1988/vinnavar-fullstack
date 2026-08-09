import React, { useState, useEffect } from "react";
import { fetchTestimonials } from "../services/api";

const TestimonialsCarousel = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeState, setFadeState] = useState("fade-in"); // "fade-in" | "fade-out"
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const data = await fetchTestimonials();
                setTestimonials(data);
            } catch (err) {
                console.error("Error loading testimonials", err);
            } finally {
                setLoading(false);
            }
        };
        loadTestimonials();
    }, []);

    // Fade-in / Fade-out timer: Card stays for 5 seconds (5000ms), then 500ms fade transition
    useEffect(() => {
        if (testimonials.length <= 1 || isPaused) return;

        const displayTimer = setTimeout(() => {
            setFadeState("fade-out");
            const switchTimer = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
                setFadeState("fade-in");
            }, 400);

            return () => clearTimeout(switchTimer);
        }, 5000);

        return () => clearTimeout(displayTimer);
    }, [currentIndex, isPaused, testimonials.length]);

    const handleSelectCard = (targetIndex) => {
        if (targetIndex === currentIndex) return;
        setFadeState("fade-out");
        setTimeout(() => {
            setCurrentIndex(targetIndex);
            setFadeState("fade-in");
        }, 300);
    };

    const handlePrev = () => {
        const target = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        handleSelectCard(target);
    };

    const handleNext = () => {
        const target = (currentIndex + 1) % testimonials.length;
        handleSelectCard(target);
    };

    const getUserInitials = (name) => {
        if (!name || typeof name !== "string") return "VO";
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "VO";
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        const single = parts[0];
        return single.length >= 2 ? single.substring(0, 2).toUpperCase() : single.toUpperCase();
    };

    if (loading) {
        return (
            <div className="py-5 text-center bg-light">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading testimonials...</span>
                </div>
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    const currentItem = testimonials[currentIndex];

    const formatDate = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "";
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        } catch (e) {
            return "";
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "";
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        } catch (e) {
            return "";
        }
    };

    const formattedDateStr = formatDate(currentItem.createdAt);
    const formattedTimeStr = formatTime(currentItem.createdAt);

    return (
        <section
            className="py-5 bg-light position-relative overflow-hidden"
            style={{ backgroundColor: "#f8f9fa" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container py-3">
                {/* Section Header */}
                <div className="text-center mb-4">
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill mb-2" style={{ color: "#2d6a4f" }}>
                        💚 CUSTOMER REVIEWS & TESTIMONIALS
                    </span>
                    <h2 className="fw-bold text-dark fs-1 mb-2">What Our Happy Customers Say</h2>
                    <p className="text-muted fs-5 mb-0" style={{ maxWidth: "600px", margin: "0 auto" }}>
                        Real reviews and verified experiences from organic food buyers across India.
                    </p>
                </div>

                {/* Single Card Container with Fade In/Out Effect */}
                <div className="position-relative px-md-5 my-3" style={{ maxWidth: "720px", margin: "0 auto" }}>
                    {/* Navigation Buttons */}
                    <button
                        className="btn btn-white shadow-sm rounded-circle position-absolute top-50 start-0 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center"
                        style={{ width: "48px", height: "48px", backgroundColor: "#ffffff", borderColor: "#e9ecef" }}
                        onClick={handlePrev}
                        aria-label="Previous Testimonial"
                    >
                        <span className="fw-bold text-success fs-4">‹</span>
                    </button>

                    <button
                        className="btn btn-white shadow-sm rounded-circle position-absolute top-50 end-0 translate-middle-y z-3 d-none d-md-flex align-items-center justify-content-center"
                        style={{ width: "48px", height: "48px", backgroundColor: "#ffffff", borderColor: "#e9ecef" }}
                        onClick={handleNext}
                        aria-label="Next Testimonial"
                    >
                        <span className="fw-bold text-success fs-4">›</span>
                    </button>

                    {/* Single Card Box */}
                    <div
                        style={{
                            opacity: fadeState === "fade-in" ? 1 : 0,
                            transform: fadeState === "fade-in" ? "translateY(0) scale(1)" : "translateY(-12px) scale(0.97)",
                            transition: "opacity 0.45s ease-in-out, transform 0.45s ease-in-out"
                        }}
                    >
                        <div
                            className="card border-0 shadow-lg rounded-4 p-4 p-md-5 position-relative"
                            style={{
                                backgroundColor: "#ffffff",
                                boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                                borderLeft: "5px solid #2d6a4f"
                            }}
                        >
                            {/* Decorative Quote Watermark */}
                            <div
                                className="position-absolute text-success opacity-10 font-serif unselectable"
                                style={{
                                    top: "15px",
                                    right: "25px",
                                    fontSize: "80px",
                                    lineHeight: 1,
                                    pointerEvents: "none",
                                    userSelect: "none"
                                }}
                            >
                                “
                            </div>

                            {/* Header: Rating & Verified Badge */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="text-warning fs-5">
                                    {"★".repeat(currentItem.rating || 5)}
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1.5 rounded-pill" style={{ fontSize: "12px" }}>
                                    ✓ Verified Buyer
                                </span>
                            </div>

                            {/* Review Body */}
                            <p className="text-dark fs-5 fst-italic mb-4" style={{ lineHeight: "1.7", fontWeight: "450" }}>
                                "{currentItem.reviewText}"
                            </p>

                            {/* Footer Customer Info with Time, Place, Date */}
                            <div className="pt-3 border-top d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: "#2d6a4f",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {getUserInitials(currentItem.customerName)}
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: "17px" }}>
                                            {currentItem.customerName}
                                        </h5>
                                        <div className="d-flex flex-wrap align-items-center gap-2 text-muted" style={{ fontSize: "12.5px" }}>
                                            <span>📍 {currentItem.customerLocation || "India"}</span>
                                            {formattedDateStr && (
                                                <>
                                                    <span className="text-secondary">•</span>
                                                    <span>📅 {formattedDateStr}</span>
                                                </>
                                            )}
                                            {formattedTimeStr && (
                                                <>
                                                    <span className="text-secondary">•</span>
                                                    <span>🕒 {formattedTimeStr}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {currentItem.productName && (
                                    <span className="badge bg-light text-success border border-success border-opacity-25 fw-semibold px-3 py-2 rounded-pill align-self-start align-self-sm-center">
                                        🌾 {currentItem.productName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dot Indicators */}
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                className={`btn p-0 rounded-circle ${idx === currentIndex ? "bg-success" : "bg-secondary bg-opacity-25"}`}
                                style={{
                                    width: idx === currentIndex ? "28px" : "10px",
                                    height: "10px",
                                    borderRadius: "5px",
                                    transition: "all 0.4s ease"
                                }}
                                onClick={() => handleSelectCard(idx)}
                                aria-label={`Go to testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsCarousel;
