import { getImageUrl, fetchCategories, fetchProducts, fetchSettings, API_BASE_URL, toggleWishlist } from "../services/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import FAQ from "./FooterElements/Faq";
import OrganicProductList from "../Component/OrganicProductList";
import TestimonialsCarousel from "../Component/TestimonialsCarousel";
import { ProductSkeleton, CategorySkeleton, OfferProductSkeleton } from "../Component/Skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Fade } from "react-awesome-reveal";

const bannerdeal = getImageUrl("/media/site/banner-deal1.jpg");
const product11 = getImageUrl("/media/products/product-img-11.jpg");

const isVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim().toLowerCase().split("?")[0].split("#")[0];
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov")
  );
};

const AnimatedVisitorCount = ({ target = 5000 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(ease * target);
      setCount(currentVal);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, target]);

  return (
    <span ref={ref}>
      {count < target ? count.toLocaleString("en-IN") : "5K"}
      <span style={{ color: "#a5d6a7" }}>+</span>
    </span>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [offerProducts, setOfferProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const slideTimerRef = useRef(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [isHeroMuted, setIsHeroMuted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-unmute voice ONLY when active slide is a video and user interacts with the page
  useEffect(() => {
    const unmuteActiveVideoOnInteraction = () => {
      const el = document.getElementById("carouselExampleFade");
      if (el) {
        const activeItem = el.querySelector(".carousel-item.active");
        const vid = activeItem?.querySelector("video");
        if (vid) {
          vid.muted = false;
          vid.volume = 1.0;
          if (isHeroPlaying) {
            vid.play().catch(() => {});
          }
          setIsHeroMuted(false);
        }
      }
    };

    const events = ["click", "touchstart", "pointerdown", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, unmuteActiveVideoOnInteraction, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, unmuteActiveVideoOnInteraction);
      });
    };
  }, [isHeroPlaying]);

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
    const loadHeroSlides = async () => {
      try {
        const settings = await fetchSettings();
        if (settings && typeof settings === "object") {
          const slides = Object.keys(settings)
            .filter((k) => k.startsWith("home_hero_") || k.startsWith("hero_slider_"))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
            .map((k) => settings[k])
            .filter((val) => val && typeof val === "string" && val.trim().length > 0);
          if (slides.length > 0) {
            setHeroSlides(slides);
          }
        }
      } catch (err) {
        console.error("Failed to load hero slides from settings", err);
      }
    };

    loadCategories();
    loadOfferProducts();
    loadHeroSlides();
  }, []);

  // Helper to reliably advance the carousel across all Bootstrap & DOM states
  const advanceCarouselNext = () => {
    const el = document.getElementById("carouselExampleFade");
    if (!el) return;

    try {
      if (window.bootstrap?.Carousel) {
        const bsCarousel =
          (typeof window.bootstrap.Carousel.getInstance === "function" && window.bootstrap.Carousel.getInstance(el)) ||
          new window.bootstrap.Carousel(el, { interval: false, pause: false, ride: false, wrap: true });
        if (bsCarousel && typeof bsCarousel.next === "function") {
          bsCarousel.next();
          return;
        }
      }
    } catch (err) {
      console.warn("Bootstrap Carousel instance next() warning:", err);
    }

    // Direct fallback: click the next arrow button
    const nextBtn = el.querySelector(".carousel-control-next");
    if (nextBtn) {
      nextBtn.click();
      return;
    }

    // jQuery fallback if loaded
    if (window.$ && typeof window.$ === "function") {
      try {
        window.$(el).carousel("next");
      } catch (e) {}
    }
  };

  // 10-Second image timer scheduler
  const scheduleNextImageSlide = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
    if (!isHeroPlaying) return;

    slideTimerRef.current = setTimeout(() => {
      advanceCarouselNext();
    }, 10000); // exactly 10 seconds for image slides
  };

  // Called when video finishes playing its full length (3.57 minutes)
  const handleVideoEnded = () => {
    if (heroSlides.length > 1) {
      advanceCarouselNext();
    }
  };

  // Unified Carousel Controller
  useEffect(() => {
    const el = document.getElementById("carouselExampleFade");
    if (!el) return;

    try {
      if (window.bootstrap?.Carousel) {
        (typeof window.bootstrap.Carousel.getInstance === "function" && window.bootstrap.Carousel.getInstance(el)) ||
          new window.bootstrap.Carousel(el, {
            interval: false,
            pause: false,
            ride: false,
            wrap: true,
          });
      }
    } catch (err) {
      console.warn("Bootstrap Carousel initialization warning:", err);
    }

    // When slide starts transitioning:
    const handleSlide = () => {
      // Clear any pending image timer
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
        slideTimerRef.current = null;
      }
      // Immediately stop all video audio & playback
      const videos = el.querySelectorAll("video");
      videos.forEach((vid) => {
        try {
          vid.pause();
        } catch (e) {}
      });
    };

    // When slide transition completes (slide becomes visible):
    const handleSlid = () => {
      const activeItem = el.querySelector(".carousel-item.active");
      if (!activeItem) return;

      const vid = activeItem.querySelector("video");
      if (vid) {
        // VIDEO SLIDE IS VISIBLE: Audio and video start playing only now!
        vid.currentTime = 0;
        vid.muted = isHeroMuted;
        vid.volume = 1.0;
        if (isHeroPlaying) {
          vid.play().catch(() => {
            // If browser blocks unmuted autoplay before interaction, start muted and allow one-click unmute
            vid.muted = true;
            setIsHeroMuted(true);
            vid.play().catch(() => {});
          });
        }
        // Special: Do NOT set any 10-second timer! It stays for the full 3.57 minutes!
      } else {
        // IMAGE SLIDE IS VISIBLE: Start 10-second timer
        scheduleNextImageSlide();
      }
    };

    el.addEventListener("slide.bs.carousel", handleSlide);
    el.addEventListener("slid.bs.carousel", handleSlid);

    // Initial check on mount:
    const activeItem = el.querySelector(".carousel-item.active");
    const vid = activeItem?.querySelector("video");
    if (vid) {
      vid.currentTime = 0;
      vid.muted = isHeroMuted;
      vid.volume = 1.0;
      if (isHeroPlaying) {
        vid.play().catch(() => {});
      }
    } else {
      scheduleNextImageSlide();
    }

    return () => {
      el.removeEventListener("slide.bs.carousel", handleSlide);
      el.removeEventListener("slid.bs.carousel", handleSlid);
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
        slideTimerRef.current = null;
      }
    };
  }, [heroSlides, isHeroPlaying, isHeroMuted]);

  const toggleHeroSound = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const el = document.getElementById("carouselExampleFade");
    const nextMuted = !isHeroMuted;
    setIsHeroMuted(nextMuted);

    if (el) {
      const activeItem = el.querySelector(".carousel-item.active");
      const vid = activeItem?.querySelector("video");
      if (vid) {
        vid.muted = nextMuted;
        if (!nextMuted) {
          vid.volume = 1.0;
          vid.play().catch(() => {});
        }
      }
    }
  };

  const toggleHeroPlayPause = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const el = document.getElementById("carouselExampleFade");
    const nextPlaying = !isHeroPlaying;
    setIsHeroPlaying(nextPlaying);

    if (el) {
      const activeItem = el.querySelector(".carousel-item.active");
      const vid = activeItem?.querySelector("video");

      if (vid) {
        // On video slide: stop or play both video and audio together!
        if (nextPlaying) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      } else {
        // On image slide: pause or resume the 10-second timer
        if (slideTimerRef.current) {
          clearTimeout(slideTimerRef.current);
          slideTimerRef.current = null;
        }
        if (nextPlaying) {
          scheduleNextImageSlide();
        }
      }
    }
  };

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
                <div className="container-fluid px-0">
                  <div
                    id="carouselExampleFade"
                    className="carousel slide carousel-fade"
                    data-bs-ride="false"
                    data-bs-pause="false"
                    data-bs-interval="false"
                  >
                    <div className="carousel-inner">
                      {heroSlides.length > 0 ? (
                        heroSlides.map((slideUrl, idx) => (
                          <div
                            key={idx}
                            className={`carousel-item ${idx === 0 ? "active" : ""}`}
                            data-bs-interval="false"
                          >
                            <Link to="/Product" className="d-block w-100 h-100 position-relative">
                              {isVideoUrl(slideUrl) ? (
                                <video
                                  src={getImageUrl(slideUrl)}
                                  autoPlay
                                  loop={heroSlides.length <= 1}
                                  muted={isHeroMuted}
                                  playsInline
                                  className="hero-background-video"
                                  onEnded={handleVideoEnded}
                                />
                              ) : (
                                <img
                                  src={getImageUrl(slideUrl)}
                                  alt={`Vinnavar Banner ${idx + 1}`}
                                  className="img-fluid w-100"
                                />
                              )}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <>
                          {/* Slide 1 */}
                          <div className="carousel-item active" data-bs-interval="10000">
                            {/* Desktop Image */}
                            <Link to="/Product" className="d-none d-md-block">
                              <img
                                src={`${process.env.PUBLIC_URL}/HERO_01_DESKTOP.webp`}
                                alt="Vinnavar Organic Grains"
                                className="img-fluid w-100"
                              />
                            </Link>
                            {/* Mobile Image */}
                            <Link to="/Product" className="d-block d-md-none">
                              <img
                                src={`${process.env.PUBLIC_URL}/HERO_01_MOBILE.webp`}
                                alt="Vinnavar Organic Grains"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>

                          {/* Slide 2 */}
                          <div className="carousel-item" data-bs-interval="10000">
                            {/* Desktop Image */}
                            <Link to="/Product" className="d-none d-md-block">
                              <img
                                src={`${process.env.PUBLIC_URL}/hero_02_desktop.webp`}
                                alt="Vinnavar Cold Pressed Oils"
                                className="img-fluid w-100"
                              />
                            </Link>
                            {/* Mobile Image */}
                            <Link to="/Product" className="d-block d-md-none">
                              <img
                                src={`${process.env.PUBLIC_URL}/hero_02_mobile.webp`}
                                alt="Vinnavar Cold Pressed Oils"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>

                          {/* Slide 3 */}
                          <div className="carousel-item" data-bs-interval="10000">
                            {/* Desktop Image */}
                            <Link to="/Product" className="d-none d-md-block">
                              <img
                                src={`${process.env.PUBLIC_URL}/HERO_03_DESKTOP.webp`}
                                alt="Vinnavar Natural Sweeteners"
                                className="img-fluid w-100"
                              />
                            </Link>
                            {/* Mobile Image */}
                            <Link to="/Product" className="d-block d-md-none">
                              <img
                                src={`${process.env.PUBLIC_URL}/HERO_03_MOBILE.webp`}
                                alt="Vinnavar Natural Sweeteners"
                                className="img-fluid w-100"
                              />
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                    <Link
                      className="carousel-control-prev"
                      to="#carouselExampleFade"
                      role="button"
                      data-bs-slide="prev"
                      title="Previous banner"
                      aria-label="Previous banner"
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
                      title="Next banner (Skip)"
                      aria-label="Next banner (Skip)"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </Link>

                    {/* Floating Controls (Sound Toggle & Auto-Play / Pause) */}
                    <div className="hero-floating-controls">
                      {heroSlides.some((url) => isVideoUrl(url)) && (
                        <button
                          type="button"
                          className={`hero-sound-btn ${isHeroMuted ? "is-muted" : "is-unmuted"}`}
                          onClick={toggleHeroSound}
                          title={isHeroMuted ? "Click to unmute voice / sound" : "Click to mute voice"}
                          aria-label={isHeroMuted ? "Unmute voice" : "Mute voice"}
                        >
                          <span className="hero-sound-icon">{isHeroMuted ? "🔇" : "🔊"}</span>
                          <span className="hero-sound-label">{isHeroMuted ? "Unmute Voice" : "Voice On"}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="hero-play-pause-btn"
                        onClick={toggleHeroPlayPause}
                        title={isHeroPlaying ? "Pause autoplay" : "Start autoplay"}
                        aria-label={isHeroPlaying ? "Pause autoplay" : "Start autoplay"}
                      >
                        {isHeroPlaying ? (
                          <span className="hero-play-pause-icon">⏸</span>
                        ) : (
                          <span className="hero-play-pause-icon" style={{ marginLeft: "2px" }}>▶</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>

            {/* Colorful Animated Features & Trust Highlights */}
            <Fade direction="up" triggerOnce cascade damping={0.15}>
              <div className="home-features-bar container my-4 my-md-5">
                <div className="row g-3 g-md-4">
                  <div className="col-6 col-lg-3">
                    <div className="feature-highlight-card card-emerald">
                      <div className="feature-icon-wrapper">🌿</div>
                      <div className="feature-text-content">
                        <h6 className="feature-title">100% Certified Organic</h6>
                        <p className="feature-desc">Naturally grown, no chemical preservatives</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3">
                    <div className="feature-highlight-card card-amber">
                      <div className="feature-icon-wrapper">🌾</div>
                      <div className="feature-text-content">
                        <h6 className="feature-title">Traditional & Pure</h6>
                        <p className="feature-desc">Wood cold-pressed & unpolished grains</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3">
                    <div className="feature-highlight-card card-sky">
                      <div className="feature-icon-wrapper">🚚</div>
                      <div className="feature-text-content">
                        <h6 className="feature-title">Fast Doorstep Delivery</h6>
                        <p className="feature-desc">Safely packed & delivered across India</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3">
                    <div className="feature-highlight-card card-coral">
                      <div className="feature-icon-wrapper">👨‍🌾</div>
                      <div className="feature-text-content">
                        <h6 className="feature-title">Direct From Farmers</h6>
                        <p className="feature-desc">Empowering authentic rural growers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>

            {/* section category */}
            <Fade direction="up" triggerOnce fraction={0.1}>
                <section className="home-category-section my-lg-14 my-8 py-5">
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
                                    to={`/Product?category=${cat.id}`}
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
                                    title={cat.nameTranslations?.[currentLang] || cat.name}
                                  >
                                    <Link to={`/Product?category=${cat.id}`} className="text-dark text-decoration-none">
                                      {cat.nameTranslations?.[currentLang] || cat.name}
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
                                    title={cat.descriptionTranslations?.[currentLang] || cat.description}
                                  >
                                    {cat.descriptionTranslations?.[currentLang] || cat.description || "Premium quality organically grown products."}
                                  </p>
                                  <Link
                                    to={`/Product?category=${cat.id}`}
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
            </Fade>

            <OrganicProductList categoryId={selectedCategoryId} limit={12} />

            <Fade direction="up" triggerOnce fraction={0.1}>
              <TestimonialsCarousel />
            </Fade>

            <Fade direction="up" triggerOnce fraction={0.1}>
              <FAQ />
            </Fade>

            {/* Visitor Count Banner with Animated Counter */}
            <Fade direction="up" triggerOnce fraction={0.15}>
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
                    <AnimatedVisitorCount target={5000} />
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
            </Fade>

            {/* Store Location Map Section (Above Footer) */}
            <Fade direction="up" triggerOnce fraction={0.15}>
              <section className="my-5 py-2">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm">
                        {/* Section Title & Store Info */}
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 pb-3 border-bottom gap-3">
                          <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2.5 py-1.5 rounded-pill" style={{ color: "#2d6a4f", fontSize: "0.8rem" }}>
                                📍 {t("store_location_badge", "OUR STORE & DISTRIBUTION CENTER")}
                              </span>
                            </div>
                            <h3 className="fw-bold text-dark fs-4 mb-1">
                              {t("store_location_title", "Visit LP Traders (Vinnavar Brand Groceries)")}
                            </h3>
                            <p className="text-muted small mb-0">
                              #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Ariyapadi, Tamil Nadu - 632314
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href="https://maps.app.goo.gl/42JywxrkAbVS9y6h8"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-success btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-2xs"
                            >
                              <span>{t("open_in_google_maps", "Open in Google Maps")}</span>
                              <span style={{ fontSize: "1rem" }}>↗</span>
                            </a>
                          </div>
                        </div>

                        {/* Responsive Google Maps Embed */}
                        <div
                          className="rounded-3 overflow-hidden position-relative border"
                          style={{
                            width: "100%",
                            height: "420px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          <iframe
                            title="LP Traders Vinnavar Brand Groceries Location"
                            src="https://maps.google.com/maps?q=LP%20Traders%20(Vinnavar%20Brand%20Groceries)%2C%2016%2C%20MS%20Nagar%2C%20Phase%202%2C%20Arni%2C%20Ariyapadi%2C%20Tamil%20Nadu%20632314&hl=en&z=15&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Fade>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
