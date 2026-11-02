import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { fetchBlogBySlug, fetchBlogById, fetchBlogsByCategory, fetchBlogs, getYouTubeVideoId, getImageUrl } from "../../services/api";
import { useTranslation } from "react-i18next";

const BlogSingle = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const { slug: routeSlug, id: routeId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const identifier = routeId || routeSlug || queryParams.get("id") || queryParams.get("slug");

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadBlogDetail = async () => {
      try {
        setLoading(true);
        let article = null;

        if (identifier) {
          // Try fetching by slug or ID
          article = await fetchBlogBySlug(identifier);
          if (!article && !isNaN(identifier)) {
            article = await fetchBlogById(identifier);
          }
        }

        // If still no article, fallback to featured or first active blog
        if (!article) {
          const all = await fetchBlogs();
          if (all && all.length > 0) {
            article = all[0];
          }
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
  }, [identifier]);

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
          <div key={`list-${keyPrefix}`} className="bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 p-6 rounded-3xl my-6 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2 uppercase tracking-wide">
              <span>🥗</span> Key Details &amp; Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentList.map((item, iIdx) => (
                <div key={iIdx} className="flex items-start gap-2 text-slate-800 dark:text-amber-100 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">✅</span>
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
              <div key={iIdx} className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900/90 rounded-2xl border border-slate-100 dark:border-amber-400/20 shadow-xs">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {iIdx + 1}
                </span>
                <div className="text-slate-800 dark:text-amber-100 text-sm leading-relaxed pt-0.5">
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

      // Embedded 9:16 YouTube Shorts / Video Link
      const inlineYtId = getYouTubeVideoId(trimmed);
      if (inlineYtId && (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes("youtube.com") || trimmed.includes("youtu.be"))) {
        elements.push(
          <div key={`inline-yt-${idx}`} className="my-8 flex justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 dark:border-amber-400/25 bg-black relative ring-4 ring-emerald-500/20">
              <iframe
                src={`https://www.youtube.com/embed/${inlineYtId}?rel=0`}
                title="Embedded YouTube Short"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        );
        return;
      }

      if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="font-extrabold text-slate-900 dark:text-amber-100 text-lg mt-6 mb-3">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="font-black text-slate-900 dark:text-amber-100 text-xl mt-8 mb-4">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="font-black text-slate-900 dark:text-amber-100 text-2xl mt-8 mb-4">
            {trimmed.replace(/^#\s+/, "")}
          </h1>
        );
      } else {
        elements.push(
          <p key={idx} className="text-slate-700 dark:text-amber-200/90 text-sm leading-relaxed mb-4 font-normal">
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
          <strong key={index} className="font-extrabold text-slate-900 dark:text-amber-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Resolve current active language fields with graceful fallbacks
  const currentTitle = blog?.titleTranslations?.[currentLang] || blog?.titleTranslations?.en || blog?.titleTranslations?.ta || blog?.title || "";
  const currentShortDesc = blog?.shortDescriptionTranslations?.[currentLang] || blog?.shortDescriptionTranslations?.en || blog?.shortDescriptionTranslations?.ta || blog?.shortDescription || "";
  const currentContent = blog?.contentTranslations?.[currentLang] || blog?.contentTranslations?.en || blog?.contentTranslations?.ta || blog?.content || "";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="w-1/3 h-4 bg-slate-200/80 dark:bg-stone-800/80 rounded-full"></div>
          <div className="w-3/4 h-10 bg-slate-200/80 dark:bg-stone-800/80 rounded-full"></div>
          <div className="w-full h-80 bg-slate-200/80 dark:bg-stone-800/80 rounded-3xl"></div>
        </div>
      ) : !blog ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4 bg-white dark:bg-stone-900/85 rounded-3xl border border-slate-100 dark:border-amber-400/20 p-8 shadow-sm">
          <h3 className="font-black text-slate-900 dark:text-amber-100 text-lg">Article Not Found</h3>
          <p className="text-xs text-slate-500 dark:text-amber-200/70">The requested article could not be loaded.</p>
          <Link to="/Blog" className="inline-block px-5 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-full">
            Back to All Articles
          </Link>
        </div>
      ) : (
        <>
          <ScrollToTop />
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-slate-500 dark:text-amber-200/70 space-x-2">
              <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold">Home</Link>
              <span>/</span>
              <Link to="/Blog" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold">Blog</Link>
              <span>/</span>
              <Link to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`} className="text-slate-700 dark:text-amber-200 font-semibold">
                {blog.category}
              </Link>
            </nav>

            {/* Main Article Container */}
            <article className="bg-white dark:bg-stone-900/85 rounded-3xl border border-slate-100 dark:border-amber-400/20 shadow-sm p-6 sm:p-10 space-y-6 backdrop-blur-xs">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Link
                    to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                    className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-200/60 dark:border-emerald-700/50"
                  >
                    {blog.category}
                  </Link>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-stone-400">
                    Article #{blog.id}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-amber-100 leading-tight">
                  {currentTitle}
                </h1>

                {currentShortDesc && (
                  <p className="text-sm sm:text-base text-slate-600 dark:text-amber-200/90 mt-3 leading-relaxed font-normal bg-slate-50 dark:bg-stone-800/90 p-4 rounded-2xl border border-slate-100 dark:border-amber-400/20">
                    {currentShortDesc}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              <div className="rounded-3xl overflow-hidden max-h-[480px] bg-slate-100 dark:bg-stone-800 border border-slate-100 dark:border-amber-400/20">
                <img
                  src={getImageUrl(blog.imageUrl)}
                  alt={currentTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 9:16 Video / YouTube Shorts Player */}
              {blog.videoUrl && (
                <div className="my-8 p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-3xl border border-emerald-500/30 dark:border-amber-400/30 shadow-2xl relative overflow-hidden">
                  <div className="text-center max-w-lg mx-auto mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm mb-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      {getYouTubeVideoId(blog.videoUrl) ? "9:16 YouTube Shorts" : "Video Guide (9:16)"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-amber-300">
                      Recipe &amp; Method in Action
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Vertical 9:16 video tutorial &amp; walkthrough
                    </p>
                  </div>

                  {/* 9:16 Aspect Ratio Frame */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 dark:border-amber-400/25 bg-black relative ring-4 ring-emerald-500/20">
                      {getYouTubeVideoId(blog.videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.videoUrl)}?rel=0`}
                          title={currentTitle}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={getImageUrl(blog.videoUrl)}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Formatted Content in active language */}
              <div className="pt-4 border-t border-slate-100 dark:border-amber-400/20">
                {renderFormattedContent(currentContent)}
              </div>

              {/* Article Actions Bar */}
              <div className="pt-6 border-t border-slate-100 dark:border-amber-400/20 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/Blog"
                  className="px-5 py-2.5 bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-700 dark:text-amber-100 font-bold text-xs rounded-full transition-all border border-transparent dark:border-amber-400/20"
                >
                  ← {t("all_articles") || "Back to All Articles"}
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
                <h3 className="text-xl font-black text-slate-900 dark:text-amber-100 text-center">
                  Related Articles You Might Enjoy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedBlogs.map((rel) => {
                    const relTitle = rel.titleTranslations?.[currentLang] || rel.titleTranslations?.en || rel.titleTranslations?.ta || rel.title;
                    const relLink = `/blog/${rel.slug || rel.id}`;
                    return (
                      <div
                        key={rel.id}
                        className="group bg-white dark:bg-stone-900/85 rounded-3xl border border-slate-100 dark:border-amber-400/20 shadow-sm hover:shadow-xl transition-all p-4 flex flex-col justify-between backdrop-blur-xs"
                      >
                        <div className="space-y-3">
                          <div className="h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-800">
                            <Link to={relLink}>
                              <img
                                src={getImageUrl(rel.imageUrl)}
                                alt={relTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          </div>
                          <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                            {rel.category}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-amber-100 text-sm line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-amber-300 transition-colors">
                            <Link to={relLink}>{relTitle}</Link>
                          </h4>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-amber-400/20">
                          <Link
                            to={relLink}
                            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                          >
                            Read Article ➔
                          </Link>
                        </div>
                      </div>
                    );
                  })}
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
