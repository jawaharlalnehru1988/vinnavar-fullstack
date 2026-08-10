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

const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
              <i className="fa fa-lock text-success fs-4" />
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>Privacy Policy</h1>
              <p className="text-muted small mb-0">Vinnavar Organics — LP Traders | Last Updated: August 2025</p>
            </div>
          </div>
          <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
            <p className="mb-0 small">Your privacy is important to us. This Privacy Policy explains how <strong>LP Traders (Vinnavar Organics)</strong> collects, uses, stores, and protects your personal information when you use our website or services. By using our website, you consent to the practices described in this policy.</p>
          </div>
        </div>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
          <Section title="1. Information We Collect">
            <p>We collect information to provide better services to all our customers. The types of information we collect include:</p>
            <p><strong>a) Information You Provide Directly:</strong></p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, mobile phone number, and password when you create an account</li>
              <li><strong>Order Information:</strong> Billing name, shipping address (house number, street, city, state, pincode), mobile number, and email when you place an order</li>
              <li><strong>Payment Information:</strong> Payment method selection (we do not store card/UPI details — these are processed by Razorpay)</li>
              <li><strong>GSTIN:</strong> Optionally provided for B2B GST invoicing</li>
              <li><strong>Review and Feedback:</strong> Product reviews, ratings, and photographs you submit voluntarily</li>
              <li><strong>Support Queries:</strong> Information shared through complaints, help center requests, or emails</li>
            </ul>
            <p><strong>b) Information Collected Automatically:</strong></p>
            <ul>
              <li><strong>Log Data:</strong> IP address, browser type and version, operating system, referring/exit pages, date and time of visits</li>
              <li><strong>Device Data:</strong> Device identifiers, screen resolution, language preferences</li>
              <li><strong>Usage Data:</strong> Pages visited, products browsed, time spent, clicks, and navigation patterns</li>
              <li><strong>Cookies and Similar Technologies:</strong> Session cookies, preference cookies, analytics cookies (see Section 7)</li>
            </ul>
          </Section>
          <Section title="2. How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <ul>
              <li><strong>Order Processing:</strong> To process and fulfill your orders, arrange delivery, and send order confirmations, shipping updates, and invoices</li>
              <li><strong>Customer Support:</strong> To respond to queries, handle complaints, process returns/refunds, and provide after-sale support</li>
              <li><strong>Account Management:</strong> To create and manage your customer account, authenticate logins, and maintain your order history and wishlist</li>
              <li><strong>Communication:</strong> To send transactional emails (order confirmation, shipping updates, refund status), promotional offers (only with your consent), and important policy updates</li>
              <li><strong>Legal Compliance:</strong> To comply with our obligations under the GST Act, Consumer Protection Act, FSSAI regulations, and other applicable Indian laws, including maintaining proper financial and tax records</li>
              <li><strong>Fraud Prevention:</strong> To detect, investigate, and prevent fraudulent transactions and unauthorized access</li>
              <li><strong>Analytics and Improvement:</strong> To analyze website usage patterns, improve our product catalog, website experience, and marketing effectiveness</li>
              <li><strong>Delivery Coordination:</strong> To share your name, address, and phone number with our logistics partners for delivery purposes</li>
            </ul>
          </Section>
          <Section title="3. Legal Basis for Processing (Indian Law)">
            <p>We process your personal data on the following lawful bases under the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and other applicable Indian legislation:</p>
            <ul>
              <li><strong>Consent:</strong> For marketing communications and newsletter subscriptions, where you have explicitly opted in</li>
              <li><strong>Contractual Necessity:</strong> To fulfill orders and provide services you have requested</li>
              <li><strong>Legal Obligation:</strong> For compliance with GST, FSSAI, tax regulations, and court orders</li>
              <li><strong>Legitimate Interests:</strong> For fraud prevention, security, website analytics, and improving our services</li>
            </ul>
          </Section>
          <Section title="4. Sharing of Information">
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We share your information only in the following circumstances:</p>
            <ul>
              <li><strong>Logistics Partners:</strong> Courier and delivery companies (e.g., Delhivery, DTDC, India Post) receive your name, address, and phone number to facilitate delivery</li>
              <li><strong>Payment Gateway:</strong> Razorpay processes your payment. We share your order amount and minimal required details. Razorpay's privacy policy governs their data handling</li>
              <li><strong>Analytics Providers:</strong> Anonymized/aggregated usage data may be shared with analytics tools (e.g., Google Analytics)</li>
              <li><strong>Legal Authorities:</strong> We may disclose information to government authorities, law enforcement, or courts when legally required or to protect our legal rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of business assets, your information may be transferred to the acquiring entity</li>
            </ul>
            <p>All third-party service providers are contractually required to protect your information and use it only for the purposes for which it was shared.</p>
          </Section>
          <Section title="5. Data Retention">
            <p>We retain your personal data for as long as necessary to fulfill the purposes for which it was collected:</p>
            <ul>
              <li><strong>Order and Transaction Records:</strong> Minimum 7 years as required under the Income Tax Act, 1961 and GST regulations</li>
              <li><strong>Customer Accounts:</strong> Until you request deletion, or 3 years after the last activity, whichever is later</li>
              <li><strong>Communication Logs:</strong> Up to 2 years for customer service improvement purposes</li>
              <li><strong>Marketing Preferences:</strong> Until you withdraw consent or request removal</li>
            </ul>
            <p>Upon account deletion or at the end of the applicable retention period, your data will be securely deleted or anonymized.</p>
          </Section>
          <Section title="6. Data Security">
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:</p>
            <ul>
              <li><strong>SSL/TLS Encryption:</strong> All data transmission between your browser and our servers is encrypted using HTTPS with SSL/TLS</li>
              <li><strong>Secure Payment Processing:</strong> All payments are processed through Razorpay (PCI-DSS Level 1 compliant). We never store card numbers or CVV codes</li>
              <li><strong>Access Controls:</strong> Only authorized personnel with a legitimate business need can access personal data</li>
              <li><strong>Firewall and Intrusion Detection:</strong> Our servers are protected by firewall systems and monitored for unauthorized activity</li>
              <li><strong>Regular Security Audits:</strong> We periodically review our security practices and update them as needed</li>
            </ul>
            <p>Despite our best efforts, no method of transmission over the internet or method of electronic storage is 100% secure. We cannot guarantee absolute security but commit to taking all commercially reasonable precautions.</p>
          </Section>
          <Section title="7. Cookies Policy">
            <p>We use cookies and similar tracking technologies to enhance your experience on our website. Types of cookies we use:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality (shopping cart, login sessions). Cannot be disabled</li>
              <li><strong>Preference Cookies:</strong> Store your language, currency, and browsing preferences</li>
              <li><strong>Analytics Cookies:</strong> Used to collect anonymized information about how visitors use our site (e.g., Google Analytics). Help us improve our website</li>
              <li><strong>Marketing Cookies:</strong> Used to show you relevant ads on other platforms (used only with your explicit consent)</li>
            </ul>
            <p>You can control cookie settings through your browser. Disabling certain cookies may affect website functionality. You may opt out of analytics tracking via Google's opt-out browser add-on.</p>
          </Section>
          <Section title="8. Your Rights Under the DPDPA, 2023">
            <p>Under the <strong>Digital Personal Data Protection Act, 2023</strong>, you have the following rights:</p>
            <ul>
              <li><strong>Right to Access:</strong> Request a summary of personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong>Right to Grievance Redressal:</strong> Lodge a complaint with our Grievance Officer (see Section 11)</li>
              <li><strong>Right to Nominate:</strong> Nominate another individual to exercise your rights in the event of your death or incapacity</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw marketing consent at any time without affecting prior processing</li>
            </ul>
            <p>To exercise these rights, email us at <strong>vinnavarbrand@gmail.com</strong> with the subject line "Data Privacy Request." We will respond within 30 days.</p>
          </Section>
          <Section title="9. Children's Privacy">
            <p>Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a minor has provided personal information, we will take steps to delete such information promptly. If you believe a minor has submitted information, please contact us at vinnavarbrand@gmail.com.</p>
          </Section>
          <Section title="10. Third-Party Links">
            <p>Our website may contain links to external websites, social media platforms, or third-party services. This Privacy Policy does not apply to those third-party websites. We encourage you to review the privacy policies of any third-party sites you visit. We are not responsible for the privacy practices or content of external sites.</p>
          </Section>
          <Section title="11. Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or applicable legal requirements. When we make material changes, we will:</p>
            <ul>
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Display a prominent notice on our website</li>
              <li>Notify registered customers via email (for significant changes)</li>
            </ul>
            <p>Your continued use of our website after any changes take effect constitutes your acceptance of the revised policy.</p>
          </Section>
          <Section title="12. Grievance Officer / Contact">
            <div className="border rounded-3 p-3 bg-light mt-2">
              <p className="mb-1"><strong>Name:</strong> Mr. Lokesh Rajan Shah</p>
              <p className="mb-1"><strong>Role:</strong> Grievance Officer / Sole Proprietor, LP Traders</p>
              <p className="mb-1"><strong>Email:</strong> vinnavarbrand@gmail.com</p>
              <p className="mb-1"><strong>Address:</strong> #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Tamil Nadu – 632314</p>
              <p className="mb-0"><strong>Response Time:</strong> Within 30 days of receiving your request or complaint</p>
            </div>
            <p className="mt-3">You also have the right to lodge a complaint with the <strong>Data Protection Board of India</strong> once established under the DPDPA, 2023.</p>
          </Section>
          <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
            <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">Terms &amp; Conditions</Link>
            <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">Return Policy</Link>
            <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">Refund Policy</Link>
            <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
