import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";

const OrganicCategorySlider = ({ selectedCategoryId, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) {
        return <div className="text-center my-4">Loading Organic Categories...</div>;
    }

    return (
        <section className="my-lg-8 my-4">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center mb-6">
                        <h3 className="h3style" data-title="Shop By Organic Category">
                            Shop By Organic Category
                        </h3>
                        <div className="wt-separator bg-primarys"></div>
                        <div className="wt-separator2 bg-primarys"></div>
                    </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <button
                        className={`btn ${selectedCategoryId === null ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => onSelectCategory(null)}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`btn ${selectedCategoryId === cat.id ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => onSelectCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OrganicCategorySlider;
