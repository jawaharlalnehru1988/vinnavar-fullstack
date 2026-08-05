import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {loaderStatus ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 font-medium">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span>Loading Articles for {selectedCategory}...</span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Category Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 mb-2">
                Category Articles
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedCategory}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Discover our curated organic articles and recipes for {selectedCategory}.
              </p>
            </div>

            {/* Category Nav Links */}
            <div className="flex flex-wrap gap-2 items-center">
              <Link
                to="/BlogCategory?category=All"
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                  selectedCategory === "All"
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </Link>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/BlogCategory?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {blogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center space-y-4 max-w-md mx-auto">
              <div className="text-4xl">📚</div>
              <h3 className="font-bold text-slate-900 text-base">No articles found in {selectedCategory}</h3>
              <p className="text-xs text-slate-500">Check back soon or explore other blog categories!</p>
              <div className="pt-2">
                <Link
                  to="/Blog"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-full shadow-md"
                >
                  Back to All Blogs ➔
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
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
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">
                        {blog.category}
                      </span>
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
                      <span>Read Article</span>
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

export default BlogCategory;
