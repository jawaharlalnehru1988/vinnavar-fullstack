import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";
import { fetchBlogs, fetchBlogCategories, getImageUrl } from "../../services/api";

const Blog = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setLoaderStatus(true);
        const [blogList, catList] = await Promise.all([
          fetchBlogs(),
          fetchBlogCategories()
        ]);

        setBlogs(blogList || []);
        setCategories(catList || []);
      } catch (err) {
        console.error("Error loading blog data:", err);
      } finally {
        setLoaderStatus(false);
      }
    };

    loadBlogData();
  }, []);

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter(b => b.category?.toLowerCase() === selectedCategory.toLowerCase());

  const heroBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);

  return (
    <div>
      {loaderStatus ? (
        <div className="loader-container">
          <MagnifyingGlass
            visible={true}
            height="100"
            width="100"
            ariaLabel="magnifying-glass-loading"
            glassColor="#c0efff"
            color="#0aad0a"
          />
        </div>
      ) : (
        <>
          <ScrollToTop />
          <div>
            {/* Header section */}
            <section className="mt-8">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <h1 className="fw-bold">Vinnavar Organic Blog</h1>
                    <p className="text-muted">
                      Explore recipes, healthy living guides, and traditional organic farming wisdom.
                    </p>
                  </div>

                  {/* Category Pills Filter */}
                  <div className="col-md-6 col-12 text-md-end mt-3 mt-md-0">
                    <div className="d-flex flex-wrap justify-content-md-end gap-2">
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className={`btn btn-sm rounded-pill ${
                          selectedCategory === "All" ? "btn-success" : "btn-outline-success"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCategory(cat)}
                          className={`btn btn-sm rounded-pill ${
                            selectedCategory.toLowerCase() === cat.toLowerCase()
                              ? "btn-success"
                              : "btn-outline-success"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Content Section */}
            <section className="mt-6 mb-lg-14 mb-8">
              <div className="container">
                {/* Hero Top Blog */}
                {heroBlog && (
                  <div className="row d-flex align-items-center mb-8">
                    <div className="col-12 col-md-12 col-lg-8">
                      <Link to={`/blog/${heroBlog.slug}`}>
                        <Fade>
                          <div className="img-zoom">
                            <img
                              src={getImageUrl(heroBlog.imageUrl)}
                              alt={heroBlog.title}
                              className="img-fluid rounded-3 w-100"
                              style={{ maxHeight: "420px", objectFit: "cover" }}
                            />
                          </div>
                        </Fade>
                      </Link>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4">
                      <Slide direction="down">
                        <div className="ps-lg-8 mt-8 mt-lg-0">
                          <Link
                            to={`/BlogCategory?category=${encodeURIComponent(heroBlog.category)}`}
                            className="badge bg-success mb-2 px-3 py-1 font-monospace text-decoration-none"
                          >
                            {heroBlog.category}
                          </Link>
                          <h2 className="mb-3">
                            <Link to={`/blog/${heroBlog.slug}`} className="text-inherit text-decoration-none">
                              {heroBlog.title}
                            </Link>
                          </h2>
                          <p className="text-secondary">{heroBlog.shortDescription || heroBlog.content}</p>
                          <Link to={`/blog/${heroBlog.slug}`} className="btn btn-sm btn-success rounded-pill fw-semibold mt-2">
                            Read Full Article →
                          </Link>
                        </div>
                      </Slide>
                    </div>
                  </div>
                )}

                {/* Grid of Blog Posts */}
                <div className="row">
                  {gridBlogs.length === 0 && !heroBlog ? (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">No blog posts found in this category.</p>
                    </div>
                  ) : (
                    gridBlogs.map((blog) => (
                      <div key={blog.id} className="col-12 col-md-6 col-lg-4 mb-8">
                        <Zoom>
                          <div className="mb-4">
                            <Link to={`/blog/${blog.slug}`}>
                              <div className="img-zoom">
                                <img
                                  src={getImageUrl(blog.imageUrl)}
                                  alt={blog.title}
                                  className="img-fluid rounded-3 w-100"
                                  style={{ height: "240px", objectFit: "cover" }}
                                />
                              </div>
                            </Link>
                          </div>
                        </Zoom>
                        <div className="mb-2">
                          <Link
                            to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                            className="text-success fw-bold text-decoration-none small text-uppercase"
                          >
                            {blog.category}
                          </Link>
                        </div>
                        <div>
                          <h2 className="h5 mb-2">
                            <Link to={`/blog/${blog.slug}`} className="text-inherit text-decoration-none">
                              {blog.title}
                            </Link>
                          </h2>
                          <p className="text-muted small">
                            {blog.shortDescription || (blog.content?.substring(0, 100) + "...")}
                          </p>
                          <Link to={`/blog/${blog.slug}`} className="btn btn-sm btn-outline-success rounded-pill fw-semibold mt-2">
                            Read Full Article →
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
