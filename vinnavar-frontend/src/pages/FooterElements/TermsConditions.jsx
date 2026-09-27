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

const TermsConditions = () => {
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ — ਐਲਪੀ ਟਰੇਡਰਜ਼ | ਆਖਰੀ ਅਪਡੇਟ: ਅਗਸਤ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ। ਸਾਡੀ ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਜਾਂ ਉਤਪਾਦ ਖਰੀਦ ਕੇ ਤੁਸੀਂ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰਨ ਲਈ ਸਹਿਮਤ ਹੁੰਦੇ ਹੋ।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ਸ਼ਰਤਾਂ ਦੀ ਸਵੀਕ੍ਰਿਤੀ (Acceptance of Terms)">
              <p>vinnavar.com ਵੈੱਬਸਾਈਟ ਤੱਕ ਪਹੁੰਚ ਕਰਕੇ, ਬ੍ਰਾਊਜ਼ ਕਰਕੇ ਜਾਂ ਈ-ਕਾਮਰਸ ਸੇਵਾਵਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ, ਤੁਸੀਂ ਭਾਰਤ ਦੇ ਸਾਰੇ ਲਾਗੂ ਕਾਨੂੰਨਾਂ ਅਤੇ ਇਹਨਾਂ ਸੇਵਾ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰਦੇ ਹੋ। ਜੇਕਰ ਤੁਸੀਂ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਨਾਲ ਅਸਹਿਮਤ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।</p>
            </Section>

            <Section title="2. ਕੰਪਨੀ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਲਾਇਸੈਂਸ">
              <p>ਇਹ ਵੈੱਬਸਾਈਟ <strong>ਐਲਪੀ ਟਰੇਡਰਜ਼ (LP Traders)</strong> ਦੀ ਮਲਕੀਅਤ ਵਾਲੇ <strong>ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ (Vinnavar Organics)</strong> ਬ੍ਰਾਂਡ ਅਧੀਨ ਚਲਾਈ ਜਾਂਦੀ ਹੈ।</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ਸੰਸਥਾ ਦਾ ਨਾਮ:</strong> ਐਲਪੀ ਟਰੇਡਰਜ਼ (LP Traders)</p>
                <p className="mb-1"><strong>ਬ੍ਰਾਂਡ:</strong> ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI ਲਾਇਸੈਂਸ ਨੰਬਰ:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>ਮੁੱਖ ਦਫ਼ਤਰ:</strong> ਚੇਨਈ, ਤਾਮਿਲਨਾਡੂ, ਭਾਰਤ</p>
              </div>
            </Section>

            <Section title="3. ਯੋਗਤਾ ਅਤੇ ਖਾਤਾ ਪ੍ਰਬੰਧਨ">
              <p>ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਕਰਨ ਲਈ ਭਾਰਤੀ ਕਾਨੂੰਨ ਅਨੁਸਾਰ ਕਾਨੂੰਨੀ ਸਮਝੌਤਾ ਕਰਨ ਲਈ ਤੁਹਾਡੀ ਘੱਟੋ-ਘੱਟ ਉਮਰ 18 ਸਾਲ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ। ਨਾਬਾਲਗ ਕੇਵਲ ਮਾਪਿਆਂ ਦੀ ਨਿਗਰਾਨੀ ਹੇਠ ਹੀ ਖਰੀਦਦਾਰੀ ਕਰ ਸਕਦੇ ਹਨ। ਤੁਹਾਡੇ ਖਾਤੇ ਦੀ ਸੁਰੱਖਿਆ ਦੀ ਪੂਰੀ ਜ਼ਿੰਮੇਵਾਰੀ ਤੁਹਾਡੀ ਹੋਵੇਗੀ।</p>
            </Section>

            <Section title="4. ਜੈਵਿਕ ਉਤਪਾਦ ਅਤੇ ਗੁਣਵੱਤਾ">
              <p>ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ ਕੁਦਰਤੀ, ਜੈਵਿਕ ਭੋਜਨ ਉਤਪਾਦ, ਕੋਲਡ-ਪ੍ਰੈੱਸਡ ਤੇਲ, ਸ਼ਹਿਦ ਅਤੇ ਰਵਾਇਤੀ ਅਨਾਜ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। ਜੈਵਿਕ ਉਤਪਾਦ ਕੁਦਰਤੀ ਢੰਗ ਨਾਲ ਤਿਆਰ ਹੋਣ ਕਾਰਨ ਵੱਖ-ਵੱਖ ਬੈਚਾਂ ਵਿੱਚ ਰੰਗ, ਸੁਗੰਧ ਜਾਂ ਬਣਤਰ ਵਿੱਚ ਮਾਮੂਲੀ ਫਰਕ ਹੋ ਸਕਦਾ ਹੈ; ਇਹ ਕੁਦਰਤੀ ਗੁਣ ਹੈ, ਕੋਈ ਖਰਾਬੀ ਨਹੀਂ।</p>
            </Section>

            <Section title="5. ਕੀਮਤਾਂ, ਟੈਕਸ ਅਤੇ ਭੁਗਤਾਨ ਸ਼ਰਤਾਂ">
              <p>ਸਾਰੀਆਂ ਕੀਮਤਾਂ ਭਾਰਤੀ ਰੁਪਏ (INR) ਵਿੱਚ ਹਨ ਅਤੇ ਲਾਗੂ GST ਟੈਕਸਾਂ ਸਮੇਤ ਦਰਸਾਈਆਂ ਗਈਆਂ ਹਨ। ਸ਼ਿਪਿੰਗ ਖਰਚੇ ਚੈੱਕਆਉਟ ਵੇਲੇ ਸਪੱਸ਼ਟ ਦਿਖਾਏ ਜਾਣਗੇ। ਅਸੀਂ Razorpay ਰਾਹੀਂ ਕ੍ਰੈਡਿਟ/ਡੈਬਿਟ ਕਾਰਡ, ਨੈੱਟ ਬੈਂਕਿੰਗ, UPI ਅਤੇ ਸੁਰੱਖਿਅਤ ਡਿਜੀਟਲ ਵਾਲਿਟ ਰਾਹੀਂ ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕਰਦੇ ਹਾਂ।</p>
            </Section>

            <Section title="6. ਆਰਡਰ ਸਵੀਕ੍ਰਿਤੀ ਅਤੇ ਰੱਦ ਕਰਨਾ">
              <p>ਉਤਪਾਦ ਦੀ ਅਣਉਪਲਬਧਤਾ, ਕੀਮਤਾਂ ਦੀ ਗਲਤੀ ਜਾਂ ਅਣਕਿਆਸੀਆਂ ਰੁਕਾਵਟਾਂ ਕਾਰਨ ਕੋਈ ਵੀ ਆਰਡਰ ਰੱਦ ਕਰਨ ਦਾ ਅਧਿਕਾਰ ਕੰਪਨੀ ਕੋਲ ਰਾਖਵਾਂ ਹੈ। ਕੰਪਨੀ ਵੱਲੋਂ ਆਰਡਰ ਰੱਦ ਹੋਣ 'ਤੇ ਪ੍ਰਾਪਤ ਕੀਤੀ ਪੂਰੀ ਰਕਮ ਤੁਰੰਤ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ।</p>
            </Section>

            <Section title="7. ਸ਼ਿਪਿੰਗ ਅਤੇ ਡਿਲਿਵਰੀ">
              <p>ਪੁਸ਼ਟੀ ਕੀਤੇ ਆਰਡਰ 1-2 ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ ਭੇਜੇ ਜਾਂਦੇ ਹਨ। ਮੈਟਰੋ ਸ਼ਹਿਰਾਂ ਵਿੱਚ 3-5 ਦਿਨ ਅਤੇ ਹੋਰ ਖੇਤਰਾਂ ਵਿੱਚ 5-8 ਦਿਨਾਂ ਵਿੱਚ ਡਿਲੀਵਰੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਪਾਰਸਲ ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਟਰੈਕਿੰਗ ਵੇਰਵੇ ਭੇਜੇ ਜਾਣਗੇ।</p>
            </Section>

            <Section title="8. ਬੌਧਿਕ ਸੰਪਤੀ ਅਧਿਕਾਰ (Intellectual Property)">
              <p>ਵੈੱਬਸਾਈਟ ਦੀ ਸਾਰੀ ਸਮੱਗਰੀ, ਲੋਗੋ, ਤਸਵੀਰਾਂ ਅਤੇ ਲਿਖਤਾਂ ਐਲਪੀ ਟਰੇਡਰਜ਼ ਦੀ ਬੌਧਿਕ ਜਾਇਦਾਦ ਹਨ। ਬਿਨਾਂ ਆਗਿਆ ਇਹਨਾਂ ਦੀ ਨਕਲ ਕਰਨਾ ਜਾਂ ਵਪਾਰਕ ਵਰਤੋਂ ਕਰਨਾ ਕਾਨੂੰਨੀ ਅਪਰਾਧ ਹੈ।</p>
            </Section>

            <Section title="9. ਦੇਣਦਾਰੀ ਦੀ ਸੀਮਾ (Limitation of Liability)">
              <p>ਕਾਨੂੰਨ ਅਨੁਸਾਰ, ਵੈੱਬਸਾਈਟ ਜਾਂ ਉਤਪਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਾਰਨ ਹੋਏ ਕਿਸੇ ਵੀ ਅਸਿੱਧੇ ਨੁਕਸਾਨ ਲਈ ਕੰਪਨੀ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹੋਵੇਗੀ। ਸਾਡੀ ਵੱਧ ਤੋਂ ਵੱਧ ਦੇਣਦਾਰੀ ਸੰਬੰਧਿਤ ਆਰਡਰ ਲਈ ਗਾਹਕ ਵੱਲੋਂ ਅਦਾ ਕੀਤੀ ਰਕਮ ਤੱਕ ਹੀ ਸੀਮਤ ਹੋਵੇਗੀ।</p>
            </Section>

            <Section title="10. ਲਾਗੂ ਕਾਨੂੰਨ ਅਤੇ ਅਧਿਕਾਰ ਖੇਤਰ">
              <p>ਇਹ ਸ਼ਰਤਾਂ ਭਾਰਤ ਦੇ ਕਾਨੂੰਨਾਂ ਅਨੁਸਾਰ ਚਲਾਈਆਂ ਜਾਣਗੀਆਂ। ਇਸ ਸਮਝੌਤੇ ਸਬੰਧੀ ਕੋਈ ਵੀ ਕਾਨੂੰਨੀ ਵਿਵਾਦ ਕੇਵਲ <strong>ਚੇਨਈ, ਤਾਮਿਲਨਾਡੂ</strong> ਅਦਾਲਤਾਂ ਦੇ ਅਧਿਕਾਰ ਖੇਤਰ ਅਧੀਨ ਸੁਲਝਾਇਆ ਜਾਵੇਗਾ।</p>
            </Section>

            <Section title="11. ਸੰਪਰਕ ਜਾਣਕਾਰੀ">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ਐਲਪੀ ਟਰੇਡਰਜ਼ (ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ)</strong></p>
                <p className="mb-1"><strong>ਈਮੇਲ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ਗਾਹਕ ਸਹਾਇਤਾ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ਪਤਾ:</strong> ਚੇਨਈ, ਤਾਮਿਲਨਾਡੂ, ਭਾਰਤ - 600001</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">ਗੋਪਨੀਯਤਾ ਨੀਤੀ</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">ਵਾਪਸੀ ਨੀਤੀ</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">ਰਿਫੰਡ ਨੀਤੀ</Link>
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>नियम आणि अटी (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑरगॅनिक्स — एलपी ट्रेडर्स | शेवटचे अपडेट: ऑगस्ट २०२५</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com वेबसाइट वापरण्यापूर्वी कृपया या नियम आणि अटी काळजीपूर्वक वाचा. आमची वेबसाइट वापरून किंवा उत्पादने खरेदी करून आपण या सर्व अटींचे पालन करण्याचे मान्य करता.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. अटींचा स्वीकार (Acceptance of Terms)">
              <p>vinnavar.com वेबसाइट पाहणे, ब्राउझ करणे किंवा ई-कॉमर्स सेवा वापरणे यावरून आपण भारतातील सर्व लागू कायदे आणि या सेवा अटींना संमती दर्शवत आहात. आपण या अटींशी असहमत असल्यास कृपया वेबसाइटचा वापर करू नका.</p>
            </Section>

            <Section title="2. कंपनी माहिती आणि परवाने">
              <p>ही वेबसाइट <strong>एलपी ट्रेडर्स (LP Traders)</strong> च्या मालकीच्या <strong>विन्नवर ऑरगॅनिक्स (Vinnavar Organics)</strong> ब्रँड अंतर्गत चालवली जाते.</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>संस्थेचे नाव:</strong> एलपी ट्रेडर्स (LP Traders)</p>
                <p className="mb-1"><strong>ब्रँड:</strong> विन्नवर ऑरगॅनिक्स (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI परवाना क्रमांक:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>मुख्यालय:</strong> चेन्नई, तामिळनाडू, भारत</p>
              </div>
            </Section>

            <Section title="3. पात्रता आणि खाते व्यवस्थापन">
              <p>वेबसाइट वापरण्यासाठी भारतीय कायद्यानुसार कायदेशीर करार करण्यासाठी आपले किमान वय १८ वर्षे असणे आवश्यक आहे. अल्पवयीन व्यक्ती केवळ पालकांच्या देखरेखीखाली खरेदी करू शकतात. आपल्या खात्याच्या गोपनीयतेची संपूर्ण जबाबदारी आपली असेल.</p>
            </Section>

            <Section title="4. सेंद्रिय उत्पादने आणि गुणवत्ता">
              <p>विन्नवर ऑरगॅनिक्स नैसर्गिक, सेंद्रिय अन्न उत्पादने, लाकडी घाण्याचे तेल, मध आणि पारंपारिक धान्ये पुरवते. सेंद्रिय उत्पादने नैसर्गिक पद्धतीने तयार होत असल्याने वेगवेगळ्या बॅचमध्ये रंग, गंध किंवा पोतात किंचित फरक असू शकतो; हा नैसर्गिक गुणधर्म आहे, कोणतीही उणीव नाही.</p>
            </Section>

            <Section title="5. किंमती, कर आणि पेमेंट अटी">
              <p>सर्व किंमती भारतीय रुपयांमध्ये (INR) असून लागू GST करासह दर्शविल्या आहेत. शिपिंग शुल्क चेकआऊटच्या वेळी स्पष्टपणे दाखवले जाईल. आम्ही Razorpay द्वारे क्रेडिट/डेबिट कार्ड, नेट बँकिंग, UPI आणि सुरक्षित डिजिटल वॉलेटद्वारे पेमेंट स्वीकारतो.</p>
            </Section>

            <Section title="6. ऑर्डर स्वीकृती आणि रद्दीकरण">
              <p>उत्पादनाची अनुपलब्धता, किंमतीतील त्रुटी किंवा अपरिहार्य कारणांमुळे कोणतीही ऑर्डर रद्द करण्याचा अधिकार कंपनी राखून ठेवते. कंपनीद्वारे ऑर्डर रद्द झाल्यास ग्राहकाकडून घेतलेली पूर्ण रक्कम तात्काळ परत केली जाईल.</p>
            </Section>

            <Section title="7. शिपिंग आणि वितरण">
              <p>निश्चित केलेल्या ऑर्डर्स १-२ कामकाजाच्या दिवसांत पाठवल्या जातात. मेट्रो शहरांमध्ये ३-५ दिवस आणि इतर भागात ५-८ दिवसांत डिलिव्हरी केली जाते. पार्सल पाठवल्यानंतर ट्रॅकिंग तपशील पाठवला जाईल.</p>
            </Section>

            <Section title="8. बौद्धिक संपदा हक्क (Intellectual Property)">
              <p>वेबसाइटवरील सर्व मजकूर, लोगो, चित्रे आणि माहिती एलपी ट्रेडर्सची बौद्धिक संपत्ती आहे. पूर्वपरवानगीशिवाय यांची प्रत तयार करणे किंवा व्यावसायिक वापर करणे कायद्याने गुन्हा आहे.</p>
            </Section>

            <Section title="9. दायित्वाची मर्यादा (Limitation of Liability)">
              <p>कायद्यानुसार, वेबसाइट किंवा उत्पादनांच्या वापरामुळे झालेल्या कोणत्याही अप्रत्यक्ष नुकसानीस कंपनी जबाबदार असणार नाही. आमचे कमाल दायित्व संबंधित ऑर्डरसाठी ग्राहकाने भरलेल्या रकमेपुरतेच मर्यादित असेल.</p>
            </Section>

            <Section title="10. लागू कायदा आणि अधिकारक्षेत्र">
              <p>हे नियम भारताच्या कायद्यांनुसार चालवले जातील. या करारासंबंधी कोणताही कायदेशीर वाद केवळ <strong>चेन्नई, तामिळनाडू</strong> न्यायालयांच्या अधिकारक्षेत्रात सोडवला जाईल.</p>
            </Section>

            <Section title="11. संपर्क माहिती">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>एलपी ट्रेडर्स (विन्नवर ऑरगॅनिक्स)</strong></p>
                <p className="mb-1"><strong>ईमेल:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ग्राहक सेवा:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>पत्ता:</strong> चेन्नई, तामिळनाडू, भारत - ६००००१</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">गोपनीयता धोरण</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">परतावा धोरण</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">रिफंड धोरण</Link>
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>শর্তাবলী ও নিয়মাবলী (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">ভিন্নভার অর্গানিকস — এলপি ট্রেডার্স | সর্বশেষ আপডেট: আগস্ট ২০২৫</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com ওয়েবসাইট ব্যবহারের পূর্বে অনুগ্রহ করে এই শর্তাবলী ও নিয়মাবলী মনোযোগ সহকারে পড়ুন। আমাদের ওয়েবসাইট ব্যবহার করে বা পণ্য ক্রয়ের মাধ্যমে আপনি এই সকল শর্ত মেনে চলতে সম্মত হচ্ছেন।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. শর্তাবলীর স্বীকৃতি (Acceptance of Terms)">
              <p>vinnavar.com ব্রাউজ করা বা এর ই-কমার্স সেবা ব্যবহার করার মাধ্যমে আপনি ভারতের প্রচলিত আইন এবং এই সেবামূলক শর্তাবলীর প্রতি পূর্ণ সম্মতি জ্ঞাপন করছেন। এই শর্তাবলীর কোনো অংশে আপনার দ্বিমত থাকলে ওয়েবসাইটটি ব্যবহার না করার অনুরোধ করা হচ্ছে।</p>
            </Section>

            <Section title="2. কোম্পানির তথ্য ও লাইসেন্স">
              <p>এই ওয়েবসাইটটি <strong>এলপি ট্রেডার্স (LP Traders)</strong>-এর মালিকানাধীন <strong>ভিন্নভার অর্গানিকস (Vinnavar Organics)</strong> ব্র্যান্ডের অধীনে পরিচালিত হয়।</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>প্রতিষ্ঠানের নাম:</strong> এলপি ট্রেডার্স (LP Traders)</p>
                <p className="mb-1"><strong>ব্র্যান্ড:</strong> ভিন্নভার অর্গানিকস (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI লাইসেন্স নম্বর:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>প্রধান কার্যালয়:</strong> চেন্নাই, তামিলনাড়ু, ভারত</p>
              </div>
            </Section>

            <Section title="3. ব্যবহারের যোগ্যতা ও অ্যাকাউন্ট">
              <p>ওয়েবসাইটে কেনাকাটা করার জন্য ভারতীয় আইন অনুযায়ী আপনাকে ন্যূনতম ১৮ বছর বয়সী হতে হবে। অপ্রাপ্তবয়স্করা অভিভাবকের তত্ত্বাবধানে ক্রয় করতে পারেন। আপনার অ্যাকাউন্টের তথ্যের গোপনীয়তা রক্ষার দায়িত্ব আপনার।</p>
            </Section>

            <Section title="4. অর্গানিক পণ্যের গুণমান ও তথ্য">
              <p>ভিন্নভার অর্গানিকস খাঁটি ও প্রাকৃতিক ভেষজ খাদ্য সামগ্রী, কোল্ড-প্রেসড তেল, মধু ও ঐতিহ্যবাহী খাদ্যশস্য সরবরাহ করে। প্রাকৃতিক পদ্ধতিতে উৎপাদিত হওয়ায় বিভিন্ন ব্যাচের পণ্যের রঙ, সুবাস বা গঠনে সামান্য ভিন্নতা থাকতে পারে; এটি প্রাকৃতিক গুণাবলীর প্রমাণ, কোনো ত্রুটি নয়।</p>
            </Section>

            <Section title="5. মূল্য, কর এবং পেমেন্ট ব্যবস্থা">
              <p>সকল মূল্য ভারতীয় রুপিতে (INR) এবং প্রযোজ্য জিএসটি কর সহ প্রদর্শিত। শিপিং চার্জ চেকআউটের সময় দেখানো হবে। Razorpay-এর মাধ্যমে সুরক্ষিত ক্রেডিট/ডেবিট কার্ড, নেট ব্যাংকিং, UPI ও ডিজিটাল ওয়ালেটে পেমেন্ট গ্রহণ করা হয়।</p>
            </Section>

            <Section title="6. অর্ডার গ্রহণ ও বাতিলকরণ">
              <p>পণ্যের অপ্রাপ্যতা, মূল্যের ত্রুটি বা অনিবার্য কারণে যেকোনো অর্ডার বাতিল করার অধিকার কোম্পানি সংরক্ষণ করে। কোম্পানি কর্তৃক অর্ডার বাতিল হলে গৃহীত অর্থ অবিলম্বে ফেরত দেওয়া হবে।</p>
            </Section>

            <Section title="7. শিপিং ও ডেলিভারি">
              <p>নিশ্চিতকৃত অর্ডার ১-২ কার্যদিবসে পাঠানো হয়। মেট্রো শহরে ৩-৫ দিন এবং অন্যান্য অঞ্চলে ৫-৮ দিনে ডেলিভারি সম্পন্ন হয়। পার্সেল পাঠানোর পর ট্র্যাকিং বিবরণী পাঠানো হবে।</p>
            </Section>

            <Section title="8. বুদ্ধিবৃত্তিক সম্পত্তি অধিকার (Intellectual Property)">
              <p>ওয়েবসাইটের যাবতীয় কনটেন্ট, লোগো, ছবি ও বিবরণী এলপি ট্রেডার্সের বুদ্ধিবৃত্তিক সম্পত্তি। অনুমতি ব্যতিরেকে এসবের অনুলিপি তৈরি করা বা বাণিজ্যিক ব্যবহার আইনত দণ্ডনীয়।</p>
            </Section>

            <Section title="9. দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)">
              <p>আইনানুযায়ী, ওয়েবসাইট বা পণ্যের ব্যবহারে কোনো পরোক্ষ ক্ষতির জন্য ভিন্নভার অর্গানিকস দায়ী থাকবে না। আমাদের সর্বোচ্চ দায় সংশ্লিষ্ট অর্ডারে গ্রাহকের পরিশোধিত অর্থের মধ্যে সীমাবদ্ধ।</p>
            </Section>

            <Section title="10. প্রযোজ্য আইন ও বিচারব্যবস্থা">
              <p>এই শর্তাবলী ভারতের আইন অনুসারে নিয়ন্ত্রিত হবে। যেকোনো আইনি বিরোধ কেবল <strong>চেন্নাই, তামিলনাড়ু</strong> আদালতের বিচারিক এখতিয়ারভুক্ত হবে।</p>
            </Section>

            <Section title="11. যোগাযোগের বিবরণী">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>এলপি ট্রেডার্স (ভিন্নভার অর্গানিকস)</strong></p>
                <p className="mb-1"><strong>ইমেল:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>হেল্পলাইন:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ঠিকানা:</strong> চেন্নাই, তামিলনাড়ু, ভারত - ৬০০০০১</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">গোপনীয়তা নীতি</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">রিটার্ন পলিসি</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">রিফান্ড পলিসি</Link>
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>നിബന്ധനകളും വ്യവസ്ഥകളും (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">വിണ്ണവർ ഓർഗാനിക്‌സ് — എൽപി ട്രേഡേഴ്‌സ് | അവസാന അപ്‌ഡേറ്റ്: ഓഗസ്റ്റ് 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com വെബ്‌സൈറ്റ് ഉപയോഗിക്കുന്നതിന് മുമ്പ് ദയവായി ഈ നിബന്ധനകളും വ്യവസ്ഥകളും ശ്രദ്ധാപൂർവ്വം വായിക്കുക. ഞങ്ങളുടെ വെബ്‌സൈറ്റ് സന്ദർശിക്കുകയോ ഉൽപ്പന്നങ്ങൾ വാങ്ങുകയോ ചെയ്യുന്നതിലൂടെ, നിങ്ങൾ ഇനിപ്പറയുന്ന നിബന്ധനകൾ പാലിക്കാൻ ബാധ്യസ്ഥരാണെന്ന് സമ്മതിക്കുന്നു.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. നിബന്ധനകളുടെ അംഗീകാരം (Acceptance of Terms)">
              <p>vinnavar.com വെബ്‌സൈറ്റ് ആക്‌സസ് ചെയ്യുകയോ ബ്രൗസ് ചെയ്യുകയോ ഇ-കൊമേഴ്‌സ് സേവനങ്ങൾ ഉപയോഗിക്കുകയോ ചെയ്യുന്നതിലൂടെ, ബാധകമായ എല്ലാ ഇന്ത്യൻ നിയമങ്ങളും ഈ സേവന വ്യവസ്ഥകളും നിങ്ങൾ അംഗീകരിക്കുന്നതായി സ്ഥിരീകരിക്കുന്നു. ഈ നിബന്ധനകളിലെ ഏതെങ്കിലും ഭാഗത്തോട് നിങ്ങൾക്ക് യോജിപ്പില്ലെങ്കിൽ, ദയവായി വെബ്‌സൈറ്റ് ഉപയോഗിക്കരുത്.</p>
            </Section>

            <Section title="2. കമ്പനി വിവരങ്ങളും ലൈസൻസിംഗും">
              <p>ഈ വെബ്‌സൈറ്റ് <strong>എൽപി ട്രേഡേഴ്‌സ് (LP Traders)</strong> ഉടമസ്ഥതയിലുള്ള <strong>വിണ്ണവർ ഓർഗാനിക്‌സ് (Vinnavar Organics)</strong> ബ്രാൻഡിന് കീഴിലാണ് പ്രവർത്തിക്കുന്നത്.</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>സ്ഥാപനത്തിന്റെ പേര്:</strong> എൽപി ട്രേഡേഴ്‌സ് (LP Traders)</p>
                <p className="mb-1"><strong>ബ്രാൻഡ് നാമം:</strong> വിണ്ണവർ ഓർഗാനിക്‌സ് (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI ലൈസൻസ് നമ്പർ:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>പ്രധാന ഓഫീസ്:</strong> ചെന്നൈ, തമിഴ്‌നാട്, ഇന്ത്യ</p>
              </div>
            </Section>

            <Section title="3. യോഗ്യതയും അക്കൗണ്ട് ഉപയോഗവും">
              <p>ഈ വെബ്‌സൈറ്റ് ഉപയോഗിക്കുന്നതിന് ഇന്ത്യൻ നിയമപ്രകാരം കരാറിൽ ഏർപ്പെടാൻ നിയമപരമായ പ്രായം (18 വയസ്സ്) നിങ്ങൾക്ക് ഉണ്ടായിരിക്കണം. പ്രായപൂർത്തിയാകാത്തവർ മാതാപിതാക്കളുടെയോ രക്ഷിതാക്കളുടെയോ മേൽനോട്ടത്തിൽ മാത്രമേ വാങ്ങലുകൾ നടത്താവൂ. നിങ്ങളുടെ അക്കൗണ്ട് ലോഗിൻ വിവരങ്ങളുടെ സുരക്ഷയ്ക്ക് നിങ്ങൾ മാത്രമാണ് ഉത്തരവാദി.</p>
            </Section>

            <Section title="4. ഓർഗാനിക് ഉൽപ്പന്ന വിവരങ്ങളും ഗുണനിലവാരവും">
              <p>വിണ്ണവർ ഓർഗാനിക്‌സ് സ്വാഭാവികവും ഗുണമേന്മയുള്ളതുമായ ഓർഗാനിക് ഭക്ഷ്യവസ്തുക്കൾ, എണ്ണകൾ, തേൻ, പരമ്പരാഗത ഉൽപ്പന്നങ്ങൾ എന്നിവ നൽകുന്നു. ഓർഗാനിക് ഉൽപ്പന്നങ്ങൾ സ്വാഭാവികമായി ഉണ്ടാക്കുന്നതായതിനാൽ ബാച്ചുകൾ തമ്മിൽ നിറം, മണം, ഘടന എന്നിവയിൽ ചെറിയ വ്യത്യാസങ്ങൾ ഉണ്ടാകാം; ഇത് സ്വാഭാവിക സവിശേഷത മാത്രമാണ്, ഗുണനിലവാരക്കുറവല്ല.</p>
            </Section>

            <Section title="5. വിലകൾ, നികുതികൾ, പേയ്‌മെന്റ് നിബന്ധനകൾ">
              <p>വെബ്‌സൈറ്റിൽ കാണിച്ചിരിക്കുന്ന എല്ലാ വിലകളും ഇന്ത്യൻ രൂപയിലാണ് (INR) ഒപ്പം ബാധകമായ GST നികുതികൾ ഉൾപ്പെടുത്തിയിട്ടുള്ളതുമാണ്. ഷിപ്പിംഗ് നിരക്കുകൾ ചെക്ക്ഔട്ട് സമയത്ത് വ്യക്തമായി കാണിക്കും. Razorpay മുഖേന ക്രെഡിറ്റ്/ഡെബിറ്റ് കാർഡുകൾ, നെറ്റ് ബാങ്കിംഗ്, UPI, മറ്റ് സുരക്ഷിത ഡിജിറ്റൽ മാർഗ്ഗങ്ങൾ വഴിയുള്ള പേയ്‌മെന്റുകൾ മാത്രമേ ഞങ്ങൾ സ്വീകരിക്കൂ.</p>
            </Section>

            <Section title="6. ഓർഡർ സ്വീകരണവും റദ്ദാക്കലും">
              <p>ഉൽപ്പന്നങ്ങളുടെ ലഭ്യതക്കുറവ്, വിലയിലെ പിശകുകൾ അല്ലെങ്കിൽ അപ്രതീക്ഷിത തടസ്സങ്ങൾ എന്നിവ കാരണം ഓർഡറുകൾ റദ്ദാക്കാനുള്ള അവകാശം കമ്പനിയിൽ നിക്ഷിപ്തമാണ്. കമ്പനി ഓർഡർ റദ്ദാക്കുകയാണെങ്കിൽ, ഈടാക്കിയ മുഴുവൻ തുകയും ഉടൻ റീഫണ്ട് ചെയ്യും.</p>
            </Section>

            <Section title="7. ഷിപ്പിംഗും വിതരണവും">
              <p>സ്ഥിരീകരിച്ച ഓർഡറുകൾ സാധാരണയായി 1-2 പ്രവൃത്തി ദിവസങ്ങൾക്കുള്ളിൽ ഡിസ്പാച്ച് ചെയ്യുന്നു. മെട്രോ നഗരങ്ങളിലേക്ക് 3-5 ദിവസങ്ങളും മറ്റ് പ്രദേശങ്ങളിലേക്ക് 5-8 ദിവസങ്ങളും ഡെലിവറിക്ക് എടുത്തേക്കാം. പാർസൽ കൊറിയർ കമ്പനിക്ക് കൈമാറിയ ശേഷം ട്രാക്കിംഗ് വിവരങ്ങൾ SMS/ഇമെയിൽ വഴി നൽകും.</p>
            </Section>

            <Section title="8. ബൗദ്ധിക സ്വത്തവകാശം (Intellectual Property)">
              <p>vinnavar.com ലെ എല്ലാ ഉള്ളടക്കങ്ങളും, ലോഗോകളും, ചിത്രങ്ങളും, വാചകങ്ങളും എൽപി ട്രേഡേഴ്സിന്റെ ബൗദ്ധിക സ്വത്താണ്. മുൻകൂർ അനുമതിയില്ലാതെ ഇവ പകർത്തുകയോ വാണിജ്യ ആവശ്യങ്ങൾക്ക് ഉപയോഗിക്കുകയോ ചെയ്യുന്നത് നിയമവിരുദ്ധമാണ്.</p>
            </Section>

            <Section title="9. ബാധ്യതാ പരിമിതി (Limitation of Liability)">
              <p>ഇന്ത്യൻ നിയമം അനുവദിക്കുന്ന പരിധിയിൽ, വെബ്‌സൈറ്റ് ഉപയോഗം മൂലമോ ഉൽപ്പന്നങ്ങൾ മൂലമോ ഉണ്ടാകുന്ന ഏതെങ്കിലും പരോക്ഷ നഷ്ടങ്ങൾക്ക് വിണ്ണവർ ഓർഗാനിക്‌സ് ബാധ്യസ്ഥരല്ല. ബന്ധപ്പെട്ട ഓർഡറിനായി നിങ്ങൾ നൽകിയ തുകയിൽ മാത്രമായിരിക്കും ഞങ്ങളുടെ പരമാവധി ബാധ്യത പരിമിതപ്പെടുത്തിയിരിക്കുന്നത്.</p>
            </Section>

            <Section title="10. ബാധകമായ നിയമവും അധികാരപരിധിയും">
              <p>ഈ നിബന്ധനകൾ ഇന്ത്യൻ നിയമങ്ങൾക്ക് വിധേയമാണ്. ഈ കരാറുമായി ബന്ധപ്പെട്ട ഏതൊരു തർക്കങ്ങളും പൂർണ്ണമായും <strong>ചെന്നൈ, തമിഴ്‌നാട്</strong> കോടതികളുടെ അധികാരപരിധിയിൽ മാത്രമായിരിക്കും തീർപ്പാക്കേണ്ടത്.</p>
            </Section>

            <Section title="11. ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ (Contact Information)">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>എൽപി ട്രേഡേഴ്‌സ് (വിണ്ണവർ ഓർഗാനിക്‌സ്)</strong></p>
                <p className="mb-1"><strong>ഇമെയിൽ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>കസ്റ്റമർ കെയർ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>വിലാസം:</strong> ചെന്നൈ, തമിഴ്‌നാട്, ഇന്ത്യ - 600001</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">സ്വകാര്യതാ നയം</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">റിട്ടേൺ പോളിസി</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">റീഫണ്ട് പോളിസി</Link>
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ — ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ | ಕೊನೆಯ ನವೀಕರಣ: ಆಗಸ್ಟ್ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಮೊದಲು ದಯವಿಟ್ಟು ಈ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ. ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಮೂಲಕ ಅಥವಾ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸುವ ಮೂಲಕ, ನೀವು ಈ ಕೆಳಗಿನ ನಿಯಮಗಳಿಗೆ ಬದ್ಧರಾಗಿರಲು ಒಪ್ಪುತ್ತೀರಿ.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ನಿಯಮಗಳ ಸ್ವೀಕಾರ (Acceptance of Terms)">
              <p>vinnavar.com ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡುವ ಮೂಲಕ, ಬ್ರೌಸ್ ಮಾಡುವ ಮೂಲಕ ಅಥವಾ ಇ-ಕಾಮರ್ಸ್ ಸೇವೆಗಳನ್ನು ಬಳಸುವ ಮೂಲಕ, ನೀವು ಅನ್ವಯವಾಗುವ ಎಲ್ಲಾ ಭಾರತೀಯ ಕಾನೂನುಗಳು ಮತ್ತು ಈ ಸೇವಾ ನಿಯಮಗಳಿಗೆ ಒಪ್ಪಿಗೆ ನೀಡಿದ್ದೀರಿ ಎಂದು ಖಚಿತಪಡಿಸುತ್ತೀರಿ. ನೀವು ಈ ನಿಯಮಗಳನ್ನು ಒಪ್ಪದಿದ್ದರೆ, ದಯವಿಟ್ಟು ವೆಬ್‌ಸೈಟ್ ಬಳಸಬೇಡಿ.</p>
            </Section>

            <Section title="2. ಕಂಪನಿ ವಿವರಗಳು ಮತ್ತು ಪರವಾನಗಿಗಳು">
              <p>ಈ ವೆಬ್‌ಸೈಟ್ <strong>ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ (LP Traders)</strong> ಮಾಲೀಕತ್ವದ <strong>ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ (Vinnavar Organics)</strong> ಬ್ರ್ಯಾಂಡ್ ಅಡಿಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ವ್ಯಾಪಾರ ಹೆಸರು:</strong> ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ (LP Traders)</p>
                <p className="mb-1"><strong>ಬ್ರ್ಯಾಂಡ್:</strong> ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI ಪರವಾನಗಿ ಸಂಖ್ಯೆ:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>ಮುಖ್ಯ ಕಚೇರಿ:</strong> ಚೆನ್ನೈ, ತಮಿಳುನಾಡು, ಭಾರತ</p>
              </div>
            </Section>

            <Section title="3. ಅರ್ಹತೆ ಮತ್ತು ಖಾತೆ ನಿರ್ವಹಣೆ">
              <p>ಈ ವೆಬ್‌ಸೈಟ್ ಬಳಸಲು ಭಾರತೀಯ ಕಾನೂನಿನ ಪ್ರಕಾರ ನೀವು ಕನಿಷ್ಠ 18 ವರ್ಷ ವಯಸ್ಸನ್ನು ಪೂರೈಸಿರಬೇಕು. ಅಪ್ರಾಪ್ತರು ಪೋಷಕರ ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿ ಮಾತ್ರ ಖರೀದಿಸಬಹುದು. ನಿಮ್ಮ ಖಾತೆಯ ಲಾಗಿನ್ ವಿವರಗಳ ಗೌಪ್ಯತೆಗೆ ನೀವೇ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತೀರಿ.</p>
            </Section>

            <Section title="4. ಸಾವಯವ ಉತ್ಪನ್ನಗಳ ಮಾಹಿತಿ ಮತ್ತು ಗುಣಮಟ್ಟ">
              <p>ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ ನೈಸರ್ಗಿಕ, ಸಾವಯವ ಆಹಾರ ಪದಾರ್ಥಗಳು, ಎಣ್ಣೆಗಳು, ಜೇನುತುಪ್ಪ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಧಾನ್ಯಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಸಾವಯವ ಉತ್ಪನ್ನಗಳು ನೈಸರ್ಗಿಕವಾಗಿ ತಯಾರಾಗುವುದರಿಂದ ಬಣ್ಣ, ಪರಿಮಳ ಮತ್ತು ವಿನ್ಯಾಸದಲ್ಲಿ ಸಣ್ಣ ವ್ಯತ್ಯಾಸಗಳಿರಬಹುದು; ಇದು ನೈಸರ್ಗಿಕ ಗುಣವೇ ಹೊರತು ಗುಣಮಟ್ಟದ ಕೊರತೆಯಲ್ಲ.</p>
            </Section>

            <Section title="5. ಬೆಲೆಗಳು, ತೆರಿಗೆಗಳು ಮತ್ತು ಪಾವತಿ ವಿಧಾನಗಳು">
              <p>ಎಲ್ಲಾ ಬೆಲೆಗಳು ಭಾರತೀಯ ರೂಪಾಯಿಗಳಲ್ಲಿವೆ (INR) ಮತ್ತು ಅನ್ವಯವಾಗುವ GST ತೆರಿಗೆಗಳನ್ನು ಒಳಗೊಂಡಿವೆ. ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕವನ್ನು ಚೆಕ್‌ಔಟ್ ಸಮಯದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ತೋರಿಸಲಾಗುತ್ತದೆ. ನಾವು Razorpay ಮೂಲಕ ಕ್ರೆಡಿಟ್/ಡೆಬಿಟ್ ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್, UPI ಮತ್ತು ಡಿಜಿಟಲ್ ವಾಲೆಟ್‌ಗಳ ಮೂಲಕ ಸುರಕ್ಷಿತ ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೇವೆ.</p>
            </Section>

            <Section title="6. ಆರ್ಡರ್ ಸ್ವೀಕಾರ ಮತ್ತು ರದ್ದತಿ ಹಕ್ಕು">
              <p>ನೀವು ಸಲ್ಲಿಸಿದ ಆರ್ಡರ್ ಉತ್ಪನ್ನ ಲಭ್ಯತೆ, ಬೆಲೆ ದೋಷಗಳು ಅಥವಾ ಸಾಗಣೆ ಅಸಾಧ್ಯವಾದ ಸಂದರ್ಭಗಳಲ್ಲಿ ರದ್ದುಗೊಳಿಸುವ ಹಕ್ಕನ್ನು ಕಂಪನಿ ಕಾಯ್ದಿರಿಸಿಕೊಂಡಿದೆ. ಕಂಪನಿಯಿಂದ ಆರ್ಡರ್ ರದ್ದಾದರೆ, ಪಾವತಿಸಿದ ಪೂರ್ಣ ಮೊತ್ತವನ್ನು ಮರುಪಾವತಿಸಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="7. ಶಿಪ್ಪಿಂಗ್, ವಿತರಣೆ ಮತ್ತು ಹೊಣೆಗಾರಿಕೆ">
              <p>ದೃಢೀಕರಿಸಿದ ಆರ್ಡರ್‌ಗಳು 1-2 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ರವಾನೆಯಾಗುತ್ತವೆ. ಮೆಟ್ರೋ ನಗರಗಳಿಗೆ 3-5 ದಿನಗಳು ಮತ್ತು ಇತರ ಪ್ರದೇಶಗಳಿಗೆ 5-8 ದಿನಗಳಲ್ಲಿ ಡೆಲಿವರಿ ಮಾಡಲಾಗುತ್ತದೆ. ಪಾರ್ಸೆಲ್ ಕೊರಿಯರ್‌ಗೆ ಹಸ್ತಾಂತರಿಸಿದ ನಂತರ ಟ್ರ್ಯಾಕಿಂಗ್ ವಿವರಗಳನ್ನು SMS/ಇಮೇಲ್ ಮೂಲಕ ನೀಡಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="8. ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಹಕ್ಕುಗಳು (Intellectual Property)">
              <p>vinnavar.com ನಲ್ಲಿರುವ ಎಲ್ಲಾ ವಿಷಯ, ಲೋಗೋಗಳು, ಚಿತ್ರಗಳು ಮತ್ತು ಪಠ್ಯಗಳು ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್‌ನ ಬೌದ್ಧಿಕ ಆಸ್ತಿಯಾಗಿದೆ. ಅನುಮತಿಯಿಲ್ಲದೆ ಇವುಗಳನ್ನು ಮರುಬಳಕೆ ಮಾಡುವುದು ಅಥವಾ ನಕಲಿಸುವುದು ಕಾನೂನುಬಾಹಿರವಾಗಿದೆ.</p>
            </Section>

            <Section title="9. ಹೊಣೆಗಾರಿಕೆಯ ಮಿತಿ (Limitation of Liability)">
              <p>ಭಾರತೀಯ ಕಾನೂನಿನ ಅನ್ವಯ, ವೆಬ್‌ಸೈಟ್ ಬಳಕೆ ಅಥವಾ ಉತ್ಪನ್ನಗಳಿಂದ ಉಂಟಾಗುವ ಯಾವುದೇ ಪರೋಕ್ಷ ಹಾನಿಗಳಿಗೆ ಕಂಪನಿ ಹೊಣೆಗಾರನಾಗಿರುವುದಿಲ್ಲ. ನಮ್ಮ ಗರಿಷ್ಠ ಹೊಣೆಗಾರಿಕೆಯು ಸಂಬಂಧಿತ ಆರ್ಡರ್‌ಗೆ ನೀವು ಪಾವತಿಸಿದ ಮೊತ್ತಕ್ಕೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿರುತ್ತದೆ.</p>
            </Section>

            <Section title="10. ಅನ್ವಯವಾಗುವ ಕಾನೂನು ಮತ್ತು ನ್ಯಾಯವ್ಯಾಪ್ತಿ">
              <p>ಈ ನಿಯಮಗಳು ಭಾರತದ ಕಾನೂನುಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ. ಈ ಒಪ್ಪಂದಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ವಿವಾದಗಳು ಕೇವಲ <strong>ಚೆನ್ನೈ, ತಮಿಳುನಾಡು</strong> ನ್ಯಾಯಾಲಯಗಳ ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ.</p>
            </Section>

            <Section title="11. ಸಂಪರ್ಕ ಮಾಹಿತಿ">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ (ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್)</strong></p>
                <p className="mb-1"><strong>ಇಮೇಲ್:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ಗ್ರಾಹಕ ಬೆಂಬಲ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ವಿಳಾಸ:</strong> ಚೆನ್ನೈ, ತಮಿಳುನಾಡು, ಭಾರತ - 600001</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">ಗೌಪ್ಯತಾ ನೀತಿ</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">ರಿಟರ್ನ್ ನೀತಿ</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">ಮರುಪಾವತಿ ನೀತಿ</Link>
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
                <i className="fa fa-file-text-o text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>నిబంధనలు మరియు షరతులు (Terms & Conditions)</h1>
                <p className="text-muted small mb-0">విన్నవర్ ఆర్గానిక్స్ — ఎల్పీ ట్రేడర్స్ | చివరి నవీకరణ: ఆగస్టు 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">vinnavar.com వెబ్‌సైట్‌ను ఉపయోగించే ముందు దయచేసి ఈ నిబంధనలు మరియు షరతులను జాగ్రత్తగా చదవండి. మా వెబ్‌సైట్‌ను సందర్శించడం లేదా మా వద్ద నుండి ఉత్పత్తులను ఆర్డర్ చేయడం ద్వారా, మీరు ఈ క్రింది నిబంధనలకు కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. నిబంధనల ఆమోదం (Acceptance of Terms)">
              <p>vinnavar.com వెబ్‌సైట్‌ను ప్రాప్యత చేయడం, బ్రౌజ్ చేయడం లేదా ఇ-కామర్స్ సేవలను ఉపయోగించడం ద్వారా, మీరు వర్తించే అన్ని భారతీయ చట్టాలు, నిబంధనలు మరియు ఈ సేవా నిబంధనలకు కట్టుబడి ఉంటారని నిర్ధారిస్తున్నారు. మీరు ఈ నిబంధనలలోని ఏ భాగానికైనా అంగీకరించకపోతే, దయచేసి వెబ్‌సైట్ సేవలను ఉపయోగించవద్దు.</p>
            </Section>

            <Section title="2. కంపెనీ వివరాలు మరియు లైసెన్సింగ్">
              <p>ఈ వెబ్‌సైట్ <strong>ఎల్పీ ట్రేడర్స్ (LP Traders)</strong> యొక్క యాజమాన్యంలో మరియు నిర్వహణలో ఉన్న <strong>విన్నవర్ ఆర్గానిక్స్ (Vinnavar Organics)</strong> బ్రాండ్ క్రింద పనిచేస్తుంది.</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>వ్యాపార నామం:</strong> ఎల్పీ ట్రేడర్స్ (LP Traders)</p>
                <p className="mb-1"><strong>బ్రాండ్:</strong> విన్నవర్ ఆర్గానిక్స్ (Vinnavar Organics)</p>
                <p className="mb-1"><strong>FSSAI లైసెన్స్ నంబర్:</strong> 12424008001712</p>
                <p className="mb-1"><strong>GSTIN:</strong> 33COWPS4246L1ZF</p>
                <p className="mb-0"><strong>ప్రధాన కార్యాలయం:</strong> చెన్నై, తమిళనాడు, భారతదేశం</p>
              </div>
            </Section>

            <Section title="3. అర్హత మరియు ఖాతా నమోదు">
              <p>ఈ వెబ్‌సైట్‌ను ఉపయోగించడానికి మీరు భారతీయ చట్టాల ప్రకారం చట్టబద్ధమైన ఒప్పందం కుదుర్చుకోగల కనీస వయస్సు (18 సంవత్సరాలు) కలిగి ఉండాలి. మైనర్లు వారి తల్లిదండ్రులు లేదా చట్టపరమైన సంరక్షకుల పర్యవేక్షణలో మాత్రమే కొనుగోళ్లు జరపవచ్చు. మీ ఖాతా పాస్‌వర్డ్ మరియు లాగిన్ వివరాల భద్రతకు మీరే పూర్తి బాధ్యులు.</p>
            </Section>

            <Section title="4. ఉత్పత్తుల సమాచారం మరియు నాణ్యత">
              <p>విన్నవర్ ఆర్గానిక్స్ సహజమైన, ప్రామాణికమైన సేంద్రీయ ఆహార పదార్థాలు, నూనెలు, తేనె మరియు దేశీయ సంప్రదాయ ఉత్పత్తులను అందిస్తుంది. మేము అన్ని ఉత్పత్తుల వివరణలు, పదార్థాలు మరియు ధరలను ఖచ్చితంగా ప్రదర్శించడానికి శ్రద్ధ వహిస్తాము. అయినప్పటికీ, సేంద్రీయ ఉత్పత్తులు సహజంగా తయారవుతాయి కాబట్టి బ్యాచ్‌ల మధ్య రంగు, వాసన మరియు ఆకృతిలో స్వల్ప తేడాలు ఉండవచ్చు, ఇది సహజ లక్షణమే తప్ప నాణ్యతా లోపం కాదు.</p>
            </Section>

            <Section title="5. ధరలు, పన్నులు మరియు చెల్లింపు నిబంధనలు">
              <p>వెబ్‌సైట్‌లో ప్రదర్శించబడే అన్ని ధరలు భారతీయ రూపాయలలో (INR) ఉంటాయి మరియు వర్తించే GST పన్నులతో కలిపి ఉంటాయి. షిప్పింగ్ ఛార్జీలు చెక్‌అవుట్ సమయంలో ఆర్డర్ బరువు మరియు గమ్యస్థాన పిన్‌కోడ్ ఆధారంగా స్పష్టంగా చూపబడతాయి. మేము Razorpay ద్వారా క్రెడిట్/డెబిట్ కార్డులు, నెట్ బ్యాంకింగ్, UPI మరియు అధీకృత డిజిటల్ వాలెట్లతో సురక్షితమైన చెల్లింపులను మాత్రమే స్వీకరిస్తాము.</p>
            </Section>

            <Section title="6. ఆర్డర్ ఆమోదం మరియు రద్దు హక్కు">
              <p>మీరు ఆర్డర్ సమర్పించిన తర్వాత అది కొనుగోలు చేయడానికి మీ ప్రతిపాదనగా పరిగణించబడుతుంది. ఉత్పత్తి లభ్యత లేకపోవడం, ధరల లోపాలు, మోసపూరిత లావాదేవీల అనుమానం లేదా డెలివరీ చేయలేని స్థానిక పరిస్థితుల కారణంగా ఆర్డర్‌ను తిరస్కరించే లేదా రద్దు చేసే హక్కు కంపెనీకి ఉంటుంది. కంపెనీ ద్వారా ఆర్డర్ రద్దు చేయబడితే, వసూలు చేసిన పూర్తి మొత్తం వెంటనే రీఫండ్ చేయబడుతుంది.</p>
            </Section>

            <Section title="7. షిప్పింగ్, డెలివరీ మరియు రిస్క్">
              <p>ధృవీకరించబడిన ఆర్డర్‌లు సాధారణంగా 1-2 పని దినాలలో ప్రాసెస్ చేయబడి, ప్రముఖ కొరియర్ భాగస్వాముల ద్వారా రవాణా చేయబడతాయి. మెట్రో నగరాలకు 3-5 రోజులు, ఇతర ప్రాంతాలకు 5-8 రోజులలో డెలివరీ జరుగుతుంది. కొరియర్ భాగస్వామికి పార్శిల్ అప్పగించబడిన తర్వాత ట్రాకింగ్ నంబర్ ఇమెయిల్/SMS ద్వారా పంపబడుతుంది.</p>
            </Section>

            <Section title="8. మేధో సంపత్తి హక్కులు (Intellectual Property)">
              <p>vinnavar.com లోని అన్ని కంటెంట్, లోగోలు, గ్రాఫిక్స్, ఉత్పత్తి చిత్రాలు, వచనం మరియు బ్రాండ్ పేర్లు ఎల్పీ ట్రేడర్స్ యొక్క మేధో సంపత్తి. మా అనుమతి లేకుండా వీటిని కాపీ చేయడం, పునరుత్పత్తి చేయడం లేదా వ్యాపార ప్రయోజనాల కోసం ఉపయోగించడం కాపీరైట్ చట్టాల ప్రకారం నిషేధించబడింది.</p>
            </Section>

            <Section title="9. నిషేధిత కార్యకలాపాలు (Prohibited Activities)">
              <p>వినియోగదారులు వెబ్‌సైట్‌ను చట్టవిరుద్ధమైన ప్రయోజనాలకు ఉపయోగించకూడదు, వైరస్‌లు లేదా హానికరమైన కోడ్‌లను ప్రవేశపెట్టకూడదు, ఆర్డరింగ్ వ్యవస్థను దుర్వినియోగం చేయకూడదు లేదా ఇతర వినియోగదారుల డేటాను సేకరించడానికి ప్రయత్నించకూడదు.</p>
            </Section>

            <Section title="10. బాధ్యత పరిమితి (Limitation of Liability)">
              <p>భారతీయ చట్టం అనుమతించిన మేరకు, వెబ్‌సైట్ వినియోగం లేదా ఉత్పత్తుల వినియోగం వల్ల కలిగే పరోక్ష, యాదృచ్ఛిక లేదా పర్యవసాన నష్టాలకు విన్నవర్ ఆర్గానిక్స్ బాధ్యత వహించదు. ఏ సందర్భంలోనైనా మా గరిష్ట బాధ్యత మీరు సంబంధిత ఆర్డర్ కోసం చెల్లించిన మొత్తంకే పరిమితం చేయబడుతుంది.</p>
            </Section>

            <Section title="11. వర్తించే చట్టం మరియు న్యాయపరిధి (Governing Law)">
              <p>ఈ నిబంధనలు భారత గణతంత్ర రాజ్య చట్టాలకు అనుగుణంగా నిర్వహించబడతాయి. ఈ ఒప్పందం లేదా సేవల వినియోగం నుండి తలెత్తే ఏవైనా వివాదాలు పూర్తిగా <strong>చెన్నై, తమిళనాడు</strong> లోని న్యాయస్థానాల పరిధికి లోబడి ఉంటాయి.</p>
            </Section>

            <Section title="12. సంప్రదింపు వివరాలు (Contact Information)">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ఎల్పీ ట్రేడర్స్ (విన్నవర్ ఆర్గానిక్స్)</strong></p>
                <p className="mb-1"><strong>ఇమెయిల్:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>కస్టమర్ కేర్:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>చిరునామా:</strong> చెన్నై, తమిళనాడు, భారతదేశం - 600001</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm">గోప్యతా విధానం</Link>
              <Link to="/return-policy" className="btn btn-outline-secondary btn-sm">రిటర్న్ పాలసీ</Link>
              <Link to="/refund-policy" className="btn btn-outline-secondary btn-sm">రీఫండ్ పాలసీ</Link>
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
                <i className="fa fa-file-contract text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>नियम और शर्तें (Terms &amp; Conditions)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑर्गेनिक्स — एलपी ट्रेडर्स | अंतिम अद्यतन: अगस्त 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">कृपया <strong>www.vinnavar.com</strong> का उपयोग करने या कोई भी ऑर्डर देने से पहले इन नियमों और शर्तों को ध्यान से पढ़ें। हमारी वेबसाइट पर जाकर या हमसे खरीदारी करके, आप इन नियमों से बंधे होने के लिए अपनी सहमति देते हैं।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. कंपनी की जानकारी">
              <p>यह वेबसाइट <strong>एलपी ट्रेडर्स (LP Traders)</strong> के स्वामित्व और संचालन में है, जो भारत में पंजीकृत एक एकल स्वामित्व फर्म है और <strong>विन्नवर ऑर्गेनिक्स (Vinnavar Organics)</strong> के व्यापारिक नाम से संचालित होती है।</p>
              <ul>
                <li><strong>मालिक (Proprietor):</strong> श्री लोकेश राजन शाह</li>
                <li><strong>पंजीकृत पता:</strong> #16, एमएस नगर फेज 2, कुरुमंथंगल रोड, कुन्नात्तूर, अरणी, तमिलनाडु – 632314, भारत</li>
                <li><strong>GSTIN:</strong> 33AFOPL7097M1ZN</li>
                <li><strong>FSSAI लाइसेंस नंबर:</strong> 22425479000675</li>
                <li><strong>ईमेल:</strong> vinnavarbrand@gmail.com</li>
              </ul>
              <p>हम भारत भर में खाद्य उत्पादों के निर्माण, बिक्री और वितरण के लिए <strong>खाद्य सुरक्षा और मानक अधिनियम, 2006 (FSSAI)</strong> के तहत विधिवत लाइसेंस प्राप्त हैं।</p>
            </Section>

            <Section title="2. शर्तों की स्वीकृति">
              <p>हमारी वेबसाइट पर आकर, खाता बनाकर, उत्पादों को ब्राउज़ करके या ऑर्डर देकर, आप स्वीकार करते हैं कि आपने इन नियमों और शर्तों के साथ-साथ हमारी गोपनीयता नीति, रिफंड नीति और वापसी नीति को पढ़, समझ और स्वीकार कर लिया है। हमें किसी भी समय इन शर्तों को अपडेट करने का अधिकार सुरक्षित है। अपडेट के बाद वेबसाइट का निरंतर उपयोग आपके द्वारा नए नियमों की स्वीकृति माना जाएगा।</p>
            </Section>

            <Section title="3. पात्रता">
              <p>हमारी सेवाओं का उपयोग करने के लिए आपकी आयु कम से कम <strong>18 वर्ष</strong> होनी चाहिए, आपके पास वैध डिलीवरी पते के साथ भारत का निवासी होना चाहिए, सटीक व्यक्तिगत जानकारी प्रदान करनी चाहिए, और भारतीय अनुबंध अधिनियम, 1872 के तहत कानूनी रूप से बाध्यकारी अनुबंध में प्रवेश करने की कानूनी क्षमता होनी चाहिए।</p>
            </Section>

            <Section title="4. उत्पाद — जैविक खाद्य मानक">
              <p>विन्नवर ऑर्गेनिक्स पर बेचे जाने वाले सभी खाद्य उत्पाद तमिलनाडु और पड़ोसी राज्यों के प्रमाणित जैविक किसानों से प्राप्त किए जाते हैं। हम पारंपरिक देशी चावल की किस्मों, कच्ची घानी (कोल्ड-प्रेस्ड) तेलों और शुद्ध प्राकृतिक किराना उत्पादों पर ध्यान केंद्रित करते हैं:</p>
              <ul>
                <li><strong>FSSAI खाद्य सुरक्षा और मानक विनियम (2011)</strong> के अनुपालन में प्रसंस्कृत और पैक किए गए</li>
                <li>सिंथेटिक कीटनाशकों, कृत्रिम रंगों, रासायनिक परिरक्षकों से 100% मुक्त</li>
                <li>शुद्ध वजन, सामग्री, पोषण मूल्य, बैच नंबर, निर्माण तिथि, सर्वश्रेष्ठ उपयोग तिथि और FSSAI लाइसेंस नंबर के साथ पूरी तरह से लेबल किए गए</li>
                <li>डिस्पैच से पहले कड़े आंतरिक गुणवत्ता परीक्षण से गुजरे हुए</li>
              </ul>
              <p><strong>प्राकृतिक बनावट पर नोट:</strong> पारंपरिक जैविक उत्पादों के रंग, बनावट या दाने के आकार में मामूली प्राकृतिक बदलाव कोई दोष नहीं हैं, बल्कि प्रामाणिक और बिना पॉलिश किए भोजन की पहचान हैं।</p>
            </Section>

            <Section title="5. मूल्य निर्धारण और भुगतान">
              <p>सभी कीमतें भारतीय रुपये (INR) में हैं और जब तक अन्यथा न कहा जाए, इनमें <strong>GST कर और शिपिंग शुल्क शामिल हैं</strong>। ऑर्डर प्लेसमेंट के समय दिखाई गई कीमत ही अंतिम होगी।</p>
              <p>हम स्वीकार करते हैं: UPI (GPay, PhonePe, Paytm, BHIM), क्रेडिट/डेबिट कार्ड (Visa, Mastercard, RuPay), और नेट बैंकिंग — सभी <strong>Razorpay (PCI-DSS लेवल 1 प्रमाणित)</strong> के माध्यम से 100% सुरक्षित रूप से संसाधित होते हैं। हम आपका कोई भी कार्ड या भुगतान विवरण सुरक्षित नहीं करते।</p>
            </Section>

            <Section title="6. ऑर्डर और पुष्टिकरण">
              <p>ऑर्डर देना एक खरीद प्रस्ताव है। अनुबंध केवल पार्सल डिस्पैच होने पर ही बनता है। अनुपलब्धता, मूल्य त्रुटि या पते की समस्या के कारण ऑर्डर रद्द करने का अधिकार हमारे पास है। रद्द किए गए ऑर्डर की पूरी राशि 5–7 कार्य दिवसों के भीतर पूरी तरह वापस कर दी जाती है।</p>
            </Section>

            <Section title="7. शिपिंग और डिलीवरी">
              <p>हम पूरे भारत में डिलीवरी करते हैं। अनुमानित डिलीवरी समय डिस्पैच की तारीख से <strong>4–8 कार्य दिवस</strong> है। ऑर्डर की पुष्टि के 1–3 दिनों के भीतर डिस्पैच किया जाता है और ट्रैकिंग नंबर SMS/ईमेल द्वारा साझा किया जाता है।</p>
            </Section>

            <Section title="8. खाद्य सुरक्षा और भंडारण">
              <ul>
                <li>उत्पादों को ठंडी, सूखी और वायुरोधी जगह पर रखें</li>
                <li>उपयोग करने से पहले "Best Before" तिथि की जांच करें</li>
                <li>पारंपरिक जैविक खाद्य पदार्थों में कोई रासायनिक संरक्षक नहीं होता, इसलिए इन्हें सावधानी से रखें</li>
              </ul>
            </Section>

            <Section title="9. बौद्धिक संपदा (Intellectual Property)">
              <p>वेबसाइट की सभी सामग्री — टेक्स्ट, चित्र, लोगो और सॉफ्टवेयर — LP Traders / Vinnavar Organics की विशेष संपत्ति हैं और कॉपीराइट अधिनियम, 1957 और ट्रेड मार्क्स अधिनियम, 1999 के तहत संरक्षित हैं।</p>
            </Section>

            <Section title="10. शिकायत निवारण अधिकारी (Grievance Officer)">
              <div className="border rounded-3 p-3 bg-light mt-2">
                <p className="mb-1"><strong>नाम:</strong> श्री लोकेश राजन शाह</p>
                <p className="mb-1"><strong>पद:</strong> शिकायत अधिकारी / मालिक, एलपी ट्रेडर्स</p>
                <p className="mb-1"><strong>ईमेल:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-0"><strong>प्रतिक्रिया समय:</strong> शिकायत प्राप्त होने के 30 दिनों के भीतर</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">गोपनीयता नीति</Link>
              <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">वापसी नीति</Link>
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
                <i className="fa fa-file-contract text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>விதிமுறைகள் &amp; நிபந்தனைகள்</h1>
                <p className="text-muted small mb-0">விண்ணவர் ஆர்கானிக்ஸ் — LP டிரேடர்ஸ் | கடைசியாக புதுப்பிக்கப்பட்டது: ஆகஸ்ட் 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small"><strong>www.vinnavar.com</strong> இணையதளத்தைப் பயன்படுத்துவதற்கு முன்பாகவோ அல்லது ஏதேனும் ஆர்டர் செய்வதற்கு முன்பாகவோ இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை கவனமாகப் படிக்கவும். எங்கள் தளத்தைப் பார்வையிடுவதன் மூலமோ அல்லது பொருட்கள் வாங்குவதன் மூலமோ, நீங்கள் இந்த விதிமுறைகளுக்குக் கட்டுப்பட ஒப்புக்கொள்கிறீர்கள்.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. நிறுவனத் தகவல்">
              <p>இந்த இணையதளம் <strong>விண்ணவர் ஆர்கானிக்ஸ் (Vinnavar Organics)</strong> என்ற வணிகப் பெயரில் இயங்கும் இந்தியாவில் பதிவுசெய்யப்பட்ட தனியுரிம நிறுவனமான <strong>LP Traders</strong>-க்கு சொந்தமானது மற்றும் அவர்களால் நிர்வகிக்கப்படுகிறது.</p>
              <ul>
                <li><strong>உரிமையாளர்:</strong> திரு. லோகேஷ் ராஜன் ஷா</li>
                <li><strong>பதிவு செய்யப்பட்ட முகவரி:</strong> #16, MS நகர் ஃபேஸ் 2, குருமந்தாங்கல் ரோடு, குன்னத்தூர், ஆரணி, தமிழ்நாடு – 632314, இந்தியா</li>
                <li><strong>GSTIN:</strong> 33AFOPL7097M1ZN</li>
                <li><strong>FSSAI உரிம எண்:</strong> 22425479000675</li>
                <li><strong>மின்னஞ்சல்:</strong> vinnavarbrand@gmail.com</li>
              </ul>
              <p>இந்தியா முழுவதும் இயற்கை உணவுப் பொருட்களைத் தயாரித்து, விற்பனை செய்து விநியோகிக்க <strong>உணவுப் பாதுகாப்பு மற்றும் தர நிர்ணயச் சட்டம், 2006 (FSSAI)</strong> கீழ் உரிய உரிமம் பெற்றுள்ளோம்.</p>
            </Section>

            <Section title="2. விதிமுறைகளை ஏற்றுக்கொள்வது">
              <p>எங்கள் வலைத்தளத்தைப் பார்வையிடுதல், பயனர் கணக்கு உருவாக்குதல், தயாரிப்புகளை உலவுதல் அல்லது ஆர்டர் செய்தல் மூலம், இந்த விதிமுறைகள் &amp; நிபந்தனைகள் மற்றும் எங்கள் தனியுரிமைக் கொள்கை, பணத்தைத் திரும்பப்பெறும் கொள்கை, மற்றும் திரும்பப்பெறும் கொள்கை ஆகியவற்றை நீங்கள் படித்துப் புரிந்து கொண்டு முழுமையாக ஏற்றுக்கொள்கிறீர்கள். இந்த விதிமுறைகளை எந்த நேரத்திலும் புதுப்பிக்கும் உரிமை எங்களுக்கு உண்டு. புதுப்பித்தலுக்குப் பிறகும் இணையதளத்தைத் தொடர்ந்து பயன்படுத்துவது, நீங்கள் புதிய விதிமுறைகளை ஏற்றுக் கொண்டதாகக் கருதப்படும்.</p>
            </Section>

            <Section title="3. தகுதி">
              <p>எங்கள் சேவைகளைப் பயன்படுத்த நீங்கள் குறைந்தது <strong>18 வயது</strong> பூர்த்தியடைந்தவராக இருக்க வேண்டும், செல்லுபடியாகும் டெலிவரி முகவரியுடன் இந்தியாவில் வசிப்பவராக இருக்க வேண்டும், துல்லியமான தனிப்பட்ட தகவல்களை வழங்க வேண்டும், மேலும் இந்திய ஒப்பந்தச் சட்டம், 1872-இன் கீழ் பிணைப்பு ஒப்பந்தத்தில் ஈடுபடும் சட்டப்பூர்வ தகுதியைப் பெற்றிருக்க வேண்டும். எந்தவொரு பயனருக்கும் எந்த நேரத்திலும் சேவையை மறுக்கும் உரிமை எங்களுக்கு உண்டு.</p>
            </Section>

            <Section title="4. தயாரிப்புகள் — இயற்கை உணவு தரநிலைகள்">
              <p>விண்ணவர் ஆர்கானிக்ஸில் விற்கப்படும் அனைத்து உணவுப் பொருட்களும் தமிழ்நாட்டிலும் அண்டை மாநிலங்களிலும் உள்ள சான்றளிக்கப்பட்ட இயற்கை விவசாயிகளிடமிருந்து நேரடியாகப் பெறப்படுகின்றன. குறிப்பாக பாரம்பரிய அரிசி வகைகள், மரச்செக்கு எண்ணெய்கள் மற்றும் சுத்தமான இயற்கை மளிகைப் பொருட்களுக்கு நாங்கள் முன்னுரிமை அளிக்கிறோம். எங்கள் தயாரிப்புகள்:</p>
              <ul>
                <li><strong>உணவுப் பாதுகாப்பு மற்றும் தர நிர்ணய விதிமுறைகள் (2011)</strong>-க்கு ஏற்ப பதப்படுத்தப்பட்டு பேக் செய்யப்படுகின்றன</li>
                <li>செயற்கை பூச்சிக்கொல்லிகள், செயற்கை நிறமிகள், இரசாயனங்கள் மற்றும் பாதுகாப்புகள் எதுவும் சேர்க்கப்படாதவை</li>
                <li>நிகர எடை, மூலப்பொருட்கள், ஊட்டச்சத்து விவரங்கள், பேட்ச் எண், உற்பத்தி தேதி, காலாவதி தேதி மற்றும் FSSAI உரிம எண் ஆகியவற்றுடன் <strong>FSSAI லேபிளிங் விதிமுறைகள் (2020)</strong> படி லேபிளிடப்பட்டவை</li>
                <li>அனுப்புவதற்கு முன் கடுமையான உள் தரக் கட்டுப்பாட்டுப் பரிசோதனைக்கு உட்படுத்தப்பட்டவை</li>
              </ul>
              <p><strong>இயற்கைத் தன்மை பற்றிய குறிப்பு:</strong> பாரம்பரிய இயற்கை விளைபொருட்களில் நிறம், அமைப்பு அல்லது தானிய அளவில் ஏற்படும் சிறிய மாறுபாடுகள் குறைபாடுகள் அல்ல; மாறாக அவை கலப்படமற்ற தூய இயற்கை உணவின் தனித்துவமான பண்புகளாகும்.</p>
            </Section>

            <Section title="5. விலை நிர்ணயம் மற்றும் கட்டணம் செலுத்துதல்">
              <p>அனைத்து விலைகளும் இந்திய ரூபாயில் (INR) குறிப்பிடப்பட்டுள்ளன மற்றும் வேறுவிதமாகக் கூறப்படாவிட்டால் <strong>GST வரிகள் மற்றும் ஷிப்பிங் கட்டணங்கள் உள்ளடங்கியவை</strong>. முன்னறிவிப்பின்றி விலைகள் மாறக்கூடும்; இருப்பினும் நீங்கள் ஆர்டர் செய்யும் போது குறிப்பிடப்பட்ட விலையே இறுதியானது.</p>
              <p>நாங்கள் ஏற்கும் கட்டண முறைகள்: UPI (GPay, PhonePe, Paytm, BHIM), டெபிட்/கிரெடிட் கார்டுகள் (Visa, Mastercard, RuPay), மற்றும் நெட் பேங்கிங் — இவை அனைத்தும் <strong>Razorpay (PCI-DSS சான்றளிக்கப்பட்டது)</strong> மூலமாக 100% பாதுகாப்பாகப் பரிசீலிக்கப்படுகின்றன. உங்கள் கட்டணத் தகவல்களை நாங்கள் எங்களின் தளத்தில் சேமிப்பதில்லை.</p>
              <p>ஒவ்வொரு பார்சலுடனும் அதிகாரப்பூர்வ GST வரி விலைப்பட்டியல் (Invoice) அனுப்பப்படும். தோல்வியுற்ற பரிவர்த்தனைகளுக்கான தொகை உங்கள் வங்கி விதிமுறைகளின்படி 5–7 வணிக நாட்களுக்குள் உங்கள் கணக்கில் தானாகவே வரவு வைக்கப்படும்.</p>
            </Section>

            <Section title="6. ஆர்டர் பதிவு செய்தல் மற்றும் உறுதிப்படுத்துதல்">
              <p>ஆர்டர் பதிவு செய்வது என்பது ஒரு கொள்முதல் கோரிக்கையாகும். பார்சல் அனுப்பப்படும் (Dispatch) போது மட்டுமே ஒப்பந்தம் உறுதியாகிறது. பொருள் இருப்பு இல்லாதது, தவறான விலை, சந்தேகத்திற்கிடமான மோசடி, தவறான முகவரி அல்லது பணம் செலுத்துதல் தோல்வி போன்ற காரணங்களால் ஆர்டரை ரத்து செய்யும் உரிமை எங்களுக்கு உண்டு. எங்களால் ரத்து செய்யப்படும் ஆர்டர்களின் முழுத் தொகையும் 5–7 வணிக நாட்களுக்குள் முழுமையாகத் திருப்பித் தரப்படும்.</p>
            </Section>

            <Section title="7. ஷிப்பிங் மற்றும் டெலிவரி">
              <p>இந்தியா முழுவதும் நாங்கள் டெலிவரி செய்கிறோம். ஆர்டர் உறுதிசெய்யப்பட்ட 1–3 வணிக நாட்களுக்குள் பார்சல் அனுப்பப்படும். அனுப்பப்பட்ட தேதியிலிருந்து <strong>4–8 வணிக நாட்களுக்குள்</strong> உங்கள் முகவரிக்கு வந்து சேரும் என எதிர்பார்க்கப்படுகிறது. ட்ராக்கிங் எண் SMS/மின்னஞ்சல் வழியாக பகிரப்படும். கூரியர் நிறுவன தாமதங்கள், இயற்கை பேரிடர்கள் அல்லது எதிர்பாராத சூழ்நிலைகளால் ஏற்படும் தாமதங்களுக்கு நிறுவனம் பொறுப்பேற்காது. டெலிவரி செய்யப்பட்டவுடன் பார்சலுக்கான பொறுப்பு உங்களிடம் சேர்கிறது.</p>
            </Section>

            <Section title="8. உணவுப் பாதுகாப்பு மற்றும் கையாளுதல் வழிமுறைகள்">
              <p>FSSAI உரிமம் பெற்ற உணவு வணிகர் என்ற வகையில் நாங்கள் பரிந்துரைப்பது:</p>
              <ul>
                <li>தயாரிப்புகளை லேபிளில் உள்ள வழிமுறைகளின்படி (குளிர்ந்த, உலர்ந்த, காற்றுப்புகாத பாத்திரங்களில்) சேமிக்கவும்</li>
                <li>பயன்படுத்துவதற்கு முன் "Best Before" தேதியை சரிபார்க்கவும்</li>
                <li>சேதமடைந்த, மாசுபட்ட அல்லது வாசனை/அமைப்பில் மாறுபாடுள்ள பொருட்களை உட்கொள்ள வேண்டாம்</li>
                <li>உணவு ஒவ்வாமை (Allergy) உள்ளவர்கள் மூலப்பொருள் விவரங்களை கவனமாகப் படித்துவிட்டுப் பயன்படுத்தவும். வெளியிடப்படாத ஒவ்வாமைகளுக்கு நிறுவனம் பொறுப்பல்ல</li>
                <li>பாரம்பரிய இயற்கை அரிசி மற்றும் மரச்செக்கு எண்ணெய்களில் ரசாயனப் பாதுகாப்பிகள் இல்லாததால் வணிக தயாரிப்புகளை விட குறுகிய ஆயுட்காலம் கொண்டவை; அதற்கேற்ப பராமரிக்கவும்</li>
              </ul>
            </Section>

            <Section title="9. அறிவுசார் சொத்துரிமை (Intellectual Property)">
              <p>இந்த வலைத்தளத்தில் உள்ள உள்ளடக்கம் — உரைகள், படங்கள், லோகோக்கள், வடிவமைப்பு மற்றும் மென்பொருள் அனைத்தும் LP Traders / Vinnavar Organics-க்கு மட்டுமே சொந்தமானது. அவை <strong>பதிப்புரிமைச் சட்டம் (Copyright Act, 1957)</strong> மற்றும் <strong>வர்த்தக முத்திரைச் சட்டம் (Trade Marks Act, 1999)</strong>-இன் கீழ் பாதுகாக்கப்படுகின்றன. எழுத்துப்பூர்வ அனுமதியின்றி எந்தவொரு உள்ளடக்கத்தையும் மறுஉருவாக்கம் செய்யவோ அல்லது வணிக ரீதியாகப் பயன்படுத்தவோ அனுமதி இல்லை.</p>
            </Section>

            <Section title="10. பயனர் கணக்குகள் மற்றும் பாதுகாப்பு">
              <p>உங்கள் பயனர் கணக்கின் கடவுச்சொல் மற்றும் உள்நுழைவு விவரங்களை ரகசியமாகப் பாதுகாப்பது உங்கள் பொறுப்பாகும். அங்கீகரிக்கப்படாத பயன்பாடு ஏதேனும் கண்டறியப்பட்டால் உடனடியாக <strong>vinnavarbrand@gmail.com</strong>-க்கு தெரிவிக்கவும். இந்த விதிமுறைகளை மீறுபவர்கள் அல்லது மோசடி செய்பவர்களின் கணக்குகளை எந்த நேரத்திலும் முடக்கும் உரிமை எங்களுக்கு உள்ளது.</p>
            </Section>

            <Section title="11. தடைசெய்யப்பட்ட நடவடிக்கைகள்">
              <p>சட்டவிரோதமான நோக்கங்களுக்காக வலைத்தளத்தைப் பயன்படுத்துவது, தவறான அல்லது அவதூறான கருத்துக்களை இடுவது, இணையதள அமைப்பில் ஊடுருவ முயற்சிப்பது, வைரஸ் அல்லது மால்வேர்களைப் பரப்புவது, விளம்பரக் குறியீடுகளை தவறாகப் பயன்படுத்துவது ஆகியவை கடுமையாகத் தடைசெய்யப்பட்டுள்ளன.</p>
            </Section>

            <Section title="12. பொறுப்பு மறுப்பு (Disclaimer)">
              <p>இணையதளம் மற்றும் தயாரிப்புகள் "உள்ளவாறே" வழங்கப்படுகின்றன. <strong>ஆரோக்கியக் கூற்றுக்கள் மறுப்பு:</strong> தயாரிப்பு பக்கங்களில் உள்ள ஊட்டச்சத்து மற்றும் ஆரோக்கிய நன்மைகள் பொதுவான தகவல்களுக்காக மட்டுமே, அவை மருத்துவ ஆலோசனையல்ல. மருத்துவ நிலைமைகளுக்குத் தகுதியான மருத்துவரை அணுகவும்.</p>
            </Section>

            <Section title="13. பொறுப்பு வரம்பு (Limitation of Liability)">
              <p>இந்திய சட்டத்தின்படி அனுமதிக்கப்பட்ட முழு வரம்பிற்கு உட்பட்டு, LP Traders / Vinnavar Organics மறைமுக அல்லது எதிர்பாராத சேதங்களுக்குப் பொறுப்பேற்காது. எங்கள் அதிகபட்சப் பொறுப்பு சம்பந்தப்பட்ட ஆர்டருக்கு நீங்கள் செலுத்திய தொகையைத் தாண்டாது.</p>
            </Section>

            <Section title="14. ஆளுகைச் சட்டம் மற்றும் தகராறு தீர்வு">
              <p>இந்த விதிமுறைகள் <strong>இந்திய சட்டங்களுக்கு</strong> உட்பட்டவை. ஏதேனும் தகராறுகள் ஏற்பட்டால், அவை <strong>திருவண்ணாமலை, தமிழ்நாடு</strong> நீதிமன்றங்களின் பிரத்யேக அதிகார வரம்பிற்கு உட்பட்டவை. நுகர்வோர் பாதுகாப்பு விதிகளின் கீழ் நுகர்வோர் புகார்களையும் தாக்கல் செய்யலாம்.</p>
            </Section>

            <Section title="15. குறைதீர்க்கும் அதிகாரி (Grievance Redressal Officer)">
              <div className="border rounded-3 p-3 bg-light mt-2">
                <p className="mb-1"><strong>பெயர்:</strong> திரு. லோகேஷ் ராஜன் ஷா</p>
                <p className="mb-1"><strong>பொறுப்பு:</strong> குறைதீர்க்கும் அதிகாரி / உரிமையாளர்</p>
                <p className="mb-1"><strong>மின்னஞ்சல்:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-0"><strong>பதில் அளிக்கும் நேரம்:</strong> புகார் பெறப்பட்ட 30 நாட்களுக்குள்</p>
              </div>
              <p className="mt-3"><strong>தகவல் தொழில்நுட்பச் சட்டம் (2000)</strong> மற்றும் <strong>நுகர்வோர் பாதுகாப்பு (மின்-வணிகம்) விதிகள் (2020)</strong>-இன் கீழ் நியமிக்கப்பட்டுள்ளார்.</p>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">தனியுரிமைக் கொள்கை</Link>
              <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">திரும்பப்பெறும் கொள்கை</Link>
              <Link to="/refund-policy" className="btn btn-outline-success btn-sm rounded-pill">பணத்திரும்ப நிதி</Link>
              <Link to="/" className="btn btn-success btn-sm rounded-pill ms-auto">முகப்புக்கு செல்ல</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // English fallback
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
