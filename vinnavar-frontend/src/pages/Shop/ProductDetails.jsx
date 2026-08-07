import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, getImageUrl } from "../../services/api";

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
                            <span className="badge bg-success px-2 py-1 fs-6">
                                4.8 ★
                            </span>
                            <span className="text-muted small fw-bold">142 Ratings & 38 Reviews</span>
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
            </div>

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
