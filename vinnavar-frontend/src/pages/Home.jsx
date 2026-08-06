import { getImageUrl, fetchCategories, fetchProducts, API_BASE_URL, toggleWishlist } from "../services/api";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Zoom } from "react-awesome-reveal";
import { MagnifyingGlass } from "react-loader-spinner";
import Swal from "sweetalert2";
import FAQ from "./FooterElements/Faq";
import OrganicProductList from "../Component/OrganicProductList";
import TestimonialsCarousel from "../Component/TestimonialsCarousel";
import { ProductSkeleton, CategorySkeleton, OfferProductSkeleton } from "../Component/Skeleton";

const bannerdeal = getImageUrl("/media/site/banner-deal1.jpg");
const product11 = getImageUrl("/media/products/product-img-11.jpg");
const refresh = getImageUrl("/media/site/refresh-cw.svg");
const clock = getImageUrl("/media/site/clock.svg");
const gift = getImageUrl("/media/site/gift.svg");
const package1 = getImageUrl("/media/site/package.svg");
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { PulseLoader } from 'react-spinners';

const Home = () => {
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

  const settings1 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
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
              <section>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12 mb-6">
                      <div className="section-head text-center mt-8">
                        <h3 className="h3style" data-title="Offers & Discounts">
                          Offers & Discounts
                        </h3>
                        <div className="wt-separator bg-primarys"></div>
                        <div className="wt-separator2 bg-primarys"></div>
                      </div>
                    </div>
                  </div>
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col-md-3 fade-in-left">
                      <div
                        className=" pt-8 px-8 rounded-3"
                        style={{
                          background: `url(${bannerdeal})no-repeat`,
                          backgroundSize: "cover",
                          height: 400,
                        }}
                      >
                        <div>
                          <h3 className="fw-bold text-white">
                            100% Organic Coffee Beans.
                          </h3>
                          <p className="text-white">
                            Get the best deal before close.
                          </p>
                          <Link to="#!" className="btn btn-primary">
                            Shop Now{" "}
                            <i className="feather-icon icon-arrow-right ms-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-9 ">
                      <div className="image-itemss">
                        <Slider {...settings1}>
                          {offerProducts.length > 0 ? (
                            offerProducts.map((product) => {
                              const defaultVar = product.variants?.find((v) => v.default) || product.variants?.[0];
                              const price = defaultVar?.discountPrice || defaultVar?.price || 0;
                              const originalPrice = defaultVar?.discountPrice ? defaultVar?.price : null;
                              const prodImg = product.imageUrl || defaultVar?.imageUrl ? getImageUrl(product.imageUrl || defaultVar?.imageUrl) : product11;

                              return (
                                <div key={product.id} className="images swiper-slide px-2">
                                  <div className="col">
                                    <div className="card card-product shadow-sm border-0 rounded-3">
                                      <div className="card-body p-3">
                                        <div className="text-center position-relative mb-2">
                                          {originalPrice && (
                                            <div className="position-absolute top-0 start-0">
                                              <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: "10px" }}>
                                                OFFER
                                              </span>
                                            </div>
                                          )}
                                          <Link to={`/product/${product.slug}`}>
                                            <img
                                              src={prodImg}
                                              alt={product.name}
                                              className="mb-2 img-fluid rounded"
                                              style={{ height: "140px", objectFit: "contain", width: "100%" }}
                                            />
                                          </Link>
                                          <div className="card-product-action">
                                            <Link
                                              to={`/product/${product.slug}`}
                                              className="btn-action"
                                              title="Quick View"
                                            >
                                              <i className="bi bi-eye" />
                                            </Link>
                                            <button
                                              type="button"
                                              className="btn-action border-0 bg-transparent"
                                              title="Wishlist"
                                              onClick={() => handleToggleWishlist(product)}
                                            >
                                              <i className="bi bi-heart text-danger" />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="text-small mb-1">
                                          <small className="text-muted fw-semibold">
                                            {product.category?.name || "Organic Staples"}
                                          </small>
                                        </div>
                                        <h2 className="fs-6 fw-bold mb-2 text-truncate">
                                          <Link
                                            to={`/product/${product.slug}`}
                                            className="text-inherit text-decoration-none text-dark"
                                          >
                                            {product.name}
                                          </Link>
                                        </h2>
                                        <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                          <div>
                                            <span className="text-dark fw-bold me-1">₹{price}</span>
                                            {originalPrice && (
                                              <span className="text-decoration-line-through text-muted small">
                                                ₹{originalPrice}
                                              </span>
                                            )}
                                          </div>
                                          <div>
                                            <small className="text-warning">
                                              <i className="bi bi-star-fill" />
                                              <i className="bi bi-star-fill" />
                                              <i className="bi bi-star-fill" />
                                              <i className="bi bi-star-fill" />
                                              <i className="bi bi-star-half" />
                                            </small>
                                            <span>
                                              <small className="ms-1 fw-semibold">4.5</small>
                                            </span>
                                          </div>
                                        </div>
                                        <div className="d-grid mt-2">
                                          <button
                                            type="button"
                                            className="btn btn-primary btn-sm fw-bold"
                                            onClick={() => handleAddToCart(product)}
                                          >
                                            + Add to cart
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <OfferProductSkeleton count={3} />
                          )}
                        </Slider>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              {/* section category */}
              <section className="my-lg-14 my-8">
                <div className="container ">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-6">
                        {/* heading    */}
                        <div className="section-head text-center mt-8">
                          <h3
                            className="h3style"
                            data-title="Shop Popular Categories"
                          >
                            Shop Popular Categories
                          </h3>
                          <div className="wt-separator bg-primarys"></div>
                          <div className="wt-separator2 bg-primarys"></div>
                          {/* <p>Connecting with entrepreneurs online, is just a few clicks away.</p> */}
                        </div>
                      </div>
                    </div>
                    <div className="row g-4 justify-content-center align-items-stretch">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <div key={cat.id} className="col-lg-3 col-md-6 col-12 d-flex">
                            <div className="card h-100 w-100 category-card border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                              {/* Category Image */}
                              <div
                                className="position-relative overflow-hidden category-img-container d-flex align-items-center justify-content-center p-3 bg-light"
                                style={{ height: "200px" }}
                              >
                                <Link
                                  to="#"
                                  onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}
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
                                  <Link to="#" className="text-dark text-decoration-none" onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}>
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
                                  to="#"
                                  onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}
                                  className="btn btn-success btn-sm rounded-pill mt-auto fw-bold py-2 w-100 shadow-sm"
                                >
                                  Browse Products
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12">
                          <CategorySkeleton count={4} />
                        </div>
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
              <section className="my-lg-14 my-8">
                <div className="container" style={{ marginTop: 50 }}>
                  <div
                    className="row justify-content-center  g-4"
                    style={{ textAlign: "center" }}
                  >
                    <div className="col-md-3 col-sm-6 fade-zoom ">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={refresh} alt="refresh" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Easy Returns</h3>
                              <p>
                                Not satisfied with a product? Return it at the
                                doorstep &amp; get a refund within hours. No
                                questions asked
                                <Link to="#!">policy</Link>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={package1} alt="package" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">Wide Assortment</h3>
                              <p>
                                Choose from 5000+ products across food, personal
                                care, household, bakery, veg and non-veg &amp;
                                other categories.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={gift} alt="gift" />
                              </div>
                            </div>
                            <div className="icon-content">
                              <h3 className="h5 mb-3">
                                Best Prices &amp; Offers
                              </h3>
                              <p>
                                Cheaper prices than your local supermarket,
                                great cashback offers to top it off. Get best
                                pricess &amp; offers.
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                    <div className="col-md-3 col-sm-12 fade-zoom">
                      <Zoom>
                        <div className="shadow-effect">
                          <div className="wt-icon-box-wraper center p-a25 p-b50 m-b30 bdr-1 bdr-gray bdr-solid corner-radius step-icon-box bg-white v-icon-effect">
                            <div className="icon-lg m-b20">
                              <div className="mb-6">
                                <img src={clock} alt="clock" />
                              </div>
                            </div>
                            <div className="icon-content">
                              {/* <h4 className="wt-tilte">Reports</h4> */}
                              <h3 className="h5 mb-3">10 minute grocery now</h3>
                              <p>
                                Get your order delivered to your doorstep at the
                                earliest from FreshCart pickup
                                <p> stores near you.</p>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Zoom>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <TestimonialsCarousel />
              <FAQ />
            </>


            
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
