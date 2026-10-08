import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl, fetchProductReviews, submitProductReview, uploadReviewImage, uploadReviewImages, updateProductReview, getCartId } from "../../services/api";
import AmazonProductMagnifier from "../../Component/AmazonProductMagnifier";
import { useTranslation } from "react-i18next";
import {
    WhatsappShareButton, WhatsappIcon,
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, XIcon,
    TelegramShareButton, TelegramIcon,
    LinkedinShareButton, LinkedinIcon,
    EmailShareButton, EmailIcon
} from "react-share";
import { calculateUSP } from "../../utils/usp";
export { calculateUSP };

const amazonpay = getImageUrl("/media/site/amazonpay.svg");
const gpay = getImageUrl("/media/site/gpay.svg");
const paytm = getImageUrl("/media/site/paytm.svg");

const renderBenefitsContent = (rawBenefits) => {
    if (!rawBenefits) return null;

    // Split by 4 or more underscores or dashes, which serve as section dividers
    const rawSections = rawBenefits
        .split(/(?:_{4,}|\-{4,})/)
        .map((s) => s.trim())
        .filter(Boolean);

    if (rawSections.length === 0) return null;

    return (
        <div className="space-y-6">
            {rawSections.map((sec, sIdx) => {
                const lines = sec
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean);

                if (lines.length === 0) return null;

                const firstLine = lines[0];
                // Check if first line is a title (short, does not start with bullet characters, and does not have colon)
                const isHeading =
                    !/^[\uFFFD\u00A0\t•\-\*]/.test(firstLine) &&
                    firstLine.length < 60 &&
                    !firstLine.includes(":");
                const heading = isHeading ? firstLine : null;
                const bodyLines = isHeading ? lines.slice(1) : lines;

                return (
                    <div key={sIdx} className="space-y-3">
                        {/* Clear visual divider between sections on its own line */}
                        {sIdx > 0 && (
                            <div className="py-2">
                                <hr className="border-t border-emerald-200/90" />
                            </div>
                        )}

                        {heading && (
                            <h4 className="text-sm sm:text-base font-extrabold text-emerald-900 tracking-wide uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                <span>{heading}</span>
                            </h4>
                        )}

                        <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                            {bodyLines.map((line, lIdx) => {
                                const cleanLine = line
                                    .replace(/^[\uFFFD\u00A0\t•\-\*]+\s*/, "")
                                    .replace(/[\uFFFD\u00A0]/g, "–")
                                    .replace(/(?:_{3,}|\-{3,})/g, "")
                                    .trim();

                                if (!cleanLine) return null;

                                const colonIndex = cleanLine.indexOf(":");
                                if (colonIndex > 0 && colonIndex < 40) {
                                    const keyPart = cleanLine.slice(0, colonIndex).trim();
                                    const valPart = cleanLine.slice(colonIndex + 1).trim();

                                    return (
                                        <div key={lIdx} className="flex items-start gap-2.5">
                                            <span className="text-emerald-600 font-bold mt-1 text-xs shrink-0">●</span>
                                            <p className="flex-1">
                                                <span className="font-bold text-slate-900">{keyPart}:</span>{" "}
                                                <span className="text-slate-700">{valPart}</span>
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={lIdx} className="flex items-start gap-2.5">
                                        <span className="text-emerald-600 font-bold mt-1 text-xs shrink-0">●</span>
                                        <p className="flex-1 text-slate-700">{cleanLine}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ProductDetails = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Zoom Lightbox State
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Reviews State
    const [reviewData, setReviewData] = useState({ totalReviews: 0, averageRating: 5.0, ratingBreakdown: {}, reviews: [] });
    const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
    const [reviewImagePreview, setReviewImagePreview] = useState(null);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: "",
        comment: "",
        customerName: "",
        customerLocation: "",
        customerPhone: "",
        imageFiles: [],
        imagePreviews: [],
        submitting: false
    });

    const [showEditReviewModal, setShowEditReviewModal] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        rating: 5,
        title: "",
        comment: "",
        customerName: "",
        customerLocation: "",
        customerPhone: "",
        imageFiles: [],
        imagePreviews: [],
        existingImageUrls: [],
        submitting: false
    });

    const currentUser = (() => {
        try {
            const saved = localStorage.getItem("vinnavar_customer");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    })();

    useEffect(() => {
        try {
            const saved = localStorage.getItem("vinnavar_customer");
            if (saved) {
                const user = JSON.parse(saved);
                setNewReview(prev => ({
                    ...prev,
                    customerName: user.fullName || user.name || "",
                    customerPhone: user.mobileNumber || "",
                }));
            }
        } catch (e) {}
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    const defVar = data.variants?.find((v) => v.default) || data.variants?.[0] || null;
                    setSelectedVariant(defVar);
                } else {
                    const allRes = await fetch(`${API_BASE_URL}/products`);
                    if (allRes.ok) {
                        const allData = await allRes.json();
                        const found = allData.find(
                            (p) => p.slug === slug || p.id === parseInt(slug)
                        );
                        if (found) {
                            setProduct(found);
                            const default5kg = found.variants?.find((v) => v.variantName?.toLowerCase().replace(/\s+/g, "") === "5kg");
                            const defVar = default5kg || found.variants?.find((v) => v.default || v.isDefault) || found.variants?.[0] || null;
                            setSelectedVariant(defVar);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching product details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (product?.id) {
            fetchProductReviews(product.id)
                .then((data) => setReviewData(data || { totalReviews: 0, averageRating: 5.0, ratingBreakdown: {}, reviews: [] }))
                .catch((err) => console.error("Failed to load reviews:", err));
        }
    }, [product?.id]);

    const handleProductReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) {
            Swal.fire("Missing Field", "Please write your review comment", "warning");
            return;
        }

        setNewReview(prev => ({ ...prev, submitting: true }));
        try {
            let uploadedImageUrl = null;
            let uploadedImageUrls = [];
            
            if (newReview.imageFiles && newReview.imageFiles.length > 0) {
                const uploadRes = await uploadReviewImages(newReview.imageFiles);
                uploadedImageUrls = uploadRes.imageUrls || [];
                if (uploadedImageUrls.length > 0) {
                    uploadedImageUrl = uploadedImageUrls[0];
                }
            }

            const currentUser = (() => {
                try {
                    const saved = localStorage.getItem("vinnavar_customer");
                    return saved ? JSON.parse(saved) : null;
                } catch (e) {
                    return null;
                }
            })();

            await submitProductReview({
                productId: product.id,
                productName: product.name,
                customerName: newReview.customerName || currentUser?.fullName || currentUser?.name || "Organic Enthusiast",
                customerLocation: newReview.customerLocation || "India",
                customerPhone: newReview.customerPhone || currentUser?.mobileNumber || "",
                rating: newReview.rating,
                reviewTitle: newReview.title,
                reviewComment: newReview.comment,
                imageUrl: uploadedImageUrl,
                imageUrls: uploadedImageUrls,
                verifiedPurchase: true,
                status: "APPROVED"
            });

            Swal.fire({
                title: "Review Posted! ⭐",
                text: "Thank you for sharing your feedback and photo!",
                icon: "success",
                confirmButtonColor: "#047857"
            });
            setShowWriteReviewModal(false);
            setNewReview(prev => ({
                ...prev,
                rating: 5,
                title: "",
                comment: "",
                imageFiles: [],
                imagePreviews: [],
                submitting: false
            }));

            const updated = await fetchProductReviews(product.id);
            setReviewData(updated);
        } catch (err) {
            console.error("Review submission error:", err);
            Swal.fire("Error", err.message || "Failed to submit review", "error");
        } finally {
            setNewReview(prev => ({ ...prev, submitting: false }));
        }
    };

    const openEditModal = (rev) => {
        setEditData({
            id: rev.id,
            rating: rev.rating || 5,
            title: rev.reviewTitle || "",
            comment: rev.reviewComment || "",
            customerName: rev.customerName || "",
            customerLocation: rev.customerLocation || "",
            customerPhone: rev.customerPhone || "",
            existingImageUrls: rev.imageUrls && rev.imageUrls.length > 0 ? rev.imageUrls : (rev.imageUrl ? [rev.imageUrl] : []),
            imageFiles: [],
            imagePreviews: [],
            submitting: false
        });
        setShowEditReviewModal(true);
    };

    const handleEditReviewSubmit = async (e) => {
        e.preventDefault();
        if (!editData.comment.trim()) {
            Swal.fire("Missing Field", "Please write your review comment", "warning");
            return;
        }

        setEditData(prev => ({ ...prev, submitting: true }));
        try {
            let finalImageUrls = [...editData.existingImageUrls];

            if (editData.imageFiles && editData.imageFiles.length > 0) {
                const uploadRes = await uploadReviewImages(editData.imageFiles);
                if (uploadRes.imageUrls && uploadRes.imageUrls.length > 0) {
                    finalImageUrls = [...finalImageUrls, ...uploadRes.imageUrls];
                }
            }

            await updateProductReview(editData.id, {
                rating: editData.rating,
                reviewTitle: editData.title,
                reviewComment: editData.comment,
                customerName: editData.customerName,
                customerLocation: editData.customerLocation,
                customerPhone: editData.customerPhone,
                imageUrls: finalImageUrls,
                imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : null
            });

            Swal.fire({
                title: "Review Updated! ⭐",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
            setShowEditReviewModal(false);
            
            const updated = await fetchProductReviews(product.id);
            setReviewData(updated);
        } catch (err) {
            console.error("Edit submission error:", err);
            Swal.fire("Error", err.message || "Failed to update review", "error");
        } finally {
            setEditData(prev => ({ ...prev, submitting: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <h5 className="mt-4 font-medium text-slate-600">Loading product details...</h5>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-20 px-4 text-center">
                <h3 className="text-2xl font-bold text-red-600">Product Not Found</h3>
                <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
                <Link to="/Product" className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md">
                    Back to Store
                </Link>
            </div>
        );
    }

    const galleryImages = (product.imageUrls && product.imageUrls.length > 0)
        ? product.imageUrls
        : (product.imageUrl ? [product.imageUrl] : []);

    const activeImageUrl = galleryImages[activeImageIndex] || product.imageUrl || "/media/site/placeholder.png";

    const handlePrevImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleNextImage = () => {
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleAddToCart = async (buyNow = false) => {
        if (!selectedVariant) return;

        const cartId = getCartId();
        setAddingToCart(true);
        try {
            const res = await fetch(`${API_BASE_URL}/cart/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartId: cartId,
                    productId: product.id,
                    variantId: selectedVariant.id,
                    quantity: quantity
                })
            });

            if (res.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
                if (buyNow) {
                    navigate("/ProductCheckOut");
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Added to Cart!",
                        text: `${product.name} (${selectedVariant.variantName}) x${quantity} added to your cart.`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } else {
                Swal.fire("Cart Error", "Failed to add product to cart.", "error");
            }
        } catch (err) {
            Swal.fire("Cart Error", "Error adding item to cart.", "error");
        } finally {
            setAddingToCart(false);
        }
    };

    // Zoom Lightbox Handlers
    const openZoomModal = () => {
        setShowZoomModal(true);
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setZoomScale((prev) => Math.min(prev + 0.5, 3.5));
    };

    const handleZoomOut = () => {
        setZoomScale((prev) => {
            const next = Math.max(prev - 0.5, 1);
            if (next === 1) setPanOffset({ x: 0, y: 0 });
            return next;
        });
    };

    const handleResetZoom = () => {
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleToggleDoubleTapZoom = () => {
        if (zoomScale > 1) {
            handleResetZoom();
        } else {
            setZoomScale(2.2);
        }
    };

    const handleMouseDown = (e) => {
        if (zoomScale <= 1) return;
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    };

    const handleMouseMove = (e) => {
        if (!isDragging || zoomScale <= 1) return;
        setPanOffset({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (zoomScale <= 1 || e.touches.length !== 1) return;
        setIsDragging(true);
        dragStartRef.current = {
            x: e.touches[0].clientX - panOffset.x,
            y: e.touches[0].clientY - panOffset.y
        };
    };

    const handleTouchMove = (e) => {
        if (!isDragging || zoomScale <= 1 || e.touches.length !== 1) return;
        setPanOffset({
            x: e.touches[0].clientX - dragStartRef.current.x,
            y: e.touches[0].clientY - dragStartRef.current.y
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const currentPrice = selectedVariant?.discountPrice || selectedVariant?.price || 0;
    const mrpPrice = selectedVariant?.price || 0;
    const hasDiscount = selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.price;
    const discountPercent = hasDiscount
        ? Math.round(((mrpPrice - currentPrice) / mrpPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50/70 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* BREADCRUMB */}
                <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-4 overflow-x-auto pb-1 scrollbar-none">
                    <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <span className="text-slate-300">/</span>
                    <Link to="/Product" className="hover:text-emerald-600 transition-colors">{t("nav_shop_catalog") || "Shop"}</Link>
                    {product.category && (
                        <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-600 font-medium">{product.category.nameTranslations?.[currentLang] || product.category.name}</span>
                        </>
                    )}
                    <span className="text-slate-300">/</span>
                    <span className="text-emerald-700 font-bold truncate max-w-[200px] sm:max-w-xs">{product.nameTranslations?.[currentLang] || product.name}</span>
                </nav>

                {/* MAIN PRODUCT CARD (50-50 SPLIT FOR IMAGE AND DETAILS) */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        
                        {/* LEFT COLUMN: 50% SCREEN IMAGE GALLERY */}
                        <div className="space-y-4">
                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                
                                {/* THUMBNAILS LIST */}
                                {galleryImages.length > 1 && (
                                    <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[500px] pb-1 sm:pb-0 scrollbar-thin">
                                        {galleryImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-white transition-all shrink-0 overflow-hidden ${
                                                    activeImageIndex === idx ? "border-emerald-600 shadow-sm ring-1 ring-emerald-600/30" : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                                                }`}
                                                onClick={() => setActiveImageIndex(idx)}
                                                onMouseEnter={() => setActiveImageIndex(idx)}
                                            >
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* MAIN FEATURED IMAGE VIEW WITH AMAZON LENS MAGNIFIER */}
                                <AmazonProductMagnifier
                                    imageUrl={activeImageUrl}
                                    altText={product.name}
                                    productName={product.name}
                                    zoomLevel={2.8}
                                    galleryImages={galleryImages}
                                    activeImageIndex={activeImageIndex}
                                    onPrevImage={handlePrevImage}
                                    onNextImage={handleNextImage}
                                    onOpenModal={openZoomModal}
                                    featured={product.featured}
                                    videoUrl={product.videoUrl}
                                    onOpenVideo={() => setShowVideoModal(true)}
                                />
                            </div>

                            {/* Payment Partners */}
                            <div className="p-3 bg-slate-50/80 rounded-xl text-center border border-slate-200/80">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    {t("safe_secure_payments", "100% Safe & Secure Payments")}
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <img src={amazonpay} alt="Amazon Pay" className="h-5 object-contain" />
                                    <img src={gpay} alt="Google Pay" className="h-5 object-contain" />
                                    <img src={paytm} alt="Paytm" className="h-5 object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: 50% SCREEN PRODUCT INFO & VARIANT SELECTOR */}
                        <div className="space-y-4 sm:space-y-5">
                            <div>
                                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                                    {product.category?.nameTranslations?.[currentLang] || product.category?.name || "Pure Organic Product"}
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <h1 className="flex-1 text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                        {product.nameTranslations?.[currentLang] || product.name}
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={() => setShowShareModal(true)}
                                        title="Share this product"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginTop: "2px",
                                            padding: "6px",
                                            borderRadius: "10px",
                                            border: "1.5px solid #e2e8f0",
                                            background: "#ffffff",
                                            color: "#64748b",
                                            cursor: "pointer",
                                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background="#f0fdf4"; e.currentTarget.style.borderColor="#34d399"; e.currentTarget.style.color="#059669"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background="#ffffff"; e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#64748b"; }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#64748b"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ width: "18px", height: "18px", display: "block" }}
                                        >
                                            <circle cx="18" cy="5" r="3"/>
                                            <circle cx="6" cy="12" r="3"/>
                                            <circle cx="18" cy="19" r="3"/>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* RATING & REVIEWS */}
                            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                                <div className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                                    <span>{reviewData.averageRating ? reviewData.averageRating.toFixed(1) : "5.0"}</span>
                                    <span>★</span>
                                </div>
                                <a href="#ratings-and-reviews" className="text-slate-600 text-xs sm:text-sm font-semibold hover:text-emerald-700 transition-colors">
                                    {reviewData.totalReviews > 0 ? `${reviewData.totalReviews} Customer Review${reviewData.totalReviews > 1 ? 's' : ''}` : "Be the first to review"}
                                </a>
                                <span className="h-3 w-px bg-slate-300"></span>
                                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                                    <span>✓</span> {t("authentic_organic", "100% Authentic Organic")}
                                </span>
                            </div>

                            {/* PRICE DISPLAY CARD (AMAZON STYLE WITH USP) */}
                            <div className="p-3.5 sm:p-4 bg-slate-50/90 rounded-xl border border-slate-200/80">
                                <div className="flex flex-wrap items-baseline gap-2 sm:gap-2.5">
                                    {hasDiscount && (
                                        <span className="text-red-600 font-extrabold text-lg sm:text-xl">
                                            -{discountPercent}%
                                        </span>
                                    )}
                                    <div className="flex items-baseline">
                                        <span className="text-sm font-semibold text-slate-700 mr-0.5">₹</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                            {currentPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    {/* Main Price USP */}
                                    {calculateUSP(currentPrice, selectedVariant?.variantName) && (
                                        <span className="text-xs sm:text-sm font-semibold text-slate-600">
                                            {calculateUSP(currentPrice, selectedVariant?.variantName)}
                                        </span>
                                    )}
                                </div>

                                {hasDiscount && (
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                        <span>{t("mrp_label", "M.R.P.:")}</span>
                                        <span className="line-through font-medium">₹{mrpPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {/* All-Inclusive Delivery Note */}
                                <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                                        <span>🚚</span> <span className="text-color-blink font-extrabold">{t("free_delivery_included", "FREE Doorstep Delivery Included")}</span>
                                    </span>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <span className="text-slate-500 font-medium">
                                        {t("all_inclusive_price_desc", "Covers Base Price + Doorstep Delivery + All Taxes across India.")}
                                    </span>
                                </div>
                            </div>

                            {/* VARIANT SELECTOR - AMAZON STYLE TILES WITH USP (IMAGE 2 & 3) */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs sm:text-sm font-medium text-slate-700">
                                        {t("select_variation", "Select Weight / Size Variation:")}{" "}
                                        <span className="font-extrabold text-slate-900">
                                            {selectedVariant?.variantName}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {product.variants.map((variant) => {
                                            const isSelected = selectedVariant?.id === variant.id;
                                            const priceVal = variant.discountPrice || variant.price || 0;
                                            const mrpVal = variant.price || 0;
                                            const hasVarDiscount = variant.discountPrice && variant.discountPrice < variant.price;
                                            const uspText = calculateUSP(priceVal, variant.variantName);
                                            const isAvailable = variant.stockQuantity === undefined || variant.stockQuantity > 0;

                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`text-left p-2.5 sm:p-3 rounded-xl transition-all relative flex flex-col justify-between border cursor-pointer ${
                                                        isSelected
                                                            ? "border-2 border-emerald-700 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-600/30"
                                                            : "border-slate-300 bg-white hover:border-slate-500 hover:bg-slate-50/50 shadow-2xs"
                                                    }`}
                                                >
                                                    {/* TOP: Variant Name / Size (Amazon Style Header) */}
                                                    <div className="font-bold text-xs sm:text-sm text-slate-900 leading-tight uppercase line-clamp-2 min-h-[28px] sm:min-h-[32px] flex items-center">
                                                        {variant.variantName}
                                                    </div>

                                                    {/* Horizontal Line Divider (Like Amazon Image 3) */}
                                                    <div className="border-t border-slate-200/90 my-1.5 sm:my-2 w-full"></div>

                                                    {/* BOTTOM: Price + USP + MRP */}
                                                    <div className="space-y-0.5">
                                                        {isAvailable ? (
                                                            <>
                                                                <div className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                                                                    ₹{priceVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </div>
                                                                {uspText && (
                                                                    <div className="text-[11px] sm:text-xs text-slate-600 font-normal leading-tight">
                                                                        {uspText}
                                                                    </div>
                                                                )}
                                                                {hasVarDiscount && (
                                                                    <div className="text-[11px] text-slate-400 line-through leading-tight">
                                                                        ₹{mrpVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="text-xs text-rose-600 font-medium leading-tight">
                                                                {t("currently_unavailable", "Currently unavailable.")}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Subtle Active Indicator Dot */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* QUANTITY & ACTIONS */}
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center gap-3">
                                    <label className="text-xs sm:text-sm font-bold text-slate-800">
                                        {t("quantity_label", "Quantity:")}
                                    </label>
                                    <div className="flex items-center border border-slate-300 rounded-lg bg-white shadow-2xs overflow-hidden">
                                        <button
                                            type="button"
                                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors"
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-bold text-slate-900 text-xs sm:text-sm">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors"
                                            onClick={() => setQuantity((prev) => prev + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS (AMAZON STYLE BELOW VARIATION / QUANTITY) */}
                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        className="w-full py-2.5 sm:py-3 px-4 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        onClick={() => handleAddToCart(false)}
                                        disabled={addingToCart}
                                    >
                                        <span>🛒</span>
                                        <span>{addingToCart ? t("adding", "Adding...") : t("add_to_cart", "ADD TO CART")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full py-2.5 sm:py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        onClick={() => handleAddToCart(true)}
                                        disabled={addingToCart}
                                    >
                                        <span>⚡</span>
                                        <span>{t("buy_now", "BUY NOW")}</span>
                                    </button>
                                </div>
                            </div>

                                {/* TRUST HIGHLIGHTS */}
                                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 border-t border-slate-100">
                                    <span className="flex items-center gap-1 text-emerald-700">
                                        <span>🌿</span> 100% Pure & Unpolished
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-600">
                                        <span>🚚</span> Pan-India Free Delivery
                                    </span>
                                    <span className="flex items-center gap-1 text-amber-700">
                                        <span>🛡️</span> Directly Sourced
                                    </span>
                                </div>
                            </div>
                        </div>

                    {/* FULL-WIDTH DETAILED DESCRIPTION, HEALTH BENEFITS & SPECIFICATIONS (OCCUPIES BOTH LEFT & RIGHT) */}
                    <div className="mt-10 pt-8 border-t border-slate-200">
                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 text-xl font-bold shadow-2xs">
                                🌾
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                    {t("product_overview_story", "Product Description & Health Guide")}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                                    {t("product_overview_sub", "Authentic details, traditional significance, nutrition, and culinary uses.")}
                                </p>
                            </div>
                        </div>

                        {/* Combined Essay / Overview (Occupies full width without splitting) */}
                        {((product.descriptionTranslations?.[currentLang] || product.shortDescription) || 
                          (product.fullDescriptionTranslations?.[currentLang] || product.fullDescription)) && (
                            <div className="p-5 sm:p-7 bg-emerald-50/40 rounded-2xl border border-emerald-100/90 mb-6">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                                    <span>📖</span> {t("product_overview_desc", "Product Overview & Description")}
                                </h3>
                                <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-3 font-normal">
                                    {(product.descriptionTranslations?.[currentLang] || product.shortDescription) && (
                                        <p className="font-medium text-slate-900">
                                            {product.descriptionTranslations?.[currentLang] || product.shortDescription}
                                        </p>
                                    )}
                                    {(product.fullDescriptionTranslations?.[currentLang] || product.fullDescription) && (
                                        <p className="whitespace-pre-line text-slate-700">
                                            {product.fullDescriptionTranslations?.[currentLang] || product.fullDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Health Benefits, Culinary Uses & Detailed Guide (Full Width) */}
                        {(product.benefitsTranslations?.[currentLang] || product.benefits) && (
                            <div className="p-5 sm:p-7 bg-emerald-50/70 rounded-2xl border-l-4 border-emerald-600 mb-6 shadow-2xs">
                                <h3 className="text-base sm:text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                    <span>🌿</span> {t("health_benefits_culinary_uses", "Health Benefits & Culinary Uses:")}
                                </h3>
                                {renderBenefitsContent(product.benefitsTranslations?.[currentLang] || product.benefits)}
                            </div>
                        )}

                        {/* Product Specifications (Full-width responsive grid) */}
                        <div className="p-5 sm:p-7 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span>📋</span> {t("product_specifications", "Product Specifications:")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_brand", "Brand")}</span>
                                    <span className="font-bold text-slate-800">Vinnavar Organic</span>
                                </div>
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_category", "Category")}</span>
                                    <span className="font-bold text-slate-800">{product.category?.nameTranslations?.[currentLang] || product.category?.name || "Organic Staples"}</span>
                                </div>
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_pack_size", "Selected Pack Size")}</span>
                                    <span className="font-bold text-slate-800">{selectedVariant?.variantName || "Standard"}</span>
                                </div>
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_origin", "Country of Origin")}</span>
                                    <span className="font-bold text-slate-800">{t("spec_origin_val", "India (Tamil Nadu)")}</span>
                                </div>
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_quality", "Form & Quality")}</span>
                                    <span className="font-bold text-slate-800">{t("spec_quality_val", "100% Unpolished & Pure Natural")}</span>
                                </div>
                                <div className="flex justify-between p-3.5 bg-white rounded-xl border border-slate-200/80">
                                    <span className="font-semibold text-slate-500">{t("spec_storage", "Storage Instructions")}</span>
                                    <span className="font-bold text-slate-800">{t("spec_storage_val", "Store in a cool and dry place. Keep container tightly closed.")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RATINGS & CUSTOMER PHOTO REVIEWS SECTION */}
                    <div id="ratings-and-reviews" className="mt-12 pt-8 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                    ⭐ {t("customer_ratings_reviews", "Customer Ratings & Photo Reviews")}
                                </h2>
                                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                                    {t("customer_ratings_subtitle", "Real photos & authentic reviews from verified buyers of Vinnavar Organics.")}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="self-start sm:self-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
                                onClick={() => setShowWriteReviewModal(true)}
                            >
                                ✏️ {t("write_review_btn", "Write a Review")}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Rating Stats Summary Box */}
                            <div className="md:col-span-4 bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center">
                                <div className="text-5xl font-black text-slate-900">
                                    {reviewData.averageRating ? reviewData.averageRating.toFixed(1) : "5.0"}
                                </div>
                                <div className="text-amber-400 text-xl my-1">
                                    {"★".repeat(Math.round(reviewData.averageRating || 5))}
                                    {"☆".repeat(5 - Math.round(reviewData.averageRating || 5))}
                                </div>
                                <div className="text-slate-500 text-xs font-semibold">
                                    Based on {reviewData.totalReviews || 0} customer reviews
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = (reviewData.ratingBreakdown && reviewData.ratingBreakdown[star]) || 0;
                                        const percent = reviewData.totalReviews > 0 ? Math.round((count / reviewData.totalReviews) * 100) : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="w-8 font-bold text-slate-700">{star} ★</span>
                                                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                                                </div>
                                                <span className="w-8 text-right text-slate-400 font-medium">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Customer Reviews List */}
                            <div className="md:col-span-8 space-y-4">
                                {reviewData.reviews && reviewData.reviews.length > 0 ? (
                                    reviewData.reviews.map((rev) => (
                                        <div key={rev.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                                                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : "U"}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 text-sm">{rev.customerName || "Verified Buyer"}</div>
                                                        <div className="text-[11px] text-slate-400">
                                                            {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                            {rev.verifiedPurchase && <span className="text-emerald-600 font-bold ml-2">✓ Verified Purchase</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-amber-400 text-sm">
                                                    {"★".repeat(rev.rating || 5)}
                                                    {"☆".repeat(5 - (rev.rating || 5))}
                                                </div>
                                            </div>
                                            
                                            {/* Show Edit Button if it's the current user's review */}
                                            {currentUser && (
                                                (currentUser.mobileNumber && currentUser.mobileNumber === rev.customerPhone) ||
                                                (currentUser.email && currentUser.email === rev.customerEmail) ||
                                                (currentUser.id && currentUser.id === rev.customerId)
                                            ) && (
                                                <div className="mt-1">
                                                    <button 
                                                        onClick={() => openEditModal(rev)}
                                                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 transition-colors"
                                                    >
                                                        ✏️ Edit Review
                                                    </button>
                                                </div>
                                            )}

                                            {rev.reviewTitle && <h4 className="font-bold text-slate-900 text-sm">{rev.reviewTitle}</h4>}
                                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{rev.reviewComment}</p>

                                            {(rev.imageUrls && rev.imageUrls.length > 0) ? (
                                                <div className="pt-1 flex flex-wrap gap-2">
                                                    {rev.imageUrls.map((url, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={getImageUrl(url)}
                                                            alt={`Customer Product Photo ${idx+1}`}
                                                            className="w-24 h-24 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => setReviewImagePreview(getImageUrl(url))}
                                                        />
                                                    ))}
                                                </div>
                                            ) : rev.imageUrl ? (
                                                <div className="pt-1">
                                                    <img
                                                        src={getImageUrl(rev.imageUrl)}
                                                        alt="Customer Product Photo"
                                                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => setReviewImagePreview(getImageUrl(rev.imageUrl))}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                                        <div className="text-3xl mb-2">🌿</div>
                                        <h3 className="font-bold text-slate-900">No customer reviews yet</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-4">Be the first customer to rate and upload a photo of this organic product!</p>
                                        <button
                                            type="button"
                                            className="px-4 py-2 border border-emerald-600 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors"
                                            onClick={() => setShowWriteReviewModal(true)}
                                        >
                                            ⭐ Write First Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* FLIPKART STYLE INTERACTIVE FULLSCREEN IMAGE ZOOM LIGHTBOX MODAL */}
                {showZoomModal && (
                    <div
                        className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* TOP CONTROLS BAR */}
                        <div className="p-4 flex items-center justify-between text-white border-b border-slate-800 bg-slate-900/80 z-20">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm text-slate-200">
                                    {activeImageIndex + 1} / {galleryImages.length}
                                </span>
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                    (Double click/tap to toggle zoom • Drag to pan)
                                </span>
                            </div>

                            {/* ZOOM CONTROLS */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleZoomOut}
                                    disabled={zoomScale <= 1}
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg disabled:opacity-40 transition-colors"
                                    title="Zoom Out (-)"
                                >
                                    -
                                </button>
                                <span className="text-xs font-mono w-12 text-center text-emerald-400 font-bold">
                                    {Math.round(zoomScale * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={handleZoomIn}
                                    disabled={zoomScale >= 3.5}
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg disabled:opacity-40 transition-colors"
                                    title="Zoom In (+)"
                                >
                                    +
                                </button>
                                {zoomScale > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleResetZoom}
                                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowZoomModal(false)}
                                    className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-bold text-lg ml-3 transition-colors"
                                    title="Close Lightbox"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* INTERACTIVE IMAGE DISPLAY AREA */}
                        <div
                            className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
                            onDoubleClick={handleToggleDoubleTapZoom}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                        >
                            <img
                                src={getImageUrl(activeImageUrl)}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-200 ease-out"
                                style={{
                                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`
                                }}
                            />

                            {/* NEXT / PREVIOUS ARROWS */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center text-2xl font-bold shadow-xl transition-all"
                                        onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                        title="Previous Image"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center text-2xl font-bold shadow-xl transition-all"
                                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                        title="Next Image"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>

                        {/* BOTTOM THUMBNAILS CAROUSEL */}
                        {galleryImages.length > 1 && (
                            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-center gap-3 overflow-x-auto z-20">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-950 transition-all shrink-0 overflow-hidden ${
                                            activeImageIndex === idx ? "border-emerald-500 ring-2 ring-emerald-500/30 opacity-100" : "border-slate-800 opacity-50 hover:opacity-100"
                                        }`}
                                        onClick={() => {
                                            setActiveImageIndex(idx);
                                            handleResetZoom();
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* WRITE REVIEW MODAL */}
                {showWriteReviewModal && (
                    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
                            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-white">⭐ Review & Upload Photo for {product.name}</h3>
                                <button type="button" className="text-white hover:text-slate-200 text-2xl font-bold" onClick={() => setShowWriteReviewModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleProductReviewSubmit} className="p-6 space-y-4">
                                {/* Star Rating */}
                                <div className="text-center space-y-2">
                                    <label className="block text-sm font-bold text-slate-800">Your Rating:</label>
                                    <div className="inline-flex gap-2 p-2 bg-slate-50 rounded-full border border-slate-200">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="text-2xl p-1 focus:outline-none transition-transform hover:scale-125"
                                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                            >
                                                <span className={star <= newReview.rating ? "text-amber-400" : "text-slate-300"}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name:</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                            placeholder="Enter your name"
                                            value={newReview.customerName}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">City / Location (Place):</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                            placeholder="e.g. Chennai, Tamil Nadu"
                                            value={newReview.customerLocation}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, customerLocation: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile (Optional):</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                            placeholder="Mobile number"
                                            value={newReview.customerPhone}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, customerPhone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Title / Headline:</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                        placeholder="e.g., Pure aroma & great taste!"
                                        value={newReview.title}
                                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review:</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                                        placeholder="Tell us what you loved about this organic product..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">📸 Upload Product Photos (Optional, max 5):</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files).slice(0, 5);
                                            if (files.length > 0) {
                                                const previews = files.map(file => URL.createObjectURL(file));
                                                setNewReview(prev => ({
                                                    ...prev,
                                                    imageFiles: files,
                                                    imagePreviews: previews
                                                }));
                                            }
                                        }}
                                    />
                                    {newReview.imagePreviews && newReview.imagePreviews.length > 0 && (
                                        <div className="mt-2 flex gap-2 overflow-x-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                                            {newReview.imagePreviews.map((preview, idx) => (
                                                <img key={idx} src={preview} alt={`Preview ${idx+1}`} className="max-h-24 rounded-lg object-contain" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                                    <button type="button" className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={() => setShowWriteReviewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-colors" disabled={newReview.submitting}>
                                        {newReview.submitting ? "Posting..." : "Submit Review ⭐"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* EDIT REVIEW MODAL */}
                {showEditReviewModal && (
                    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
                            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-white">✏️ Edit Review for {product.name}</h3>
                                <button type="button" className="text-white hover:text-slate-200 text-2xl font-bold" onClick={() => setShowEditReviewModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleEditReviewSubmit} className="p-6 space-y-4">
                                <div className="text-center space-y-2">
                                    <label className="block text-sm font-bold text-slate-800">Your Rating:</label>
                                    <div className="inline-flex gap-2 p-2 bg-slate-50 rounded-full border border-slate-200">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="text-2xl p-1 focus:outline-none transition-transform hover:scale-125"
                                                onClick={() => setEditData(prev => ({ ...prev, rating: star }))}
                                            >
                                                <span className={star <= editData.rating ? "text-amber-400" : "text-slate-300"}>★</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Title / Headline:</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                                        value={editData.title}
                                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review:</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                                        value={editData.comment}
                                        onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">📸 Add More Photos (Optional, max 5):</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files).slice(0, 5);
                                            if (files.length > 0) {
                                                const previews = files.map(file => URL.createObjectURL(file));
                                                setEditData(prev => ({
                                                    ...prev,
                                                    imageFiles: files,
                                                    imagePreviews: previews
                                                }));
                                            }
                                        }}
                                    />
                                    {editData.imagePreviews && editData.imagePreviews.length > 0 && (
                                        <div className="mt-2 flex gap-2 overflow-x-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                                            {editData.imagePreviews.map((preview, idx) => (
                                                <img key={idx} src={preview} alt={`Preview ${idx+1}`} className="max-h-24 rounded-lg object-contain" />
                                            ))}
                                        </div>
                                    )}

                                    {editData.existingImageUrls.length > 0 && (
                                        <div className="mt-4 pt-2 border-t border-slate-200">
                                            <label className="block text-xs font-bold text-slate-500 mb-2">Existing Photos:</label>
                                            <div className="flex flex-wrap gap-3">
                                                {editData.existingImageUrls.map((url, idx) => (
                                                    <div key={idx} className="relative">
                                                      <img src={getImageUrl(url)} alt="Existing" className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-sm" />
                                                      <button 
                                                          type="button" 
                                                          className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-600 transition-colors"
                                                          onClick={() => setEditData(prev => ({
                                                              ...prev,
                                                              existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== idx)
                                                          }))}
                                                      >
                                                          ✕
                                                      </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                                    <button type="button" className="px-5 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={() => setShowEditReviewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-colors" disabled={editData.submitting}>
                                        {editData.submitting ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* REVIEW PHOTO PREVIEW MODAL */}
                {reviewImagePreview && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setReviewImagePreview(null)}>
                        <div className="relative max-w-4xl max-h-[90vh]">
                            <button type="button" className="absolute -top-10 right-0 text-white text-2xl font-bold" onClick={() => setReviewImagePreview(null)}>✕</button>
                            <img src={reviewImagePreview} alt="Review Customer Photo" className="max-h-[85vh] rounded-2xl object-contain" />
                        </div>
                    </div>
                )}

                {/* VIDEO MODAL */}
                {showVideoModal && product.videoUrl && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
                        <div className="bg-slate-950 rounded-3xl max-w-4xl w-full overflow-hidden border border-slate-800" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                                <h3 className="font-bold text-sm sm:text-base">Product Video: {product.name}</h3>
                                <button type="button" className="text-white text-xl font-bold" onClick={() => setShowVideoModal(false)}>✕</button>
                            </div>
                            <div className="p-2 text-center bg-black">
                                <video controls autoPlay className="w-full max-h-[500px] rounded-2xl">
                                    <source src={getImageUrl(product.videoUrl)} type="video/mp4" />
                                    Your browser does not support video playback.
                                </video>
                            </div>
                        </div>
                    </div>
                )}

                {/* SHARE MODAL */}
                {showShareModal && (() => {
                    const shareUrl = `${window.location.origin}/product/${product.slug || product.id}`;
                    const shareTitle = product.name;
                    const shareDesc = product.shortDescription || `Buy ${product.name} from Vinnavar Organics — 100% pure & authentic organic products.`;
                    const firstImage = getImageUrl(galleryImages[0] || product.imageUrl || "");

                    const handleCopyLink = () => {
                        navigator.clipboard.writeText(shareUrl).then(() => {
                            setLinkCopied(true);
                            setTimeout(() => setLinkCopied(false), 2500);
                        });
                    };

                    return (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
                            onClick={() => setShowShareModal(false)}
                        >
                            <div
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-extrabold text-slate-900 text-lg">Share this Product</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowShareModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-bold transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Product preview strip */}
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                                    {firstImage && (
                                        <img
                                            src={firstImage}
                                            alt={shareTitle}
                                            className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-white p-1 shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate">{shareTitle}</p>
                                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{shareDesc}</p>
                                    </div>
                                </div>

                                {/* Share Buttons Grid */}
                                <div className="px-6 py-5">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Share via</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <WhatsappShareButton
                                                url={shareUrl}
                                                title={`🌿 ${shareTitle}\n\n${shareDesc}\n\nBuy Now → `}
                                                separator=""
                                                className="focus:outline-none"
                                            >
                                                <WhatsappIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </WhatsappShareButton>
                                            <span className="text-xs font-semibold text-slate-600">WhatsApp</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <FacebookShareButton
                                                url={shareUrl}
                                                quote={shareTitle}
                                                hashtag="#VinnavarOrganics"
                                                className="focus:outline-none"
                                            >
                                                <FacebookIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </FacebookShareButton>
                                            <span className="text-xs font-semibold text-slate-600">Facebook</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <TwitterShareButton
                                                url={shareUrl}
                                                title={`🌿 ${shareTitle} — 100% Organic!`}
                                                hashtags={["VinnavarOrganics", "OrganicFood"]}
                                                className="focus:outline-none"
                                            >
                                                <XIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </TwitterShareButton>
                                            <span className="text-xs font-semibold text-slate-600">X / Twitter</span>

                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <TelegramShareButton
                                                url={shareUrl}
                                                title={`🌿 ${shareTitle} — ${shareDesc}`}
                                                className="focus:outline-none"
                                            >
                                                <TelegramIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </TelegramShareButton>
                                            <span className="text-xs font-semibold text-slate-600">Telegram</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <LinkedinShareButton
                                                url={shareUrl}
                                                title={shareTitle}
                                                summary={shareDesc}
                                                source="Vinnavar Organics"
                                                className="focus:outline-none"
                                            >
                                                <LinkedinIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </LinkedinShareButton>
                                            <span className="text-xs font-semibold text-slate-600">LinkedIn</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
                                            <EmailShareButton
                                                url={shareUrl}
                                                subject={`Check out: ${shareTitle}`}
                                                body={`Hi! I found this amazing organic product for you:\n\n${shareTitle}\n${shareDesc}\n\nBuy it here: `}
                                                className="focus:outline-none"
                                            >
                                                <EmailIcon size={52} round className="shadow-md group-hover:scale-110 transition-transform" />
                                            </EmailShareButton>
                                            <span className="text-xs font-semibold text-slate-600">Email</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Copy Link */}
                                <div className="px-6 pb-5">
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-2xl bg-slate-50 p-2 pl-3">
                                        <span className="flex-1 text-xs text-slate-500 truncate font-mono">{shareUrl}</span>
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                linkCopied
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                            }`}
                                        >
                                            {linkCopied ? "✓ Copied!" : "Copy Link"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </div>
    );
};

export default ProductDetails;
