import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import ScrollToTop from "../ScrollToTop";
import { fetchBlogBySlug, fetchBlogsByCategory, fetchBlogs, getImageUrl } from "../../services/api";

const BlogSingle = () => {
  const { slug: routeSlug } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const slug = routeSlug || queryParams.get("slug") || "garlic-cream-bucatini-peas-asparagus";

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadBlogDetail = async () => {
      try {
        setLoading(true);
        let article = await fetchBlogBySlug(slug);
        
        // Fallback to first blog if slug is not found
        if (!article) {
          const all = await fetchBlogs();
          if (all && all.length > 0) article = all[0];
        }

        setBlog(article);

        if (article && article.category) {
          const related = await fetchBlogsByCategory(article.category);
          setRelatedBlogs((related || []).filter((b) => b.id !== article.id).slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading blog details:", err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    loadBlogDetail();
  }, [slug]);

  // Robust Markdown & List Parser
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const rawLines = content.split("\n");
    const elements = [];
    let currentList = [];
    let listType = null; // 'bullet' or 'numbered'

    const flushList = (keyPrefix) => {
      if (currentList.length === 0) return;

      if (listType === "bullet") {
        elements.push(
          <div key={`list-${keyPrefix}`} className="card border-0 bg-light p-4 rounded-4 my-4 shadow-sm">
            <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
              <span>🥗</span> Key Ingredients & Items Required
            </h5>
            <div className="row g-3">
              {currentList.map((item, iIdx) => (
                <div key={iIdx} className="col-12 col-md-6 d-flex align-items-start gap-2">
                  <span className="text-success fs-5 mt-n1">✅</span>
                  <span className="text-dark fw-medium" style={{ lineHeight: "1.55" }}>
                    {renderInlineStyles(item)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (listType === "numbered") {
        elements.push(
          <div key={`list-${keyPrefix}`} className="my-4 ps-1">
            {currentList.map((item, iIdx) => (
              <div key={iIdx} className="d-flex align-items-start gap-3 mb-3 p-3.5 bg-white rounded-4 border shadow-sm">
                <span
                  className="badge bg-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                  style={{ width: "32px", height: "32px", fontSize: "0.95rem" }}
                >
                  {iIdx + 1}
                </span>
                <div className="text-dark pt-1" style={{ lineHeight: "1.7", fontSize: "1.05rem" }}>
                  {renderInlineStyles(item)}
                </div>
              </div>
            ))}
          </div>
        );
      }

      currentList = [];
      listType = null;
    };

    rawLines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(idx);
        return;
      }

      // Check Bullet (- or *)
      if (/^[-*]\s+/.test(trimmed)) {
        if (listType && listType !== "bullet") flushList(idx);
        listType = "bullet";
        currentList.push(trimmed.replace(/^[-*]\s+/, ""));
        return;
      }

      // Check Numbered (1. 2.)
      if (/^\d+\.\s+/.test(trimmed)) {
        if (listType && listType !== "numbered") flushList(idx);
        listType = "numbered";
        currentList.push(trimmed.replace(/^\d+\.\s+/, ""));
        return;
      }

      // Non-list line encountered
      flushList(idx);

      // Check Headers
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="fw-bold text-dark mt-4 mb-3" style={{ fontSize: "1.4rem" }}>
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="fw-bold text-dark mt-5 mb-3" style={{ fontSize: "1.75rem" }}>
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="fw-bold text-dark mt-5 mb-3" style={{ fontSize: "2rem" }}>
            {trimmed.replace(/^#\s+/, "")}
          </h1>
        );
      } else {
        elements.push(
          <p key={idx} className="text-secondary mb-3.5" style={{ fontSize: "1.1rem", lineHeight: "1.85" }}>
            {renderInlineStyles(trimmed)}
          </p>
        );
      }
    });

    flushList("end");
    return elements;
  };

  // Helper for bold **text** in markdown
  const renderInlineStyles = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="fw-bold text-dark">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div>
      {loading ? (
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
      ) : !blog ? (
        <div className="container py-5 text-center">
          <h3>Blog article not found</h3>
          <Link to="/Blog" className="btn btn-success rounded-pill mt-3">
            Back to All Articles
          </Link>
        </div>
      ) : (
        <>
          <ScrollToTop />
          <div className="bg-light py-4 border-bottom">
            <div className="container">
              {/* Breadcrumbs */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none text-muted">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/Blog" className="text-decoration-none text-muted">
                      Blog
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link
                      to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                      className="text-decoration-none text-muted"
                    >
                      {blog.category}
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
                    {blog.title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <article className="py-8">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-9 col-12">
                  {/* Category Pill */}
                  <div className="mb-3">
                    <Link
                      to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                      className="badge bg-success px-3 py-1.5 text-uppercase fw-bold text-decoration-none rounded-pill"
                    >
                      {blog.category}
                    </Link>
                  </div>

                  {/* Main Title */}
                  <h1 className="fw-bold display-5 text-dark mb-4" style={{ lineHeight: "1.25" }}>
                    {blog.title}
                  </h1>

                  {/* Excerpt Lead */}
                  {blog.shortDescription && (
                    <p className="lead text-muted mb-4 fs-5" style={{ lineHeight: "1.6" }}>
                      {blog.shortDescription}
                    </p>
                  )}

                  {/* Main Featured Image */}
                  <div className="mb-5">
                    <img
                      src={getImageUrl(blog.imageUrl)}
                      alt={blog.title}
                      className="img-fluid rounded-4 shadow-sm w-100"
                      style={{ maxHeight: "500px", objectFit: "cover" }}
                    />
                  </div>

                  {/* Article Body Content */}
                  <div className="article-body bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
                    {renderFormattedContent(blog.content)}
                  </div>

                  {/* Back to Blog Action Bar */}
                  <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                    <Link to="/Blog" className="btn btn-outline-success rounded-pill px-4 fw-semibold">
                      ← Back to All Articles
                    </Link>
                    <Link
                      to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                      className="btn btn-success text-white rounded-pill px-4 fw-semibold"
                    >
                      More in {blog.category} →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related Articles Section */}
              {relatedBlogs.length > 0 && (
                <div className="mt-10 pt-5 border-top">
                  <h3 className="fw-bold mb-4 text-center">Related Articles You Might Enjoy</h3>
                  <div className="row">
                    {relatedBlogs.map((rel) => (
                      <div key={rel.id} className="col-12 col-md-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                          <Link to={`/blog/${rel.slug}`}>
                            <img
                              src={getImageUrl(rel.imageUrl)}
                              alt={rel.title}
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </Link>
                          <div className="card-body p-4 d-flex flex-column">
                            <span className="text-success fw-bold small text-uppercase mb-2">
                              {rel.category}
                            </span>
                            <h5 className="card-title fw-bold mb-2">
                              <Link to={`/blog/${rel.slug}`} className="text-dark text-decoration-none">
                                {rel.title}
                              </Link>
                            </h5>
                            <p className="card-text text-muted small flex-grow-1">
                              {rel.shortDescription || (rel.content?.substring(0, 90) + "...")}
                            </p>
                            <Link
                              to={`/blog/${rel.slug}`}
                              className="btn btn-sm btn-outline-success rounded-pill mt-3 align-self-start fw-semibold"
                            >
                              Read Full Article →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </>
      )}
    </div>
  );
};

export default BlogSingle;
