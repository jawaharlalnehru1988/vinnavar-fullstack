import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_SEO_MAP = {
    "/": {
        title: "Vinnavar Organics | 100% Pure Traditional Organic Rice & Farm Products",
        description: "Vinnavar Organics offers 100% pure traditional organic rice (Mapillai Samba, Karuppu Kavuni, Seeraga Samba), cold-pressed oils, unpolished pulses, natural honey, and farm-fresh healthy grains.",
        canonical: "https://vinnavar.com/"
    },
    "/Shop": {
        title: "Shop Organic Products | Vinnavar Organics",
        description: "Explore our authentic range of traditional organic rice, cold-pressed oils, grains, natural honey, and traditional wellness products.",
        canonical: "https://vinnavar.com/Shop"
    },
    "/Blog": {
        title: "Health & Organic Farming Blog Articles | Vinnavar Organics",
        description: "Read articles and guides on traditional organic farming, health benefits of ancient rice varieties, cold pressed oils, and healthy natural recipes.",
        canonical: "https://vinnavar.com/Blog"
    },
    "/TrackOrder": {
        title: "Track Your Order | Vinnavar Organics",
        description: "Real-time order tracking for your Vinnavar Organics purchases. Enter your Order ID to check shipment and delivery status.",
        canonical: "https://vinnavar.com/TrackOrder"
    },
    "/Faq": {
        title: "Frequently Asked Questions (FAQ) | Vinnavar Organics",
        description: "Find answers to common questions about our organic certification, traditional rice varieties, shipping rates, and order fulfillment.",
        canonical: "https://vinnavar.com/Faq"
    },
    "/Coupons": {
        title: "Offers, Discounts & Coupon Codes | Vinnavar Organics",
        description: "Discover exclusive promo codes, special offers, and seasonal discounts on traditional organic food products from Vinnavar Organics.",
        canonical: "https://vinnavar.com/Coupons"
    },
    "/Careers": {
        title: "Join Our Team - Careers | Vinnavar Organics",
        description: "Explore career opportunities at Vinnavar Organics. Join us in promoting traditional sustainable agriculture and chemical-free organic food.",
        canonical: "https://vinnavar.com/Careers"
    },
    "/helpcenter": {
        title: "Help & Support Center | Vinnavar Organics",
        description: "Contact Vinnavar customer support for assistance with orders, products, deliveries, and returns.",
        canonical: "https://vinnavar.com/helpcenter"
    }
};

const DEFAULT_SEO = {
    title: "Vinnavar Organics | Pure Traditional Organic Products",
    description: "100% Pure Traditional Organic Rice, Cold Pressed Oils & Farm Fresh Grains.",
    canonical: "https://vinnavar.com/"
};

const SEO = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Match exact or prefix route
        const seoData = ROUTE_SEO_MAP[pathname] || DEFAULT_SEO;

        // Update Document Title
        document.title = seoData.title;

        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.setAttribute("name", "description");
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", seoData.description);

        // Update Open Graph Title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute("content", seoData.title);
        }

        // Update Open Graph Description
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute("content", seoData.description);
        }

        // Update Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute("href", seoData.canonical || `https://vinnavar.com${pathname}`);
    }, [pathname]);

    return null;
};

export default SEO;
