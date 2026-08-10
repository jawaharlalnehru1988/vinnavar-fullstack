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

const RefundPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
              <i className="fa fa-rupee-sign text-success fs-4" />
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>Refund Policy</h1>
              <p className="text-muted small mb-0">Vinnavar Organics — LP Traders | Last Updated: August 2025</p>
            </div>
          </div>
          <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
            <p className="mb-0 small">This Refund Policy outlines when and how refunds are processed by <strong>LP Traders (Vinnavar Organics)</strong>. We are committed to ensuring that all valid refund claims are handled promptly, transparently, and in accordance with Indian consumer protection laws.</p>
          </div>
        </div>
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
          <Section title="1. Our Refund Commitment">
            <p>At Vinnavar Organics, we stand behind the quality of our products. We offer refunds in genuine cases where there has been a clear error or quality failure on our part. We process all refunds honestly and without unnecessary delays, and we strive to communicate every step clearly to our customers.</p>
          </Section>
          <Section title="2. Circumstances Under Which Refunds Are Issued">
            <p>You are eligible for a full or partial refund in the following situations:</p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm small rounded-3 overflow-hidden">
                <thead className="table-success">
                  <tr>
                    <th>Reason</th>
                    <th>Refund Type</th>
                    <th>Processing Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Wrong product delivered</td>
                    <td>Full refund or replacement</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Product damaged / tampered upon delivery</td>
                    <td>Full refund or replacement</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Expired product delivered</td>
                    <td>Full refund</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Product quality defect (contamination, mold, foul odor)</td>
                    <td>Full refund or replacement</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Missing items from order</td>
                    <td>Partial refund for missing items</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Order cancelled before dispatch</td>
                    <td>Full refund</td>
                    <td>5–7 business days</td>
                  </tr>
                  <tr>
                    <td>Failed delivery (undeliverable address — our error)</td>
                    <td>Full refund</td>
                    <td>7–10 business days</td>
                  </tr>
                  <tr>
                    <td>Double payment / duplicate charge</td>
                    <td>Excess amount refunded</td>
                    <td>3–5 business days</td>
                  </tr>
                  <tr>
                    <td>Payment failure with amount debited</td>
                    <td>Full refund</td>
                    <td>5–7 business days (bank dependent)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="3. Non-Refundable Situations">
            <p>Refunds will <strong>not</strong> be issued in the following cases:</p>
            <ul>
              <li>Change of mind or disliking the product after opening/consumption</li>
              <li>Dissatisfaction with the taste, flavor, or natural aroma of organic products (these are inherent product characteristics)</li>
              <li>Natural variation in color, grain size, or texture of unpolished organic rice or cold-pressed oils</li>
              <li>Refund requests made after the 7-day return/refund window has closed</li>
              <li>Products that have been fully consumed before the refund is requested</li>
              <li>Damage caused by improper storage by the customer</li>
              <li>Orders with incorrect delivery addresses provided by the customer (if delivered to that address)</li>
              <li>Promotional or clearance items marked as non-refundable at the time of purchase (unless defective)</li>
            </ul>
          </Section>
          <Section title="4. How to Request a Refund">
            <p>To initiate a refund request, please follow these steps:</p>
            <ol>
              <li className="mb-2"><strong>Gather Evidence:</strong> Take clear photographs of the product showing the issue — damaged packaging, quality defect, wrong product, expired label, etc.</li>
              <li className="mb-2"><strong>Email Us:</strong> Send your request to <strong>vinnavarbrand@gmail.com</strong> with subject: <em>"Refund Request — Order #[Your Order Number]"</em></li>
              <li className="mb-2"><strong>Include:</strong> Your full name, order number, registered phone/email, reason for refund, and attached photos</li>
              <li className="mb-2"><strong>Review Period:</strong> We will review your request within <strong>2–3 business days</strong> and respond with our decision</li>
              <li className="mb-2"><strong>Return (if required):</strong> For some cases, we may request you to return the product before processing the refund. If so, we will coordinate the return logistics</li>
              <li className="mb-2"><strong>Refund Initiated:</strong> Once your request is approved, we will initiate the refund immediately</li>
            </ol>
          </Section>
          <Section title="5. Refund Processing Timelines">
            <p>Once we approve and initiate a refund, the time for the amount to reflect in your account depends on your payment method:</p>
            <div className="border rounded-3 overflow-hidden">
              <table className="table table-sm small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Payment Method</th>
                    <th>Refund Timeline (after initiation)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>UPI (GPay, PhonePe, Paytm, etc.)</td><td>1–3 business days</td></tr>
                  <tr><td>Credit Card (Visa, Mastercard)</td><td>5–7 business days</td></tr>
                  <tr><td>Debit Card (all banks)</td><td>5–7 business days</td></tr>
                  <tr><td>Net Banking</td><td>3–5 business days</td></tr>
                  <tr><td>RuPay Card</td><td>3–7 business days</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3"><strong>Important Note:</strong> These timelines are estimates and may vary depending on your bank's processing speed. Weekends and public holidays are not counted as business days. If you have not received your refund within the stated timeline, please first check with your bank before contacting us.</p>
          </Section>
          <Section title="6. Refund Method">
            <p>Refunds are always processed to the <strong>original payment source</strong> used for the purchase:</p>
            <ul>
              <li>UPI payments are refunded to the same UPI ID</li>
              <li>Credit/debit card payments are refunded to the same card</li>
              <li>Net banking payments are refunded to the same bank account</li>
            </ul>
            <p>We do not issue cash refunds or transfer money to a different bank account/UPI ID than the one used for payment, unless technically not possible (e.g., closed account), in which case we will contact you to arrange an alternate refund method.</p>
            <p><strong>Store Credit Option:</strong> In some cases, instead of a monetary refund, you may opt for an equivalent store credit (discount coupon) usable on your next purchase. This will be honored only at your explicit written request.</p>
          </Section>
          <Section title="7. Partial Refunds">
            <p>Partial refunds may be issued in cases where:</p>
            <ul>
              <li>Only a portion of the order is defective, damaged, or missing</li>
              <li>The customer has partially consumed the product but reports a quality issue with the remaining portion (evaluated on a case-by-case basis)</li>
              <li>A discount or coupon was applied to the original order — the refund amount will reflect the actual amount paid</li>
            </ul>
            <p>Partial refund amounts will be clearly communicated to you before processing.</p>
          </Section>
          <Section title="8. Failed Payment Refunds">
            <p>If your payment fails but the amount has been debited from your account:</p>
            <ul>
              <li>In most cases, the amount is automatically reversed by your bank within <strong>5–7 business days</strong></li>
              <li>If you do not receive the reversal within 7 business days, please contact your bank first</li>
              <li>If the bank confirms the deduction but Razorpay/we do not show a successful payment, please email us at vinnavarbrand@gmail.com with your bank statement (screenshot) and we will investigate and refund manually if required</li>
            </ul>
          </Section>
          <Section title="9. Refunds for Cancelled Orders">
            <p>For pre-paid orders cancelled before dispatch:</p>
            <ul>
              <li>Full refund will be processed immediately upon order cancellation</li>
              <li>The refund will be credited to your original payment source within 5–7 business days</li>
              <li>You will receive an email confirmation once the refund is initiated</li>
            </ul>
            <p>For orders cancelled after dispatch but before delivery (where applicable), refunds will be processed after the order is returned to us by the courier.</p>
          </Section>
          <Section title="10. GST and Invoice Considerations">
            <p>In accordance with the <strong>Goods and Services Tax (GST) Act, 2017</strong>:</p>
            <ul>
              <li>Full refunds include the applicable GST component</li>
              <li>Our accounting team will issue a <strong>Credit Note</strong> against the original invoice upon processing a refund, in compliance with GST return filing requirements</li>
              <li>If you have used the GSTIN for B2B invoicing, the credit note will reflect the same GSTIN</li>
            </ul>
          </Section>
          <Section title="11. Escalation and Disputes">
            <p>If you are dissatisfied with our refund decision, you may escalate the matter to:</p>
            <ul>
              <li><strong>Our Grievance Officer:</strong> Mr. Lokesh Rajan Shah — vinnavarbrand@gmail.com (response within 30 days)</li>
              <li><strong>National Consumer Helpline:</strong> 1800-11-4000 (toll-free)</li>
              <li><strong>Consumer Online Resource and Empowerment (CORE) Portal:</strong> consumerhelpline.gov.in</li>
              <li><strong>District Consumer Forum:</strong> File a complaint under the Consumer Protection Act, 2019 at your nearest consumer forum</li>
              <li><strong>FSSAI (for food quality issues):</strong> Report at fssai.gov.in or call 1800-112-100</li>
            </ul>
          </Section>
          <Section title="12. Amendments to This Policy">
            <p>We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated "Last Updated" date. For significant changes, we will notify customers via email or a website banner. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </Section>
          <Section title="13. Contact Us">
            <div className="border rounded-3 p-3 bg-light">
              <p className="mb-1"><strong>Email:</strong> vinnavarbrand@gmail.com</p>
              <p className="mb-1"><strong>Subject:</strong> "Refund Request — Order #[Order Number]"</p>
              <p className="mb-1"><strong>Address:</strong> #16, MS Nagar Phase 2, Kurumanthangal Road, Kunnathur, Arani, Tamil Nadu – 632314</p>
              <p className="mb-0"><strong>Response Time:</strong> 2–3 business days for refund decisions</p>
            </div>
          </Section>
          <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
            <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">Terms &amp; Conditions</Link>
            <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">Privacy Policy</Link>
            <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">Return Policy</Link>
            <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
