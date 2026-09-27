import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  useEffect(() => { window.scrollTo(0, 0); }, []);

              if (currentLang === "pa") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ਵਾਪਸੀ ਨੀਤੀ (Return Policy)</h1>
                <p className="text-muted small mb-0">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ — ਐਲਪੀ ਟਰੇਡਰਜ਼ | ਆਖਰੀ ਅਪਡੇਟ: ਅਗਸਤ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ ਵਿੱਚ, ਅਸੀਂ ਤੁਹਾਨੂੰ ਉੱਚ ਗੁਣਵੱਤਾ ਵਾਲੇ ਕੁਦਰਤੀ ਅਤੇ ਜੈਵਿਕ ਭੋਜਨ ਉਤਪਾਦ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹਾਂ। ਜੇਕਰ ਤੁਸੀਂ ਆਪਣੀ ਖਰੀਦ ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੰਤੁਸ਼ਟ ਨਹੀਂ ਹੋ, ਤਾਂ ਆਪਣੇ ਵਿਕਲਪਾਂ ਨੂੰ ਸਮਝਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਇਸ ਵਾਪਸੀ ਨੀਤੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ਸਾਡਾ ਵਾਪਸੀ ਸਿਧਾਂਤ (Return Philosophy)">
              <p>ਅਸੀਂ ਮੰਨਦੇ ਹਾਂ ਕਿ ਹਰੇਕ ਗਾਹਕ ਨੂੰ ਸੰਤੁਸ਼ਟੀਜਨਕ ਅਨੁਭਵ ਮਿਲਣਾ ਚਾਹੀਦਾ ਹੈ। ਕਿਉਂਕਿ ਅਸੀਂ <strong>ਜਲਦੀ ਖਰਾਬ ਹੋਣ ਵਾਲੇ ਅਤੇ ਵਰਤੋਂ ਯੋਗ ਜੈਵਿਕ ਭੋਜਨ ਪਦਾਰਥਾਂ</strong> ਦਾ ਵਪਾਰ ਕਰਦੇ ਹਾਂ, ਇਸ ਲਈ FSSAI ਭੋਜਨ ਸੁਰੱਖਿਆ ਮਾਪਦੰਡਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹੋਏ ਦੋਵਾਂ ਧਿਰਾਂ ਲਈ ਨਿਰਪੱਖ ਵਾਪਸੀ ਨੀਤੀ ਬਣਾਈ ਗਈ ਹੈ। ਕੇਵਲ ਜਾਇਜ਼ ਅਤੇ ਢੁਕਵੇਂ ਕਾਰਨਾਂ ਕਰਕੇ ਹੀ ਵਾਪਸੀ ਸਵੀਕਾਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।</p>
            </Section>

            <Section title="2. ਵਾਪਸੀ ਯੋਗਤਾ — ਵਾਪਸੀ ਕਦੋਂ ਸਵੀਕਾਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ ਜਾਇਜ਼ ਵਾਪਸੀ ਦੇ ਕਾਰਨ:</p>
                <ul className="mb-0">
                  <li><strong>ਗਲਤ ਉਤਪਾਦ ਡਿਲੀਵਰ ਹੋਇਆ:</strong> ਤੁਹਾਡੇ ਵੱਲੋਂ ਆਰਡਰ ਕੀਤੇ ਉਤਪਾਦ ਤੋਂ ਵੱਖਰਾ ਉਤਪਾਦ ਮਿਲਣ 'ਤੇ (ਜਿਵੇਂ: ਗਲਤ ਚੌਲਾਂ ਦੀ ਕਿਸਮ, ਗਲਤ ਭਾਰ/ਆਕਾਰ)</li>
                  <li><strong>ਨੁਕਸਾਨਿਆ ਉਤਪਾਦ:</strong> ਡਿਲੀਵਰੀ ਵੇਲੇ ਪੈਕੇਜਿੰਗ ਫਟੀ, ਟੁੱਟੀ ਜਾਂ ਖਰਾਬ ਮਿਲਣ 'ਤੇ</li>
                  <li><strong>ਮਿਆਦ ਪੁੱਗਿਆ (Expired) ਉਤਪਾਦ:</strong> ਡਿਲੀਵਰੀ ਦੀ ਮਿਤੀ 'ਤੇ ਉਤਪਾਦ ਦੀ "Best Before" ਮਿਤੀ ਲੰਘ ਚੁੱਕੀ ਹੋਵੇ</li>
                  <li><strong>ਗੁਣਵੱਤਾ ਵਿੱਚ ਨੁਕਸ:</strong> ਉਤਪਾਦ ਵਿੱਚ ਉੱਲੀ (fungus), ਬਦਬੂ, ਅਸਾਧਾਰਨ ਰੰਗ ਜਾਂ ਸਪੱਸ਼ਟ ਖਰਾਬੀ ਹੋਣ 'ਤੇ</li>
                  <li><strong>ਮਾਤਰਾ ਵਿੱਚ ਘਾਟ:</strong> ਆਰਡਰ ਕੀਤੇ ਭਾਰ ਜਾਂ ਗਿਣਤੀ ਨਾਲੋਂ ਘੱਟ ਮਾਤਰਾ ਮਿਲਣ 'ਤੇ</li>
                  <li><strong>ਗੁੰਮ ਹੋਈਆਂ ਚੀਜ਼ਾਂ:</strong> ਇਨਵੌਇਸ ਵਿੱਚ ਦਰਜ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਪਾਰਸਲ ਵਿੱਚੋਂ ਵਸਤੂ ਗਾਇਬ ਹੋਣ 'ਤੇ</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ ਗੈਰ-ਵਾਪਸੀ ਯੋਗ ਸਥਿਤੀਆਂ:</p>
                <ul className="mb-0">
                  <li>ਸੀਲ ਖੁੱਲ੍ਹੇ ਜਾਂ ਵਰਤੇ ਗਏ ਭੋਜਨ ਉਤਪਾਦ (ਭੋਜਨ ਸੁਰੱਖਿਆ ਅਤੇ ਸਵੱਛਤਾ ਕਾਰਨ)</li>
                  <li>ਨਿੱਜੀ ਪਸੰਦ, ਸਵਾਦ ਜਾਂ ਰੰਗ ਦੇ ਫਰਕ ਕਾਰਨ (ਜੈਵਿਕ ਉਤਪਾਦਾਂ ਵਿੱਚ ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਮਾਮੂਲੀ ਫਰਕ ਹੋ ਸਕਦਾ ਹੈ)</li>
                  <li>ਗਲਤ ਤਰੀਕੇ ਨਾਲ ਸਾਂਭਣ ਕਾਰਨ ਖਰਾਬ ਹੋਏ ਉਤਪਾਦ (ਜਿਵੇਂ ਸਿੱਲ੍ਹੀ ਥਾਂ 'ਤੇ ਰੱਖਣਾ)</li>
                  <li>ਡਿਲੀਵਰੀ ਤੋਂ 48 ਘੰਟਿਆਂ ਬਾਅਦ ਦੱਸੀਆਂ ਗਈਆਂ ਨੁਕਸਾਨ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ</li>
                  <li>ਅਸਲ ਬਿੱਲ, ਪੈਕੇਜਿੰਗ ਜਾਂ ਬਾਰਕੋਡ ਨਾ ਹੋਣ ਦੀ ਸੂਰਤ ਵਿੱਚ</li>
                </ul>
              </div>
            </Section>

            <Section title="3. ਵਾਪਸੀ ਦੀ ਸਮਾਂ-ਸੀਮਾ (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ 24 ਤੋਂ 48 ਘੰਟੇ</p>
                    <p className="small text-muted mb-0">ਨੁਕਸਾਨੇ, ਨੁਕਸਦਾਰ, ਮਿਆਦ ਪੁੱਗੇ ਜਾਂ ਗਲਤ ਉਤਪਾਦਾਂ ਲਈ ਡਿਲੀਵਰੀ ਸਮੇਂ ਤੋਂ <strong>24 ਤੋਂ 48 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ</strong> ਫੋਟੋਆਂ/ਵੀਡੀਓ ਸਮੇਤ ਰਿਪੋਰਟ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 7 ਦਿਨ</p>
                    <p className="small text-muted mb-0">ਨਾ ਖੋਲ੍ਹੀ ਗਈ, ਅਸਲ ਪੈਕੇਜਿੰਗ ਵਾਲੇ ਹੋਰ ਯੋਗ ਉਤਪਾਦਾਂ ਲਈ ਡਿਲੀਵਰੀ ਮਿਤੀ ਤੋਂ ਵੱਧ ਤੋਂ ਵੱਧ <strong>7 ਦਿਨਾਂ ਤੱਕ</strong> ਦਾ ਸਮਾਂ ਲਾਗੂ ਹੁੰਦਾ ਹੈ।</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. ਅਨਬਾਕਸਿੰਗ ਵੀਡੀਓ ਦੀ ਲੋੜ (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਸੂਚਨਾ — ਅਨਬਾਕਸਿੰਗ ਵੀਡੀਓ:</p>
                <p className="small mb-0">ਆਵਾਜਾਈ ਦੌਰਾਨ ਹੋਏ ਨੁਕਸਾਨ, ਗੁੰਮ ਹੋਈਆਂ ਵਸਤਾਂ ਜਾਂ ਗਲਤ ਉਤਪਾਦਾਂ ਦੇ ਦਾਅਵਿਆਂ ਦੇ ਤੇਜ਼ ਹੱਲ ਲਈ, <strong>ਪਾਰਸਲ ਖੋਲ੍ਹਣ ਵੇਲੇ ਰਿਕਾਰਡ ਕੀਤੀ ਸਪੱਸ਼ਟ ਅਨਬਾਕਸਿੰਗ ਵੀਡੀਓ</strong> ਜਮ੍ਹਾਂ ਕਰਾਉਣ ਦੀ ਅਸੀਂ ਸਖ਼ਤ ਸਿਫਾਰਸ਼ ਕਰਦੇ ਹਾਂ।</p>
              </div>
            </Section>

            <Section title="5. ਵਾਪਸੀ ਪ੍ਰਕਿਰਿਆ — 4 ਆਸਾਨ ਕਦਮ">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "1", title: "ਬੇਨਤੀ ਭੇਜੋ", desc: "ਆਪਣੀ ਆਰਡਰ ਆਈਡੀ, ਸਮੱਸਿਆ ਦਾ ਵੇਰਵਾ, ਫੋਟੋਆਂ ਅਤੇ ਅਨਬਾਕਸਿੰਗ ਵੀਡੀਓ ਨਾਲ support@vinnavar.com 'ਤੇ ਈਮੇਲ ਕਰੋ ਜਾਂ +91 94441 83387 'ਤੇ ਵਟਸਐਪ ਕਰੋ।" },
                  { step: "2", title: "ਪੜਤਾਲ ਅਤੇ ਪ੍ਰਵਾਨਗੀ", desc: "ਸਾਡੀ ਗਾਹਕ ਸਹਾਇਤਾ ਟੀਮ 24-48 ਘੰਟਿਆਂ ਵਿੱਚ ਤੁਹਾਡੀ ਬੇਨਤੀ ਦੀ ਜਾਂਚ ਕਰਕੇ ਵਾਪਸੀ ਦੀ ਪ੍ਰਵਾਨਗੀ ਦੇਵੇਗੀ।" },
                  { step: "3", title: "ਰਿਵਰਸ ਪਿਕਅੱਪ / ਬਦਲੀ", desc: "ਪ੍ਰਵਾਨਗੀ ਤੋਂ ਬਾਅਦ, ਸਾਡਾ ਕੋਰੀਅਰ ਪਾਰਟਨਰ ਤੁਹਾਡੇ ਪਤੇ ਤੋਂ ਪਾਰਸਲ ਪਿਕਅੱਪ ਕਰੇਗਾ ਜਾਂ ਮੁਫਤ ਨਵਾਂ ਉਤਪਾਦ ਭੇਜਿਆ ਜਾਵੇਗਾ।" },
                  { step: "4", title: "ਰਿਫੰਡ ਜਾਂ ਬਦਲਵਾਂ ਉਤਪਾਦ", desc: "ਉਤਪਾਦ ਸਾਡੇ ਗੋਦਾਮ ਵਿੱਚ ਪਹੁੰਚ ਕੇ ਗੁਣਵੱਤਾ ਜਾਂਚ ਪੂਰੀ ਹੋਣ ਦੇ 5-7 ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ ਰਿਫੰਡ ਜਾਂ ਬਦਲੀ ਦੀ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋ ਜਾਵੇਗੀ।" },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. ਰਿਵਰਸ ਪਿਕਅੱਪ ਅਤੇ ਸ਼ਿਪਿੰਗ ਖਰਚੇ">
              <p>ਸਾਡੀ ਗਲਤੀ ਕਾਰਨ ਸਮੱਸਿਆ ਆਉਣ 'ਤੇ (ਗਲਤ ਉਤਪਾਦ, ਖਰਾਬ ਜਾਂ ਨੁਕਸਦਾਰ ਉਤਪਾਦ), <strong>ਰਿਵਰਸ ਪਿਕਅੱਪ ਬਿਲਕੁਲ ਮੁਫਤ</strong> ਹੁੰਦਾ ਹੈ ਅਤੇ ਸਾਰਾ ਸ਼ਿਪਿੰਗ ਖਰਚਾ ਅਸੀਂ ਚੁੱਕਦੇ ਹਾਂ। ਜੇਕਰ ਤੁਹਾਡੇ ਪਿੰਨਕੋਡ 'ਤੇ ਪਿਕਅੱਪ ਸੇਵਾ ਨਹੀਂ ਹੈ, ਤਾਂ ਕੋਰੀਅਰ ਰਸੀਦ ਜਮ੍ਹਾਂ ਕਰਨ 'ਤੇ ਉਹ ਖਰਚਾ ਵੀ ਰਿਫੰਡ ਕੀਤਾ ਜਾਵੇਗਾ।</p>
            </Section>

            <Section title="7. ਗਾਹਕ ਸਹਾਇਤਾ ਅਤੇ ਸੰਪਰਕ ਜਾਣਕਾਰੀ">
              <p>ਵਾਪਸੀ ਸਬੰਧੀ ਕਿਸੇ ਵੀ ਸਵਾਲ ਲਈ ਸਾਡੇ ਨਾਲ ਬੇਝਿਜਕ ਸੰਪਰਕ ਕਰੋ:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ਕੰਪਨੀ:</strong> ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ (ਐਲਪੀ ਟਰੇਡਰਜ਼)</p>
                <p className="mb-1"><strong>ਈਮੇਲ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>ਫ਼ੋਨ / ਵਟਸਐਪ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ਕੰਮ ਦੇ ਘੰਟੇ:</strong> ਸੋਮਵਾਰ – ਸ਼ਨੀਵਾਰ: ਸਵੇਰੇ 9:30 ਤੋਂ ਸ਼ਾਮ 6:30 ਵਜੇ ਤੱਕ (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">ਰਿਫੰਡ ਨੀਤੀ ਪੜ੍ਹੋ</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">ਗੋਪਨੀਯਤਾ ਨੀਤੀ</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "mr") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>परतावा धोरण (Return Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑरगॅनिक्स — एलपी ट्रेडर्स | शेवटचे अपडेट: ऑगस्ट २०२५</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">विन्नवर ऑरगॅनिक्समध्ये, आम्ही आपल्याला उत्कृष्ट दर्जाची नैसर्गिक व सेंद्रिय अन्न उत्पादने वितरीत करण्यासाठी वचनबद्ध आहोत. आपण आपल्या खरेदीबद्दल पूर्णपणे समाधानी नसल्यास, आपले पर्याय समजून घेण्यासाठी कृपया हे परतावा धोरण काळजीपूर्वक वाचा.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. आमचे परतावा तत्त्वज्ञान (Return Philosophy)">
              <p>प्रत्येक ग्राहकाला समाधानकारक अनुभव मिळावा असा आमचा विश्वास आहे. आम्ही <strong>लवकर खराब होणाऱ्या आणि उपभोग्य सेंद्रिय अन्नपदार्थांचा</strong> व्यापार करत असल्याने, FSSAI अन्न सुरक्षा मानकांचे पालन करत दोन्ही बाजूंच्या हिताचे रक्षण करणारे परतावा धोरण आम्ही तयार केले आहे. केवळ वैध आणि वाजवी कारणांसाठीच परतावा स्वीकारला जातो.</p>
            </Section>

            <Section title="2. परतावा पात्रता — परतावा कधी स्वीकारला जातो?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ वैध परताव्याची कारणे:</p>
                <ul className="mb-0">
                  <li><strong>चुकीचे उत्पादन मिळाले:</strong> आपण ऑर्डर केलेल्या उत्पादनाव्यतिरिक्त वेगळे उत्पादन आल्यास (उदा. चुकीचा तांदळाचा प्रकार, चुकीचे वजन/आकार)</li>
                  <li><strong>खराब/नुकसान झालेले उत्पादन:</strong> डिलिव्हरीच्या वेळी पॅकेजिंग फाटलेले, फुटलेले किंवा नुकसानग्रस्त आढळल्यास</li>
                  <li><strong>कालबाह्य (Expired) उत्पादन:</strong> डिलिव्हरीच्या तारखेला उत्पादनाची "Best Before" तारीख उलटून गेली असल्यास</li>
                  <li><strong>गुणवत्तेतील त्रुटी:</strong> उत्पादनात बुरशी (fungus), दुर्गंधी, असामान्य रंग किंवा उघड बिघाड आढळल्यास</li>
                  <li><strong>प्रमाणात तफावत:</strong> ऑर्डर केलेल्या वजनापेक्षा किंवा संख्येपैक्षा कमी प्रमाणात माल मिळाल्यास</li>
                  <li><strong>गहाळ वस्तू:</strong> इनव्हॉईसमध्ये नोंद असूनही पार्सलमध्ये वस्तू न आढळल्यास</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ परतावा न करता येण्याजोगी परिस्थिती:</p>
                <ul className="mb-0">
                  <li>सील उघडलेले किंवा वापरलेले अन्नपदार्थ (अन्न सुरक्षा आणि आरोग्याच्या कारणास्तव)</li>
                  <li>वैयक्तिक पसंती, चव किंवा रंगाच्या फरकामुळे (सेंद्रिय उत्पादनांमध्ये नैसर्गिक कारणांमुळे किंचित फरक असू शकतो)</li>
                  <li>अयोग्य साठवणुकीमुळे उत्पादन खराब झाल्यास (उदा. ओलसर जागेत ठेवल्यामुळे)</li>
                  <li>डिलिव्हरी मिळाल्यानंतर ४८ तासांनंतर केलेली नुकसानाची तक्रार</li>
                  <li>मूळ बिल, पॅकेजिंग किंवा बारकोड नसल्यास</li>
                </ul>
              </div>
            </Section>

            <Section title="3. परतावा कालावधी (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ २४ ते ४८ तास</p>
                    <p className="small text-muted mb-0">खराब झालेले, त्रुटीयुक्त, कालबाह्य किंवा चुकीचे उत्पादन मिळाल्यास डिलिव्हरीच्या वेळेपासून <strong>२४ ते ४८ तासांच्या आत</strong> फोटो/व्हिडिओसह कळवणे आवश्यक आहे.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 ७ दिवस</p>
                    <p className="small text-muted mb-0">न उघडलेल्या आणि मूळ पॅकेजिंगमध्ये असलेल्या इतर पात्र उत्पादनांसाठी डिलिव्हरीच्या तारखेपासून कमाल <strong>७ दिवसांचा</strong> कालावधी लागू राहील.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. अनबॉक्सिंग व्हिडिओची आवश्यकता (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ अत्यंत महत्त्वाची सूचना — अनबॉक्सिंग व्हिडिओ:</p>
                <p className="small mb-0">वाहतुकीदरम्यान झालेले नुकसान, गहाळ वस्तू किंवा चुकीच्या उत्पादनांच्या दाव्यांचे जलद निवारण करण्यासाठी, <strong>पार्सल उघडताना रेकॉर्ड केलेला स्पष्ट अनबॉक्सिंग व्हिडिओ</strong> सादर करण्याची आम्ही ठाम शिफारस करतो. यामुळे आपल्या दाव्याची त्वरित पूर्तता होण्यास मदत होते.</p>
              </div>
            </Section>

            <Section title="5. परतावा प्रक्रिया — ४ सोप्या पायऱ्या">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "१", title: "विनंती पाठवा", desc: "आपला ऑर्डर आयडी, समस्येचा तपशील, फोटो आणि अनबॉक्सिंग व्हिडिओसह support@vinnavar.com वर ईमेल करा किंवा +91 94441 83387 वर व्हॉट्सअॅप करा." },
                  { step: "२", title: "पडताळणी आणि मंजुरी", desc: "आमची ग्राहक सेवा टीम २४-४८ तासांत आपल्या विनंतीची तपासणी करून परतावा मंजुरी देईल." },
                  { step: "३", title: "रिव्हर्स पिकअप / रिप्लेसमेंट", desc: "मंजुरीनंतर आमचा कुरिअर पार्टनर आपल्या पत्त्यावरून पार्सल पिकअप करेल किंवा मोफत नवीन उत्पादन पाठवले जाईल." },
                  { step: "४", title: "रिफंड किंवा बदली उत्पादन", desc: "उत्पादन आमच्या गोदामात पोहोचून गुणवत्ता तपासणी पूर्ण झाल्यानंतर ५-७ कामकाजाच्या दिवसांत रिफंड किंवा रिप्लेसमेंट पूर्ण होईल." },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. रिव्हर्स पिकअप आणि शिपिंग शुल्क">
              <p>आमच्या चुकीमुळे समस्या उद्भवल्यास (चुकीचे उत्पादन, खराब किंवा निकृष्ट दर्जाचे उत्पादन), <strong>रिव्हर्स पिकअप पूर्णपणे मोफत</strong> केले जाते आणि शिपिंगचा सर्व खर्च आम्ही उचलतो. आपल्या पिनकोडवर पिकअप सेवा नसल्यास, कुरिअरद्वारे पाठवल्याची पावती दिल्यावर तो खर्चही रिफंड केला जाईल.</p>
            </Section>

            <Section title="7. ग्राहक सेवा आणि संपर्क माहिती">
              <p>परताव्याबाबत काही शंका असल्यास आमच्याशी निःसंकोचपणे संपर्क साधा:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>कंपनी:</strong> विन्नवर ऑरगॅनिक्स (एलपी ट्रेडर्स)</p>
                <p className="mb-1"><strong>ईमेल:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>फोन / व्हॉट्सअॅप:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>कामकाजाची वेळ:</strong> सोमवार – शनिवार: सकाळी ९:३० ते संध्याकाळी ६:३० (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">रिफंड धोरण वाचा</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">नियम आणि अटी</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">गोपनीयता धोरण</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "bn") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>রিটার্ন পলিসি (Return Policy)</h1>
                <p className="text-muted small mb-0">ভিন্নভার অর্গানিকস — এলপি ট্রেডার্স | সর্বশেষ আপডেট: আগস্ট ২০২৫</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ভিন্নভার অর্গানিকসে, আমরা আপনাকে সর্বোচ্চ মানের খাঁটি ও প্রাকৃতিক জৈব খাদ্য পণ্য সরবরাহ করতে প্রতিশ্রুতিবদ্ধ। আপনি যদি আপনার কেনাকাটায় পুরোপুরি সন্তুষ্ট না হন, তবে আপনার বিকল্পগুলি বুঝতে অনুগ্রহ করে এই রিটার্ন নীতিটি মনোযোগ সহকারে পড়ুন।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. আমাদের রিটার্ন দর্শন (Return Philosophy)">
              <p>আমরা বিশ্বাস করি প্রতিটি গ্রাহকের একটি সন্তোষজনক অভিজ্ঞতা পাওয়া উচিত। যেহেতু আমরা <strong>দ্রুত পচনশীল এবং ব্যবহারযোগ্য জৈব খাদ্য সামগ্রীর</strong> ব্যবসা করি, তাই FSSAI খাদ্য নিরাপত্তা মান মেনে উভয় পক্ষের জন্য ন্যায়সঙ্গতভাবে আমাদের রিটার্ন নীতি তৈরি করা হয়েছে। কেবলমাত্র বৈধ ও যুক্তিসঙ্গত কারণেই রিটার্ন গ্রহণ করা হয়।</p>
            </Section>

            <Section title="2. রিটার্ন যোগ্যতা — কখন রিটার্ন গ্রহণ করা হয়?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ বৈধ রিটার্নের কারণসমূহ:</p>
                <ul className="mb-0">
                  <li><strong>ভুল পণ্য ডেলিভারি:</strong> আপনি যে পণ্য অর্ডার করেছিলেন তার পরিবর্তে অন্য কোনো পণ্য পেলে (যেমন: ভুল চালের জাত, ভুল ওজন/আকার)</li>
                  <li><strong>ক্ষতিগ্রস্ত পণ্য:</strong> ডেলিভারির সময় প্যাকেজিং ছেঁড়া, ভাঙা বা ফুটো অবস্থায় পাওয়া গেলে</li>
                  <li><strong>মেয়াদোত্তীর্ণ (Expired) পণ্য:</strong> ডেলিভারির তারিখে পণ্যের "Best Before" বা মেয়াদের তারিখ পার হয়ে থাকলে</li>
                  <li><strong>গুণমানের ত্রুটি:</strong> পণ্যে ছত্রাক (fungus), দুর্গন্ধ, অস্বাভাবিক রঙ বা স্পষ্ট কোনো ত্রুটি পরিলক্ষিত হলে</li>
                  <li><strong>পরিমাণে ঘাটতি:</strong> অর্ডার করা ওজন বা সংখ্যার চেয়ে কম পরিমাণ পেলে</li>
                  <li><strong>অনুপস্থিত পণ্য:</strong> চালানে (Invoice) উল্লিখিত পণ্য পার্সেল থেকে অনুপস্থিত থাকলে</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ যেসকল ক্ষেত্রে রিটার্ন প্রযোজ্য নয়:</p>
                <ul className="mb-0">
                  <li>সিল খোলা বা আংশিক ব্যবহৃত খাদ্য সামগ্রী (খাদ্য নিরাপত্তা ও স্বাস্থ্যবিধির স্বার্থে)</li>
                  <li>ব্যক্তিগত পছন্দ, স্বাদ বা রঙের পার্থক্যের কারণে (জৈব পণ্যে প্রাকৃতিক কারণে সামান্য রঙের পার্থক্য হতে পারে)</li>
                  <li>অনুপযুক্ত সংরক্ষণের কারণে পণ্য নষ্ট হলে (যেমন: স্যাঁতসেঁতে জায়গায় রাখা)</li>
                  <li>ডেলিভারি পাওয়ার ৪৮ ঘণ্টার পর জানানো ক্ষতির অভিযোগ</li>
                  <li>মূল বিল, প্যাকেজিং বা বারকোড অনুপস্থিত থাকলে</li>
                </ul>
              </div>
            </Section>

            <Section title="3. রিটার্নের সময়সীমা (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ ২৪ থেকে ৪৮ ঘণ্টা</p>
                    <p className="small text-muted mb-0">ক্ষতিগ্রস্ত, ত্রুটিপূর্ণ, মেয়াদোত্তীর্ণ বা ভুল পণ্যের ক্ষেত্রে ডেলিভারির সময় থেকে <strong>২৪ থেকে ৪৮ ঘণ্টার মধ্যে</strong> ছবি/ভিডিও সহ রিপোর্ট করতে হবে।</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 ৭ দিন</p>
                    <p className="small text-muted mb-0">না খোলা, অক্ষত আসল প্যাকেজিংয়ে থাকা অন্যান্য যোগ্য পণ্যের ক্ষেত্রে ডেলিভারির তারিখ থেকে সর্বোচ্চ <strong>৭ দিন পর্যন্ত</strong> সময় প্রযোজ্য।</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. আনবক্সিং ভিডিওর প্রয়োজনীয়তা (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ অত্যন্ত গুরুত্বপূর্ণ — আনবক্সিং ভিডিও:</p>
                <p className="small mb-0">পরিবহনে ক্ষতি, অনুপস্থিত পণ্য বা ভুল পণ্যের দাবির দ্রুত সমাধানের জন্য, <strong>পার্সেল খোলার সময় ধারণকৃত একটি স্পষ্ট আনবক্সিং ভিডিও</strong> প্রদান করার জন্য আমরা বিশেষভাবে অনুরোধ জানাচ্ছি। এটি আপনার দাবির দ্রুত নিষ্পত্তিতে সহায়তা করে।</p>
              </div>
            </Section>

            <Section title="5. রিটার্ন প্রক্রিয়া — ৪টি সহজ ধাপ">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "১", title: "অনুরোধ পাঠান", desc: "আপনার অর্ডার আইডি, সমস্যার বিবরণ, ছবি ও আনবক্সিং ভিডিও সহ support@vinnavar.com এ ইমেল করুন অথবা +91 94441 83387 এ হোয়াটসঅ্যাপ করুন।" },
                  { step: "২", title: "পর্যালোচনা ও অনুমোদন", desc: "আমাদের কাস্টমার সাপোর্ট টিম ২৪-৪৮ ঘণ্টার মধ্যে আপনার অনুরোধটি যাচাই করে অনুমোদন প্রদান করবে।" },
                  { step: "৩", title: "রিভার্স পিকআপ / প্রতিস্থাপন", desc: "অনুমোদনের পর, আমাদের কুরিয়ার পার্টনার আপনার ঠিকানা থেকে পার্সেলটি সংগ্রহ করবে অথবা বিনামূল্যে নতুন পণ্য পাঠানো হবে।" },
                  { step: "৪", title: "রিফান্ড বা পণ্য প্রতিস্থাপন", desc: "পণ্যটি আমাদের গুদামে পৌঁছে গুণমান যাচাই সম্পন্ন হওয়ার ৫-৭ কার্যদিবসের মধ্যে রিফান্ড বা প্রতিস্থাপন সম্পন্ন হবে।" },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. রিভার্স পিকআপ এবং শিপিং চার্জ">
              <p>আমাদের ভুলের কারণে সমস্যা হলে (ভুল পণ্য, ক্ষতিগ্রস্ত বা নিম্নমানের পণ্য), <strong>রিভার্স পিকআপ সম্পূর্ণ বিনামূল্যে</strong> করা হয় এবং সমস্ত শিপিং খরচ আমরা বহন করি। যদি আপনার পিনকোডে পিকআপ সেবা না থাকে, তবে কুরিয়ারের মাধ্যমে পাঠানোর রসিদ দিলে সেই খরচও ফেরত দেওয়া হবে।</p>
            </Section>

            <Section title="7. কাস্টমার সাপোর্ট এবং যোগাযোগের তথ্য">
              <p>রিটার্ন সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>কোম্পানি:</strong> ভিন্নভার অর্গানিকস (এলপি ট্রেডার্স)</p>
                <p className="mb-1"><strong>ইমেল:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>ফোন / হোয়াটসঅ্যাপ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>কার্যকাল:</strong> সোমবার – শনিবার: সকাল ৯:৩০ থেকে সন্ধ্যা ৬:৩০ (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">রিফান্ড পলিসি পড়ুন</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">শর্তাবলী ও নিয়মাবলী</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">গোপনীয়তা নীতি</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "ml") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>റിട്ടേൺ പോളിസി (Return Policy)</h1>
                <p className="text-muted small mb-0">വിണ്ണവർ ഓർഗാനിക്‌സ് — എൽപി ട്രേഡേഴ്‌സ് | അവസാന അപ്‌ഡേറ്റ്: ഓഗസ്റ്റ് 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">വിണ്ണവർ ഓർഗാനിക്‌സിൽ, നിങ്ങൾക്ക് ഉയർന്ന ഗുണനിലവാരമുള്ള ഓർഗാനിക് ഭക്ഷ്യ ഉൽപ്പന്നങ്ങൾ എത്തിക്കാൻ ഞങ്ങൾ പ്രതിജ്ഞാബദ്ധരാണ്. നിങ്ങളുടെ വാങ്ങലിൽ നിങ്ങൾ പൂർണ്ണമായി തൃപ്തരല്ലെങ്കിൽ, നിങ്ങളുടെ ഓപ്ഷനുകൾ മനസ്സിലാക്കാൻ ദയവായി ഈ റിട്ടേൺ പോളിസി ശ്രദ്ധാപൂർവ്വം വായിക്കുക.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ഞങ്ങളുടെ റിട്ടേൺ തത്വം (Return Philosophy)">
              <p>ഓരോ ഉപഭോക്താവിനും തൃപ്തികരമായ അനുഭവം നൽകുക എന്നതാണ് ഞങ്ങളുടെ ലക്ഷ്യം. ഞങ്ങൾ <strong>വേഗത്തിൽ കേടുവരുന്നതും ഉപഭോഗയോഗ്യവുമായ ഓർഗാനിക് ഭക്ഷ്യവസ്തുക്കളുടെ</strong> വ്യാപാരം നടത്തുന്നതിനാൽ, FSSAI ഭക്ഷ്യസുരക്ഷാ മാനദണ്ഡങ്ങൾ പാലിച്ച് ഇരുവിഭാഗത്തിനും നീതിപൂർവ്വമായ രീതിയിലാണ് ഞങ്ങളുടെ റിട്ടേൺ പോളിസി രൂപകൽപ്പന ചെയ്തിരിക്കുന്നത്. സാധുവായ കാരണങ്ങൾ ഉള്ളപ്പോൾ മാത്രമേ റിട്ടേൺ സ്വീകരിക്കുകയുള്ളൂ.</p>
            </Section>

            <Section title="2. റിട്ടേൺ യോഗ്യത — എപ്പോഴാണ് റിട്ടേൺ സ്വീകരിക്കുന്നത്?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ സാധുവായ റിട്ടേൺ കാരണങ്ങൾ:</p>
                <ul className="mb-0">
                  <li><strong>തെറ്റായ ഉൽപ്പന്നം ലഭിച്ചു:</strong> നിങ്ങൾ ഓർഡർ ചെയ്ത ഉൽപ്പന്നത്തിൽ നിന്ന് വ്യത്യസ്തമായ ഉൽപ്പന്നം ലഭിക്കുമ്പോൾ (ഉദാ. തെറ്റായ അരി ഇനം, തെറ്റായ അളവ്/തൂക്കം)</li>
                  <li><strong>കേടുപാടുകൾ സംഭവിച്ച ഉൽപ്പന്നം:</strong> ഡെലിവറി സമയത്ത് പാക്കേജിംഗ് കീറിയതോ പൊട്ടിയതോ കേടുവന്നതോ ആണെങ്കിൽ</li>
                  <li><strong>കാലാവധി കഴിഞ്ഞ ഉൽപ്പന്നങ്ങൾ:</strong> ഡെലിവറി തീയതിയിൽ ഉൽപ്പന്നത്തിന്റെ "Best Before" തീയതി കഴിഞ്ഞിട്ടുണ്ടെങ്കിൽ</li>
                  <li><strong>ഗുണനിലവാര തകരാറുകൾ:</strong> ഉൽപ്പന്നത്തിൽ പൂപ്പൽ (fungus), ദുർഗന്ധം, അസ്വാഭാവിക നിറം അല്ലെങ്കിൽ വ്യക്തമായ കേടുപാടുകൾ ശ്രദ്ധയിൽപ്പെട്ടാൽ</li>
                  <li><strong>അളവിലെ വ്യത്യാസം:</strong> ഓർഡർ ചെയ്ത തൂക്കത്തേക്കാളോ എണ്ണത്തേക്കാളോ കുറവ് ലഭിച്ചാൽ</li>
                  <li><strong>വിട്ടുപോയ ഉൽപ്പന്നങ്ങൾ:</strong> ഇൻവോയ്‌സിൽ രേഖപ്പെടുത്തിയ ഉൽപ്പന്നം പാഴ്സലിൽ ഇല്ലാതിരുന്നാൽ</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ റിട്ടേൺ ചെയ്യാനാവാത്ത സാഹചര്യങ്ങൾ:</p>
                <ul className="mb-0">
                  <li>സീൽ തുറന്നതോ ഉപയോഗിച്ചതോ ആയ ഭക്ഷ്യ ഉൽപ്പന്നങ്ങൾ (ഭക്ഷ്യസുരക്ഷയും ശുചിത്വവും കണക്കിലെടുത്ത്)</li>
                  <li>വ്യക്തിഗത അഭിരുചി, രുചി അല്ലെങ്കിൽ നിറം സംബന്ധിച്ച മുൻഗണനകൾ കാരണം (ഓർഗാനിക് ഉൽപ്പന്നങ്ങളിൽ സ്വാഭാവിക വ്യത്യാസങ്ങൾ ഉണ്ടാകാം)</li>
                  <li>ശരിയായ രീതിയിൽ സൂക്ഷിക്കാത്തതുമൂലം ഉൽപ്പന്നങ്ങൾക്ക് കേടുപാടുകൾ സംഭവിച്ചാൽ (ഉദാ. ഈർപ്പമുള്ള സ്ഥലങ്ങളിൽ സൂക്ഷിക്കൽ)</li>
                  <li>ഡെലിവറി കഴിഞ്ഞ് 48 മണിക്കൂറിനു ശേഷം റിപ്പോർട്ട് ചെയ്യപ്പെട്ട കേടുപാടുകൾ</li>
                  <li>യഥാർത്ഥ ബിൽ, പാക്കേജിംഗ് അല്ലെങ്കിൽ ബാർകോഡ് ഇല്ലാത്ത ഉൽപ്പന്നങ്ങൾ</li>
                </ul>
              </div>
            </Section>

            <Section title="3. റിട്ടേൺ സമയപരിധി (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ 24 മുതൽ 48 മണിക്കൂർ വരെ</p>
                    <p className="small text-muted mb-0">കേടായതോ തകരാറുള്ളതോ കാലാവധി കഴിഞ്ഞതോ ആയ ഉൽപ്പന്നങ്ങൾ ഡെലിവറി സമയം മുതൽ <strong>24 മുതൽ 48 മണിക്കൂറിനുള്ളിൽ</strong> ഫോട്ടോകൾ/വീഡിയോ സഹിതം റിപ്പോർട്ട് ചെയ്യണം.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 7 ദിവസങ്ങൾ</p>
                    <p className="small text-muted mb-0">തുറക്കാത്തതും യഥാർത്ഥ പാക്കേജിംഗിൽ ഉള്ളതുമായ മറ്റ് യോഗ്യമായ ഉൽപ്പന്നങ്ങൾക്ക് ഡെലിവറി തീയതി മുതൽ പരമാവധി <strong>7 ദിവസത്തെ</strong> സമയപരിധിയുണ്ട്.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. അൺബോക്‌സിംഗ് വീഡിയോ ആവശ്യകത (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ പ്രധാന അറിയിപ്പ് — അൺബോക്‌സിംഗ് വീഡിയോ:</p>
                <p className="small mb-0">യാത്രാവേളയിലുണ്ടായ കേടുപാടുകൾ, കാണാതായ സാധനങ്ങൾ അല്ലെങ്കിൽ തെറ്റായ ഉൽപ്പന്നങ്ങൾ എന്നിവ സംബന്ധിച്ച പരാതികൾ വേഗത്തിൽ പരിഹരിക്കുന്നതിന്, <strong>പാഴ്സൽ തുറക്കുമ്പോൾ ചിത്രീകരിച്ച വ്യക്തമായ അൺബോക്‌സിംഗ് വീഡിയോ</strong> നൽകാൻ ഞങ്ങൾ ശക്തമായി ശുപാർശ ചെയ്യുന്നു.</p>
              </div>
            </Section>

            <Section title="5. റിട്ടേൺ നടപടിക്രമം — 4 ലളിതമായ ഘട്ടങ്ങൾ">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "1", title: "അപേക്ഷ സമർപ്പിക്കുക", desc: "നിങ്ങളുടെ ഓർഡർ ഐഡി, പ്രശ്നത്തിന്റെ വിവരണം, ഫോട്ടോകൾ, അൺബോക്‌സിംഗ് വീഡിയോ എന്നിവ സഹിതം support@vinnavar.com ലേക്ക് ഇമെയിൽ ചെയ്യുക അല്ലെങ്കിൽ +91 94441 83387 ലേക്ക് വാട്ട്‌സ്ആപ്പ് ചെയ്യുക." },
                  { step: "2", title: "പരിശോധനയും അംഗീകാരവും", desc: "ഞങ്ങളുടെ സപ്പോർട്ട് ടീം നിങ്ങളുടെ അപേക്ഷ 24-48 മണിക്കൂറിനുള്ളിൽ പരിശോധിച്ച് റിട്ടേൺ അംഗീകാരം നൽകും." },
                  { step: "3", title: "റിവേഴ്സ് പിക്കപ്പ് / റീപ്ലേസ്‌മെന്റ്", desc: "അംഗീകാരം ലഭിച്ചുകഴിഞ്ഞാൽ, ഞങ്ങളുടെ കൊറിയർ പങ്കാളി നിങ്ങളുടെ വിലാസത്തിൽ നിന്ന് പാർസൽ പിക്കപ്പ് ചെയ്യുകയോ സൗജന്യമായി പുതിയ ഉൽപ്പന്നം അയക്കുകയോ ചെയ്യും." },
                  { step: "4", title: "റീഫണ്ട് അല്ലെങ്കിൽ പുതിയ ഉൽപ്പന്നം", desc: "ഉൽപ്പന്നം ഞങ്ങളുടെ വെയർഹൗസിൽ എത്തി പരിശോധന പൂർത്തിയായി 5-7 പ്രവൃത്തി ദിവസങ്ങൾക്കുള്ളിൽ തുക റീഫണ്ട് ചെയ്യും." },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. റിവേഴ്സ് പിക്കപ്പും ഷിപ്പിംഗ് ചാർജുകളും">
              <p>ഞങ്ങളുടെ ഭാഗത്തുനിന്നുണ്ടായ തെറ്റുകൾക്ക് (തെറ്റായ ഉൽപ്പന്നം, കേടുവന്നതോ ഗുണനിലവാരമില്ലാത്തതോ ആയ ഉൽപ്പന്നം), <strong>റിവേഴ്സ് പിക്കപ്പ് പൂർണ്ണമായും സൗജന്യമാണ്</strong>, എല്ലാ ഷിപ്പിംഗ് ചെലവുകളും ഞങ്ങൾ വഹിക്കുന്നതാണ്. നിങ്ങളുടെ പിൻകോഡിൽ റിവേഴ്സ് പിക്കപ്പ് ലഭ്യമല്ലെങ്കിൽ, നിങ്ങൾ കൊറിയർ വഴി അയച്ച രസീത് സമർപ്പിച്ചാൽ ആ തുകയും റീഫണ്ട് ചെയ്യുന്നതാണ്.</p>
            </Section>

            <Section title="7. കസ്റ്റമർ സപ്പോർട്ടും ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും">
              <p>റിട്ടേൺ സംബന്ധിച്ച് എന്തെങ്കിലും ചോദ്യങ്ങളുണ്ടെങ്കിൽ, ഞങ്ങളെ ബന്ധപ്പെടാവുന്നതാണ്:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>കമ്പനി:</strong> വിണ്ണവർ ഓർഗാനിക്‌സ് (എൽപി ട്രേഡേഴ്‌സ്)</p>
                <p className="mb-1"><strong>ഇമെയിൽ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>ഫോൺ / വാട്ട്‌സ്ആപ്പ്:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>പ്രവൃത്തി സമയം:</strong> തിങ്കൾ – ശനി: രാവിലെ 9:30 മുതൽ വൈകുന്നേരം 6:30 വരെ (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">റീഫണ്ട് പോളിസി വായിക്കുക</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">നിബന്ധനകളും വ്യവസ്ഥകളും</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">സ്വകാര്യതാ നയം</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "kn") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ರಿಟರ್ನ್ ನೀತಿ (Return Policy)</h1>
                <p className="text-muted small mb-0">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ — ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ | ಕೊನೆಯ ನವೀಕರಣ: ಆಗಸ್ಟ್ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್‌ನಲ್ಲಿ, ನಾವು ನಿಮಗೆ ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ನೈಸರ್ಗಿಕ ಹಾಗೂ ಸಾವಯವ ಆಹಾರ ಉತ್ಪನ್ನಗಳನ್ನು ತಲುಪಿಸಲು ಬದ್ಧರಾಗಿದ್ದೇವೆ. ನಿಮ್ಮ ಖರೀದಿಯ ಬಗ್ಗೆ ನೀವು ಸಂಪೂರ್ಣ ತೃಪ್ತರಾಗದಿದ್ದರೆ, ನಿಮ್ಮ ಆಯ್ಕೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ದಯವಿಟ್ಟು ಈ ರಿಟರ್ನ್ ನೀತಿಯನ್ನು ಓದಿ.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ನಮ್ಮ ರಿಟರ್ನ್ ತತ್ವ (Return Philosophy)">
              <p>ಪ್ರತಿಯೊಬ್ಬ ಗ್ರಾಹಕರಿಗೂ ತೃಪ್ತಿದಾಯಕ ಅನುಭವ ಸಿಗಬೇಕೆಂದು ನಾವು ಬಯಸುತ್ತೇವೆ. ನಾವು <strong>ಬೇಗ ಹಾಳಾಗುವ ಮತ್ತು ಸೇವಿಸುವ ಸಾವಯವ ಆಹಾರ ಪದಾರ್ಥಗಳ</strong> ವಹಿವಾಟು ನಡೆಸುತ್ತಿರುವುದರಿಂದ, FSSAI ಆಹಾರ ಸುರಕ್ಷತಾ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸುತ್ತಾ ಉಭಯ ಪಕ್ಷಗಳಿಗೂ ನ್ಯಾಯಯುತವಾಗಿರುವಂತೆ ನಮ್ಮ ನೀತಿಯನ್ನು ರೂಪಿಸಲಾಗಿದೆ. ಮಾನ್ಯ ಕಾರಣಗಳಿದ್ದಾಗ ಮಾತ್ರ ರಿಟರ್ನ್ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="2. ರಿಟರ್ನ್ ಅರ್ಹತೆ — ರಿಟರ್ನ್ ಯಾವಾಗ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ ಮಾನ್ಯ ರಿಟರ್ನ್ ಕಾರಣಗಳು:</p>
                <ul className="mb-0">
                  <li><strong>ತಪ್ಪು ಉತ್ಪನ್ನ ವಿತರಣೆ:</strong> ನೀವು ಆರ್ಡರ್ ಮಾಡಿದ ಉತ್ಪನ್ನಕ್ಕಿಂತ ಭಿನ್ನವಾದ ಉತ್ಪನ್ನ ತಲುಪಿದಾಗ (ಉದಾ. ತಪ್ಪು ಅಕ್ಕಿ ವಿಧ, ತಪ್ಪು ತೂಕ/ಗಾತ್ರ)</li>
                  <li><strong>ಹಾನಿಗೊಳಗಾದ ಉತ್ಪನ್ನ:</strong> ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ಪ್ಯಾಕೇಜಿಂಗ್ ಹರಿದುಹೋಗಿದ್ದರೆ, ಒಡೆದಿದ್ದರೆ ಅಥವಾ ಹಾನಿಗೊಳಗಾಗಿದ್ದರೆ</li>
                  <li><strong>ಅವಧಿ ಮೀರಿದ (Expired) ಉತ್ಪನ್ನ:</strong> ಡೆಲಿವರಿ ದಿನಾಂಕದಂದು ಉತ್ಪನ್ನದ "Best Before" ದಿನಾಂಕ ಮುಗಿದಿದ್ದರೆ</li>
                  <li><strong>ಗುಣಮಟ್ಟದ ದೋಷ:</strong> ಉತ್ಪನ್ನದಲ್ಲಿ ಶಿಲೀಂಧ್ರ (fungus), ದುರ್ವಾಸನೆ, ಅಸಹಜ ಬಣ್ಣ ಅಥವಾ ಸ್ಪಷ್ಟವಾಗಿ ಹಾಳಾಗಿದ್ದರೆ</li>
                  <li><strong>ಪ್ರಮಾಣದಲ್ಲಿ ವ್ಯತ್ಯಾಸ:</strong> ಆರ್ಡರ್ ಮಾಡಿದ ತೂಕ ಅಥವಾ ಸಂಖ್ಯೆಗಿಂತ ಕಡಿಮೆ ಪ್ರಮಾಣ ತಲುಪಿದ್ದರೆ</li>
                  <li><strong>ಕಾಣೆಯಾದ ವಸ್ತುಗಳು:</strong> ಇನ್‌ವಾಯ್ಸ್‌ನಲ್ಲಿದ್ದು ಪಾರ್ಸೆಲ್‌ನಲ್ಲಿ ವಸ್ತು ಇರದಿದ್ದರೆ</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ ರಿಟರ್ನ್ ಮಾಡಲಾಗದ ಸಂದರ್ಭಗಳು:</p>
                <ul className="mb-0">
                  <li>ಸೀಲ್ ತೆರೆದ ಅಥವಾ ಬಳಸಲಾದ ಆಹಾರ ಪದಾರ್ಥಗಳು (ಆಹಾರ ಸುರಕ್ಷತೆ ಮತ್ತು ನೈರ್ಮಲ್ಯದ ದೃಷ್ಟಿಯಿಂದ)</li>
                  <li>ವೈಯಕ್ತಿಕ ಇಷ್ಟ, ರುಚಿ ಅಥವಾ ಬಣ್ಣದ ಆದ್ಯತೆಗಾಗಿ (ಸಾವಯವ ಉತ್ಪನ್ನಗಳಲ್ಲಿ ನೈಸರ್ಗಿಕ ವ್ಯತ್ಯಾಸಗಳು ಸಹಜ)</li>
                  <li>ಸರಿಯಾಗಿ ಶೇಖರಿಸದ ಕಾರಣ ಉತ್ಪನ್ನ ಹಾಳಾಗಿದ್ದರೆ (ಉದಾ. ತೇವಾಂಶವಿರುವ ಜಾಗದಲ್ಲಿ ಇಡುವುದು)</li>
                  <li>ಡೆಲಿವರಿ ಆದ 48 ಗಂಟೆಗಳ ನಂತರ ವರದಿ ಮಾಡಲಾದ ಹಾನಿಯ ದೂರುಗಳು</li>
                  <li>ಮೂಲ ಬಿಲ್, ಪ್ಯಾಕೇಜಿಂಗ್ ಅಥವಾ ಬಾರ್‌ಕೋಡ್ ಇಲ್ಲದ ಉತ್ಪನ್ನಗಳು</li>
                </ul>
              </div>
            </Section>

            <Section title="3. ರಿಟರ್ನ್ ಸಮಯ ಮಿತಿ (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ 24 ರಿಂದ 48 ಗಂಟೆಗಳು</p>
                    <p className="small text-muted mb-0">ಹಾನಿಗೊಳಗಾದ, ದೋಷಯುಕ್ತ, ಅವಧಿ ಮೀರಿದ ಅಥವಾ ತಪ್ಪು ಉತ್ಪನ್ನಗಳನ್ನು ಡೆಲಿವರಿ ಸಮಯದಿಂದ <strong>24 ರಿಂದ 48 ಗಂಟೆಗಳೊಳಗೆ</strong> ಫೋಟೋ/ವೀಡಿಯೊ ಸಮೇತ ವರದಿ ಮಾಡಬೇಕು.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 7 ದಿನಗಳು</p>
                    <p className="small text-muted mb-0">ತೆರೆಯದ, ಮೂಲ ಪ್ಯಾಕೇಜಿಂಗ್‌ನಲ್ಲಿರುವ ಇತರ ಅರ್ಹ ಉತ್ಪನ್ನಗಳಿಗೆ ಡೆಲಿವರಿ ದಿನಾಂಕದಿಂದ ಗರಿಷ್ಠ <strong>7 ದಿನಗಳವರೆಗೆ</strong> ಅವಕಾಶವಿರುತ್ತದೆ.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. ಅನ್‌ಬಾಕ್ಸಿಂಗ್ ವಿಡಿಯೋ ಅವಶ್ಯಕತೆ (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ ಪ್ರಮುಖ ಸೂಚನೆ — ಅನ್‌ಬಾಕ್ಸಿಂಗ್ ವಿಡಿಯೋ:</p>
                <p className="small mb-0">ಸಾರಿಗೆಯಲ್ಲಿ ಉಂಟಾದ ಹಾನಿ, ಕಳೆದುಹೋದ ವಸ್ತುಗಳು ಅಥವಾ ತಪ್ಪು ಉತ್ಪನ್ನಗಳ ಕ್ಲೈಮ್‌ಗಳನ್ನು ಶೀಘ್ರವಾಗಿ ಪರಿಹರಿಸಲು, <strong>ಪಾರ್ಸೆಲ್ ತೆರೆಯುವಾಗ ಚಿತ್ರೀಕರಿಸಿದ ಸ್ಪಷ್ಟವಾದ ಅನ್‌ಬಾಕ್ಸಿಂಗ್ ವೀಡಿಯೊ</strong>ವನ್ನು ಒದಗಿಸಲು ನಾವು ಬಲವಾಗಿ ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.</p>
              </div>
            </Section>

            <Section title="5. ರಿಟರ್ನ್ ಪ್ರಕ್ರಿಯೆ — 4 ಸುಲಭ ಹಂತಗಳು">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "1", title: "ವಿನಂತಿ ಕಳುಹಿಸಿ", desc: "ನಿಮ್ಮ ಆರ್ಡರ್ ID, ಸಮಸ್ಯೆಯ ವಿವರ, ಫೋಟೋ ಮತ್ತು ಅನ್‌ಬಾಕ್ಸಿಂಗ್ ವೀಡಿಯೊದೊಂದಿಗೆ support@vinnavar.com ಗೆ ಇಮೇಲ್ ಮಾಡಿ ಅಥವಾ +91 94441 83387 ಗೆ ವಾಟ್ಸಾಪ್ ಮಾಡಿ." },
                  { step: "2", title: "ಪರಿಶೀಲನೆ & ಅನುಮೋದನೆ", desc: "ನಮ್ಮ ಗ್ರಾಹಕ ಬೆಂಬಲ ತಂಡವು ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು 24-48 ಗಂಟೆಗಳೊಳಗೆ ಪರಿಶೀಲಿಸಿ ಅನುಮೋದನೆಯನ್ನು ತಿಳಿಸುತ್ತದೆ." },
                  { step: "3", title: "ರಿವರ್ಸ್ ಪಿಕಪ್ / ಬದಲಿ", desc: "ಅನುಮೋದನೆಯ ನಂತರ, ನಮ್ಮ ಕೊರಿಯರ್ ಪಾಲುದಾರರು ನಿಮ್ಮ ವಿಳಾಸದಿಂದ ಪಾರ್ಸೆಲ್ ಪಿಕಪ್ ಮಾಡುತ್ತಾರೆ ಅಥವಾ ಉಚಿತವಾಗಿ ಹೊಸ ಉತ್ಪನ್ನ ಕಳುಹಿಸಲಾಗುತ್ತದೆ." },
                  { step: "4", title: "ಮರುಪಾವತಿ ಅಥವಾ ಬದಲಿ ಉತ್ಪನ್ನ", desc: "ಉತ್ಪನ್ನ ನಮ್ಮ ಗೋದಾಮನ್ನು ತಲುಪಿ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಂಡ 5-7 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ಮರುಪಾವತಿ ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತದೆ." },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. ರಿವರ್ಸ್ ಪಿಕಪ್ ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕಗಳು">
              <p>ನಮ್ಮ ಕಡೆಯಿಂದ ಆದ ದೋಷಗಳಿಗೆ (ತಪ್ಪು ವಸ್ತು, ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ದೋಷಪೂರಿತ ಉತ್ಪನ್ನ), <strong>ರಿವರ್ಸ್ ಪಿಕಪ್ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿರುತ್ತದೆ</strong> ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ವೆಚ್ಚವನ್ನು ನಾವೇ ಭರಿಸುತ್ತೇವೆ. ನಿಮ್ಮ ಪಿನ್‌ಕೋಡ್‌ನಲ್ಲಿ ರಿವರ್ಸ್ ಪಿಕಪ್ ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ, ನೀವು ರಿಟರ್ನ್ ಕಳುಹಿಸಿದ ರಶೀದಿಯನ್ನು ಸಲ್ಲಿಸಿದಾಗ ಆ ಮೊತ್ತವನ್ನು ಮರುಪಾವತಿಸಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="7. ಗ್ರಾಹಕ ಬೆಂಬಲ & ಸಂಪರ್ಕ ವಿವರಗಳು">
              <p>ರಿಟರ್ನ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ಕಂಪನಿ:</strong> ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ (ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್)</p>
                <p className="mb-1"><strong>ಇಮೇಲ್:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>ಫೋನ್ / ವಾಟ್ಸಾಪ್:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ಕೆಲಸದ ಸಮಯ:</strong> ಸೋಮವಾರ – ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9:30 ರಿಂದ ಸಂಜೆ 6:30 ವರೆಗೆ (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">ಮರುಪಾವತಿ ನೀತಿ ಓದಿ</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">ಗೌಪ್ಯತಾ ನೀತಿ</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "te") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>రిటర్న్ పాలసీ (Return Policy)</h1>
                <p className="text-muted small mb-0">విన్నవర్ ఆర్గానిక్స్ — ఎల్పీ ట్రేడర్స్ | చివరి నవీకరణ: ఆగస్టు 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">విన్నవర్ ఆర్గానిక్స్ వద్ద, మేము మీకు అత్యుత్తమ నాణ్యమైన సేంద్రీయ ఆహార ఉత్పత్తులను అందించడానికి కట్టుబడి ఉన్నాము. మీరు మీ కొనుగోలుతో పూర్తిగా సంతృప్తి చెందకపోతే, మీ ఎంపికలను అర్థం చేసుకోవడానికి దయచేసి ఈ రిటర్న్ పాలసీని జాగ్రత్తగా చదవండి.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. మా రిటర్న్ సిద్ధాంతం (Return Philosophy)">
              <p>ప్రతి కస్టమర్‌కు సంతృప్తికరమైన అనుభవం ఉండాలని మేము విశ్వసిస్తున్నాము. మేము <strong>త్వరగా పాడైపోయే మరియు వినియోగించదగిన సేంద్రీయ ఆహార పదార్థాలను</strong> విక్రయిస్తున్నందున, మా రిటర్న్ పాలసీ FSSAI ఆహార భద్రతా నిబంధనలను పాటిస్తూ ఇరుపక్షాలకు న్యాయంగా ఉండేలా రూపొందించబడింది. సరైన మరియు చెల్లుబాటు అయ్యే కారణాల ఆధారంగా మాత్రమే రిటర్న్లు ఆమోదించబడతాయి.</p>
            </Section>

            <Section title="2. రిటర్న్ అర్హత — రిటర్న్ ఎప్పుడు ఆమోదించబడుతుంది?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ చెల్లుబాటు అయ్యే రిటర్న్ కారణాలు:</p>
                <ul className="mb-0">
                  <li><strong>తప్పు ఉత్పత్తి డెలివరీ:</strong> మీరు ఆర్డర్ చేసిన వస్తువు కాకుండా వేరే ఉత్పత్తి అందినప్పుడు (ఉదా. వేరే రకం బియ్యం, వేరే పరిమాణం/తూకం)</li>
                  <li><strong>దెబ్బతిన్న ఉత్పత్తి:</strong> డెలివరీ సమయంలో ప్యాకేజింగ్ చిరిగిపోయి, పగిలిపోయి లేదా దెబ్బతిని ఉంటే</li>
                  <li><strong>గడువు ముగిసిన (Expired) ఉత్పత్తులు:</strong> డెలివరీ తేదీ నాటికి "Best Before" తేదీ ముగిసిపోయి ఉంటే</li>
                  <li><strong>నాణ్యతా లోపాలు:</strong> ఉత్పత్తిలో బూజు, దుర్వాసన, అసాధారణ రంగు లేదా స్పష్టమైన చెడిపోవడం గమనిస్తే</li>
                  <li><strong>పరిమాణంలో తేడా:</strong> ఆర్డర్ చేసిన బరువు లేదా సంఖ్య కంటే తక్కువగా అందితే</li>
                  <li><strong>మిస్ అయిన వస్తువులు:</strong> ఇన్వాయిస్‌లో ఉండి పార్శిల్‌లో వస్తువు లేకపోతే</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ రిటర్న్ చేయలేని పరిస్థితులు:</p>
                <ul className="mb-0">
                  <li>సీల్ తెరిచిన లేదా ఉపయోగించిన ఆహార పదార్థాలు (ఆహార భద్రత మరియు పరిశుభ్రత దృష్ట్యా)</li>
                  <li>వ్యక్తిగత అభిరుచి, రుచి లేదా రంగు ప్రాధాన్యత కారణంగా (సేంద్రీయ ఉత్పత్తులలో సహజంగా చిన్న మార్పులు ఉంటాయి)</li>
                  <li>సరైన విధంగా నిల్వ చేయకపోవడం వల్ల ఉత్పత్తులు పాడైపోవడం (ఉదా. తేమ ఉన్న ప్రదేశంలో ఉంచడం)</li>
                  <li>డెలివరీ అయిన 48 గంటల తర్వాత రిపోర్ట్ చేసిన దెబ్బతిన్న ఉత్పత్తులు</li>
                  <li>అసలు బిల్లు, ప్యాకేజింగ్ లేదా బార్‌కోడ్ లేని ఉత్పత్తులు</li>
                </ul>
              </div>
            </Section>

            <Section title="3. రిటర్న్ సమయ పరిమితి (Return Window)">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">⏱️ 24 నుండి 48 గంటలు</p>
                    <p className="small text-muted mb-0">దెబ్బతిన్న, లోపభూయిష్ట, గడువు ముగిసిన లేదా తప్పుగా డెలివరీ అయిన ఉత్పత్తులను డెలివరీ సమయం నుండి <strong>24 నుండి 48 గంటలలోపు</strong> ఫోటోలు/వీడియోలతో తెలియజేయాలి.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 h-100" style={{ background: "#f8fafc" }}>
                    <p className="fw-bold text-success mb-1">📅 7 రోజులు</p>
                    <p className="small text-muted mb-0">తెరవని, చెక్కుచెదరని అసలు ప్యాకేజింగ్‌లో ఉన్న ఇతర అర్హత గల ఉత్పత్తులకు డెలివరీ తేదీ నుండి గరిష్టంగా <strong>7 రోజుల వరకు</strong> సమయం ఉంటుంది.</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="4. అన్‌బాక్సింగ్ వీడియో అవసరం (Unboxing Video Requirement)">
              <div className="alert alert-warning border-0 rounded-3 mb-0" style={{ background: "#fffbeb" }}>
                <p className="fw-bold text-dark mb-1">⚠️ ముఖ్యమైన గమనిక — అన్‌బాక్సింగ్ వీడియో:</p>
                <p className="small mb-0">రవాణాలో జరిగిన నష్టాలు, తప్పిపోయిన వస్తువులు లేదా తప్పు ఉత్పత్తుల విషయంలో త్వరిత పరిష్కారం కోసం, <strong>పార్శిల్‌ను ఓపెన్ చేసేటప్పుడు రికార్డ్ చేసిన స్పష్టమైన అన్‌బాక్సింగ్ వీడియో</strong>ను అందించాలని మేము గట్టిగా సిఫార్సు చేస్తున్నాము. ఇది మీ క్లెయిమ్‌ను వేగంగా పరిష్కరించడానికి సహాయపడుతుంది.</p>
              </div>
            </Section>

            <Section title="5. రిటర్న్ ప్రక్రియ (Return Process — 4 సులభమైన దశలు)">
              <div className="d-flex flex-column gap-3">
                {[
                  { step: "1", title: "అభ్యర్థన పంపండి", desc: "మీ ఆర్డర్ ID, సమస్య వివరాలు, ఫోటోలు మరియు అన్‌బాక్సింగ్ వీడియోతో support@vinnavar.com కి ఇమెయిల్ చేయండి లేదా +91 94441 83387 కి వాట్సాప్ చేయండి." },
                  { step: "2", title: "పరిశీలన & ఆమోదం", desc: "మా సపోర్ట్ బృందం మీ అభ్యర్థనను 24-48 గంటల్లో పరిశీలించి, రిటర్న్ ఆమోదం లేదా ప్రత్యామ్నాయ పరిష్కారాన్ని తెలియజేస్తుంది." },
                  { step: "3", title: "రివర్స్ పికప్ / రీప్లేస్‌మెంట్", desc: "ఆమోదించబడిన తర్వాత, మా కొరియర్ భాగస్వామి మీ చిరునామా నుండి వస్తువును పికప్ చేస్తారు లేదా కొత్త రీప్లేస్‌మెంట్ ఉచితంగా పంపబడుతుంది." },
                  { step: "4", title: "రీఫండ్ లేదా ప్రత్యామ్నాయం", desc: "ఉత్పత్తి మా గిడ్డంగికి చేరి తనిఖీ పూర్తయిన 5-7 పని దినాలలో రీఫండ్ లేదా రీప్లేస్‌మెంట్ ప్రాసెస్ చేయబడుతుంది." },
                ].map((s) => (
                  <div key={s.step} className="d-flex gap-3 align-items-start p-3 rounded-3 border" style={{ background: "#f8fafc" }}>
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold" style={{ width: 32, height: 32, fontSize: "0.9rem" }}>
                      {s.step}
                    </div>
                    <div>
                      <p className="fw-bold text-dark mb-1">{s.title}</p>
                      <p className="text-secondary small mb-0">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="6. రివర్స్ పికప్ & షిప్పింగ్ ఛార్జీలు">
              <p>మా లోపం వల్ల జరిగిన సందర్భాలలో (తప్పు వస్తువు, పాడైపోయిన లేదా లోపభూయిష్ట ఉత్పత్తి), <strong>రివర్స్ పికప్ పూర్తిగా ఉచితం</strong> మరియు మేము అన్ని రవాణా ఖర్చులను భరిస్తాము. ఒకవేళ మీ ప్రాంతానికి రివర్స్ పికప్ సర్వీస్ అందుబాటులో లేకపోతే, విశ్వసనీయ కొరియర్ ద్వారా పంపమని మేము మిమ్మల్ని కోరవచ్చు, దానికి సంబంధించిన రవాణా రసీదును సమర్పిస్తే ఆ మొత్తం కూడా రీఫండ్ చేయబడుతుంది.</p>
            </Section>

            <Section title="7. కస్టమర్ సపోర్ట్ & సంప్రదింపు వివరాలు">
              <p>రిటర్న్‌లకు సంబంధించి ఏవైనా సందేహాలు ఉంటే, మమ్మల్ని సంప్రదించడానికి సంకోచించకండి:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>కంపెనీ:</strong> విన్నవర్ ఆర్గానిక్స్ (ఎల్పీ ట్రేడర్స్)</p>
                <p className="mb-1"><strong>ఇమెయిల్:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a> / <a href="mailto:help@vinnavar.com" className="text-success text-decoration-none">help@vinnavar.com</a></p>
                <p className="mb-1"><strong>ఫోన్ / వాట్సాప్:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>పని వేళలు:</strong> సోమవారం – శనివారం: ఉదయం 9:30 నుండి సాయంత్రం 6:30 వరకు (IST)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm">రీఫండ్ పాలసీ చదవండి</Link>
              <Link to="/terms-conditions" className="btn btn-outline-secondary btn-sm">నిబంధనలు మరియు షరతులు</Link>
              <Link to="/privacy-policy" className="btn btn-outline-secondary btn-sm">గోప్యతా విధానం</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (currentLang === "hi") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>वापसी नीति (Return Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑर्गेनिक्स — एलपी ट्रेडर्स | अंतिम अद्यतन: अगस्त 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">विन्नवर ऑर्गेनिक्स में, हम आपको बेहतरीन गुणवत्ता वाले जैविक खाद्य उत्पाद देने के लिए प्रतिबद्ध हैं। यदि आप अपनी खरीदारी से पूरी तरह संतुष्ट नहीं हैं, तो कृपया अपने विकल्पों को समझने के लिए इस वापसी नीति को ध्यान से पढ़ें।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. हमारा वापसी दर्शन (Philosophy)">
              <p>हमारा मानना ​​है कि प्रत्येक ग्राहक को संतोषजनक अनुभव मिलना चाहिए। चूंकि हम <strong>जल्दी खराब होने वाले और उपभोग्य जैविक खाद्य पदार्थों</strong> का व्यापार करते हैं, हमारी वापसी नीति FSSAI खाद्य सुरक्षा मानकों का पालन करते हुए दोनों पक्षों के लिए निष्पक्ष बनाई गई है। वैध कारणों के तहत ही रिटर्न स्वीकार किए जाते हैं।</p>
            </Section>

            <Section title="2. रिटर्न पात्रता — कब रिटर्न स्वीकार किया जाता है?">
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ वैध रिटर्न के कारण:</p>
                <ul className="mb-0">
                  <li><strong>गलत उत्पाद डिलीवर हुआ:</strong> जो उत्पाद आपने ऑर्डर किया था उससे अलग उत्पाद मिला (उदा. गलत चावल की किस्म, गलत वजन/आकार)</li>
                  <li><strong>क्षतिग्रस्त उत्पाद:</strong> डिलीवरी के समय पैकेजिंग फटी हुई, टूटी हुई या छेड़छाड़ की गई मिली हो</li>
                  <li><strong>समाप्ति (Expired) उत्पाद:</strong> डिलीवरी के समय उत्पाद की "Best Before" तारीख बीत चुकी हो</li>
                  <li><strong>गुणवत्ता दोष:</strong> उत्पाद में फफूंद, दुर्गंध, असामान्य रंग या अन्य स्पष्ट खराबी हो</li>
                  <li><strong>मात्रा में कमी:</strong> ऑर्डर किए गए वजन या संख्या से कम मात्रा मिली हो</li>
                  <li><strong>छूटे हुए सामान:</strong> इनवॉइस में मौजूद सामान पार्सल से गायब हो</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ गैर-वापसी योग्य स्थितियां:</p>
                <ul className="mb-0">
                  <li>डिलीवरी के 7 दिनों की वापसी समय-सीमा समाप्त होने के बाद</li>
                  <li>सीलबंद पैकेट खुला हुआ और आंशिक रूप से उपयोग किया गया उत्पाद (वास्तविक गुणवत्ता शिकायत को छोड़कर)</li>
                  <li>जैविक उत्पादों के प्राकृतिक रंग, बनावट या सुगंध में प्राकृतिक भिन्नता</li>
                  <li>व्यक्तिगत स्वाद पसंद न आना</li>
                  <li>निर्देशानुसार सही तरीके से स्टोर न करने के कारण खराब हुआ सामान</li>
                </ul>
              </div>
            </Section>

            <Section title="3. वापसी समय सीमा (Return Window)">
              <p>वापसी अनुरोध डिलीवरी की तारीख से <strong>7 कैलेंडर दिनों</strong> के भीतर प्रस्तुत किया जाना चाहिए।</p>
              <p>जल्दी खराब होने वाले सामान और फफूंद/दुर्गंध जैसी गुणवत्ता शिकायतों के लिए त्वरित समाधान हेतु <strong>डिलीवरी के 48 घंटों के भीतर</strong> शिकायत दर्ज करें।</p>
            </Section>

            <Section title="4. रिटर्न कैसे शुरू करें?">
              <ol>
                <li className="mb-2"><strong>तस्वीरें लें:</strong> उत्पाद, पैकेजिंग और बैच नंबर का स्पष्ट फोटो लें।</li>
                <li className="mb-2"><strong>ईमेल करें:</strong> <em>"Return Request — Order #[ऑर्डर नंबर]"</em> विषय के साथ <strong>vinnavarbrand@gmail.com</strong> पर ईमेल भेजें।</li>
                <li className="mb-2"><strong>प्रतीक्षा करें:</strong> हमारी ग्राहक सेवा टीम <strong>2–3 कार्य दिवसों</strong> में समीक्षा करेगी।</li>
                <li className="mb-2"><strong>शिपमेंट:</strong> उत्पाद वापस भेजने की आवश्यकता होने पर हम सहायता प्रदान करेंगे।</li>
              </ol>
            </Section>

            <Section title="5. प्रतिस्थापन (Replacement) बनाम रिफंड (Refund)">
              <ul>
                <li><strong>प्रतिस्थापन (Replacement):</strong> बिना किसी अतिरिक्त शुल्क के उसी उत्पाद का नया पैक भेजा जाएगा।</li>
                <li><strong>रिफंड (Refund):</strong> दोषपूर्ण वस्तु की पूरी राशि आपके मूल भुगतान खाते में वापस भेज दी जाएगी।</li>
              </ul>
            </Section>

            <Section title="6. रिटर्न शिपिंग शुल्क">
              <p>हमारी गलती (गलत या क्षतिग्रस्त उत्पाद) के कारण होने वाले रिटर्न का पूरा कूरियर खर्च <strong>हम स्वयं वहन करते हैं</strong>।</p>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">नियम और शर्तें</Link>
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">गोपनीयता नीति</Link>
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">रिफंड नीति</Link>
              <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">स्टोर पर वापस जाएं</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentLang === "ta") {
    return (
      <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-success-subtle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52 }}>
                <i className="fa fa-undo text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>திரும்பப்பெறும் கொள்கை</h1>
                <p className="text-muted small mb-0">விண்ணவர் ஆர்கானிக்ஸ் — LP டிரேடர்ஸ் | கடைசியாக புதுப்பிக்கப்பட்டது: ஆகஸ்ட் 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">விண்ணவர் ஆர்கானிக்ஸில், சிறந்த தரமான இயற்கை உணவுப் பொருட்களை உங்களுக்கு வழங்குவதில் நாங்கள் உறுதியாக உள்ளோம். நீங்கள் வாங்கிய பொருளில் ஏதேனும் குறைபாடு இருந்தால், உங்கள் உரிமைகள் மற்றும் விருப்பங்களைப் புரிந்து கொள்ள இந்த திரும்பப்பெறும் கொள்கையை கவனமாகப் படிக்கவும்.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. எங்களின் கொள்கைக் கோட்பாடு">
              <p>ஒவ்வொரு வாடிக்கையாளரும் திருப்திகரமான அனுபவத்தைப் பெற வேண்டும் என்று நாங்கள் நம்புகிறோம். நாங்கள் <strong>அழுகக்கூடிய மற்றும் நுகரக்கூடிய இயற்கை உணவுப் பொருட்களைக்</strong> கையாள்வதால், எங்களின் திரும்பப்பெறும் கொள்கை வாடிக்கையாளருக்கும் நிறுவனத்திற்கும் நியாயமாகவும், அதே சமயம் FSSAI உணவுப் பாதுகாப்புத் தரங்களுக்கு இணங்கவும் வடிவமைக்கப்பட்டுள்ளது. கீழே குறிப்பிடப்பட்டுள்ள குறிப்பிட்ட சரியான காரணங்களின் கீழ் மட்டுமே பொருட்கள் திரும்பப் பெறப்படும்.</p>
            </Section>

            <Section title="2. திரும்பப் பெறுவதற்கான தகுதி — எப்பொழுது ஏற்றுக்கொள்ளப்படும்?">
              <p>பொருட்கள் பின்வரும் சூழ்நிலைகளில் <strong>மட்டுமே</strong> திரும்பப் பெறப்படும்:</p>
              <div className="border rounded-3 p-3 mb-3" style={{ borderLeft: "4px solid #16a34a !important", background: "#f0fdf4" }}>
                <p className="fw-bold text-dark mb-2">✅ செல்லுபடியாகும் காரணங்கள்:</p>
                <ul className="mb-0">
                  <li><strong>தவறான தயாரிப்பு வழங்கப்பட்டது:</strong> நீங்கள் ஆர்டர் செய்ததைத் தவிர வேறு தயாரிப்பு டெலிவரி செய்யப்பட்டால் (எ.கா., தவறான அரிசி வகை, தவறான எடை/அளவு)</li>
                  <li><strong>சேதமடைந்த தயாரிப்பு:</strong> பார்சல் திறக்கப்பட்டு, பேக்கிங் கிழிந்து அல்லது உடைந்து உணவுப் பொருட்கள் வெளிப்பட்ட நிலையில் டெலிவரி செய்யப்பட்டால்</li>
                  <li><strong>காலாவதியான தயாரிப்பு:</strong> டெலிவரி செய்யப்படும் நேரத்தில் தயாரிப்பின் "Best Before" தேதி ஏற்கனவே கடந்திருந்தால்</li>
                  <li><strong>தரக் குறைபாடு:</strong> பூஞ்சை, கெட்ட வாசனை, அசாதாரண நிற மாற்றம் அல்லது தெளிவான தரக்குறைபாடுகள் காணப்பட்டால்</li>
                  <li><strong>எடை/அளவு குறைவு:</strong> ஆர்டர் செய்து பணம் செலுத்தியதை விடக் குறைவான எடை அல்லது எண்ணிக்கை இருந்தால்</li>
                  <li><strong>பொருட்கள் விடுபட்டிருந்தால்:</strong> விலைப்பட்டியலில் உள்ள பொருள் பார்சலில் இல்லாமல் போனால்</li>
                </ul>
              </div>
              <div className="border rounded-3 p-3" style={{ background: "#fff7ed" }}>
                <p className="fw-bold text-dark mb-2">❌ திரும்பப் பெற முடியாத சூழ்நிலைகள்:</p>
                <ul className="mb-0">
                  <li>டெலிவரி செய்யப்பட்ட 7 நாட்களுக்குப் பிறகு கோரப்படும் கோரிக்கைகள்</li>
                  <li>பேக்கிங் பிரிக்கப்பட்டு, பகுதியளவு பயன்படுத்தப்பட்ட பொருட்கள் (உண்மையான தரப் புகாரைத் தவிர)</li>
                  <li>பாரம்பரிய இயற்கை உணவுப் பொருட்களில் இயற்கையாக நிகழும் நிறம், வாசனை அல்லது தானிய அளவின் சிறிய மாறுபாடுகள்</li>
                  <li>தனிப்பட்ட சுவை விருப்பமின்மை (சுவை என்பது நபருக்கு நபர் மாறுபடும்)</li>
                  <li>லேபிளில் உள்ள வழிமுறைகளின்படி சேமிக்கப்படாமல் கெட்டுப்போன பொருட்கள்</li>
                  <li>டெலிவரிக்குப் பிறகு வாடிக்கையாளரால் ஏற்பட்ட சேதங்கள்</li>
                  <li>வாடிக்கையாளர் தவறான முகவரியை வழங்கியதால் ஏற்படும் சிக்கல்கள்</li>
                </ul>
              </div>
            </Section>

            <Section title="3. திரும்பப் பெறுவதற்கான கால அவகாசம்">
              <p>பொருட்கள் டெலிவரி செய்யப்பட்ட நாளிலிருந்து <strong>7 நாட்களுக்குள்</strong> திரும்பப் பெறும் கோரிக்கையைச் சமர்ப்பிக்க வேண்டும். இந்த காலத்திற்குப் பிறகு வரும் கோரிக்கைகள் ஏற்றுக்கொள்ளப்பட மாட்டாது.</p>
              <p>அழுகக்கூடிய பொருட்கள் மற்றும் தரக் குறைபாடுகளுக்கு (பூஞ்சை, துர்நாற்றம்), விரைவான தீர்வுக்கு <strong>டெலிவரி செய்யப்பட்ட 48 மணி நேரத்திற்குள்</strong> புகாரைப் பதிவு செய்யவும்.</p>
            </Section>

            <Section title="4. திரும்பப் பெறுவதை எவ்வாறு தொடங்குவது?">
              <p>கோரிக்கையைத் தொடங்க, பின்வரும் எளிய வழிமுறைகளைப் பின்பற்றவும்:</p>
              <ol>
                <li className="mb-2"><strong>புகைப்படம் எடுக்கவும்:</strong> குறைபாடுள்ள தயாரிப்பு, பேக்கிங் மற்றும் பேட்ச் எண் ஆகியவை தெளிவாகத் தெரியும்படி புகைப்படம் எடுக்கவும்.</li>
                <li className="mb-2"><strong>எங்களைத் தொடர்பு கொள்ளவும்:</strong> <em>"Return Request — Order #[உங்கள் ஆர்டர் எண்]"</em> என்ற தலைப்புடன் <strong>vinnavarbrand@gmail.com</strong> முகவரிக்கு மின்னஞ்சல் அனுப்பவும்.</li>
                <li className="mb-2"><strong>விவரங்களை வழங்கவும்:</strong> உங்கள் ஆர்டர் எண், பதிவு செய்யப்பட்ட தொலைபேசி எண், புகாரின் விவரம் மற்றும் புகைப்படங்களை இணைக்கவும்.</li>
                <li className="mb-2"><strong>உறுதிப்படுத்தலுக்காகக் காத்திருக்கவும்:</strong> எங்கள் வாடிக்கையாளர் சேவைக் குழு உங்கள் கோரிக்கையை ஆய்வு செய்து <strong>2–3 வணிக நாட்களுக்குள்</strong> பதிலளிக்கும்.</li>
                <li className="mb-2"><strong>கூரியர் மூலம் அனுப்புதல்:</strong> தயாரிப்பைத் திருப்பி அனுப்ப வேண்டியிருந்தால், நாங்கள் வழிகாட்டுதலை வழங்குவோம். எங்கள் எழுத்துப்பூர்வ உறுதிப்படுத்தல் இல்லாமல் பொருட்களைத் திருப்பி அனுப்ப வேண்டாம்.</li>
              </ol>
            </Section>

            <Section title="5. FSSAI உணவுப் பாதுகாப்பு தரநிலைகள்">
              <p><strong>FSSAI உரிமம் பெற்ற உணவு வணிகர்</strong> என்ற முறையில், நாங்கள் உணவுப் பாதுகாப்பிற்கு மிக உயர்ந்த முன்னுரிமை அளிக்கிறோம்:</p>
              <ul>
                <li>திரும்பப் பெறப்பட்ட உணவுப் பொருட்கள் எந்த சூழ்நிலையிலும் மீண்டும் யாருக்கும் விற்கப்படாது</li>
                <li>தரக் குறைபாடு காரணமாகத் திரும்பப் பெறப்பட்ட பொருட்கள் FSSAI வழிகாட்டுதல்களின்படி ஆய்வு செய்யப்பட்டு அழிக்கப்படும்</li>
                <li>எதிர்காலத்தில் தரத்தை மேம்படுத்த அனைத்துப் புகார்களும் விரிவாகப் பதிவு செய்யப்பட்டு கண்காணிக்கப்படுகின்றன</li>
              </ul>
            </Section>

            <Section title="6. மாற்றுப் பொருள் (Replacement) அல்லது பணத்தைத் திரும்பப் பெறுதல் (Refund)">
              <p>சரியான கோரிக்கையை ஏற்றுக்கொண்ட பிறகு, உங்களுக்கு பின்வரும் தீர்வுகள் வழங்கப்படும்:</p>
              <ul>
                <li><strong>மாற்றுப் பொருள் (Replacement):</strong> கூடுதல் கட்டணம் எதுவுமின்றி அதே தயாரிப்பின் புதிய பேக் உங்களுக்கு அனுப்பி வைக்கப்படும்.</li>
                <li><strong>பணத்தைத் திரும்பப் பெறுதல் (Refund):</strong> குறைபாடுள்ள பொருளுக்கான முழுத் தொகையும் நீங்கள் பணம் செலுத்திய அசல் கணக்கிற்குத் திருப்பித் தரப்படும். விரிவான தகவல்களுக்கு எங்கள் <Link to="/refund-policy" className="text-success">பணத்திரும்பக் கொள்கையை</Link>ப் பார்க்கவும்.</li>
                <li><strong>ஸ்டோர் கிரெடிட்:</strong> உங்கள் விருப்பத்தின் பேரில் அடுத்த ஆர்டருக்கான தள்ளுபடி கூப்பனாகவும் பெறலாம்.</li>
              </ul>
            </Section>

            <Section title="7. திரும்ப அனுப்பும் செலவு (Shipping Charges)">
              <p>எங்கள் தரப்பு தவறு (தவறான பொருள் அல்லது சேதமடைந்த பொருள்) காரணமாகத் திரும்பப் பெறப்படும் பொருட்களுக்கான கூரியர் செலவை <strong>முழுமையாக நாங்களே ஏற்றுக்கொள்கிறோம்</strong>.</p>
            </Section>

            <Section title="8. தொடர்பு விவரங்கள்">
              <div className="border rounded-3 p-3 bg-light">
                <p className="mb-1"><strong>மின்னஞ்சல்:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-1"><strong>தலைப்பு:</strong> "Return Request — Order #[ஆர்டர் எண்]"</p>
                <p className="mb-0"><strong>பதில் அளிக்கும் நேரம்:</strong> 2–3 வணிக நாட்கள்</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">விதிமுறைகள் &amp; நிபந்தனைகள்</Link>
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">தனியுரிமைக் கொள்கை</Link>
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">பணத்திரும்ப நிதி</Link>
              <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">முகப்புக்கு செல்ல</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // English
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
