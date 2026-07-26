import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import { Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";
import { fetchBlogsByCategory, fetchBlogs, fetchBlogCategories, getImageUrl } from "../../services/api";

const BlogCategory = () => {
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category") || "Recipes";

  useEffect(() => {
    const loadCategoryBlogs = async () => {
      try {
        setLoaderStatus(true);
        const [catBlogs, catList] = await Promise.all([
          selectedCategory === "All" ? fetchBlogs() : fetchBlogsByCategory(selectedCategory),
          fetchBlogCategories()
        ]);
        setBlogs(catBlogs || []);
        setCategories(catList || []);
      } catch (err) {
        console.error("Error fetching category blogs:", err);
      } finally {
        setLoaderStatus(false);
      }
    };

    loadCategoryBlogs();
  }, [selectedCategory]);

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
                  <div className="col-md-6 col-12 mb-4">
                    <h1 className="fw-bold">{selectedCategory}</h1>
                    <p className="text-muted">
                      Discover our curated organic articles and recipes for {selectedCategory}.
                    </p>
                  </div>

                  {/* Category Nav Links */}
                  <div className="col-md-6 col-12 text-md-end mb-4">
                    <div className="d-flex flex-wrap justify-content-md-end gap-2">
                      <Link
                        to="/BlogCategory?category=All"
                        className={`btn btn-sm rounded-pill ${
                          selectedCategory === "All" ? "btn-success" : "btn-outline-success"
                        }`}
                      >
                        All
                      </Link>
                      {categories.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/BlogCategory?category=${encodeURIComponent(cat)}`}
                          className={`btn btn-sm rounded-pill ${
                            selectedCategory.toLowerCase() === cat.toLowerCase()
                              ? "btn-success"
                              : "btn-outline-success"
                          }`}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Articles Grid */}
            <section className="mb-lg-14 mb-8">
              <div className="container">
                <div className="row">
                  {blogs.length === 0 ? (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">No articles found in this category.</p>
                      <Link to="/Blog" className="btn btn-outline-success rounded-pill mt-2">
                        Back to All Blogs
                      </Link>
                    </div>
                  ) : (
                    blogs.map((blog) => (
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
                          <span className="text-success fw-bold small text-uppercase">{blog.category}</span>
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

export default BlogCategory;
