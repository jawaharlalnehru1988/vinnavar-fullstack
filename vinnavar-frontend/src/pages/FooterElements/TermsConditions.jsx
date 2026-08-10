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

const TermsConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
              <i className="fa fa-file-contract text-success fs-4" />
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>Terms &amp; Conditions</h1>
              <p className="text-muted small mb-0">Vinnavar Organics — LP Traders | Last Updated: August 2025</p>
            </div>
          </div>
          <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
            <p className="mb-0 small">Please read these Terms &amp; Conditions carefully before using <strong>www.vinnavar.com</strong> or placing any order. By accessing our website or purchasing from us, you agree to be bound by these terms.</p>
          </div>
        </div>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
          <Section title="1. Company Information">
            <p>This website is owned and operated by <strong>LP Traders</strong>, a sole proprietorship firm registered in India, operating under the trade name <strong>Vinnavar Organics</strong>.</p>
            <ul>
              <li><strong>Proprietor:</strong> Mr. Lokesh Rajan Shah</li>
              <li><strong>Registered Address:</strong> #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Tamil Nadu – 632314, India</li>
              <li><strong>GSTIN:</strong> 33AFOPL7097M1ZN</li>
              <li><strong>FSSAI License No.:</strong> 22425479000675</li>
              <li><strong>Email:</strong> vinnavarbrand@gmail.com</li>
            </ul>
            <p>We are duly licensed under the <strong>Food Safety and Standards Act, 2006 (FSSAI)</strong> to manufacture, sell, and distribute food products across India.</p>
          </Section>
          <Section title="2. Acceptance of Terms">
            <p>By visiting our website, creating an account, browsing products, or placing an order, you acknowledge that you have read, understood, and agree to be legally bound by these Terms &amp; Conditions along with our Privacy Policy, Refund Policy, and Return Policy. We reserve the right to update these Terms at any time. Continued use of the website after changes constitutes your acceptance.</p>
          </Section>
          <Section title="3. Eligibility">
            <p>To use our services you must be at least <strong>18 years of age</strong>, be a resident of India with a valid delivery address, provide accurate personal information, and have the legal capacity to enter into a binding contract under the Indian Contract Act, 1872. We reserve the right to refuse service to anyone at any time.</p>
          </Section>
          <Section title="4. Products — Organic Food Standards">
            <p>All food products sold on Vinnavar Organics are sourced from certified organic farmers in Tamil Nadu and neighboring states, focusing on traditional heirloom rice varieties, cold-pressed oils, and unprocessed natural staples. Our products are:</p>
            <ul>
              <li>Processed and packed in compliance with the <strong>Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2011</strong></li>
              <li>Free from synthetic pesticides, artificial preservatives, colors, and chemical additives</li>
              <li>Labeled per <strong>FSSAI Labelling and Display Regulations, 2020</strong>, including net weight, ingredients, nutritional information, batch number, manufacturing date, best before date, and FSSAI license number</li>
              <li>Subject to internal quality checks before dispatch</li>
            </ul>
            <p><strong>Note on Appearance:</strong> Minor natural variations in color, texture, or grain size in organic products are not defects but characteristics of authentic, unprocessed food.</p>
          </Section>
          <Section title="5. Pricing and Payment">
            <p>All prices are in Indian Rupees (INR) and are <strong>inclusive of GST and shipping charges</strong> unless stated otherwise. Prices may change without notice; the price at order placement is final.</p>
            <p>We accept: UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and Net Banking — all processed securely via <strong>Razorpay (PCI-DSS compliant)</strong>. We do not store your payment credentials.</p>
            <p>A GST-compliant tax invoice will accompany each shipment. Failed transaction refunds typically process within 5–7 business days through your bank.</p>
          </Section>
          <Section title="6. Order Placement and Confirmation">
            <p>Placing an order is an offer to purchase. The contract is formed only upon dispatch. We may cancel orders due to product unavailability, pricing errors, suspected fraud, failed payment verification, or undeliverable addresses. Cancelled order amounts are fully refunded within 5–7 business days.</p>
          </Section>
          <Section title="7. Shipping and Delivery">
            <p>We deliver pan-India. Estimated delivery is <strong>4–8 business days</strong> from dispatch, which occurs within 1–3 business days of order confirmation. A tracking number will be provided via SMS/email. We are not responsible for delays due to courier issues, natural disasters, or force majeure events. Risk of loss passes to you upon delivery.</p>
          </Section>
          <Section title="8. Food Safety and Handling Instructions">
            <p>As an FSSAI-licensed food seller, we advise you to:</p>
            <ul>
              <li>Store products as per label instructions (cool, dry, airtight containers)</li>
              <li>Check the "Best Before" date before consumption</li>
              <li>Do not consume products that appear damaged, contaminated, or have altered smell/texture</li>
              <li>Read ingredient labels carefully if you have known food allergies. We shall not be liable for adverse reactions from undisclosed allergies</li>
              <li>Traditional organic rice and cold-pressed oils have shorter shelf lives than commercially processed products; handle accordingly</li>
            </ul>
          </Section>
          <Section title="9. Intellectual Property">
            <p>All content on this website — text, images, logos, icons, and software — is the exclusive property of LP Traders / Vinnavar Organics, protected under the <strong>Copyright Act, 1957</strong> and the <strong>Trade Marks Act, 1999</strong>. You may not copy, reproduce, distribute, or commercially exploit any content without written permission. You are granted a limited personal license to access the website for non-commercial use only.</p>
          </Section>
          <Section title="10. User Accounts and Security">
            <p>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. Notify us immediately at vinnavarbrand@gmail.com of any unauthorized use. We reserve the right to terminate accounts for violations of these Terms or fraudulent activity.</p>
          </Section>
          <Section title="11. Prohibited Conduct">
            <p>You agree not to use our website for any unlawful purpose, post false or defamatory reviews, attempt unauthorized system access, transmit malware, abuse promotional codes, or engage in conduct harmful to other users or our business operations.</p>
          </Section>
          <Section title="12. Disclaimer of Warranties">
            <p>The website and products are provided "AS IS" without any express or implied warranty. <strong>Health Claims Disclaimer:</strong> Nutritional and health benefit information on product pages is for informational purposes only and does not constitute medical advice. Consult a qualified healthcare professional for medical conditions.</p>
          </Section>
          <Section title="13. Limitation of Liability">
            <p>To the fullest extent permitted by Indian law, LP Traders / Vinnavar Organics shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount paid for the specific order giving rise to the claim.</p>
          </Section>
          <Section title="14. Governing Law and Dispute Resolution">
            <p>These Terms are governed by the <strong>laws of India</strong>. Disputes shall be subject to the exclusive jurisdiction of courts in <strong>Tiruvannamalai, Tamil Nadu</strong>. We encourage amicable resolution first. Unresolved disputes may be submitted to arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong>. Consumer complaints may also be filed under the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.</p>
          </Section>
          <Section title="15. Grievance Redressal Officer">
            <div className="border rounded-3 p-3 bg-light mt-2">
              <p className="mb-1"><strong>Name:</strong> Mr. Lokesh Rajan Shah</p>
              <p className="mb-1"><strong>Role:</strong> Grievance Officer / Sole Proprietor</p>
              <p className="mb-1"><strong>Email:</strong> vinnavarbrand@gmail.com</p>
              <p className="mb-0"><strong>Response Time:</strong> Within 30 days of receiving the grievance</p>
            </div>
            <p className="mt-3">Appointed as required by the <strong>Information Technology Act, 2000</strong> and <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.</p>
          </Section>
          <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
            <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">Privacy Policy</Link>
            <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">Return Policy</Link>
            <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">Refund Policy</Link>
            <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
