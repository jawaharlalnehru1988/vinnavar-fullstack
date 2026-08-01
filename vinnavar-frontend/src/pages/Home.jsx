import { getImageUrl, fetchCategories } from "../services/api";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Zoom } from "react-awesome-reveal";
import { MagnifyingGlass } from "react-loader-spinner";
import FAQ from "./FooterElements/Faq";
import OrganicProductList from "../Component/OrganicProductList";

const bannerdeal = getImageUrl("/media/site/banner-deal1.jpg");
const product11 = getImageUrl("/media/products/product-img-11.jpg");
const product12 = getImageUrl("/media/products/product-img-12.jpg");
const product13 = getImageUrl("/media/products/product-img-13.jpg");
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

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
                          <div className="images swiper-slide px-4 ">
                            <div className="col ">
                              <div className="card card-product">
                                <div className="card-body">
                                  <div className="text-center  position-relative ">
                                    {" "}
                                    <Link to="#!">
                                      <img
                                        src={product11}
                                        alt="Grocery Ecommerce Template"
                                        className="mb-3 img-fluid"
                                      />
                                    </Link>
                                    <div className="card-product-action">
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quickViewModal"
                                      >
                                        <i
                                          className="bi bi-eye"
                                          data-bs-toggle="tooltip"
                                          data-bs-html="true"
                                          title="Quick View"
                                        />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Wishlist"
                                      >
                                        <i className="bi bi-heart" />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Compare"
                                      >
                                        <i className="bi bi-arrow-left-right" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="text-small mb-1">
                                    <Link
                                      to="#!"
                                      className="text-decoration-none text-muted"
                                    >
                                      <small>Fruits &amp; Vegetables</small>
                                    </Link>
                                  </div>
                                  <h2 className="fs-6">
                                    <Link
                                      to="#!"
                                      className="text-inherit text-decoration-none"
                                    >
                                      Golden Pineapple
                                    </Link>
                                  </h2>
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                      <span className="text-dark">$13</span>{" "}
                                      <span className="text-decoration-line-through text-muted">
                                        $18
                                      </span>
                                    </div>
                                    <div>
                                      <small className="text-warning">
                                        {" "}
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-half" />
                                      </small>
                                      <span>
                                        <small>4.5</small>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-grid mt-2">
                                    <Link to="#!" className="btn btn-primary ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-plus"
                                      >
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                      </svg>{" "}
                                      Add to cart{" "}
                                    </Link>
                                  </div>
                                  <div className="d-flex justify-content-start text-center mt-3">
                                    <div
                                      className="deals-countdown w-100"
                                      data-countdown="2022/11/11 00:00:00"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="images swiper-slide px-4">
                            <div className="col">
                              <div className="card card-product">
                                <div className="card-body">
                                  <div className="text-center  position-relative ">
                                    {" "}
                                    <Link to="#!">
                                      <img
                                        src={product12}
                                        alt="Grocery Ecommerce Template"
                                        className="mb-3 img-fluid"
                                      />
                                    </Link>
                                    <div className="card-product-action">
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quickViewModal"
                                      >
                                        <i
                                          className="bi bi-eye"
                                          data-bs-toggle="tooltip"
                                          data-bs-html="true"
                                          title="Quick View"
                                        />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Wishlist"
                                      >
                                        <i className="bi bi-heart" />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Compare"
                                      >
                                        <i className="bi bi-arrow-left-right" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="text-small mb-1">
                                    <Link
                                      to="#!"
                                      className="text-decoration-none text-muted"
                                    >
                                      <small>Fruits &amp; Vegetables</small>
                                    </Link>
                                  </div>
                                  <h2 className="fs-6">
                                    <Link
                                      to="#!"
                                      className="text-inherit text-decoration-none"
                                    >
                                      Golden Pineapple
                                    </Link>
                                  </h2>
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                      <span className="text-dark">$13</span>{" "}
                                      <span className="text-decoration-line-through text-muted">
                                        $18
                                      </span>
                                    </div>
                                    <div>
                                      <small className="text-warning">
                                        {" "}
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-half" />
                                      </small>
                                      <span>
                                        <small>4.5</small>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-grid mt-2">
                                    <Link to="#!" className="btn btn-primary ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-plus"
                                      >
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                      </svg>{" "}
                                      Add to cart{" "}
                                    </Link>
                                  </div>
                                  <div className="d-flex justify-content-start text-center mt-3">
                                    <div
                                      className="deals-countdown w-100"
                                      data-countdown="2022/11/11 00:00:00"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="images swiper-slide px-4">
                            <div className="col">
                              <div className="card card-product">
                                <div className="card-body">
                                  <div className="text-center  position-relative ">
                                    {" "}
                                    <Link to="#!">
                                      <img
                                        src={product13}
                                        alt="Grocery Ecommerce Template"
                                        className="mb-3 img-fluid"
                                      />
                                    </Link>
                                    <div className="card-product-action">
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quickViewModal"
                                      >
                                        <i
                                          className="bi bi-eye"
                                          data-bs-toggle="tooltip"
                                          data-bs-html="true"
                                          title="Quick View"
                                        />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Wishlist"
                                      >
                                        <i className="bi bi-heart" />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Compare"
                                      >
                                        <i className="bi bi-arrow-left-right" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="text-small mb-1">
                                    <Link
                                      to="#!"
                                      className="text-decoration-none text-muted"
                                    >
                                      <small>Fruits &amp; Vegetables</small>
                                    </Link>
                                  </div>
                                  <h2 className="fs-6">
                                    <Link
                                      to="#!"
                                      className="text-inherit text-decoration-none"
                                    >
                                      Golden Pineapple
                                    </Link>
                                  </h2>
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                      <span className="text-dark">$13</span>{" "}
                                      <span className="text-decoration-line-through text-muted">
                                        $18
                                      </span>
                                    </div>
                                    <div>
                                      <small className="text-warning">
                                        {" "}
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-half" />
                                      </small>
                                      <span>
                                        <small>4.5</small>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-grid mt-2">
                                    <Link to="#!" className="btn btn-primary ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-plus"
                                      >
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                      </svg>{" "}
                                      Add to cart{" "}
                                    </Link>
                                  </div>
                                  <div className="d-flex justify-content-start text-center mt-3">
                                    <div
                                      className="deals-countdown w-100"
                                      data-countdown="2022/11/11 00:00:00"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="images swiper-slide px-4">
                            <div className="col">
                              <div className="card card-product">
                                <div className="card-body">
                                  <div className="text-center  position-relative ">
                                    {" "}
                                    <Link to="#!">
                                      <img
                                        src={product13}
                                        alt="Grocery Ecommerce Template"
                                        className="mb-3 img-fluid"
                                      />
                                    </Link>
                                    <div className="card-product-action">
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="modal"
                                        data-bs-target="#quickViewModal"
                                      >
                                        <i
                                          className="bi bi-eye"
                                          data-bs-toggle="tooltip"
                                          data-bs-html="true"
                                          title="Quick View"
                                        />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Wishlist"
                                      >
                                        <i className="bi bi-heart" />
                                      </Link>
                                      <Link
                                        to="#!"
                                        className="btn-action"
                                        data-bs-toggle="tooltip"
                                        data-bs-html="true"
                                        title="Compare"
                                      >
                                        <i className="bi bi-arrow-left-right" />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="text-small mb-1">
                                    <Link
                                      to="#!"
                                      className="text-decoration-none text-muted"
                                    >
                                      <small>Fruits &amp; Vegetables</small>
                                    </Link>
                                  </div>
                                  <h2 className="fs-6">
                                    <Link
                                      to="#!"
                                      className="text-inherit text-decoration-none"
                                    >
                                      Golden Pineapple
                                    </Link>
                                  </h2>
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                      <span className="text-dark">$13</span>{" "}
                                      <span className="text-decoration-line-through text-muted">
                                        $18
                                      </span>
                                    </div>
                                    <div>
                                      <small className="text-warning">
                                        {" "}
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-fill" />
                                        <i className="bi bi-star-half" />
                                      </small>
                                      <span>
                                        <small>4.5</small>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-grid mt-2">
                                    <Link to="#!" className="btn btn-primary ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-plus"
                                      >
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                      </svg>{" "}
                                      Add to cart{" "}
                                    </Link>
                                  </div>
                                  <div className="d-flex justify-content-start text-center mt-3">
                                    <div
                                      className="deals-countdown w-100"
                                      data-countdown="2022/11/11 00:00:00"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
                    <div className="row g-4 justify-content-center">
                      {categories.slice(0, 4).map((cat) => (
                        <div key={cat.id} className="col-lg-3 col-md-6 col-12 fade-zoom">
                          <Zoom>
                            <div className="card h-100 category-card border-0 shadow-sm rounded-3 overflow-hidden">
                              {/* Category Image */}
                              <div className="position-relative overflow-hidden category-img-container" style={{ height: "200px" }}>
                                <Link to="#" onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}>
                                  <img
                                    src={cat.imageUrl ? getImageUrl(cat.imageUrl) : getImageUrl("/media/site/category-atta-rice-dal.jpg")}
                                    alt={cat.name}
                                    className="w-100 h-100 object-fit-cover"
                                  />
                                </Link>
                                <span className="position-absolute top-0 start-0 m-3 badge bg-success opacity-85 fs-7 rounded-pill shadow-sm">
                                  ID: {cat.id}
                                </span>
                              </div>
                              {/* Category Content */}
                              <div className="card-body p-4 d-flex flex-column">
                                <h4 className="fs-5 fw-bold mb-2">
                                  <Link to="#" className="text-dark text-decoration-none" onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}>
                                    {cat.name}
                                  </Link>
                                </h4>
                                <p className="text-muted small mb-4 flex-grow-1" style={{ minHeight: "40px" }}>
                                  {cat.description || "Premium quality organically grown products."}
                                </p>
                                <Link
                                  to="#"
                                  onClick={(e) => { e.preventDefault(); setSelectedCategoryId(cat.id); }}
                                  className="btn btn-success btn-sm rounded-pill mt-auto fw-semibold py-2 w-100 shadow-sm"
                                >
                                  Browse Products
                                </Link>
                              </div>
                            </div>
                          </Zoom>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
              {/* section */}
            </>
            <>
              <OrganicProductList categoryId={selectedCategoryId} />
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
            <FAQ/>
            </>


            
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
