import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl, fetchProductReviews, submitProductReview, uploadReviewImage } from "../../services/api";

const amazonpay = getImageUrl("/media/site/amazonpay.svg");
const gpay = getImageUrl("/media/site/gpay.svg");
const paytm = getImageUrl("/media/site/paytm.svg");

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Reviews State
    const [reviewData, setReviewData] = useState({ totalReviews: 0, averageRating: 5.0, ratingBreakdown: {}, reviews: [] });
    const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
    const [reviewImagePreview, setReviewImagePreview] = useState(null);
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: "",
        comment: "",
        customerName: "",
        customerPhone: "",
        imageFile: null,
        imagePreview: "",
        submitting: false
    });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    // Set default variant
                    const defVar = data.variants?.find((v) => v.default) || data.variants?.[0] || null;
                    setSelectedVariant(defVar);
                } else {
                    // Fallback to searching all products
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
            if (newReview.imageFile) {
                const uploadRes = await uploadReviewImage(newReview.imageFile);
                uploadedImageUrl = uploadRes.imageUrl;
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
                customerPhone: newReview.customerPhone || currentUser?.mobileNumber || "",
                rating: newReview.rating,
                reviewTitle: newReview.title,
                reviewComment: newReview.comment,
                imageUrl: uploadedImageUrl,
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
            setNewReview({
                rating: 5,
                title: "",
                comment: "",
                customerName: "",
                customerPhone: "",
                imageFile: null,
                imagePreview: "",
                submitting: false
            });

            // Reload reviews
            const updated = await fetchProductReviews(product.id);
            setReviewData(updated);
        } catch (err) {
            console.error("Review submission error:", err);
            Swal.fire("Error", err.message || "Failed to submit review", "error");
        } finally {
            setNewReview(prev => ({ ...prev, submitting: false }));
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center my-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="mt-3 text-muted">Loading product details...</h5>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-5 text-center my-5">
                <h3 className="text-danger fw-bold">Product Not Found</h3>
                <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
                <Link to="/Shop" className="btn btn-success mt-3">Back to Store</Link>
            </div>
        );
    }

    // Build image list
    const galleryImages = (product.imageUrls && product.imageUrls.length > 0)
        ? product.imageUrls
        : (product.imageUrl ? [product.imageUrl] : []);

    const activeImageUrl = galleryImages[activeImageIndex] || product.imageUrl || "/media/site/placeholder.png";

    const handlePrevImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = async (buyNow = false) => {
        if (!selectedVariant) return;

        let cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cartId) {
            cartId = "cart_" + Math.random().toString(36).substring(2, 11);
            localStorage.setItem("vinnavar_cart_id", cartId);
        }

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
                    navigate("/ShopCheckOut");
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

    const currentPrice = selectedVariant?.discountPrice || selectedVariant?.price || 0;
    const mrpPrice = selectedVariant?.price || 0;
    const hasDiscount = selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.price;
    const discountPercent = hasDiscount
        ? Math.round(((mrpPrice - currentPrice) / mrpPrice) * 100)
        : 0;

    return (
        <div className="bg-light py-4 min-vh-100">
            <div className="container bg-white rounded shadow-sm p-3 p-md-4">
                
                {/* BREADCRUMB */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb small">
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/Shop" className="text-decoration-none text-muted">Shop</Link></li>
                        {product.category && (
                            <li className="breadcrumb-item text-muted">{product.category.name}</li>
                        )}
                        <li className="breadcrumb-item active fw-bold text-success" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* LEFT COLUMN: FLIPKART STYLE IMAGE GALLERY */}
                    <div className="col-lg-5 col-md-6">
                        <div className="d-flex flex-column-reverse flex-md-row gap-3">
                            
                            {/* THUMBNAILS LIST */}
                            {galleryImages.length > 1 && (
                                <div
                                    className="d-flex flex-md-column flex-row gap-2 overflow-auto align-items-center"
                                    style={{ maxHeight: "480px", maxWidth: "100%" }}
                                >
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`btn p-1 border rounded bg-white position-relative ${activeImageIndex === idx ? "border-2 border-success shadow-sm" : "border-light"}`}
                                            onClick={() => setActiveImageIndex(idx)}
                                            onMouseEnter={() => setActiveImageIndex(idx)}
                                            style={{ width: "65px", height: "65px", flexShrink: 0 }}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="img-fluid rounded"
                                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* MAIN FEATURED IMAGE VIEW & CAROUSEL */}
                            <div className="flex-grow-1 position-relative border rounded p-3 text-center bg-white d-flex align-items-center justify-content-center" style={{ height: "450px" }}>
                                
                                {product.featured && (
                                    <span className="badge bg-success position-absolute top-0 start-0 m-3 px-3 py-2 fs-6 shadow-sm">
                                        🌱 Organic Best Seller
                                    </span>
                                )}

                                {galleryImages.length > 0 && (
                                    <span className="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-3 px-2 py-1 small">
                                        {activeImageIndex + 1} / {galleryImages.length}
                                    </span>
                                )}

                                <img
                                    src={getImageUrl(activeImageUrl)}
                                    alt={product.name}
                                    className="img-fluid"
                                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "all 0.3s ease" }}
                                />

                                {/* NAVIGATION ARROWS */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-light btn-sm rounded-circle position-absolute top-50 start-0 translate-middle-y ms-2 shadow"
                                            onClick={handlePrevImage}
                                            title="Previous Image"
                                            style={{ width: "36px", height: "36px" }}
                                        >
                                            &lsaquo;
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-light btn-sm rounded-circle position-absolute top-50 end-0 translate-middle-y me-2 shadow"
                                            onClick={handleNextImage}
                                            title="Next Image"
                                            style={{ width: "36px", height: "36px" }}
                                        >
                                            &rsaquo;
                                        </button>
                                    </>
                                )}

                                {/* VIDEO BUTTON IF AVAILABLE */}
                                {product.videoUrl && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm position-absolute bottom-0 start-0 m-3 d-flex align-items-center gap-1 shadow-sm"
                                        onClick={() => setShowVideoModal(true)}
                                    >
                                        ▶ Watch Product Video
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* STICKY FLIPKART STYLE ACTION BUTTONS */}
                        <div className="row g-2 mt-3">
                            <div className="col-6">
                                <button
                                    type="button"
                                    className="btn btn-warning btn-lg w-100 fw-bold text-dark d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm"
                                    onClick={() => handleAddToCart(false)}
                                    disabled={addingToCart}
                                >
                                    🛒 {addingToCart ? "Adding..." : "ADD TO CART"}
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg w-100 fw-bold text-white d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm"
                                    onClick={() => handleAddToCart(true)}
                                    disabled={addingToCart}
                                >
                                    ⚡ BUY NOW
                                </button>
                            </div>
                        </div>

                        {/* Payment Partners */}
                        <div className="mt-4 p-3 bg-light rounded-3 text-center border">
                            <div className="small text-muted fw-bold mb-2">Accepting Payments via Partner Networks</div>
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                <img src={amazonpay} alt="Amazon Pay" style={{ height: "26px", objectFit: "contain" }} />
                                <img src={gpay} alt="Google Pay" style={{ height: "26px", objectFit: "contain" }} />
                                <img src={paytm} alt="Paytm" style={{ height: "26px", objectFit: "contain" }} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRODUCT INFO & VARIANT SELECTOR */}
                    <div className="col-lg-7 col-md-6 ps-lg-4">
                        <div className="text-uppercase text-muted fw-bold small mb-1">
                            {product.category?.name || "Pure Organic Product"}
                        </div>

                        <h2 className="fw-bold text-dark mb-2">{product.name}</h2>

                        {/* RATING & REVIEWS */}
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="badge bg-success px-2.5 py-1 fs-6 fw-bold">
                                {reviewData.averageRating ? reviewData.averageRating.toFixed(1) : "5.0"} ★
                            </span>
                            <a href="#ratings-and-reviews" className="text-muted small fw-bold text-decoration-none hover-underline">
                                {reviewData.totalReviews > 0 ? `${reviewData.totalReviews} Customer Review${reviewData.totalReviews > 1 ? 's' : ''}` : "Be the first to review"}
                            </a>
                            <span className="text-success small fw-bold border-start ps-2">✓ 100% Authentic Organic</span>
                        </div>

                        {/* PRICE DISPLAY */}
                        <div className="p-3 bg-light rounded mb-4">
                            <div className="d-flex align-items-baseline gap-3">
                                <span className="fs-2 fw-bold text-dark">
                                    ₹{currentPrice.toLocaleString('en-IN')}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-decoration-line-through text-muted fs-5">
                                            ₹{mrpPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="badge bg-danger fs-6">
                                            {discountPercent}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="small text-success mt-1 fw-semibold">
                                ✓ Inclusive of shipping charge + all taxes
                            </div>
                        </div>

                        {/* VARIANT SELECTOR (PILL BUTTONS: 500G, 5KG, 25KG) */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-4">
                                <label className="form-label fw-bold text-dark mb-2">
                                    Select Weight / Size Variation:
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {product.variants.map((variant) => {
                                        const isSelected = selectedVariant?.id === variant.id;
                                        const priceVal = variant.discountPrice || variant.price;
                                        return (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                className={`btn py-2 px-3 fw-bold rounded-pill text-nowrap d-flex align-items-center gap-2 ${isSelected ? "btn-success shadow-sm" : "btn-outline-secondary bg-white"}`}
                                                onClick={() => setSelectedVariant(variant)}
                                            >
                                                <span>{variant.variantName}</span>
                                                <span className={`badge ${isSelected ? "bg-white text-success" : "bg-light text-dark"}`}>
                                                    ₹{priceVal}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* QUANTITY SELECTOR */}
                        <div className="mb-4 d-flex align-items-center gap-3">
                            <label className="form-label fw-bold text-dark mb-0">Quantity:</label>
                            <div className="input-group" style={{ width: "130px" }}>
                                <button
                                    className="btn btn-outline-secondary btn-sm fw-bold"
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    className="form-control text-center fw-bold form-control-sm"
                                    value={quantity}
                                    readOnly
                                />
                                <button
                                    className="btn btn-outline-secondary btn-sm fw-bold"
                                    type="button"
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* SHORT DESCRIPTION */}
                        {product.shortDescription && (
                            <div className="mb-4">
                                <h6 className="fw-bold text-dark">Highlights & Key Details:</h6>
                                <p className="text-muted leading-relaxed">{product.shortDescription}</p>
                            </div>
                        )}

                        {/* HEALTH BENEFITS */}
                        {product.benefits && (
                            <div className="mb-4 p-3 border-start border-4 border-success bg-light rounded">
                                <h6 className="fw-bold text-success mb-2">🌿 Health Benefits & Nutrition:</h6>
                                <p className="text-dark small mb-0" style={{ whiteSpace: "pre-line" }}>
                                    {product.benefits}
                                </p>
                            </div>
                        )}

                        {/* PRODUCT SPECIFICATIONS TABLE */}
                        <div className="mt-4">
                            <h6 className="fw-bold text-dark mb-3">Product Specifications:</h6>
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm small text-muted">
                                    <tbody>
                                        <tr>
                                            <td className="fw-bold bg-light" style={{ width: "35%" }}>Brand</td>
                                            <td>Vinnavar Organic</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold bg-light">Category</td>
                                            <td>{product.category?.name || "Organic Staples"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold bg-light">Selected Pack Size</td>
                                            <td>{selectedVariant?.variantName || "Standard"}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold bg-light">Country of Origin</td>
                                            <td>India (Tamil Nadu)</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold bg-light">Form & Quality</td>
                                            <td>100% Unpolished & Pure Natural</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold bg-light">Storage Instructions</td>
                                            <td>Store in a cool and dry place. Keep container tightly closed.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RATINGS & CUSTOMER PHOTO REVIEWS SECTION */}
                <div id="ratings-and-reviews" className="mt-5 pt-4 border-top">
                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                        <div>
                            <h3 className="fw-bold text-dark mb-1">⭐ Customer Ratings & Photo Reviews</h3>
                            <p className="text-muted small mb-0">Real photos & authentic reviews from verified buyers of Vinnavar Organics.</p>
                        </div>
                        <button
                            type="button"
                            className="btn btn-success fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
                            onClick={() => setShowWriteReviewModal(true)}
                        >
                            ✏️ Write a Product Review
                        </button>
                    </div>

                    <div className="row g-4 mb-4">
                        {/* Rating Stats Summary Box */}
                        <div className="col-md-4">
                            <div className="p-4 bg-light rounded-4 border text-center">
                                <div className="display-4 fw-bold text-dark mb-0">
                                    {reviewData.averageRating ? reviewData.averageRating.toFixed(1) : "5.0"}
                                </div>
                                <div className="text-warning fs-4 mb-1">
                                    {"★".repeat(Math.round(reviewData.averageRating || 5))}
                                    {"☆".repeat(5 - Math.round(reviewData.averageRating || 5))}
                                </div>
                                <div className="text-muted small fw-bold">
                                    Based on {reviewData.totalReviews || 0} customer reviews
                                </div>

                                {/* Star Bars Breakdown */}
                                <div className="mt-3 pt-3 border-top text-start">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = (reviewData.ratingBreakdown && reviewData.ratingBreakdown[star]) || 0;
                                        const percent = reviewData.totalReviews > 0 ? Math.round((count / reviewData.totalReviews) * 100) : 0;
                                        return (
                                            <div key={star} className="d-flex align-items-center gap-2 mb-1.5 small">
                                                <span className="fw-bold text-dark" style={{ width: "32px" }}>{star} ★</span>
                                                <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                                    <div
                                                        className="progress-bar bg-success"
                                                        role="progressbar"
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-muted" style={{ width: "35px", textAlign: "right" }}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Customer Reviews List */}
                        <div className="col-md-8">
                            {reviewData.reviews && reviewData.reviews.length > 0 ? (
                                <div className="row g-3">
                                    {reviewData.reviews.map((rev) => (
                                        <div key={rev.id} className="col-12">
                                            <div className="p-3.5 bg-white border rounded-4 shadow-xs">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-success text-white rounded-circle fw-bold d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                                                            {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark lh-sm">{rev.customerName || "Verified Buyer"}</div>
                                                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                                                {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                {rev.verifiedPurchase && <span className="text-success fw-bold ms-2">✓ Verified Purchase</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-warning small">
                                                        {"★".repeat(rev.rating || 5)}
                                                        {"☆".repeat(5 - (rev.rating || 5))}
                                                    </div>
                                                </div>

                                                {rev.reviewTitle && <h6 className="fw-bold text-dark mb-1">{rev.reviewTitle}</h6>}
                                                <p className="text-secondary small mb-2 leading-relaxed">{rev.reviewComment}</p>

                                                {/* Customer Product Photo Preview */}
                                                {rev.imageUrl && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={getImageUrl(rev.imageUrl)}
                                                            alt="Customer Product Photo"
                                                            className="img-thumbnail rounded-3 cursor-pointer"
                                                            style={{ maxHeight: "110px", maxWidth: "150px", objectFit: "cover" }}
                                                            onClick={() => setReviewImagePreview(getImageUrl(rev.imageUrl))}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 text-center bg-light rounded-4 border border-dashed">
                                    <div className="fs-2 text-muted mb-2">🌿</div>
                                    <h6 className="fw-bold text-dark">No customer reviews yet</h6>
                                    <p className="text-muted small mb-3">Be the first customer to rate and upload a photo of this organic product!</p>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm fw-bold rounded-pill px-4"
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

            {/* WRITE REVIEW MODAL */}
            {showWriteReviewModal && (
                <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div className="modal-header bg-success text-white py-3 px-4">
                                <h5 className="modal-title fw-bold text-white mb-0">
                                    ⭐ Review & Upload Photo for {product.name}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowWriteReviewModal(false)}></button>
                            </div>

                            <form onSubmit={handleProductReviewSubmit}>
                                <div className="modal-body p-4">
                                    {/* Star Rating */}
                                    <div className="mb-4 text-center">
                                        <label className="form-label fw-bold text-dark d-block mb-2">Your Rating:</label>
                                        <div className="d-inline-flex gap-2 p-2 bg-light rounded-pill border">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className="btn btn-link p-1 text-decoration-none fs-3"
                                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                >
                                                    <span className={star <= newReview.rating ? "text-warning" : "text-secondary opacity-25"}>★</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Your Name */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark mb-1">Your Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your name"
                                                value={newReview.customerName}
                                                onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark mb-1">Mobile Number (Optional):</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Mobile for verified buyer badge"
                                                value={newReview.customerPhone}
                                                onChange={(e) => setNewReview(prev => ({ ...prev, customerPhone: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Headline */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold text-dark mb-1">Review Title / Headline:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., Pure aroma & great taste!"
                                            value={newReview.title}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                    </div>

                                    {/* Comment */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold text-dark mb-1">Detailed Review:</label>
                                        <textarea
                                            rows={3}
                                            className="form-control"
                                            placeholder="Tell us what you loved about this organic product..."
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="mb-3">
                                        <label className="form-label fw-bold text-dark mb-1">📸 Upload Product Photo (Optional):</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setNewReview(prev => ({
                                                        ...prev,
                                                        imageFile: file,
                                                        imagePreview: URL.createObjectURL(file)
                                                    }));
                                                }
                                            }}
                                        />
                                        {newReview.imagePreview && (
                                            <div className="mt-2 text-center p-2 border rounded bg-light">
                                                <img src={newReview.imagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: "130px" }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer bg-light py-3 px-4 justify-content-between">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowWriteReviewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success fw-bold rounded-pill px-5 shadow-sm" disabled={newReview.submitting}>
                                        {newReview.submitting ? "Posting..." : "Submit Review ⭐"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* REVIEW PHOTO MODAL PREVIEW */}
            {reviewImagePreview && (
                <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1" onClick={() => setReviewImagePreview(null)}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-black border-0 rounded-4 overflow-hidden">
                            <div className="modal-header border-0 pb-0">
                                <button type="button" className="btn-close btn-close-white" onClick={() => setReviewImagePreview(null)}></button>
                            </div>
                            <div className="modal-body text-center p-3">
                                <img src={reviewImagePreview} alt="Review Customer Photo" className="img-fluid rounded-3" style={{ maxHeight: "80vh" }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO MODAL IF PRESENT */}
            {showVideoModal && product.videoUrl && (
                <div className="modal d-block bg-dark bg-opacity-75" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-black text-white">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title fw-bold">Product Video: {product.name}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowVideoModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center p-0">
                                <video controls autoPlay className="w-100" style={{ maxHeight: "500px" }}>
                                    <source src={getImageUrl(product.videoUrl)} type="video/mp4" />
                                    Your browser does not support video playback.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
