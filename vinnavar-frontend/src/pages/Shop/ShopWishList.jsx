import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MagnifyingGlass } from 'react-loader-spinner';
import Swal from "sweetalert2";
import ScrollToTop from "../ScrollToTop";
import { API_BASE_URL, getImageUrl, fetchWishlist, removeFromWishlist, clearWishlist, getWishlistId } from "../../services/api";

const ShopWishList = () => {
  const navigate = useNavigate();
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [wishlist, setWishlist] = useState({ items: [], totalItemCount: 0 });
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadWishlistData = async () => {
    try {
      const data = await fetchWishlist();
      setWishlist(data || { items: [], totalItemCount: 0 });
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    } finally {
      setLoaderStatus(false);
    }
  };

  useEffect(() => {
    loadWishlistData();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(wishlist.items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddToCart = async (item) => {
    setActionLoadingId(item.id);
    try {
      let cartId = localStorage.getItem("vinnavar_cart_id");
      if (!cartId) {
        cartId = "cart_" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("vinnavar_cart_id", cartId);
      }

      const variantId = item.variant ? item.variant.id : (item.product.variants && item.product.variants.length > 0 ? item.product.variants[0].id : null);

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          productId: item.product.id,
          variantId: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Added to Organic Cart",
          text: `${item.product.name} ${item.variant ? `(${item.variant.variantName})` : ""} added to your cart!`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire("Cart Error", "Failed to add item to cart.", "error");
      }
    } catch (error) {
      console.error("Error adding item to cart from wishlist:", error);
      Swal.fire("Error", "Could not add item to cart.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (itemId, productName) => {
    const result = await Swal.fire({
      title: "Remove from Wishlist?",
      text: `Remove ${productName || "this item"} from your wishlist?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!"
    });

    if (result.isConfirmed) {
      setActionLoadingId(itemId);
      try {
        const success = await removeFromWishlist(itemId);
        if (success) {
          Swal.fire({
            icon: "success",
            title: "Removed",
            text: "Item removed from wishlist",
            timer: 1200,
            showConfirmButton: false
          });
          setSelectedItems(selectedItems.filter((id) => id !== itemId));
          loadWishlistData();
        } else {
          Swal.fire("Error", "Failed to remove item from wishlist.", "error");
        }
      } catch (err) {
        console.error("Error removing item:", err);
        Swal.fire("Error", "Failed to remove item", "error");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleClearAll = async () => {
    if (!wishlist.items || wishlist.items.length === 0) return;

    const result = await Swal.fire({
      title: "Clear Entire Wishlist?",
      text: "Are you sure you want to clear all products from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, clear all!"
    });

    if (result.isConfirmed) {
      try {
        await clearWishlist();
        setSelectedItems([]);
        Swal.fire({
          icon: "success",
          title: "Wishlist Cleared",
          timer: 1200,
          showConfirmButton: false
        });
        loadWishlistData();
      } catch (err) {
        Swal.fire("Error", "Failed to clear wishlist.", "error");
      }
    }
  };

  const allSelected = wishlist.items.length > 0 && selectedItems.length === wishlist.items.length;

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperclassName="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <section className="my-14">
            <div className="container">
              <div className="row">
                <div className="offset-lg-1 col-lg-10">
                  <div className="d-flex justify-content-between align-items-center mb-6">
                    <div>
                      <h1 className="mb-1">My Wishlist</h1>
                      <p className="text-muted mb-0">
                        There {wishlist.items.length === 1 ? "is 1 product" : `are ${wishlist.items.length} products`} in this wishlist.
                      </p>
                    </div>
                    {wishlist.items.length > 0 && (
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={handleClearAll}
                      >
                        <i className="fas fa-trash-alt me-2"></i>Clear Wishlist
                      </button>
                    )}
                  </div>

                  {wishlist.items.length === 0 ? (
                    <div className="text-center py-12 bg-light rounded-3 p-8 border">
                      <div className="mb-4 text-secondary">
                        <i className="far fa-heart display-1 text-muted"></i>
                      </div>
                      <h3 className="h4 fw-bold">Your Wishlist is Empty</h3>
                      <p className="text-muted mb-4">
                        Explore our store and add your favorite organic items to your wishlist!
                      </p>
                      <Link to="/Shop" className="btn btn-success btn-lg rounded-pill px-5">
                        <i className="fas fa-shopping-bag me-2"></i>Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive shadow-sm border rounded-3">
                      <table className="table text-nowrap mb-0 align-middle">
                        <thead className="table-light">
                          <tr>
                            <th className="py-3 px-4" style={{ width: "50px" }}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={allSelected}
                                  onChange={handleSelectAll}
                                  id="checkboxSelectAll"
                                />
                                <label className="form-check-label" htmlFor="checkboxSelectAll"></label>
                              </div>
                            </th>
                            <th className="py-3" style={{ width: "100px" }}>Image</th>
                            <th className="py-3">Product</th>
                            <th className="py-3">Amount</th>
                            <th className="py-3">Status</th>
                            <th className="py-3 text-center">Actions</th>
                            <th className="py-3 text-center">Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlist.items.map((item) => {
                            const product = item.product || {};
                            const variant = item.variant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
                            const price = variant ? (variant.discountPrice || variant.price) : 0;
                            const isOriginalPrice = variant && variant.discountPrice && variant.price > variant.discountPrice;
                            const inStock = variant ? (variant.stockQuantity > 0) : true;
                            const imageSrc = getImageUrl(product.imageUrl || "/media/placeholder.png");

                            return (
                              <tr key={item.id}>
                                <td className="px-4">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={selectedItems.includes(item.id)}
                                      onChange={() => handleSelectItem(item.id)}
                                      id={`checkbox_${item.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`checkbox_${item.id}`}></label>
                                  </div>
                                </td>
                                <td>
                                  <Link to={`/products/${product.slug || product.id}`}>
                                    <img
                                      src={imageSrc}
                                      className="img-fluid icon-shape icon-xxl rounded"
                                      alt={product.name || "Product"}
                                      style={{ objectFit: "cover", width: "70px", height: "70px" }}
                                    />
                                  </Link>
                                </td>
                                <td>
                                  <div>
                                    <h5 className="fs-6 mb-1">
                                      <Link to={`/products/${product.slug || product.id}`} className="text-inherit text-decoration-none fw-bold">
                                        {product.name}
                                      </Link>
                                    </h5>
                                    {variant && (
                                      <span className="badge bg-light text-dark border">
                                        {variant.variantName}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="fw-bold text-dark">
                                    ₹{Number(price).toFixed(2)}
                                    {isOriginalPrice && (
                                      <small className="text-decoration-line-through text-muted ms-2 fw-normal">
                                        ₹{Number(variant.price).toFixed(2)}
                                      </small>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  {inStock ? (
                                    <span className="badge bg-success">In Stock</span>
                                  ) : (
                                    <span className="badge bg-danger">Out of Stock</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {inStock ? (
                                    <button
                                      className="btn btn-primary btn-sm rounded-pill px-3"
                                      disabled={actionLoadingId === item.id}
                                      onClick={() => handleAddToCart(item)}
                                    >
                                      {actionLoadingId === item.id ? (
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                      ) : (
                                        <i className="fas fa-shopping-cart me-1"></i>
                                      )}
                                      Add to Cart
                                    </button>
                                  ) : (
                                    <button className="btn btn-secondary btn-sm rounded-pill px-3" disabled>
                                      Contact us
                                    </button>
                                  )}
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn btn-link text-muted p-1 border-0"
                                    title="Delete"
                                    onClick={() => handleRemove(item.id, product.name)}
                                  >
                                    <i className="fas fa-trash-alt text-danger"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ShopWishList;
