import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h2 className="fw-bold text-dark mb-3" style={{ fontSize: "1.15rem", borderLeft: "4px solid #16a34a", paddingLeft: "12px" }}>
      {title}
    </h2>
    <div className="text-secondary" style={{ fontSize: "0.93rem", lineHeight: "1.85" }}>
      {children}
    </div>
  </div>
);

const ReturnPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
              <i className="fa fa-undo text-success fs-4" />
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>Return Policy</h1>
              <p className="text-muted small mb-0">Vinnavar Organics — LP Traders | Last Updated: August 2025</p>
            </div>
          </div>
          <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
            <p className="mb-0 small">At Vinnavar Organics, we are committed to delivering the finest quality organic food products. If you are not fully satisfied with your purchase, please read this Return Policy carefully to understand your options.</p>
          </div>
        </div>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
          <Section title="1. Our Return Philosophy">
            <p>We believe every customer deserves a completely satisfying experience. Since we deal in <strong>perishable and consumable food products</strong>, our return policy is designed to be fair to both parties while adhering to FSSAI food safety standards. Returns are accepted under specific valid conditions as outlined below, and we will do our best to resolve any issue promptly and courteously.</p>
          </Section>
          <Section title="2. Return Eligibility — When Returns Are Accepted">
            <p>Returns are accepted <strong>only</strong> under the following circumstances:</p>
            <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
              <p className="fw-bold text-dark mb-2">✅ Valid Return Reasons:</p>
              <ul className="mb-0">
                <li><strong>Wrong Product Delivered:</strong> You received a product different from what you ordered (e.g., wrong rice variety, wrong weight/size)</li>
                <li><strong>Damaged Product:</strong> The product packaging is visibly damaged, broken, or tampered with upon delivery, causing the food contents to be exposed or contaminated</li>
                <li><strong>Expired Product:</strong> The "Best Before" date on the product has already passed at the time of delivery</li>
                <li><strong>Quality Defect:</strong> The product has visible signs of contamination, mold, foul smell, unusual discoloration, or other clear quality defects</li>
                <li><strong>Quantity Shortfall:</strong> The quantity or weight received is significantly less than what was ordered and paid for</li>
                <li><strong>Missing Items:</strong> An item confirmed in your order invoice was not included in the delivery</li>
              </ul>
            </div>
            <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
              <p className="fw-bold text-dark mb-2">❌ Non-Returnable Situations:</p>
              <ul className="mb-0">
                <li>Products returned after the 7-day return window has expired</li>
                <li>Products where the packaging seal has been broken and the product partially consumed, unless for a genuine quality complaint</li>
                <li>Natural variations in color, size, texture, or aroma of organic products that are characteristic of traditional, unprocessed food</li>
                <li>Dissatisfaction with taste or flavor preference (subjective experience)</li>
                <li>Products not stored as per label instructions, leading to spoilage</li>
                <li>Damage caused by the customer after delivery</li>
                <li>Orders where incorrect address was provided by the customer</li>
                <li>Products purchased during clearance or final sale promotions (unless defective)</li>
              </ul>
            </div>
          </Section>
          <Section title="3. Return Window">
            <p>Return requests must be submitted within <strong>7 (seven) calendar days</strong> from the date of delivery. Requests made after this period will generally not be accepted, except in exceptional circumstances at our sole discretion.</p>
            <p>For perishable items with quality complaints (mold, odor, contamination), please raise the complaint within <strong>48 hours of delivery</strong> for faster resolution.</p>
          </Section>
          <Section title="4. How to Initiate a Return">
            <p>To initiate a return, please follow these steps:</p>
            <ol>
              <li className="mb-2"><strong>Document the Issue:</strong> Take clear photographs of the product, packaging, batch number/label, and the specific defect. This is mandatory for quality-related returns.</li>
              <li className="mb-2"><strong>Contact Us:</strong> Email us at <strong>vinnavarbrand@gmail.com</strong> with the subject line: <em>"Return Request — Order #[Your Order Number]"</em></li>
              <li className="mb-2"><strong>Provide Details:</strong> Include your order number, full name, registered phone number, details of the issue, and attach the photographs</li>
              <li className="mb-2"><strong>Await Confirmation:</strong> Our customer support team will review your request and respond within <strong>2–3 business days</strong></li>
              <li className="mb-2"><strong>Return Shipment (if required):</strong> If a physical return is necessary, we will provide a return shipping label or reimbursement for return courier charges (at standard rates). Do not return products without our written confirmation, as unverified returns may not be processed.</li>
            </ol>
          </Section>
          <Section title="5. Food Safety Standards for Returns">
            <p>As an <strong>FSSAI-licensed food business operator</strong>, we take food safety very seriously. Returned food products are handled in compliance with the <strong>Food Safety and Standards Act, 2006</strong> and applicable regulations:</p>
            <ul>
              <li>Returned food products are never resold, regardless of their condition</li>
              <li>Products returned due to quality issues are quarantined and reported as per FSSAI recall and withdrawal guidelines if found to be part of a batch issue</li>
              <li>All complaints are logged and reviewed to improve our quality control processes</li>
              <li>We may request additional information (e.g., batch number) to investigate quality issues at the source</li>
            </ul>
          </Section>
          <Section title="6. Replacement vs. Refund">
            <p>Upon accepting a valid return, we will offer you the following resolution options:</p>
            <ul>
              <li><strong>Replacement:</strong> A fresh replacement of the same product will be shipped at no additional cost. Preferred for wrong/damaged product scenarios.</li>
              <li><strong>Refund:</strong> A full refund for the defective/missing product(s) to your original payment method. See our <Link to="/refund-policy" className="text-success">Refund Policy</Link> for processing timelines.</li>
              <li><strong>Store Credit:</strong> In some cases, you may choose to receive the equivalent value as a discount coupon for your next order.</li>
            </ul>
            <p>The resolution offered will depend on product availability, nature of the complaint, and your preference. We will always try to offer the most convenient resolution for you.</p>
          </Section>
          <Section title="7. Return Shipping">
            <p>For valid returns:</p>
            <ul>
              <li>If the return is due to our error (wrong product, defective product), we will bear the return shipping cost entirely.</li>
              <li>Please use a trackable shipping service for returns. We will not be responsible for items lost in transit without tracking.</li>
              <li>Pack the product securely in its original packaging (where possible) to prevent damage during return transit.</li>
              <li>Return shipments without prior authorization (a written confirmation from us) will not be accepted and may be returned to sender.</li>
            </ul>
          </Section>
          <Section title="8. Partial Returns and Orders with Multiple Items">
            <p>If your order contains multiple products and only some of them are defective or incorrectly delivered, you may initiate a partial return. The remaining products need not be returned. Refunds or replacements will be issued only for the specific items that qualify for return.</p>
          </Section>
          <Section title="9. Order Cancellations Before Dispatch">
            <p>If you wish to cancel an order before it has been dispatched:</p>
            <ul>
              <li>Log into your account and navigate to "My Orders" to cancel</li>
              <li>If the order is still in "Processing" status, cancellation is possible and a full refund will be issued</li>
              <li>Once the order has been dispatched (shipping confirmation sent), the order cannot be cancelled — please initiate a return after delivery</li>
              <li>Pre-paid orders cancelled before dispatch are refunded within 5–7 business days</li>
            </ul>
          </Section>
          <Section title="10. Consumer Rights Under Indian Law">
            <p>As an Indian consumer, you have rights under:</p>
            <ul>
              <li><strong>Consumer Protection Act, 2019:</strong> Right to be protected against unfair trade practices, right to seek redressal for defective goods</li>
              <li><strong>Consumer Protection (E-Commerce) Rules, 2020:</strong> Right to receive a clear return, refund, and exchange policy from e-commerce entities</li>
              <li><strong>Food Safety and Standards Act, 2006:</strong> Right to safe, wholesome food; right to complain to FSSAI about food quality or labeling issues</li>
            </ul>
            <p>If you are not satisfied with our response, you may also approach the <strong>National Consumer Helpline (NCH)</strong> at 1800-11-4000 or file a complaint on the <strong>Consumer Helpline Portal (consumerhelpline.gov.in)</strong>.</p>
          </Section>
          <Section title="11. Contact for Returns">
            <div className="border rounded-3 p-3 bg-light">
              <p className="mb-1"><strong>Email:</strong> vinnavarbrand@gmail.com</p>
              <p className="mb-1"><strong>Subject Line:</strong> "Return Request — Order #[Order Number]"</p>
              <p className="mb-0"><strong>Response Time:</strong> 2–3 business days</p>
            </div>
          </Section>
          <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
            <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">Terms &amp; Conditions</Link>
            <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">Privacy Policy</Link>
            <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">Refund Policy</Link>
            <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
