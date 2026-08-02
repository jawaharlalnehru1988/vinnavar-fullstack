import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL, fetchProducts, getImageUrl, toggleWishlist } from "../services/api";

const OrganicProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const params = categoryId ? { categoryId } : {};
                const data = await fetchProducts(params);
                setProducts(data);

                // Default variants setup
                const defaults = {};
                data.forEach((prod) => {
                    const defaultVar = prod.variants?.find((v) => v.default) || prod.variants?.[0];
                    if (defaultVar) {
                        defaults[prod.id] = defaultVar;
                    }
                });
                setSelectedVariants(defaults);
            } catch (err) {
                console.error("Error loading products", err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [categoryId]);

    const handleVariantChange = (productId, variantId) => {
        const product = products.find((p) => p.id === productId);
        const variant = product?.variants?.find((v) => v.id === parseInt(variantId));
        if (variant) {
            setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
        }
    };

    const handleAddToCart = async (product) => {
        const variant = selectedVariants[product.id] || product.variants?.[0];
        if (!variant) return;

        let cartId = localStorage.getItem("vinnavar_cart_id");
        if (!cartId) {
            cartId = "cart_" + Math.random().toString(36).substring(2, 11);
            localStorage.setItem("vinnavar_cart_id", cartId);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartId: cartId,
                    productId: product.id,
                    variantId: variant.id,
                    quantity: 1
                })
            });

            if (response.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
                Swal.fire({
                    icon: "success",
                    title: "Added to Organic Cart",
                    text: `${product.name} (${variant.variantName}) added to cart!`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Cart Error",
                text: "Failed to add product to cart."
            });
        }
    };

    const handleToggleWishlist = async (product) => {
        const variant = selectedVariants[product.id] || product.variants?.[0];
        try {
            await toggleWishlist(product.id, variant?.id);
            Swal.fire({
                icon: "success",
                title: "Wishlist Updated",
                text: `${product.name} updated in your wishlist!`,
                timer: 1200,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire("Wishlist Error", "Could not update wishlist.", "error");
        }
    };

    if (loading) {
        return <div className="text-center my-5">Loading Organic Products...</div>;
    }

    return (
        <section className="my-lg-8 my-4">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center mb-6">
                        <h3 className="h3style" data-title="Pure Organic Products">
                            Pure Organic Products
                        </h3>
                        <div className="wt-separator bg-primarys"></div>
                        <div className="wt-separator2 bg-primarys"></div>
                    </div>
                </div>

                <div className="row g-4 row-cols-lg-4 row-cols-md-2 row-cols-1">
                    {products.map((product) => {
                        const currentVariant = selectedVariants[product.id] || product.variants?.[0];
                        const imgUrl = getImageUrl(product.imageUrl);

                        return (
                            <div key={product.id} className="col">
                                <div className="card card-product h-100 shadow-sm border-0">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <div className="text-center position-relative mb-3">
                                            {product.featured && (
                                                <div className="position-absolute top-0 start-0">
                                                    <span className="badge bg-success">Organic Best Seller</span>
                                                </div>
                                            )}
                                            <button
                                                className="btn btn-sm btn-light rounded-circle shadow-sm position-absolute top-0 end-0 me-1 mt-1 p-2 border"
                                                title="Add to Wishlist"
                                                onClick={() => handleToggleWishlist(product)}
                                                style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            >
                                                <i className="far fa-heart text-danger"></i>
                                            </button>
                                            <Link to={`/product/${product.slug}`} style={{ height: "180px", overflow: "hidden" }} className="d-flex align-items-center justify-content-center text-decoration-none">
                                                <img
                                                    src={imgUrl}
                                                    alt={product.name}
                                                    className="img-fluid rounded hover-zoom"
                                                    style={{ maxHeight: "100%", objectFit: "contain" }}
                                                />
                                            </Link>
                                        </div>

                                        <div className="text-small mb-1 text-muted fw-bold">
                                            {product.category?.name}
                                        </div>
                                        <h5 className="fs-6 mb-2">
                                            <Link to={`/product/${product.slug}`} className="text-decoration-none text-dark hover-primary">
                                                {product.name}
                                            </Link>
                                        </h5>
                                        <p className="text-muted small mb-2">{product.shortDescription}</p>

                                        {/* Variant selection */}
                                        {product.variants && product.variants.length > 0 && (
                                            <div className="mb-3">
                                                <label className="form-label small text-muted mb-1">Select Size / Volume:</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={currentVariant?.id || ""}
                                                    onChange={(e) => handleVariantChange(product.id, e.target.value)}
                                                >
                                                    {product.variants.map((v) => (
                                                        <option key={v.id} value={v.id}>
                                                            {v.variantName} - ₹{v.discountPrice || v.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <div>
                                                <span className="text-dark fw-bold fs-5">
                                                    ₹{currentVariant?.discountPrice || currentVariant?.price || 0}
                                                </span>
                                                {currentVariant?.discountPrice && (
                                                    <span className="text-decoration-line-through text-muted ms-2 small">
                                                        ₹{currentVariant?.price}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-primary btn-sm px-3"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OrganicProductList;
