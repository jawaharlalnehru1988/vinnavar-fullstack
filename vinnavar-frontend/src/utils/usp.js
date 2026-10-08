/**
 * Calculate Unit Selling Price (USP) such as price per kg, per litre, or per piece
 * e.g., for ₹649 on a 5kg pack => "(₹129.80 / kg)"
 */
export const calculateUSP = (price, variantName) => {
    if (!price || !variantName) return null;
    const name = String(variantName).trim().toLowerCase();

    // Check for KG: "10kg", "5 kg", "1.5kg", "brown rice 5kg"
    const kgMatch = name.match(/([\d.]+)\s*kg\b/i);
    if (kgMatch) {
        const kg = parseFloat(kgMatch[1]);
        if (kg > 0) {
            const usp = price / kg;
            return `(₹${usp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / kg)`;
        }
    }

    // Check for Grams: "500g", "500gm", "500 gm", "250 g", "100g"
    const gMatch = name.match(/([\d.]+)\s*(?:gm|gms|g)\b/i);
    if (gMatch) {
        const g = parseFloat(gMatch[1]);
        if (g > 0) {
            const kg = g / 1000;
            const usp = price / kg;
            return `(₹${usp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / kg)`;
        }
    }

    // Check for Litre / L: "1L", "5 litre", "1 ltr"
    const lMatch = name.match(/([\d.]+)\s*(?:l|liter|litre|ltr)\b/i);
    if (lMatch) {
        const l = parseFloat(lMatch[1]);
        if (l > 0) {
            const usp = price / l;
            return `(₹${usp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / l)`;
        }
    }

    // Check for ML: "500ml", "200 ml"
    const mlMatch = name.match(/([\d.]+)\s*ml\b/i);
    if (mlMatch) {
        const ml = parseFloat(mlMatch[1]);
        if (ml > 0) {
            const l = ml / 1000;
            const usp = price / l;
            return `(₹${usp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / l)`;
        }
    }

    // Check for Pieces / Count: "Pack of 2", "2 pcs"
    const pcMatch = name.match(/([\d.]+)\s*(?:pcs|pc|piece|pieces)\b/i) || name.match(/pack of ([\d.]+)/i);
    if (pcMatch) {
        const count = parseFloat(pcMatch[1]);
        if (count > 0) {
            const usp = price / count;
            return `(₹${usp.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / piece)`;
        }
    }

    return null;
};
