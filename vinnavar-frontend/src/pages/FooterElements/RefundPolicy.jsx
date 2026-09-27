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

const RefundPolicy = () => {
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ਰਿਫੰਡ ਨੀਤੀ (Refund Policy)</h1>
                <p className="text-muted small mb-0">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ — ਐਲਪੀ ਟਰੇਡਰਜ਼ | ਆਖਰੀ ਅਪਡੇਟ: ਅਗਸਤ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ ਵਿੱਚ, ਤੁਹਾਡੀ ਸੰਤੁਸ਼ਟੀ ਅਤੇ ਵਿਸ਼ਵਾਸ ਸਾਡੀ ਮੁੱਖ ਤਰਜੀਹ ਹੈ। ਤੁਹਾਡੇ ਰਿਫੰਡ ਅਧਿਕਾਰਾਂ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਪੂਰੀ ਪਾਰਦਰਸ਼ਤਾ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਇਹ ਨੀਤੀ ਤਿਆਰ ਕੀਤੀ ਗਈ ਹੈ।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ਰਿਫੰਡ ਯੋਗਤਾ — ਰਿਫੰਡ ਕਦੋਂ ਲਾਗੂ ਹੁੰਦਾ ਹੈ?">
              <p>ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਤੁਸੀਂ ਪੂਰੇ ਜਾਂ ਅੰਸ਼ਕ ਰਿਫੰਡ ਦੇ ਹੱਕਦਾਰ ਹੋਵੋਗੇ:</p>
              <ul>
                <li><strong>ਆਰਡਰ ਰੱਦ ਕਰਨਾ:</strong> ਉਤਪਾਦ ਗੋਦਾਮ ਤੋਂ ਰਵਾਨਾ (dispatch) ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਆਰਡਰ ਰੱਦ ਕਰਨ 'ਤੇ 100% ਰਿਫੰਡ ਮਿਲਦਾ ਹੈ।</li>
                <li><strong>ਨੁਕਸਾਨੇ ਜਾਂ ਖਰਾਬ ਉਤਪਾਦ:</strong> ਡਿਲੀਵਰੀ ਵੇਲੇ ਨੁਕਸਾਨ ਸਾਬਤ ਹੋਣ 'ਤੇ ਅਤੇ 24–48 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਫੋਟੋਆਂ/ਵੀਡੀਓ ਸਮੇਤ ਰਿਪੋਰਟ ਕਰਨ 'ਤੇ।</li>
                <li><strong>ਗਲਤ ਉਤਪਾਦ ਮਿਲਣਾ:</strong> ਆਰਡਰ ਕੀਤੀ ਵਸਤੂ ਤੋਂ ਵੱਖਰੀ ਵਸਤੂ ਭੇਜੀ ਜਾਣ 'ਤੇ।</li>
                <li><strong>ਆਵਾਜਾਈ ਵਿੱਚ ਗੁੰਮ ਹੋਇਆ ਪਾਰਸਲ:</strong> ਕੋਰੀਅਰ ਕੰਪਨੀ ਵੱਲੋਂ ਪਾਰਸਲ ਗੁੰਮ ਹੋਣ ਦੀ ਅਧਿਕਾਰਤ ਪੁਸ਼ਟੀ ਕਰਨ 'ਤੇ।</li>
                <li><strong>ਸਟਾਕ ਉਪਲਬਧ ਨਾ ਹੋਣਾ:</strong> ਆਰਡਰ ਸਵੀਕਾਰ ਕਰਨ ਤੋਂ ਬਾਅਦ ਉਤਪਾਦ ਉਪਲਬਧ ਨਾ ਹੋਣ 'ਤੇ ਪੂਰੀ ਰਕਮ ਤੁਰੰਤ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ।</li>
              </ul>
            </Section>

            <Section title="2. ਰਿਫੰਡ ਸਮੀਖਿਆ ਅਤੇ ਪ੍ਰਵਾਨਗੀ">
              <p>ਵਾਪਸ ਆਇਆ ਉਤਪਾਦ ਸਾਡੇ ਗੋਦਾਮ ਵਿੱਚ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ, ਸਾਡੀ ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਟੀਮ <strong>2–3 ਕੰਮਕਾਜੀ ਦਿਨਾਂ ਵਿੱਚ</strong> ਇਸਦੀ ਜਾਂਚ ਕਰੇਗੀ। ਜਾਂਚ ਪੂਰੀ ਹੁੰਦੇ ਹੀ ਈਮੇਲ ਜਾਂ ਐਸਐਮਐਸ ਰਾਹੀਂ ਰਿਫੰਡ ਸਥਿਤੀ ਬਾਰੇ ਜਾਣੂ ਕਰਵਾਇਆ ਜਾਵੇਗਾ।</p>
            </Section>

            <Section title="3. ਰਿਫੰਡ ਵਿਧੀਆਂ ਅਤੇ ਸਮਾਂ-ਸੀਮਾ">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>ਭੁਗਤਾਨ ਵਿਧੀ</th>
                      <th>ਰਿਫੰਡ ਦਾ ਮਾਧਿਅਮ</th>
                      <th>ਸਮਾਂ-ਸੀਮਾ (ਪ੍ਰਵਾਨਗੀ ਤੋਂ ਬਾਅਦ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>ਅਸਲ UPI ਖਾਤਾ / VPA</td>
                      <td>2 ਤੋਂ 4 ਕੰਮਕਾਜੀ ਦਿਨ</td>
                    </tr>
                    <tr>
                      <td>ਕ੍ਰੈਡਿਟ / ਡੈਬਿਟ ਕਾਰਡ</td>
                      <td>ਸੰਬੰਧਿਤ ਬੈਂਕ ਕਾਰਡ ਖਾਤਾ</td>
                      <td>5 ਤੋਂ 7 ਕੰਮਕਾਜੀ ਦਿਨ</td>
                    </tr>
                    <tr>
                      <td>ਨੈੱਟ ਬੈਂਕਿੰਗ</td>
                      <td>ਅਸਲ ਬੈਂਕ ਖਾਤਾ</td>
                      <td>5 ਤੋਂ 7 ਕੰਮਕਾਜੀ ਦਿਨ</td>
                    </tr>
                    <tr>
                      <td>ਕੈਸ਼ ਆਨ ਡਿਲੀਵਰੀ (COD)</td>
                      <td>ਗਾਹਕ ਵੱਲੋਂ ਦਿੱਤਾ ਬੈਂਕ ਖਾਤਾ (NEFT/IMPS) ਜਾਂ UPI</td>
                      <td>3 ਤੋਂ 5 ਕੰਮਕਾਜੀ ਦਿਨ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">ਨੋਟ: ਬੈਂਕ ਛੁੱਟੀਆਂ ਅਤੇ ਬੈਂਕਾਂ ਦੀ ਅੰਦਰੂਨੀ ਪ੍ਰਕਿਰਿਆ ਕਾਰਨ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਜਮ੍ਹਾਂ ਹੋਣ ਲਈ ਵਾਧੂ 1–2 ਦਿਨ ਲੱਗ ਸਕਦੇ ਹਨ।</p>
            </Section>

            <Section title="4. ਗੈਰ-ਰਿਫੰਡ ਯੋਗ ਸਥਿਤੀਆਂ">
              <ul>
                <li>ਸੀਲ ਖੁੱਲ੍ਹੇ ਜਾਂ ਵਰਤੇ ਗਏ ਭੋਜਨ ਉਤਪਾਦ।</li>
                <li>ਡਿਲੀਵਰੀ ਦੇ 48 ਘੰਟਿਆਂ ਬਾਅਦ ਬਿਨਾਂ ਸਬੂਤ ਤੋਂ ਕੀਤੇ ਗਏ ਨੁਕਸਾਨ ਦੇ ਦਾਅਵੇ।</li>
                <li>ਗਾਹਕ ਵੱਲੋਂ ਗਲਤ ਪਤਾ ਜਾਂ ਫ਼ੋਨ ਨੰਬਰ ਦੇਣ ਕਾਰਨ ਡਿਲੀਵਰੀ ਅਸਫਲ ਹੋਣ 'ਤੇ (ਸ਼ਿਪਿੰਗ ਖਰਚੇ ਕੱਟੇ ਜਾਣਗੇ)।</li>
                <li>ਨਿੱਜੀ ਪਸੰਦ ਜਾਂ ਸਵਾਦ ਦੇ ਫਰਕ ਕਾਰਨ ਕੀਤੀਆਂ ਬੇਨਤੀਆਂ।</li>
              </ul>
            </Section>

            <Section title="5. ਦੇਰੀ ਨਾਲ ਜਾਂ ਨਾ ਮਿਲੇ ਰਿਫੰਡ">
              <p>ਰਿਫੰਡ ਪ੍ਰਵਾਨ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਨਿਰਧਾਰਤ ਸਮੇਂ ਵਿੱਚ ਪੈਸੇ ਨਾ ਆਉਣ 'ਤੇ, ਕਿਰਪਾ ਕਰਕੇ ਹੇਠ ਲਿਖੇ ਕਦਮ ਚੁੱਕੋ:</p>
              <ol>
                <li>ਪਹਿਲਾਂ ਆਪਣਾ ਬੈਂਕ ਸਟੇਟਮੈਂਟ ਜਾਂ UPI ਐਪ ਲੈਣ-ਦੇਣ ਇਤਿਹਾਸ ਦੁਬਾਰਾ ਜਾਂਚੋ।</li>
                <li>ਆਪਣੇ ਕਾਰਡ ਜਾਰੀਕਰਤਾ ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ; ਬੈਂਕਿੰਗ ਪ੍ਰਣਾਲੀ ਵਿੱਚ ਰਕਮ ਦਰਜ ਹੋਣ ਲਈ ਕਦੇ-ਕਦੇ ਸਮਾਂ ਲੱਗਦਾ ਹੈ।</li>
                <li>ਇਨ੍ਹਾਂ ਸਭ ਤੋਂ ਬਾਅਦ ਵੀ ਹੱਲ ਨਾ ਹੋਣ 'ਤੇ, ਆਪਣੇ ਆਰਡਰ ਵੇਰਵਿਆਂ ਨਾਲ <strong>support@vinnavar.com</strong> 'ਤੇ ਈਮੇਲ ਕਰੋ ਜਾਂ <strong>+91 94441 83387</strong> 'ਤੇ ਸੰਪਰਕ ਕਰੋ।</li>
              </ol>
            </Section>

            <Section title="6. ਆਰਡਰ ਰੱਦ ਕਰਨ ਦੀ ਨੀਤੀ (Order Cancellation)">
              <p>ਆਰਡਰ ਕਰਨ ਤੋਂ ਬਾਅਦ, ਉਤਪਾਦ ਗੋਦਾਮ ਤੋਂ ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ (before dispatch) ਤੁਸੀਂ ਮੁਫਤ ਆਰਡਰ ਰੱਦ ਕਰ ਸਕਦੇ ਹੋ। ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਬਾਅਦ ਰੱਦ ਕਰਨਾ ਸੰਭਵ ਨਹੀਂ ਹੈ; ਅਜਿਹੀ ਸਥਿਤੀ ਵਿੱਚ ਡਿਲੀਵਰੀ ਤੋਂ ਬਾਅਦ ਵਾਪਸੀ ਨੀਤੀ ਲਾਗੂ ਹੋਵੇਗੀ।</p>
            </Section>

            <Section title="7. ਗਾਹਕ ਸਹਾਇਤਾ ਸੰਪਰਕ ਜਾਣਕਾਰੀ">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ਕੰਪਨੀ:</strong> ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ (ਐਲਪੀ ਟਰੇਡਰਜ਼)</p>
                <p className="mb-1"><strong>ਈਮੇਲ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ਫ਼ੋਨ / ਵਟਸਐਪ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ਸਮਾਂ:</strong> ਸੋਮਵਾਰ ਤੋਂ ਸ਼ਨੀਵਾਰ (ਸਵੇਰੇ 9:30 – ਸ਼ਾਮ 6:30 ਵਜੇ)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">ਵਾਪਸੀ ਨੀਤੀ ਵੇਖੋ</Link>
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>रिफंड धोरण (Refund Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑरगॅनिक्स — एलपी ट्रेडर्स | शेवटचे अपडेट: ऑगस्ट २०२५</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">विन्नवर ऑरगॅनिक्समध्ये, आपले समाधान आणि विश्वास आमची सर्वोच्च प्राथमिकता आहे. आपले रिफंड हक्क आणि प्रक्रिया पारदर्शकपणे स्पष्ट करण्यासाठी हे धोरण तयार करण्यात आले आहे.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. रिफंड पात्रता — रिफंड कधी लागू होतो?">
              <p>खालील परिस्थितींमध्ये आपण पूर्ण किंवा आंशिक रिफंड मिळवण्यास पात्र असाल:</p>
              <ul>
                <li><strong>ऑर्डर रद्दीकरण:</strong> उत्पादन गोदामातून रवाना (dispatch) होण्यापूर्वी ऑर्डर रद्द केल्यास १००% रिफंड मिळतो.</li>
                <li><strong>खराब किंवा त्रुटीयुक्त उत्पादने:</strong> डिलिव्हरीच्या वेळी नुकसान झाल्याचे सिद्ध झाल्यास आणि २४–४८ तासांत फोटो/व्हिडिओसह कळवल्यास.</li>
                <li><strong>चुकीचे उत्पादन मिळाले:</strong> ऑर्डर केलेल्या वस्तूपेक्षा वेगळी वस्तू पाठवली गेल्यास.</li>
                <li><strong>वाहतुकीदरम्यान पार्सल गहाळ झाल्यास:</strong> कुरिअर कंपनीने पार्सल गहाळ झाल्याचे अधिकृतपणे घोषित केल्यास.</li>
                <li><strong>स्टॉक अनुपलब्धता:</strong> ऑर्डर स्वीकारल्यानंतर उत्पादन उपलब्ध नसल्यास पूर्ण रक्कम तात्काळ परत केली जाईल.</li>
              </ul>
            </Section>

            <Section title="2. रिफंड पडताळणी आणि मंजुरी">
              <p>परत केलेले उत्पादन आमच्या गोदामात आल्यानंतर, आमची गुणवत्ता नियंत्रण टीम <strong>२–३ कामकाजाच्या दिवसांत</strong> त्याची तपासणी करेल. तपासणी पूर्ण होताच ईमेल किंवा एसएमएसद्वारे रिफंडच्या स्थितीबाबत आपल्याला कळवले जाईल.</p>
            </Section>

            <Section title="3. रिफंड पद्धती आणि कालावधी">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>पेमेंट पद्धत</th>
                      <th>रिफंडचे माध्यम</th>
                      <th>कालावधी (मंजुरीनंतर)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>मूळ UPI खाते / VPA</td>
                      <td>२ ते ४ कामकाजाचे दिवस</td>
                    </tr>
                    <tr>
                      <td>क्रेडिट / डेबिट कार्ड</td>
                      <td>संबंधित बँक कार्ड खाते</td>
                      <td>५ ते ७ कामकाजाचे दिवस</td>
                    </tr>
                    <tr>
                      <td>नेट बँकिंग</td>
                      <td>मूळ बँक खाते</td>
                      <td>५ ते ७ कामकाजाचे दिवस</td>
                    </tr>
                    <tr>
                      <td>कॅश ऑन डिलिव्हरी (COD)</td>
                      <td>ग्राहकाने दिलेले बँक खाते (NEFT/IMPS) किंवा UPI</td>
                      <td>३ ते ५ कामकाजाचे दिवस</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">टीप: बँक सुट्ट्या आणि बँकांच्या अंतर्गत प्रक्रियेमुळे खात्यात पैसे जमा होण्यास अतिरिक्त १–२ दिवसांचा कालावधी लागू शकतो.</p>
            </Section>

            <Section title="4. रिफंड न मिळणारी परिस्थिती (Non-Refundable)">
              <ul>
                <li>सील उघडलेले किंवा वापरलेले अन्नपदार्थ.</li>
                <li>डिलिव्हरीच्या ४८ तासांनंतर योग्य पुराव्याशिवाय केलेल्या नुकसानाच्या तक्रारी.</li>
                <li>ग्राहकाने चुकीचा पत्ता किंवा फोन नंबर दिल्याने डिलिव्हरी अयशस्वी झाल्यास (शिपिंग शुल्क कापले जाईल).</li>
                <li>वैयक्तिक आवड किंवा चवीच्या फरकामुळे केलेल्या विनंत्या.</li>
              </ul>
            </Section>

            <Section title="5. उशिरा किंवा न मिळालेले रिफंड">
              <p>रिफंड मंजूर होऊनही ठरलेल्या वेळेत खात्यात पैसे न आल्यास, कृपया खालील पायऱ्या तपासा:</p>
              <ol>
                <li>प्रथम आपले बँक स्टेटमेंट किंवा UPI अॅपचा व्यवहार इतिहास पुन्हा तपासा.</li>
                <li>आपल्या कार्ड जारी करणाऱ्या बँकेशी संपर्क साधा; बँकिंग प्रणालीत रक्कम जमा होण्यास कधीकधी वेळ लागतो.</li>
                <li>या सर्वानंतरही समस्या न सुटल्यास, आपल्या ऑर्डर क्रमांकासह <strong>support@vinnavar.com</strong> वर ईमेल करा किंवा <strong>+91 94441 83387</strong> वर संपर्क साधा.</li>
              </ol>
            </Section>

            <Section title="6. ऑर्डर रद्दीकरण धोरण (Order Cancellation)">
              <p>ऑर्डर केल्यानंतर, उत्पादन गोदामातून रवाना (dispatch) होईपर्यंत आपण विनामूल्य ऑर्डर रद्द करू शकता. एकदा रवाना झाल्यानंतर रद्दीकरण शक्य नाही; अशा परिस्थितीत डिलिव्हरीनंतर परतावा धोरण लागू होईल.</p>
            </Section>

            <Section title="7. ग्राहक सेवा संपर्क माहिती">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>कंपनी:</strong> विन्नवर ऑरगॅनिक्स (एलपी ट्रेडर्स)</p>
                <p className="mb-1"><strong>ईमेल:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>फोन / व्हॉट्सअॅप:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>वेळ:</strong> सोमवार ते शनिवार (सकाळी ९:३० – संध्याकाळी ६:३०)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">परतावा धोरण पहा</Link>
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>রিফান্ড পলিসি (Refund Policy)</h1>
                <p className="text-muted small mb-0">ভিন্নভার অর্গানিকস — এলপি ট্রেডার্স | সর্বশেষ আপডেট: আগস্ট ২০২৫</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ভিন্নভার অর্গানিকসে, আপনার সন্তুষ্টি এবং বিশ্বাস আমাদের প্রধান অগ্রাধিকার। আপনার রিফান্ড সংক্রান্ত অধিকার এবং প্রক্রিয়া স্বচ্ছভাবে জানাতে এই নীতিটি প্রণয়ন করা হয়েছে।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. রিফান্ড যোগ্যতা — কখন রিফান্ড প্রযোজ্য?">
              <p>নিম্নলিখিত পরিস্থিতিতে আপনি সম্পূর্ণ বা আংশিক রিফান্ডের যোগ্য হবেন:</p>
              <ul>
                <li><strong>অর্ডার বাতিলকরণ:</strong> পণ্য গুদাম থেকে প্রেরণের পূর্বে (before dispatch) অর্ডার বাতিল করলে ১০০% রিফান্ড পাওয়া যাবে।</li>
                <li><strong>ক্ষতিগ্রস্ত বা ত্রুটিপূর্ণ পণ্য:</strong> ডেলিভারির সময় ক্ষতিগ্রস্ত প্রমাণিত হলে এবং ২৪–৪৮ ঘণ্টার মধ্যে ছবি/ভিডিও সহ জানালে।</li>
                <li><strong>ভুল পণ্য ডেলিভারি:</strong> অর্ডার করা পণ্যের পরিবর্তে অন্য পণ্য পাঠানো হলে।</li>
                <li><strong>পরিবহনে হারানো পার্সেল:</strong> কুরিয়ার সংস্থা কর্তৃক পার্সেল হারিয়ে গেছে বলে আনুষ্ঠানিকভাবে নিশ্চিত করা হলে।</li>
                <li><strong>স্টক অপ্রাপ্যতা:</strong> অর্ডার গ্রহণের পর পণ্য স্টকে না থাকলে সম্পূর্ণ অর্থ অবিলম্বে ফেরত দেওয়া হবে।</li>
              </ul>
            </Section>

            <Section title="2. রিফান্ড পর্যালোচনা ও অনুমোদন">
              <p>ফেরত পাঠানো পণ্য আমাদের গুদামে পৌঁছানোর পর, আমাদের গুণমান যাচাই দল <strong>২–৩ কার্যদিবসের মধ্যে</strong> তা পরিদর্শন করবে। পরিদর্শন শেষ হওয়া মাত্রই ইমেল বা এসএমএসের মাধ্যমে রিফান্ডের স্ট্যাটাস আপনাকে জানিয়ে দেওয়া হবে।</p>
            </Section>

            <Section title="3. রিফান্ড পদ্ধতি এবং সময়সীমা">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>পেমেন্ট মাধ্যম</th>
                      <th>রিফান্ডের মাধ্যম</th>
                      <th>সময়সীমা (অনুমোদনের পর)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>মূল UPI অ্যাকাউন্ট / VPA</td>
                      <td>২ থেকে ৪ কার্যদিবস</td>
                    </tr>
                    <tr>
                      <td>ক্রেডিট / ডেবিট কার্ড</td>
                      <td>সংশ্লিষ্ট ব্যাংক কার্ড অ্যাকাউন্ট</td>
                      <td>৫ থেকে ৭ কার্যদিবস</td>
                    </tr>
                    <tr>
                      <td>নেট ব্যাংকিং</td>
                      <td>মূল ব্যাংক অ্যাকাউন্ট</td>
                      <td>৫ থেকে ৭ কার্যদিবস</td>
                    </tr>
                    <tr>
                      <td>ক্যাশ অন ডেলিভারি (COD)</td>
                      <td>গ্রাহকের প্রদত্ত ব্যাংক অ্যাকাউন্ট (NEFT/IMPS) বা UPI</td>
                      <td>৩ থেকে ৫ কার্যদিবস</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">দ্রষ্টব্য: ব্যাংকিং ছুটির দিন ও ব্যাংকসমূহের অভ্যন্তরীণ প্রক্রিয়াকরণের কারণে অ্যাকাউন্টে টাকা প্রতিফলিত হতে অতিরিক্ত ১–২ দিন সময় লাগতে পারে।</p>
            </Section>

            <Section title="4. যেসকল ক্ষেত্রে রিফান্ড প্রযোজ্য নয়">
              <ul>
                <li>সিল খোলা বা ব্যবহৃত খাদ্য সামগ্রী।</li>
                <li>ডেলিভারির ৪৮ ঘণ্টার পর যথাযথ প্রমাণ ছাড়া করা ক্ষতির দাবি।</li>
                <li>গ্রাহকের ভুল ঠিকানা বা ফোন নম্বরের কারণে ডেলিভারি ব্যর্থ হলে (শিপিং চার্জ কর্তন করা হবে)।</li>
                <li>ব্যক্তিগত পছন্দ বা স্বাদের ভিন্নতার কারণে করা অনুরোধ।</li>
              </ul>
            </Section>

            <Section title="5. বিলম্বিত বা অনুপস্থিত রিফান্ড">
              <p>রিফান্ড অনুমোদিত হওয়ার পরও নির্দিষ্ট সময়ের মধ্যে অ্যাকাউন্টে অর্থ না পৌঁছালে, অনুগ্রহ করে নিচের পদক্ষেপগুলি অনুসরণ করুন:</p>
              <ol>
                <li>প্রথমে আপনার ব্যাংক স্টেটমেন্ট বা UPI অ্যাপের লেনদেন ইতিহাস পুনরায় পরীক্ষা করুন।</li>
                <li>আপনার কার্ড প্রদানকারী ব্যাংকের সাথে যোগাযোগ করুন; মাঝে মাঝে ব্যাংকিং সিস্টেমে প্রক্রিয়া সম্পন্ন হতে সময় নেয়।</li>
                <li>এসবের পরেও সমস্যা সমাধান না হলে, আপনার অর্ডার নম্বর সহ <strong>support@vinnavar.com</strong> এ ইমেল করুন অথবা <strong>+91 94441 83387</strong> এ যোগাযোগ করুন।</li>
              </ol>
            </Section>

            <Section title="6. অর্ডার বাতিলকরণ নীতি (Order Cancellation)">
              <p>অর্ডার দেওয়ার পর, পণ্য গুদাম থেকে ডিসপ্যাচ হওয়ার পূর্ব পর্যন্ত (before dispatch) আপনি বিনামূল্যে অর্ডার বাতিল করতে পারেন। একবার পাঠিয়ে দেওয়ার পর বাতিলকরণ সম্ভব নয়; সেক্ষেত্রে ডেলিভারির পর রিটার্ন নীতি প্রযোজ্য হবে।</p>
            </Section>

            <Section title="7. কাস্টমার সাপোর্ট ও যোগাযোগ">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>কোম্পানি:</strong> ভিন্নভার অর্গানিকস (এলপি ট্রেডার্স)</p>
                <p className="mb-1"><strong>ইমেল:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ফোন / হোয়াটসঅ্যাপ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>সময়:</strong> সোমবার থেকে শনিবার (সকাল ৯:৩০ – সন্ধ্যা ৬:৩০)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">রিটার্ন পলিসি দেখুন</Link>
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>റീഫണ്ട് പോളിസി (Refund Policy)</h1>
                <p className="text-muted small mb-0">വിണ്ണവർ ഓർഗാനിക്‌സ് — എൽപി ട്രേഡേഴ്‌സ് | അവസാന അപ്‌ഡേറ്റ്: ഓഗസ്റ്റ് 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">വിണ്ണവർ ഓർഗാനിക്‌സിൽ, നിങ്ങളുടെ സംതൃപ്തിയും വിശ്വാസവുമാണ് ഞങ്ങളുടെ പ്രധാന മുൻഗണന. നിങ്ങളുടെ റീഫണ്ട് അവകാശങ്ങളും നടപടിക്രമങ്ങളും സംബന്ധിച്ച് പൂർണ്ണ സുതാര്യത നൽകാനാണ് ഈ റീഫണ്ട് നയം തയ്യാറാക്കിയിരിക്കുന്നത്.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. റീഫണ്ട് യോഗ്യത — എപ്പോഴാണ് റീഫണ്ട് ലഭിക്കുന്നത്?">
              <p>താഴെ പറയുന്ന സാഹചര്യങ്ങളിൽ നിങ്ങൾക്ക് പൂർണ്ണമായോ ഭാഗികമായോ റീഫണ്ടിന് അർഹതയുണ്ട്:</p>
              <ul>
                <li><strong>ഓർഡർ റദ്ദാക്കൽ:</strong> ഉൽപ്പന്നം അയക്കുന്നതിന് മുമ്പ് (before dispatch) ഓർഡർ റദ്ദാക്കിയാൽ 100% റീഫണ്ട് ലഭിക്കും.</li>
                <li><strong>കേടുവന്നതോ തകരാറുള്ളതോ ആയ ഉൽപ്പന്നങ്ങൾ:</strong> ഡെലിവറി സമയത്ത് കേടുപാടുകൾ സംഭവിച്ചതായി സ്ഥിരീകരിക്കുകയും, 24–48 മണിക്കൂറിനുള്ളിൽ ഫോട്ടോകൾ/വീഡിയോ സഹിതം റിപ്പോർട്ട് ചെയ്യുകയും ചെയ്താൽ.</li>
                <li><strong>തെറ്റായ ഉൽപ്പന്നം ഡെലിവർ ചെയ്തു:</strong> നിങ്ങൾ ഓർഡർ ചെയ്ത ഇനത്തിന് പകരം മറ്റൊരു ഇനം ലഭിച്ചാൽ.</li>
                <li><strong>യാത്രയിൽ നഷ്ടപ്പെട്ട പാഴ്സൽ:</strong> കൊറിയർ കമ്പനി പാഴ്സൽ നഷ്ടപ്പെട്ടതായി ഔദ്യോഗികമായി സ്ഥിരീകരിച്ചാൽ.</li>
                <li><strong>സ്റ്റോക്ക് ലഭ്യമല്ലാതിരിക്കൽ:</strong> ഓർഡർ ചെയ്തതിനു ശേഷം ഉൽപ്പന്നം ലഭ്യമല്ലെങ്കിൽ മുഴുവൻ തുകയും ഉടൻ റീഫണ്ട് ചെയ്യും.</li>
              </ul>
            </Section>

            <Section title="2. റീഫണ്ട് പരിശോധനയും അംഗീകാരവും">
              <p>തിരികെ അയച്ച ഉൽപ്പന്നം ഞങ്ങളുടെ വെയർഹൗസിൽ എത്തിക്കഴിഞ്ഞാൽ, ഞങ്ങളുടെ ഗുണനിലവാര പരിശോധനാ സംഘം അത് <strong>2–3 പ്രവൃത്തി ദിവസങ്ങൾക്കുള്ളിൽ</strong> പരിശോധിക്കും. പരിശോധന പൂർത്തിയായ ഉടൻ, റീഫണ്ട് അംഗീകരിക്കപ്പെട്ടോ ഇല്ലയോ എന്ന വിവരം ഇമെയിൽ അല്ലെങ്കിൽ SMS വഴി നിങ്ങളെ അറിയിക്കും.</p>
            </Section>

            <Section title="3. റീഫണ്ട് രീതികളും സമയപരിധിയും">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>പേയ്‌മെന്റ് രീതി</th>
                      <th>റീഫണ്ട് മാർഗ്ഗം</th>
                      <th>സമയപരിധി (അംഗീകാരത്തിന് ശേഷം)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>യഥാർത്ഥ UPI അക്കൗണ്ട് / VPA</td>
                      <td>2 മുതൽ 4 പ്രവൃത്തി ദിവസങ്ങൾ</td>
                    </tr>
                    <tr>
                      <td>ക്രെഡിറ്റ് / ഡെബിറ്റ് കാർഡ്</td>
                      <td>ബന്ധപ്പെട്ട ബാങ്ക് കാർഡ് അക്കൗണ്ട്</td>
                      <td>5 മുതൽ 7 പ്രവൃത്തി ദിവസങ്ങൾ</td>
                    </tr>
                    <tr>
                      <td>നെറ്റ് ബാങ്കിംഗ്</td>
                      <td>യഥാർത്ഥ ബാങ്ക് അക്കൗണ്ട്</td>
                      <td>5 മുതൽ 7 പ്രവൃത്തി ദിവസങ്ങൾ</td>
                    </tr>
                    <tr>
                      <td>ക്യാഷ് ഓൺ ഡെലിവറി (COD)</td>
                      <td>ഉപഭോക്താവ് നൽകിയ ബാങ്ക് അക്കൗണ്ട് (NEFT/IMPS) അല്ലെങ്കിൽ UPI</td>
                      <td>3 മുതൽ 5 പ്രവൃത്തി ദിവസങ്ങൾ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">ശ്രദ്ധിക്കുക: ബാങ്ക് അവധി ദിവസങ്ങളും ബന്ധപ്പെട്ട ബാങ്കുകളുടെ ആഭ്യന്തര പ്രക്രിയകളും കാരണം തുക അക്കൗണ്ടിൽ കാണാൻ അധികമായി 1–2 ദിവസങ്ങൾ എടുത്തേക്കാം.</p>
            </Section>

            <Section title="4. റീഫണ്ട് ലഭിക്കാത്ത സാഹചര്യങ്ങൾ (Non-Refundable)">
              <ul>
                <li>തുറന്നതോ ഉപയോഗിച്ചതോ ആയ ഭക്ഷ്യ ഉൽപ്പന്നങ്ങൾ.</li>
                <li>ഡെലിവറി കഴിഞ്ഞ് 48 മണിക്കൂറിനു ശേഷം മതിയായ തെളിവുകളില്ലാതെ ഉന്നയിച്ച കേടുപാടുകളുടെ പരാതികൾ.</li>
                <li>ഉപഭോക്താവ് നൽകിയ തെറ്റായ വിലാസമോ ഫോൺ നമ്പറോ കാരണം ഡെലിവറി പരാജയപ്പെട്ടാൽ (ഷിപ്പിംഗ് ചാർജുകൾ കുറയ്ക്കും).</li>
                <li>വ്യക്തിഗത അഭിരുചിയോ രുചിയോ സംബന്ധിച്ച കാരണങ്ങൾ.</li>
              </ul>
            </Section>

            <Section title="5. വൈകിയതോ ലഭിക്കാത്തതോ ആയ റീഫണ്ടുകൾ">
              <p>റീഫണ്ട് അംഗീകരിക്കപ്പെട്ടിട്ടും കൃത്യസമയത്ത് തുക ലഭിച്ചില്ലെങ്കിൽ, ദയവായി താഴെ പറയുന്ന കാര്യങ്ങൾ ചെയ്യുക:</p>
              <ol>
                <li>ആദ്യം നിങ്ങളുടെ ബാങ്ക് സ്റ്റേറ്റ്‌മെന്റോ UPI ആപ്പ് ഹിസ്റ്ററിയോ ഒരിക്കൽ കൂടി പരിശോധിക്കുക.</li>
                <li>നിങ്ങളുടെ കാർഡ് നൽകിയ ബാങ്കുമായി ബന്ധപ്പെടുക; തുക അക്കൗണ്ടിൽ പ്രതിഫലിക്കാൻ ബാങ്കുകൾക്ക് ചിലപ്പോൾ സമയം ആവശ്യമായി വരും.</li>
                <li>ഇവ ചെയ്തിട്ടും തുക ലഭിച്ചില്ലെങ്കിൽ, ദയവായി നിങ്ങളുടെ ഓർഡർ വിവരങ്ങളുമായി <strong>support@vinnavar.com</strong> ലേക്ക് ഇമെയിൽ ചെയ്യുക അല്ലെങ്കിൽ <strong>+91 94441 83387</strong> ൽ ബന്ധപ്പെടുക.</li>
              </ol>
            </Section>

            <Section title="6. ഓർഡർ റദ്ദാക്കൽ നയം (Order Cancellation)">
              <p>ഓർഡർ ചെയ്ത ശേഷം, ഉൽപ്പന്നം ഞങ്ങളുടെ വെയർഹൗസിൽ നിന്ന് ഡിസ്പാച്ച് ചെയ്യുന്നതുവരെ (before dispatch) നിങ്ങൾക്ക് സൗജന്യമായി റദ്ദാക്കാവുന്നതാണ്. അയച്ചുകഴിഞ്ഞാൽ റദ്ദാക്കൽ അപേക്ഷകൾ സ്വീകരിക്കില്ല; അത്തരം സന്ദർഭങ്ങളിൽ ഡെലിവറിക്ക് ശേഷമുള്ള റിട്ടേൺ പോളിസി ബാധകമായിരിക്കും.</p>
            </Section>

            <Section title="7. കസ്റ്റമർ സപ്പോർട്ടും ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>കമ്പനി:</strong> വിണ്ണവർ ഓർഗാനിക്‌സ് (എൽപി ട്രേഡേഴ്‌സ്)</p>
                <p className="mb-1"><strong>ഇമെയിൽ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ഫോൺ / വാട്ട്‌സ്ആപ്പ്:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>സമയം:</strong> തിങ്കൾ മുതൽ ശനി വരെ (രാവിലെ 9:30 – വൈകുന്നേരം 6:30)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">റിട്ടേൺ പോളിസി കാണുക</Link>
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ಮರುಪಾವತಿ ನೀತಿ (Refund Policy)</h1>
                <p className="text-muted small mb-0">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ — ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ | ಕೊನೆಯ ನವೀಕರಣ: ಆಗಸ್ಟ್ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್‌ನಲ್ಲಿ, ಗ್ರಾಹಕರ ತೃಪ್ತಿ ಮತ್ತು ವಿಶ್ವಾಸ ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆಯಾಗಿದೆ. ನಿಮ್ಮ ಮರುಪಾವತಿ ಹಕ್ಕುಗಳು ಹಾಗೂ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ ನೀಡಲು ಈ ನೀತಿಯನ್ನು ರೂಪಿಸಲಾಗಿದೆ.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ಮರುಪಾವತಿ ಅರ್ಹತೆ — ಮರುಪಾವತಿ ಯಾವಾಗ ಅನ್ವಯಿಸುತ್ತದೆ?">
              <p>ಕೆಳಗಿನ ಸಂದರ್ಭಗಳಲ್ಲಿ ನೀವು ಪೂರ್ಣ ಅಥವಾ ಭಾಗಶಃ ಮರುಪಾವತಿಗೆ ಅರ್ಹರಾಗಿರುತ್ತೀರಿ:</p>
              <ul>
                <li><strong>ಆರ್ಡರ್ ರದ್ದತಿ:</strong> ಉತ್ಪನ್ನ ರವಾನೆಯಾಗುವ ಮುನ್ನವೇ (before dispatch) ಆರ್ಡರ್ ರದ್ದುಗೊಳಿಸಿದರೆ 100% ಮರುಪಾವತಿ ಲಭ್ಯ.</li>
                <li><strong>ಹಾನಿಗೊಳಗಾದ ಅಥವಾ ದೋಷಯುಕ್ತ ಉತ್ಪನ್ನಗಳು:</strong> ಡೆಲಿವರಿ ಸಮಯದಲ್ಲಿ ಹಾನಿಯಾಗಿದೆ ಎಂದು ದೃಢಪಟ್ಟು, 24–48 ಗಂಟೆಗಳಲ್ಲಿ ಫೋಟೋ/ವೀಡಿಯೊ ಸಮೇತ ವರದಿ ಮಾಡಿದಾಗ.</li>
                <li><strong>ತಪ್ಪು ಉತ್ಪನ್ನ ವಿತರಣೆ:</strong> ಆರ್ಡರ್ ಮಾಡಿದ ಉತ್ಪನ್ನಕ್ಕಿಂತ ಭಿನ್ನವಾದ ಉತ್ಪನ್ನ ತಲುಪಿದಾಗ.</li>
                <li><strong>ಸಾರಿಗೆಯಲ್ಲಿ ಕಳೆದುಹೋದ ಪಾರ್ಸೆಲ್:</strong> ಕೊರಿಯರ್ ಪಾಲುದಾರರು ಪಾರ್ಸೆಲ್ ಕಳೆದುಹೋಗಿದೆ ಎಂದು ಅಧಿಕೃತವಾಗಿ ದೃಢಪಡಿಸಿದರೆ.</li>
                <li><strong>ಸ್ಟಾಕ್ ಲಭ್ಯವಿಲ್ಲದಿರುವುದು:</strong> ಆರ್ಡರ್ ಸ್ವೀಕರಿಸಿದ ನಂತರ ಉತ್ಪನ್ನ ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ ಪೂರ್ಣ ಮೊತ್ತವನ್ನು ತಕ್ಷಣ ಮರುಪಾವತಿಸಲಾಗುತ್ತದೆ.</li>
              </ul>
            </Section>

            <Section title="2. ಮರುಪಾವತಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮೋದನೆ">
              <p>ರಿಟರ್ನ್ ಆದ ಉತ್ಪನ್ನ ನಮ್ಮ ಗೋದಾಮಿಗೆ ತಲುಪಿದ ನಂತರ, ನಮ್ಮ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ತಂಡವು ಅದನ್ನು <strong>2–3 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ</strong> ತಪಾಸಣೆ ಮಾಡುತ್ತದೆ. ತಪಾಸಣೆಯ ನಂತರ ನಿಮ್ಮ ಮರುಪಾವತಿಯ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಇಮೇಲ್ ಅಥವಾ SMS ಮೂಲಕ ತಿಳಿಸಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="3. ಮರುಪಾವತಿ ವಿಧಾನಗಳು ಮತ್ತು ಸಮಯ ಮಿತಿ">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>ಪಾವತಿ ವಿಧಾನ</th>
                      <th>ಮರುಪಾವತಿ ಮಾಧ್ಯಮ</th>
                      <th>ಸಮಯ ಮಿತಿ (ಅನುಮೋದನೆಯ ನಂತರ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>ಮೂಲ UPI ಖಾತೆ / VPA</td>
                      <td>2 ರಿಂದ 4 ಕೆಲಸದ ದಿನಗಳು</td>
                    </tr>
                    <tr>
                      <td>ಕ್ರೆಡಿಟ್ / ಡೆಬಿಟ್ ಕಾರ್ಡ್</td>
                      <td>ಸಂಬಂಧಿತ ಬ್ಯಾಂಕ್ ಕಾರ್ಡ್ ಖಾತೆ</td>
                      <td>5 ರಿಂದ 7 ಕೆಲಸದ ದಿನಗಳು</td>
                    </tr>
                    <tr>
                      <td>ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್</td>
                      <td>ಮೂಲ ಬ್ಯಾಂಕ್ ಖಾತೆ</td>
                      <td>5 ರಿಂದ 7 ಕೆಲಸದ ದಿನಗಳು</td>
                    </tr>
                    <tr>
                      <td>ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ (COD)</td>
                      <td>ಗ್ರಾಹಕರು ಒದಗಿಸಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ (NEFT/IMPS) ಅಥವಾ UPI</td>
                      <td>3 ರಿಂದ 5 ಕೆಲಸದ ದಿನಗಳು</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">ಗಮನಿಸಿ: ಬ್ಯಾಂಕ್ ರಜಾದಿನಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್‌ಗಳ ಆಂತರಿಕ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅವಲಂಬಿಸಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಜಮೆಯಾಗಲು ಹೆಚ್ಚುವರಿ 1–2 ದಿನಗಳು ಬೇಕಾಗಬಹುದು.</p>
            </Section>

            <Section title="4. ಮರುಪಾವತಿಸಲಾಗದ ಸಂದರ್ಭಗಳು (Non-Refundable)">
              <ul>
                <li>ಸೀಲ್ ತೆರೆದ ಅಥವಾ ಬಳಸಲಾದ ಆಹಾರ ಪದಾರ್ಥಗಳು.</li>
                <li>ಡೆಲಿವರಿ ಆದ 48 ಗಂಟೆಗಳ ನಂತರ ಸೂಕ್ತ ಪುರಾವೆಗಳಿಲ್ಲದೆ ಮಾಡಿದ ಹಾನಿಯ ದೂರುಗಳು.</li>
                <li>ಗ್ರಾಹಕರು ನೀಡಿದ ತಪ್ಪು ವಿಳಾಸ ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆಯಿಂದಾಗಿ ಡೆಲಿವರಿ ವಿಫಲವಾದರೆ (ಶಿಪ್ಪಿಂಗ್ ಶುಲ್ಕ ಕಡಿತಗೊಳಿಸಲಾಗುತ್ತದೆ).</li>
                <li>ವೈಯಕ್ತಿಕ ಇಷ್ಟ ಅಥವಾ ರುಚಿಯ ಆದ್ಯತೆಯ ಕಾರಣಕ್ಕಾಗಿ ಮಾಡಿದ ವಿನಂತಿಗಳು.</li>
              </ul>
            </Section>

            <Section title="5. ವಿಳಂಬವಾದ ಅಥವಾ ಕಾಣೆಯಾದ ಮರುಪಾವತಿಗಳು">
              <p>ಮರುಪಾವತಿ ಅನುಮೋದನೆಯಾಗಿಯೂ ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಬರದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ:</p>
              <ol>
                <li>ಮೊದಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಅಥವಾ UPI ಅಪ್ಲಿಕೇಶನ್ ಹಿಸ್ಟರಿ ಪರಿಶೀಲಿಸಿ.</li>
                <li>ನಿಮ್ಮ ಕಾರ್ಡ್ ನೀಡಿದ ಬ್ಯಾಂಕ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ; ಕೆಲವೊಮ್ಮೆ ಹಣ ಜಮೆಯಾಗಲು ತಾಂತ್ರಿಕ ಸಮಯ ಬೇಕಾಗುತ್ತದೆ.</li>
                <li>ಇದಾದ ನಂತರವೂ ಹಣ ಬರದಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆರ್ಡರ್ ವಿವರಗಳೊಂದಿಗೆ <strong>support@vinnavar.com</strong> ಗೆ ಇಮೇಲ್ ಮಾಡಿ ಅಥವಾ <strong>+91 94441 83387</strong> ಗೆ ಕರೆ ಮಾಡಿ.</li>
              </ol>
            </Section>

            <Section title="6. ಆರ್ಡರ್ ರದ್ದತಿ ನೀತಿ (Order Cancellation)">
              <p>ಉತ್ಪನ್ನ ನಮ್ಮ ಗೋದಾಮಿನಿಂದ ರವಾನೆಯಾಗುವ ಮೊದಲು (before dispatch) ನೀವು ನಿಮ್ಮ ಆರ್ಡರ್ ಅನ್ನು ಉಚಿತವಾಗಿ ರದ್ದುಗೊಳಿಸಬಹುದು. ರವಾನೆಯಾದ ನಂತರ ರದ್ದತಿ ಸಾಧ್ಯವಿಲ್ಲ; ಅಂತಹ ಸಂದರ್ಭಗಳಲ್ಲಿ ಡೆಲಿವರಿ ನಂತರ ರಿಟರ್ನ್ ನೀತಿ ಅನ್ವಯಿಸುತ್ತದೆ.</p>
            </Section>

            <Section title="7. ಗ್ರಾಹಕ ಬೆಂಬಲ & ಸಂಪರ್ಕ">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ಕಂಪನಿ:</strong> ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ (ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್)</p>
                <p className="mb-1"><strong>ಇಮೇಲ್:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ಫೋನ್ / ವಾಟ್ಸಾಪ್:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ಸಮಯ:</strong> ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ (ಬೆಳಗ್ಗೆ 9:30 – ಸಂಜೆ 6:30)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">ರಿಟರ್ನ್ ನೀತಿ ನೋಡಿ</Link>
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
                <i className="fa fa-money text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>రీఫండ్ పాలసీ (Refund Policy)</h1>
                <p className="text-muted small mb-0">విన్నవర్ ఆర్గానిక్స్ — ఎల్పీ ట్రేడర్స్ | చివరి నవీకరణ: ఆగస్టు 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">విన్నవర్ ఆర్గానిక్స్ వద్ద, మీ నమ్మకం మరియు సంతృప్తి మాకు అత్యంత ప్రాధాన్యత. మీ రీఫండ్ హక్కులు మరియు రీఫండ్ ప్రక్రియ గురించి పూర్తి పారదర్శకత అందించడానికి ఈ రీఫండ్ విధానం రూపొందించబడింది.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. రీఫండ్ అర్హత — రీఫండ్ ఎప్పుడు వర్తిస్తుంది?">
              <p>కింది పరిస్థితులలో మీరు పూర్తి లేదా పాక్షిక రీఫండ్‌కు అర్హులు:</p>
              <ul>
                <li><strong>ఆర్డర్ రద్దు:</strong> ఉత్పత్తి రవాణాకు పంపబడక ముందే (before dispatch) ఆర్డర్ రద్దు చేయబడితే 100% రీఫండ్ లభిస్తుంది.</li>
                <li><strong>దెబ్బతిన్న లేదా లోపభూయిష్ట ఉత్పత్తులు:</strong> డెలివరీ సమయంలో దెబ్బతిన్నట్లు ధృవీకరించబడి, 24–48 గంటల్లో ఫోటోలు/వీడియోలతో తెలియజేసినప్పుడు.</li>
                <li><strong>తప్పు ఉత్పత్తి డెలివరీ:</strong> మీకు ఆర్డర్ చేసిన వస్తువు కాకుండా వేరే వస్తువు పంపబడితే.</li>
                <li><strong>రవాణాలో కోల్పోయిన పార్శిల్:</strong> కొరియర్ భాగస్వామి ద్వారా పార్శిల్ పోయినట్లు అధికారికంగా నిర్ధారించబడితే.</li>
                <li><strong>స్టాక్ లేకపోవడం:</strong> ఆర్డర్ చేసిన తర్వాత ఉత్పత్తి అందుబాటులో లేకపోతే పూర్తి మొత్తం వెంటనే రీఫండ్ చేయబడుతుంది.</li>
              </ul>
            </Section>

            <Section title="2. రీఫండ్ ఆమోద ప్రక్రియ">
              <p>రిటర్న్ చేయబడిన ఉత్పత్తి మా గిడ్డంగికి చేరిన తర్వాత, మా నాణ్యతా నియంత్రణ బృందం దానిని <strong>2–3 పని దినాలలో</strong> తనిఖీ చేస్తుంది. తనిఖీ ముగిసిన వెంటనే, మీ రీఫండ్ స్థితి (ఆమోదించబడిందా లేదా తిరస్కరించబడిందా) గురించి ఇమెయిల్ లేదా SMS ద్వారా మీకు సమాచారం అందుతుంది.</p>
            </Section>

            <Section title="3. రీఫండ్ చెల్లింపు విధానాలు మరియు సమయాలు">
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>చెల్లింపు విధానం</th>
                      <th>రీఫండ్ పద్ధతి</th>
                      <th>సమయ పరిమితి (ఆమోదం తర్వాత)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>UPI (Google Pay, PhonePe, Paytm)</td>
                      <td>అసలు UPI ఖాతా లేదా VPA</td>
                      <td>2 నుండి 4 పని దినాలు</td>
                    </tr>
                    <tr>
                      <td>క్రెడిట్ / డెబిట్ కార్డ్</td>
                      <td>సంబంధిత బ్యాంక్ కార్డు ఖాతా</td>
                      <td>5 నుండి 7 పని దినాలు</td>
                    </tr>
                    <tr>
                      <td>నెట్ బ్యాంకింగ్</td>
                      <td>అసలు బ్యాంక్ ఖాతా</td>
                      <td>5 నుండి 7 పని దినాలు</td>
                    </tr>
                    <tr>
                      <td>క్యాష్ ఆన్ డెలివరీ (COD)</td>
                      <td>కస్టమర్ అందించిన బ్యాంక్ ఖాతా (NEFT/IMPS) లేదా UPI</td>
                      <td>3 నుండి 5 పని దినాలు</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="small text-muted">గమనిక: బ్యాంక్ సెలవులు మరియు సంబంధిత బ్యాంకుల అంతర్గత ప్రాసెసింగ్ సమయాన్ని బట్టి మీ ఖాతాలో నగదు జమ కావడానికి అదనంగా 1–2 రోజులు పట్టవచ్చు.</p>
            </Section>

            <Section title="4. రీఫండ్ చేయబడని సందర్భాలు (Non-Refundable)">
              <ul>
                <li>సీల్ తెరిచిన లేదా ఉపయోగించిన ఆహార మరియు సౌందర్య ఉత్పత్తులు.</li>
                <li>డెలివరీ అయిన 48 గంటల తర్వాత ఎటువంటి ఆధారాలు లేకుండా చేసిన నష్టపరిహార ఫిర్యాదులు.</li>
                <li>కస్టమర్ తప్పు చిరునామా లేదా సంప్రదింపు నంబర్ ఇవ్వడం వలన డెలివరీ విఫలమైతే (షిప్పింగ్ ఛార్జీలు మినహాయించబడతాయి).</li>
                <li>వ్యక్తిగత అభిరుచి, రుచి లేదా రంగు ప్రాధాన్యత కారణంగా చేసిన అభ్యర్థనలు.</li>
              </ul>
            </Section>

            <Section title="5. ఆలస్యమైన లేదా రాని రీఫండ్లు">
              <p>మీకు రీఫండ్ ఆమోదించబడి నిర్ణీత గడువులోగా రాని పక్షంలో, దయచేసి కింది దశలను అనుసరించండి:</p>
              <ol>
                <li>ముందుగా మీ బ్యాంక్ స్టేట్‌మెంట్ లేదా UPI యాప్ హిస్టరీని మరొకసారి తనిఖీ చేయండి.</li>
                <li>మీ క్రెడిట్/డెబిట్ కార్డు జారీ చేసిన బ్యాంకును సంప్రదించండి; కొన్నిసార్లు నగదు కనిపించడానికి సమయం పడుతుంది.</li>
                <li>ఇవన్నీ చేసినప్పటికీ మీకు రీఫండ్ అందకపోతే, దయచేసి మీ ఆర్డర్ వివరాలతో <strong>support@vinnavar.com</strong> కు ఇమెయిల్ చేయండి లేదా <strong>+91 94441 83387</strong> కు సంప్రదించండి.</li>
              </ol>
            </Section>

            <Section title="6. ఆర్డర్ రద్దు విధానం (Order Cancellation)">
              <p>మీరు ఆర్డర్ చేసిన తర్వాత, ఉత్పత్తి మా గిడ్డంగి నుండి రవాణాకు పంపబడనంతవరకు (before dispatch) ఉచితంగా రద్దు చేసుకోవచ్చు. డిస్పాచ్ అయిన తర్వాత రద్దు అభ్యర్థనలు ఆమోదించబడవు; అటువంటి సందర్భాలలో డెలివరీ తర్వాత రిటర్న్ పాలసీ వర్తిస్తుంది.</p>
            </Section>

            <Section title="7. కస్టమర్ సపోర్ట్ & సంప్రదింపులు">
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>కంపెనీ:</strong> విన్నవర్ ఆర్గానిక్స్ (ఎల్పీ ట్రేడర్స్)</p>
                <p className="mb-1"><strong>ఇమెయిల్:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ఫోన్ / వాట్సాప్:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>సమయం:</strong> సోమవారం నుండి శనివారం వరకు (ఉదయం 9:30 – సాయంత్రం 6:30)</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/return-policy" className="btn btn-outline-success btn-sm">రిటర్న్ పాలసీ చూడండి</Link>
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
                <i className="fa fa-rupee-sign text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>रिफंड नीति (Refund Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑर्गेनिक्स — एलपी ट्रेडर्स | अंतिम अद्यतन: अगस्त 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">यह रिफंड नीति बताती है कि <strong>एलपी ट्रेडर्स (विन्नवर ऑर्गेनिक्स)</strong> द्वारा ग्राहकों को कब और कैसे रिफंड प्रदान किया जाता है। सभी वैध दावों का निपटारा भारतीय उपभोक्ता संरक्षण कानूनों के तहत समयबद्ध और पारदर्शी तरीके से किया जाता है।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. हमारी रिफंड प्रतिबद्धता">
              <p>विन्नवर ऑर्गेनिक्स में, हम अपने उत्पादों की शुद्धता और गुणवत्ता पर पूरा भरोसा रखते हैं। हमारी ओर से किसी भी त्रुटि या गुणवत्ता में कमी के वास्तविक मामलों में हम बिना किसी अनावश्यक देरी के पूरा रिफंड संसाधित करते हैं।</p>
            </Section>

            <Section title="2. रिफंड की शर्तें व समय सीमा">
              <div className="table-responsive">
                <table className="table table-bordered table-sm small rounded-3 overflow-hidden">
                  <thead className="table-success">
                    <tr>
                      <th>कारण</th>
                      <th>रिफंड प्रकार</th>
                      <th>प्रसंस्करण समय</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>गलत उत्पाद डिलीवर हुआ</td><td>पूर्ण रिफंड या रिप्लेसमेंट</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>डिलीवरी पर उत्पाद क्षतिग्रस्त मिला</td><td>पूर्ण रिफंड या रिप्लेसमेंट</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>एक्सपायर्ड उत्पाद डिलीवर हुआ</td><td>पूर्ण रिफंड</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>गुणवत्ता दोष (फफूंद, दुर्गंध)</td><td>पूर्ण रिफंड या रिप्लेसमेंट</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>ऑर्डर से उत्पाद गायब होना</td><td>गायब वस्तु का आंशिक रिफंड</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>डिस्पैच से पहले रद्द किया गया ऑर्डर</td><td>पूर्ण रिफंड</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>दोहरा भुगतान (Double charge)</td><td>अतिरिक्त राशि की तुरंत वापसी</td><td>3–5 कार्य दिवस</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="3. भुगतान माध्यम अनुसार बैंक समय सीमा">
              <div className="border rounded-3 overflow-hidden">
                <table className="table table-sm small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>भुगतान का माध्यम</th>
                      <th>रिफंड समय सीमा (शुरू होने के बाद)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>UPI (GPay, PhonePe, Paytm, BHIM)</td><td>1–3 कार्य दिवस</td></tr>
                    <tr><td>क्रेडिट कार्ड (Visa, Mastercard)</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>डेबिट कार्ड (सभी बैंक)</td><td>5–7 कार्य दिवस</td></tr>
                    <tr><td>नेट बैंकिंग</td><td>3–5 कार्य दिवस</td></tr>
                    <tr><td>RuPay कार्ड</td><td>3–7 कार्य दिवस</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. मूल भुगतान स्रोत (Original Payment Source)">
              <p>रिफंड हमेशा उसी <strong>मूल स्रोत</strong> में भेजा जाता है जिससे भुगतान किया गया था (उदा. उसी UPI आईडी या कार्ड में)।</p>
            </Section>

            <Section title="5. संपर्क जानकारी">
              <div className="border rounded-3 p-3 bg-light">
                <p className="mb-1"><strong>ईमेल:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-1"><strong>विषय:</strong> "Refund Request — Order #[ऑर्डर नंबर]"</p>
                <p className="mb-0"><strong>पता:</strong> #16, एमएस नगर फेज 2, कुरुमंथंगल रोड, कुन्नात्तूर, अरणी, तमिलनाडु – 632314</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">नियम और शर्तें</Link>
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">गोपनीयता नीति</Link>
              <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">वापसी नीति</Link>
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
                <i className="fa fa-rupee-sign text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>பணத்திரும்ப நிதி (Refund Policy)</h1>
                <p className="text-muted small mb-0">விண்ணவர் ஆர்கானிக்ஸ் — LP டிரேடர்ஸ் | கடைசியாக புதுப்பிக்கப்பட்டது: ஆகஸ்ட் 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">இந்த பணத்திரும்ப நிதி கொள்கை, <strong>LP Traders (விண்ணவர் ஆர்கானிக்ஸ்)</strong> வாடிக்கையாளர்களுக்கு எப்போது மற்றும் எவ்வாறு பணத்தைத் திரும்ப வழங்குகிறது என்பதை விளக்குகிறது. அனைத்து நியாயமான பணத்திரும்பக் கோரிக்கைகளும் இந்திய நுகர்வோர் பாதுகாப்புச் சட்டங்களுக்கு இணங்க விரைவாகவும் வெளிப்படையாகவும் தீர்க்கப்படும்.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. எங்களின் பணத்திரும்ப உறுதிப்பாடு">
              <p>விண்ணவர் ஆர்கானிக்ஸில், எங்கள் தயாரிப்புகளின் தரத்திற்கு நாங்கள் முழு உத்தரவாதம் அளிக்கிறோம். எங்கள் தரப்பில் ஏதேனும் பிழை அல்லது தரக்குறைபாடு ஏற்பட்டால், உண்மையான வழக்குகளில் எந்தவித தேவையற்ற தாமதமும் இன்றி நாங்கள் பணத்தை முழுமையாகத் திருப்பித் தருகிறோம்.</p>
            </Section>

            <Section title="2. பணத்தைத் திரும்பப் பெறுவதற்கான சூழ்நிலைகள்">
              <p>பின்வரும் சூழ்நிலைகளில் முழு அல்லது பகுதி ரீதியான பணத்திரும்பைப் பெற உங்களுக்கு உரிமை உண்டு:</p>
              <div className="table-responsive">
                <table className="table table-bordered table-sm small rounded-3 overflow-hidden">
                  <thead className="table-success">
                    <tr>
                      <th>காரணம்</th>
                      <th>திரும்பப் பெறும் வகை</th>
                      <th>செயலாக்க காலம்</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>தவறான தயாரிப்பு வழங்கப்பட்டது</td>
                      <td>முழுப் பணம் அல்லது மாற்றுப் பொருள்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>டெலிவரியின் போது தயாரிப்பு சேதமடைந்தது</td>
                      <td>முழுப் பணம் அல்லது மாற்றுப் பொருள்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>காலாவதியான தயாரிப்பு வழங்கப்பட்டது</td>
                      <td>முழுப் பணம் திரும்பப் பெறுதல்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>தயாரிப்பு தரக் குறைபாடு (பூஞ்சை, துர்நாற்றம்)</td>
                      <td>முழுப் பணம் அல்லது மாற்றுப் பொருள்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>ஆர்டரில் பொருள் விடுபட்டிருந்தால்</td>
                      <td>விடுபட்ட பொருளுக்கான பகுதிப் பணம்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>பார்சல் அனுப்பப்படுவதற்கு முன் ஆர்டர் ரத்து செய்யப்பட்டது</td>
                      <td>முழுப் பணம் திரும்பப் பெறுதல்</td>
                      <td>5–7 வணிக நாட்கள்</td>
                    </tr>
                    <tr>
                      <td>இரட்டை கட்டணம் / தவறுதலாக இரண்டு முறை பணம் பிடித்தல்</td>
                      <td>கூடுதல் தொகை உடனடியாகத் திரும்ப வழங்கப்படும்</td>
                      <td>3–5 வணிக நாட்கள்</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="3. பணம் திரும்பப் பெற முடியாத சூழ்நிலைகள்">
              <p>பின்வரும் சந்தர்ப்பங்களில் பணம் திரும்பப் பெறப்பட <strong>மாட்டாது</strong>:</p>
              <ul>
                <li>தயாரிப்பைப் பிரித்து அல்லது பயன்படுத்திய பிறகு மனம் மாறுவது</li>
                <li>பாரம்பரிய இயற்கை உணவுப் பொருட்களின் இயற்கை சுவை, நிறம் அல்லது நறுமணம் பிடிக்கவில்லை என்று கூறுவது</li>
                <li>7 நாட்கள் கால அவகாசம் முடிந்த பிறகு வைக்கப்படும் கோரிக்கைகள்</li>
                <li>முறையற்ற சேமிப்பு காரணமாக வாடிக்கையாளரால் கெட்டுப்போன பொருட்கள்</li>
                <li>வாடிக்கையாளர் தவறான டெலிவரி முகவரியை வழங்கிய சூழ்நிலைகள்</li>
              </ul>
            </Section>

            <Section title="4. பணத்திரும்பை எவ்வாறு கோருவது?">
              <ol>
                <li className="mb-2"><strong>ஆதாரங்களைச் சேகரிக்கவும்:</strong> சேதமடைந்த பேக்கிங், பேட்ச் எண் மற்றும் தயாரிப்புக் குறைபாடு தெளிவாகத் தெரியும் வகையில் புகைப்படம் எடுக்கவும்.</li>
                <li className="mb-2"><strong>மின்னஞ்சல் அனுப்பவும்:</strong> <em>"Refund Request — Order #[உங்கள் ஆர்டர் எண்]"</em> என்ற தலைப்புடன் <strong>vinnavarbrand@gmail.com</strong> முகவரிக்கு மின்னஞ்சல் அனுப்பவும்.</li>
                <li className="mb-2"><strong>விவரங்களை வழங்கவும்:</strong> உங்கள் முழு பெயர், ஆர்டர் எண், பதிவு செய்யப்பட்ட தொலைபேசி எண் மற்றும் காரணத்தைக் குறிப்பிடவும்.</li>
                <li className="mb-2"><strong>பரிசீலனை:</strong> எங்கள் குழு <strong>2–3 வணிக நாட்களுக்குள்</strong> உங்கள் கோரிக்கையை ஆய்வு செய்து முடிவை அறிவிக்கும்.</li>
                <li className="mb-2"><strong>பணம் வரவு வைத்தல்:</strong> ஒப்புதல் அளிக்கப்பட்டவுடன், பணம் உடனடியாக உங்கள் அசல் கணக்கிற்குத் திருப்பி அனுப்பப்படும்.</li>
              </ol>
            </Section>

            <Section title="5. கட்டண முறைகளின்படி வங்கி செயலாக்கக் கால அவகாசம்">
              <div className="border rounded-3 overflow-hidden">
                <table className="table table-sm small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>கட்டண முறை</th>
                      <th>வரவு வைக்கப்படும் காலம் (ஒப்புதலுக்குப் பிறகு)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>UPI (GPay, PhonePe, Paytm, BHIM)</td><td>1–3 வணிக நாட்கள்</td></tr>
                    <tr><td>கிரெடிட் கார்டு (Visa, Mastercard)</td><td>5–7 வணிக நாட்கள்</td></tr>
                    <tr><td>டெபிட் கார்டு (அனைத்து வங்கிகள்)</td><td>5–7 வணிக நாட்கள்</td></tr>
                    <tr><td>நெட் பேங்கிங்</td><td>3–5 வணிக நாட்கள்</td></tr>
                    <tr><td>RuPay கார்டு</td><td>3–7 வணிக நாட்கள்</td></tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="6. திரும்பச் செலுத்தும் முறை (Original Payment Source)">
              <p>பணம் எப்பொழுதும் பொருட்கள் வாங்குவதற்குப் பயன்படுத்திய <strong>அசல் கட்டண முறைக்கே (Original Source)</strong> நேரடியாகத் திருப்பி அனுப்பப்படும் (UPI மூலமாகச் செலுத்தினால் அதே UPI கணக்கிற்கும், கார்டு மூலம் செலுத்தினால் அதே கார்டிற்கும்).</p>
            </Section>

            <Section title="7. தொடர்பு விவரங்கள்">
              <div className="border rounded-3 p-3 bg-light">
                <p className="mb-1"><strong>மின்னஞ்சல்:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-1"><strong>தலைப்பு:</strong> "Refund Request — Order #[ஆர்டர் எண்]"</p>
                <p className="mb-0"><strong>முகவரி:</strong> #16, MS நகர் ஃபேஸ் 2, குருமந்தாங்கல் ரோடு, குன்னத்தூர், ஆரணி, தமிழ்நாடு – 632314</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">விதிமுறைகள் &amp; நிபந்தனைகள்</Link>
              <Link to="/privacy-policy" className="btn btn-outline-success btn-sm rounded-pill">தனியுரிமைக் கொள்கை</Link>
              <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">திரும்பப்பெறும் கொள்கை</Link>
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
                  <tr><td>Wrong product delivered</td><td>Full refund or replacement</td><td>5–7 business days</td></tr>
                  <tr><td>Product damaged / tampered upon delivery</td><td>Full refund or replacement</td><td>5–7 business days</td></tr>
                  <tr><td>Expired product delivered</td><td>Full refund</td><td>5–7 business days</td></tr>
                  <tr><td>Product quality defect (contamination, mold, foul odor)</td><td>Full refund or replacement</td><td>5–7 business days</td></tr>
                  <tr><td>Missing items from order</td><td>Partial refund for missing items</td><td>5–7 business days</td></tr>
                  <tr><td>Order cancelled before dispatch</td><td>Full refund</td><td>5–7 business days</td></tr>
                  <tr><td>Double payment / duplicate charge</td><td>Excess amount refunded</td><td>3–5 business days</td></tr>
                  <tr><td>Payment failure with amount debited</td><td>Full refund</td><td>5–7 business days (bank dependent)</td></tr>
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="3. Refund Processing Timelines">
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
          </Section>
          <Section title="4. Contact Us">
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
