import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
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
    let listType = null;

    const flushList = (keyPrefix) => {
      if (currentList.length === 0) return;

      if (listType === "bullet") {
        elements.push(
          <div key={`list-${keyPrefix}`} className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl my-6 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-emerald-800 text-sm flex items-center gap-2 uppercase tracking-wide">
              <span>🥗</span> Key Ingredients &amp; Items Required
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentList.map((item, iIdx) => (
                <div key={iIdx} className="flex items-start gap-2 text-slate-800 font-medium">
                  <span className="text-emerald-600 text-sm mt-0.5">✅</span>
                  <span className="leading-relaxed">{renderInlineStyles(item)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      } else if (listType === "numbered") {
        elements.push(
          <div key={`list-${keyPrefix}`} className="my-6 space-y-3">
            {currentList.map((item, iIdx) => (
              <div key={iIdx} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {iIdx + 1}
                </span>
                <div className="text-slate-800 text-sm leading-relaxed pt-0.5">
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

      if (/^[-*]\s+/.test(trimmed)) {
        if (listType && listType !== "bullet") flushList(idx);
        listType = "bullet";
        currentList.push(trimmed.replace(/^[-*]\s+/, ""));
        return;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        if (listType && listType !== "numbered") flushList(idx);
        listType = "numbered";
        currentList.push(trimmed.replace(/^\d+\.\s+/, ""));
        return;
      }

      flushList(idx);

      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="font-extrabold text-slate-900 text-lg mt-6 mb-3">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="font-black text-slate-900 text-xl mt-8 mb-4">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="font-black text-slate-900 text-2xl mt-8 mb-4">
            {trimmed.replace(/^#\s+/, "")}
          </h1>
        );
      } else {
        elements.push(
          <p key={idx} className="text-slate-600 text-sm leading-relaxed mb-4">
            {renderInlineStyles(trimmed)}
          </p>
        );
      }
    });

    flushList("end");
    return elements;
  };

  const renderInlineStyles = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="w-1/3 h-4 bg-slate-200/80 rounded-full"></div>
          <div className="w-3/4 h-10 bg-slate-200/80 rounded-full"></div>
          <div className="w-full h-80 bg-slate-200/80 rounded-3xl"></div>
        </div>
      ) : !blog ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white rounded-3xl border border-slate-100 p-8">
          <h3 className="font-black text-slate-900 text-lg">Article Not Found</h3>
          <Link to="/Blog" className="inline-block px-5 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-full">
            Back to All Articles
          </Link>
        </div>
      ) : (
        <>
          <ScrollToTop />
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-slate-500 space-x-2">
              <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-bold">Home</Link>
              <span>/</span>
              <Link to="/Blog" className="text-emerald-600 hover:text-emerald-700 font-bold">Blog</Link>
              <span>/</span>
              <Link to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`} className="text-slate-700 font-semibold">
                {blog.category}
              </Link>
            </nav>

            {/* Main Article Container */}
            <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-6">
              <div>
                <Link
                  to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                  className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-200/60 mb-3"
                >
                  {blog.category}
                </Link>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {blog.title}
                </h1>
                {blog.shortDescription && (
                  <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed font-medium">
                    {blog.shortDescription}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              <div className="rounded-3xl overflow-hidden max-h-[480px] bg-slate-100">
                <img
                  src={getImageUrl(blog.imageUrl)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Formatted Content */}
              <div className="pt-4 border-t border-slate-100">
                {renderFormattedContent(blog.content)}
              </div>

              {/* Article Actions Bar */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/Blog"
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-all"
                >
                  ← Back to All Articles
                </Link>
                <Link
                  to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full transition-all shadow-md shadow-emerald-700/20"
                >
                  More in {blog.category} ➔
                </Link>
              </div>
            </article>

            {/* Related Articles Section */}
            {relatedBlogs.length > 0 && (
              <div className="space-y-6 pt-6">
                <h3 className="text-xl font-black text-slate-900 text-center">
                  Related Articles You Might Enjoy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedBlogs.map((rel) => (
                    <div
                      key={rel.id}
                      className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="h-36 rounded-2xl overflow-hidden bg-slate-100">
                          <Link to={`/blog/${rel.slug}`}>
                            <img
                              src={getImageUrl(rel.imageUrl)}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">
                          {rel.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors">
                          <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                        </h4>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100">
                        <Link
                          to={`/blog/${rel.slug}`}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          Read Article ➔
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default BlogSingle;
