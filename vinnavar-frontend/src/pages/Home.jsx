import { getImageUrl, fetchCategories, fetchProducts, API_BASE_URL, toggleWishlist } from "../services/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import FAQ from "./FooterElements/Faq";
import OrganicProductList from "../Component/OrganicProductList";
import TestimonialsCarousel from "../Component/TestimonialsCarousel";
import { ProductSkeleton, CategorySkeleton, OfferProductSkeleton } from "../Component/Skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const bannerdeal = getImageUrl("/media/site/banner-deal1.jpg");
const product11 = getImageUrl("/media/products/product-img-11.jpg");

const Home = () => {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    const loadOfferProducts = async () => {
      try {
        const data = await fetchProducts();
        setOfferProducts(data);
      } catch (err) {
        console.error("Failed to load offer products", err);
      }
    };
    loadCategories();
    loadOfferProducts();

    // Ensure hero carousel continuously auto-plays without pausing on hover
    const el = document.getElementById("carouselExampleFade");
    if (el && window.bootstrap) {
      const bsCarousel = new window.bootstrap.Carousel(el, {
        interval: 2500,
        pause: false,
        ride: "carousel"
      });
      bsCarousel.cycle();
    }
  }, []);

  const handleAddToCart = async (product) => {
    const variant = product.variants?.find((v) => v.default) || product.variants?.[0];
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
          title: "Added to Cart",
          text: `${product.name} added to cart!`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire("Cart Error", "Failed to add product to cart.", "error");
    }
  };

  const handleToggleWishlist = async (product) => {
    const variant = product.variants?.find((v) => v.default) || product.variants?.[0];
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

  const categorySliderSettings = {
    dots: true,
    infinite: categories.length > 1,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // loading
  const [loaderStatus, setLoaderStatus] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
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
            <>
              <section className="hero-section">
                <div className="container mt-8">
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-pause="false"
                    data-bs-interval="2500"
                  >
                    <div className="carousel-inner">
                      {/* Slide 1 */}
                      <div className="carousel-item active">
                        {/* Desktop Image */}
                        <Link to="/Shop" className="d-none d-md-block">
                          <img
                            src={`${process.env.PUBLIC_URL}/HERO_01_DESKTOP.webp`}
                            alt="Vinnavar Organic Grains"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                        {/* Mobile Image */}
                        <Link to="/Shop" className="d-block d-md-none">
                          <img
                            src={`${process.env.PUBLIC_URL}/HERO_01_MOBILE.webp`}
                            alt="Vinnavar Organic Grains"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                      </div>

                      {/* Slide 2 */}
                      <div className="carousel-item">
                        {/* Desktop Image */}
                        <Link to="/Shop" className="d-none d-md-block">
                          <img
                            src={`${process.env.PUBLIC_URL}/hero_02_desktop.webp`}
                            alt="Vinnavar Cold Pressed Oils"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                        {/* Mobile Image */}
                        <Link to="/Shop" className="d-block d-md-none">
                          <img
                            src={`${process.env.PUBLIC_URL}/hero_02_mobile.webp`}
                            alt="Vinnavar Cold Pressed Oils"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                      </div>

                      {/* Slide 3 */}
                      <div className="carousel-item">
                        {/* Desktop Image */}
                        <Link to="/Shop" className="d-none d-md-block">
                          <img
                            src={`${process.env.PUBLIC_URL}/HERO_03_DESKTOP.webp`}
                            alt="Vinnavar Natural Sweeteners"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                        {/* Mobile Image */}
                        <Link to="/Shop" className="d-block d-md-none">
                          <img
                            src={`${process.env.PUBLIC_URL}/HERO_03_MOBILE.webp`}
                            alt="Vinnavar Natural Sweeteners"
                            className="img-fluid w-100"
                            style={{ borderRadius: ".5rem" }}
                          />
                        </Link>
                      </div>
                    </div>
                    <Link
                      className="carousel-control-prev"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Previous</span>
                    </Link>
                    <Link
                      className="carousel-control-next"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>

            <>
              {/* section category */}
              <section className="my-lg-14 my-8">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-6">
                        {/* heading */}
                        <div className="section-head text-center mt-8">
                          <h3
                            className="h3style"
                            data-title={t("shop_categories")}
                          >
                            {t("shop_categories")}
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      {categories.length > 0 ? (
                        <Slider {...categorySliderSettings}>
                          {categories.map((cat) => (
                            <div key={cat.id} className="px-2 pb-3 h-100">
                              <div className="card h-100 category-card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                                {/* Category Image */}
                                <div
                                  className="position-relative overflow-hidden category-img-container d-flex align-items-center justify-content-center p-3 bg-light"
                                  style={{ height: "200px" }}
                                >
                                  <Link
                                    to={`/Shop?category=${cat.id}`}
                                    className="w-100 h-100 d-flex align-items-center justify-content-center"
                                  >
                                    <img
                                      src={cat.imageUrl ? getImageUrl(cat.imageUrl) : getImageUrl("/media/site/category-atta-rice-dal.jpg")}
                                      alt={cat.name}
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        transition: "transform 0.3s ease"
                                      }}
                                      className="img-fluid"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/media/placeholder.png";
                                      }}
                                    />
                                  </Link>
                                </div>
                                {/* Category Content */}
                                <div className="card-body p-4 d-flex flex-column flex-grow-1">
                                  <h4
                                    className="fs-6 fw-bold mb-2 text-dark"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      height: "44px"
                                    }}
                                    title={cat.name}
                                  >
                                    <Link to={`/Shop?category=${cat.id}`} className="text-dark text-decoration-none">
                                      {cat.name}
                                    </Link>
                                  </h4>
                                  <p
                                    className="text-muted small mb-4 flex-grow-1"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      height: "40px"
                                    }}
                                    title={cat.description}
                                  >
                                    {cat.description || "Premium quality organically grown products."}
                                  </p>
                                  <Link
                                    to={`/Shop?category=${cat.id}`}
                                    className="btn btn-success btn-sm rounded-pill mt-auto fw-bold py-2 w-100 shadow-sm"
                                  >
                                    Browse Products
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <CategorySkeleton count={4} />
                      )}
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>
            <>
              <OrganicProductList categoryId={selectedCategoryId} limit={8} />
            </>

            <>
              <TestimonialsCarousel />
              <FAQ />

              {/* Visitor Count Banner */}
              <section
                style={{
                  background: "linear-gradient(135deg, #1a5c2a 0%, #2e7d32 50%, #388e3c 100%)",
                  padding: "60px 20px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative blobs */}
                <div
                  style={{
                    position: "absolute", top: "-60px", left: "-60px",
                    width: "200px", height: "200px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", bottom: "-80px", right: "-40px",
                    width: "260px", height: "260px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{ marginBottom: "16px" }}>
                    <span
                      style={{
                        fontSize: "2.8rem",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      🌿
                    </span>
                  </div>

                  {/* Count */}
                  <h2
                    style={{
                      fontSize: "clamp(2.8rem, 6vw, 5rem)",
                      fontWeight: "800",
                      color: "#ffffff",
                      margin: "0 0 8px 0",
                      letterSpacing: "-1px",
                      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    5K<span style={{ color: "#a5d6a7" }}>+</span>
                  </h2>

                  {/* Label */}
                  <p
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: "600",
                      color: "rgba(255,255,255,0.9)",
                      margin: "0 0 6px 0",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Visitors in the Last Week
                  </p>

                  {/* Sub-label */}
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.65)",
                      margin: 0,
                    }}
                  >
                    Trusted by thousands of organic food lovers across India
                  </p>

                  {/* Divider dots */}
                  <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "8px" }}>
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          width: i === 2 ? "28px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background: i === 2 ? "#a5d6a7" : "rgba(255,255,255,0.35)",
                          transition: "width 0.3s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </>


            
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
