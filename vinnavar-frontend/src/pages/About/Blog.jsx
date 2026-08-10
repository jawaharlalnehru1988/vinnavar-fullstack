import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import { fetchBlogs, fetchBlogCategories, getImageUrl } from "../../services/api";
import { BlogSkeleton } from "../../Component/Skeleton";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {loaderStatus ? (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="w-48 h-8 bg-slate-200/80 rounded-full animate-pulse"></div>
          <BlogSkeleton count={3} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Banner & Category Filter Pills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-2">
                {t("organic_living_recipes")}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{t("journal_title")}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                {t("journal_desc")}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                  selectedCategory === "All"
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t("all_articles")}
              </button>
              {categories.map((cat, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Featured Top Article */}
          {heroBlog && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 group">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <Link to={`/blog/${heroBlog.slug}`} className="block w-full h-full">
                  <img
                    src={getImageUrl(heroBlog.imageUrl)}
                    alt={heroBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center space-y-4">
                <div>
                  <Link
                    to={`/BlogCategory?category=${encodeURIComponent(heroBlog.category)}`}
                    className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-200/60"
                  >
                    {heroBlog.category}
                  </Link>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  <Link to={`/blog/${heroBlog.slug}`}>
                    {heroBlog.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {heroBlog.shortDescription || heroBlog.content}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/blog/${heroBlog.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-700/20 transition-all active:scale-95"
                  >
                    <span>{t("read_full_article")}</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          {gridBlogs.length === 0 && !heroBlog ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="font-bold text-slate-900 text-base">{t("no_articles_found")}</h3>
              <p className="text-xs text-slate-500">{t("no_articles_desc")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4 p-5">
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100">
                      <Link to={`/blog/${blog.slug}`}>
                        <img
                          src={getImageUrl(blog.imageUrl)}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>

                    <div>
                      <Link
                        to={`/BlogCategory?category=${encodeURIComponent(blog.category)}`}
                        className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest"
                      >
                        {blog.category}
                      </Link>
                      <h3 className="font-bold text-slate-900 text-base mt-1 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {blog.shortDescription || (blog.content?.substring(0, 90) + "...")}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100/60 mt-4 flex items-center justify-between">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{t("read_article")}</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Blog;
