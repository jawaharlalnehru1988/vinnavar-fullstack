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

const PrivacyPolicy = () => {
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ਗੋਪਨੀਯਤਾ ਨੀਤੀ (Privacy Policy)</h1>
                <p className="text-muted small mb-0">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ — ਐਲਪੀ ਟਰੇਡਰਜ਼ | ਆਖਰੀ ਅਪਡੇਟ: ਅਗਸਤ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ ਵਿੱਚ, ਤੁਹਾਡੀ ਗੋਪਨੀਯਤਾ ਦੀ ਰੱਖਿਆ ਕਰਨਾ ਸਾਡੀ ਪ੍ਰਮੁੱਖ ਤਰਜੀਹ ਹੈ। ਡਿਜੀਟਲ ਪਰਸਨਲ ਡਾਟਾ ਪ੍ਰੋਟੈਕਸ਼ਨ ਐਕਟ, 2023 (DPDPA) ਅਤੇ ਭਾਰਤੀ ਕਾਨੂੰਨਾਂ ਅਨੁਸਾਰ ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਕਿਵੇਂ ਇਕੱਠੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਰੱਖਦੇ ਹਾਂ, ਉਸਦਾ ਵੇਰਵਾ ਇੱਥੇ ਦਿੱਤਾ ਗਿਆ ਹੈ।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ਇਕੱਠੀ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਜਾਣਕਾਰੀ (Information We Collect)">
              <p>ਸੇਵਾਵਾਂ ਪ੍ਰਦਾਨ ਕਰਨ ਦੇ ਉਦੇਸ਼ ਨਾਲ ਅਸੀਂ ਹੇਠ ਲਿਖੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰ ਸਕਦੇ ਹਾਂ:</p>
              <ul>
                <li><strong>ਨਿੱਜੀ ਜਾਣਕਾਰੀ:</strong> ਨਾਮ, ਈਮੇਲ ਪਤਾ, ਮੋਬਾਈਲ ਨੰਬਰ।</li>
                <li><strong>ਡਿਲੀਵਰੀ ਅਤੇ ਬਿਲਿੰਗ ਵੇਰਵੇ:</strong> ਪਤਾ, ਸ਼ਹਿਰ, ਰਾਜ, ਪਿੰਨਕੋਡ।</li>
                <li><strong>ਲੈਣ-ਦੇਣ ਵੇਰਵੇ:</strong> ਖਰੀਦੇ ਗਏ ਉਤਪਾਦ, ਰਕਮ, ਮਿਤੀ, ਭੁਗਤਾਨ ਆਈਡੀ।</li>
                <li><strong>ਤਕਨੀਕੀ ਜਾਣਕਾਰੀ:</strong> ਆਈਪੀ ਪਤਾ, ਬ੍ਰਾਊਜ਼ਰ ਕਿਸਮ, ਦੇਖੇ ਗਏ ਪੰਨੇ।</li>
              </ul>
            </Section>

            <Section title="2. ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਦੇ ਉਦੇਸ਼">
              <p>ਇਕੱਠੀ ਕੀਤੀ ਜਾਣਕਾਰੀ ਸਿਰਫ਼ ਹੇਠ ਲਿਖੇ ਕੰਮਾਂ ਲਈ ਵਰਤੀ ਜਾਂਦੀ ਹੈ:</p>
              <ul>
                <li>ਤੁਹਾਡੇ ਆਰਡਰਾਂ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰਕੇ ਉਨ੍ਹਾਂ ਨੂੰ ਘਰ ਤੱਕ ਪਹੁੰਚਾਉਣਾ।</li>
                <li>ਡਿਲੀਵਰੀ ਅਪਡੇਟਸ ਐਸਐਮਐਸ ਜਾਂ ਵਟਸਐਪ 'ਤੇ ਭੇਜਣਾ।</li>
                <li>ਗਾਹਕ ਸੇਵਾ ਅਤੇ ਸ਼ਿਕਾਇਤਾਂ ਦਾ ਨਿਪਟਾਰਾ ਕਰਨਾ।</li>
                <li>ਕਾਨੂੰਨੀ ਅਤੇ ਟੈਕਸ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰਨਾ।</li>
              </ul>
            </Section>

            <Section title="3. ਭੁਗਤਾਨ ਜਾਣਕਾਰੀ ਦੀ ਸੁਰੱਖਿਆ (Payment Security)">
              <p>ਅਸੀਂ ਕੋਈ ਵੀ ਕ੍ਰੈਡਿਟ/ਡੈਬਿਟ ਕਾਰਡ ਨੰਬਰ ਜਾਂ ਬੈਂਕ ਪਾਸਵਰਡ ਆਪਣੇ ਸਰਵਰਾਂ 'ਤੇ ਸਟੋਰ ਨਹੀਂ ਕਰਦੇ। ਸਾਰੇ ਭੁਗਤਾਨ PCI-DSS ਪ੍ਰਮਾਣਿਤ ਸੁਰੱਖਿਅਤ <strong>Razorpay</strong> ਪੇਮੈਂਟ ਗੇਟਵੇ ਰਾਹੀਂ ਇਨਕ੍ਰਿਪਟ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।</p>
            </Section>

            <Section title="4. ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਨਾ (Data Sharing)">
              <p>ਅਸੀਂ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਕਿਸੇ ਵੀ ਇਸ਼ਤਿਹਾਰ ਕੰਪਨੀ ਨੂੰ ਨਹੀਂ ਵੇਚਦੇ। ਸਿਰਫ਼ ਪਾਰਸਲ ਪਹੁੰਚਾਉਣ ਲਈ ਅਧਿਕਾਰਤ ਕੋਰੀਅਰ ਭਾਈਵਾਲਾਂ ਨਾਲ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।</p>
            </Section>

            <Section title="5. ਕੂਕੀਜ਼ ਨੀਤੀ (Cookies Policy)">
              <p>ਲੌਗਇਨ ਸੈਸ਼ਨ ਅਤੇ ਕਾਰਟ ਦੀਆਂ ਵਸਤਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ ਲਈ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਤੁਸੀਂ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਰਾਹੀਂ ਕੂਕੀਜ਼ ਨੂੰ ਕੰਟਰੋਲ ਕਰ ਸਕਦੇ ਹੋ।</p>
            </Section>

            <Section title="6. ਤੁਹਾਡੇ ਅਧਿਕਾਰ (DPDPA 2023 ਅਧੀਨ)">
              <p>ਗਾਹਕਾਂ ਕੋਲ ਆਪਣਾ ਨਿੱਜੀ ਡਾਟਾ ਦੇਖਣ, ਸੋਧਣ ਜਾਂ ਲੋੜ ਪੈਣ 'ਤੇ ਮਿਟਾਉਣ ਦੀ ਬੇਨਤੀ ਕਰਨ ਦਾ ਕਾਨੂੰਨੀ ਅਧਿਕਾਰ ਹੈ।</p>
            </Section>

            <Section title="7. ਡਾਟਾ ਸੁਰੱਖਿਆ ਅਤੇ SSL ਇਨਕ੍ਰਿਪਸ਼ਨ">
              <p>ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ SSL 256-ਬਿੱਟ ਇਨਕ੍ਰਿਪਸ਼ਨ ਰਾਹੀਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸੁਰੱਖਿਅਤ ਰੱਖੀ ਜਾਂਦੀ ਹੈ।</p>
            </Section>

            <Section title="8. ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਅਧਿਕਾਰੀ (Grievance Officer)">
              <p>ਗੋਪਨੀਯਤਾ ਸੰਬੰਧੀ ਕਿਸੇ ਵੀ ਸ਼ਿਕਾਇਤ ਲਈ ਸੰਪਰਕ ਕਰੋ:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਅਧਿਕਾਰੀ:</strong> ਲੀਗਲ ਅਤੇ ਕੰਪਲਾਇੰਸ ਵਿਭਾਗ</p>
                <p className="mb-1"><strong>ਕੰਪਨੀ:</strong> ਵਿੰਨਵਰ ਆਰਗੈਨਿਕਸ (ਐਲਪੀ ਟਰੇਡਰਜ਼)</p>
                <p className="mb-1"><strong>ਈਮੇਲ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ਫ਼ੋਨ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ਪਤਾ:</strong> ਚੇਨਈ, ਤਾਮਿਲਨਾਡੂ, ਭਾਰਤ</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ</Link>
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>गोपनीयता धोरण (Privacy Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑरगॅनिक्स — एलपी ट्रेडर्स | शेवटचे अपडेट: ऑगस्ट २०२५</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">विन्नवर ऑरगॅनिक्समध्ये, आपल्या गोपनीयतेचे रक्षण करणे आमची सर्वोच्च प्राथमिकता आहे. डिजिटल वैयक्तिक डेटा संरक्षण कायदा, २०२३ (DPDPA) आणि भारतीय कायद्यानुसार आम्ही आपली माहिती कशी गोळा आणि सुरक्षित ठेवतो याचे वर्णन येथे केले आहे.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. आम्ही गोळा करत असलेली माहिती (Information We Collect)">
              <p>सेवा पुरवण्याच्या उद्देशाने आम्ही खालील माहिती गोळा करू शकतो:</p>
              <ul>
                <li><strong>वैयक्तिक माहिती:</strong> नाव, ईमेल पत्ता, मोबाइल नंबर.</li>
                <li><strong>डिलिव्हरी आणि बिलिंग तपशील:</strong> पत्ता, शहर, राज्य, पिनकोड.</li>
                <li><strong>व्यवहार तपशील:</strong> खरेदी केलेली उत्पादने, रक्कम, तारीख, पेमेंट आयडी.</li>
                <li><strong>तांत्रिक माहिती:</strong> आयपी अॅड्रेस, ब्राउझर प्रकार, भेट दिलेली पृष्ठे.</li>
              </ul>
            </Section>

            <Section title="2. माहितीच्या वापराचे उद्दिष्ट">
              <p>गोळा केलेली माहिती केवळ खालील कारणांसाठी वापरली जाते:</p>
              <ul>
                <li>आपल्या ऑर्डर्सवर प्रक्रिया करून त्या घरपोच वितरीत करण्यासाठी.</li>
                <li>डिलिव्हरी अपडेट्स एसएमएस किंवा व्हॉट्सअॅपवर पाठवण्यासाठी.</li>
                <li>ग्राहक सेवा आणि तक्रारींचे निवारण करण्यासाठी.</li>
                <li>कायदेशीर आणि करविषयक नियमांचे पालन करण्यासाठी.</li>
              </ul>
            </Section>

            <Section title="3. पेमेंट माहितीची सुरक्षा (Payment Security)">
              <p>आम्ही कोणतेही क्रेडिट/डेबिट कार्ड नंबर किंवा बँक पासवर्ड आमच्या सर्व्हरवर साठवत नाही. सर्व पेमेंट PCI-DSS प्रमाणित सुरक्षित <strong>Razorpay</strong> पेमेंट गेटवेद्वारे एन्क्रिप्ट केले जातात.</p>
            </Section>

            <Section title="4. माहितीची देवाणघेवाण (Data Sharing)">
              <p>आम्ही आपली वैयक्तिक माहिती कोणत्याही जाहिरातदार कंपन्यांना विकत नाही. केवळ पार्सल पोहोचवण्यासाठी अधिकृत कुरिअर भागीदारांसोबत आवश्यक तेवढीच माहिती शेअर केली जाते.</p>
            </Section>

            <Section title="5. कुकीज धोरण (Cookies Policy)">
              <p>लॉगिन सत्र आणि कार्टमधील वस्तू लक्षात ठेवण्यासाठी कुकीजचा वापर केला जातो. आपण आपल्या ब्राउझर सेटिंग्जमधून कुकीज नियंत्रित करू शकता.</p>
            </Section>

            <Section title="6. आपले हक्क (DPDPA 2023 अंतर्गत)">
              <p>ग्राहकांना त्यांचा वैयक्तिक डेटा पाहण्याचा, दुरुस्त करण्याचा किंवा आवश्यक असल्यास हटवण्याची विनंती करण्याचा कायदेशीर अधिकार आहे.</p>
            </Section>

            <Section title="7. डेटा सुरक्षा आणि SSL एन्क्रिप्शन">
              <p>आपली माहिती SSL 256-बिट एन्क्रिप्शनद्वारे पूर्णपणे सुरक्षित ठेवली जाते.</p>
            </Section>

            <Section title="8. तक्रार निवारण अधिकारी (Grievance Officer)">
              <p>गोपनीयतेबाबत कोणत्याही तक्रारींसाठी संपर्क साधा:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>तक्रार निवारण अधिकारी:</strong> लीगल आणि कंप्लायन्स विभाग</p>
                <p className="mb-1"><strong>कंपनी:</strong> विन्नवर ऑरगॅनिक्स (एलपी ट्रेडर्स)</p>
                <p className="mb-1"><strong>ईमेल:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>फोन:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>पत्ता:</strong> चेन्नई, तामिळनाडू, भारत</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">नियम आणि अटी</Link>
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>গোপনীয়তা নীতি (Privacy Policy)</h1>
                <p className="text-muted small mb-0">ভিন্নভার অর্গানিকস — এলপি ট্রেডার্স | সর্বশেষ আপডেট: আগস্ট ২০২৫</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ভিন্নভার অর্গানিকসে, আপনার গোপনীয়তা রক্ষা করা আমাদের শীর্ষ দায়িত্ব। ডিজিটাল পার্সোনাল ডেটা প্রোটেকশন অ্যাক্ট, ২০২৩ (DPDPA) এবং ভারতীয় আইন মেনে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ ও সংরক্ষণ করি তা এখানে বর্ণিত হয়েছে।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. সংগৃহীত তথ্যাবলী (Information We Collect)">
              <p>সেবা প্রদানের উদ্দেশ্যে আমরা নিচের তথ্যসমূহ সংগ্রহ করতে পারি:</p>
              <ul>
                <li><strong>ব্যক্তিগত তথ্য:</strong> নাম, ইমেল ঠিকানা, মোবাইল নম্বর।</li>
                <li><strong>ডেলিভারি ও বিলিং তথ্য:</strong> ঠিকানা, শহর, রাজ্য, পিনকোড।</li>
                <li><strong>লেনদেন বিবরণী:</strong> ক্রয়কৃত পণ্য, পরিমাণ, তারিখ, পেমেন্ট আইডি।</li>
                <li><strong>প্রযুক্তিগত তথ্য:</strong> আইপি অ্যাড্রেস, ব্রাউজার টাইপ, পরিদর্শিত পেজ।</li>
              </ul>
            </Section>

            <Section title="2. তথ্য ব্যবহারের উদ্দেশ্য">
              <p>সংগৃহীত তথ্য কেবল নিচের উদ্দেশ্যে ব্যবহার করা হয়:</p>
              <ul>
                <li>আপনার অর্ডার প্রক্রিয়া এবং সরবরাহ সম্পন্ন করতে।</li>
                <li>ডেলিভারি আপডেট এসএমএস বা হোয়াটসঅ্যাপে পাঠাতে।</li>
                <li>কাস্টমার সার্ভিস এবং অভিযোগ নিষ্পত্তি করতে।</li>
                <li>আইনি ও ট্যাক্স নীতিমালা মেনে চলতে।</li>
              </ul>
            </Section>

            <Section title="3. পেমেন্ট তথ্যের নিরাপত্তা (Payment Security)">
              <p>আমরা কোনো ক্রেডিট/ডেবিট কার্ড নম্বর বা ব্যাংক পাসওয়ার্ড আমাদের সার্ভারে সংরক্ষণ করি না। সকল পেমেন্ট PCI-DSS সার্টিফাইড সুরক্ষিত <strong>Razorpay</strong> গেটওয়ের মাধ্যমে সম্পন্ন হয়।</p>
            </Section>

            <Section title="4. তথ্য ভাগাভাগি (Data Sharing)">
              <p>আমরা কোনো বিজ্ঞাপনদাতার কাছে আপনার ব্যক্তিগত তথ্য বিক্রি করি না। শুধুমাত্র পার্সেল ডেলিভারির জন্য প্রয়োজনীয় অনুমোদিত কুরিয়ার পার্টনারদের সাথে প্রয়োজনীয় তথ্য শেয়ার করা হয়।</p>
            </Section>

            <Section title="5. কুকিজ নীতি (Cookies Policy)">
              <p>লগইন সেশন ও কার্ট ডেটা সংরক্ষণের জন্য কুকিজ ব্যবহার করা হয়। আপনি চাইলে ব্রাউজারে কুকিজ নিয়ন্ত্রণ করতে পারেন।</p>
            </Section>

            <Section title="6. আপনার অধিকারসমূহ (DPDPA 2023 অনুযায়ী)">
              <p>গ্রাহকদের তাদের ব্যক্তিগত ডেটা দেখার, সংশোধনের বা প্রয়োজনে মুছে ফেলার অনুরোধ করার আইনি অধিকার রয়েছে।</p>
            </Section>

            <Section title="7. ডেটা নিরাপত্তা ও এনক্রিপশন">
              <p>আপনার তথ্য SSL 256-বিট এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত রাখা হয়।</p>
            </Section>

            <Section title="8. অভিযোগ নিষ্পত্তি কর্মকর্তা (Grievance Officer)">
              <p>গোপনীয়তা সংক্রান্ত বিষয়ে যোগাযোগের ঠিকানা:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>অভিযোগ নিষ্পত্তি কর্মকর্তা:</strong> লিগ্যাল ও কমপ্লায়েন্স বিভাগ</p>
                <p className="mb-1"><strong>কোম্পানি:</strong> ভিন্নভার অর্গানিকস (এলপি ট্রেডার্স)</p>
                <p className="mb-1"><strong>ইমেল:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ফোন:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ঠিকানা:</strong> চেন্নাই, তামিলনাড়ু, ভারত</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">শর্তাবলী ও নিয়মাবলী</Link>
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>സ്വകാര്യതാ നയം (Privacy Policy)</h1>
                <p className="text-muted small mb-0">വിണ്ണവർ ഓർഗാനിക്‌സ് — എൽപി ട്രേഡേഴ്‌സ് | അവസാന അപ്‌ഡേറ്റ്: ഓഗസ്റ്റ് 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">വിണ്ണവർ ഓർഗാനിക്‌സിൽ, നിങ്ങളുടെ സ്വകാര്യത സംരക്ഷിക്കുക എന്നത് ഞങ്ങളുടെ പ്രാഥമിക ഉത്തരവാദിത്തമാണ്. ഡിജിറ്റൽ വ്യക്തിഗത ഡാറ്റ സംരക്ഷണ നിയമം 2023 (DPDPA) പ്രകാരം നിങ്ങളുടെ വിവരങ്ങൾ ഞങ്ങൾ എങ്ങനെ ശേഖരിക്കുന്നു, ഉപയോഗിക്കുന്നു, സംരക്ഷിക്കുന്നു എന്ന് ഈ നയം വ്യക്തമാക്കുന്നു.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ഞങ്ങൾ ശേഖരിക്കുന്ന വിവരങ്ങൾ (Information We Collect)">
              <p>ഞങ്ങളുടെ സേവനങ്ങൾ നൽകുന്നതിന് ഞങ്ങൾ ഇനിപ്പറയുന്ന വിവരങ്ങൾ ശേഖരിച്ചേക്കാം:</p>
              <ul>
                <li><strong>വ്യക്തിഗത വിവരങ്ങൾ:</strong> പേര്, ഇമെയിൽ വിലാസം, മൊബൈൽ നമ്പർ.</li>
                <li><strong>ഡെലിവറി വിവരങ്ങൾ:</strong> വിലാസം, നഗരം, സംസ്ഥാനം, പിൻകോഡ്.</li>
                <li><strong>ഇടപാട് വിവരങ്ങൾ:</strong> വാങ്ങിയ ഉൽപ്പന്നങ്ങൾ, തുക, തീയതി, പേയ്‌മെന്റ് ഐഡി.</li>
                <li><strong>സാങ്കേതിക വിവരങ്ങൾ:</strong> IP വിലാസം, ബ്രൗസർ തരം, സന്ദർശിച്ച പേജുകൾ.</li>
              </ul>
            </Section>

            <Section title="2. വിവരങ്ങൾ ഉപയോഗിക്കുന്ന ആവശ്യങ്ങൾ">
              <p>ശേഖരിച്ച വിവരങ്ങൾ ഇനിപ്പറയുന്ന ആവശ്യങ്ങൾക്ക് മാത്രമേ ഉപയോഗിക്കുകയുള്ളൂ:</p>
              <ul>
                <li>നിങ്ങളുടെ ഓർഡറുകൾ പ്രോസസ്സ് ചെയ്യാനും ഡെലിവറി ചെയ്യാനും.</li>
                <li>ഡെലിവറി സ്റ്റാറ്റസും വിവരങ്ങളും SMS അല്ലെങ്കിൽ വാട്ട്‌സ്ആപ്പ് വഴി അറിയിക്കാൻ.</li>
                <li>ഉപഭോക്തൃ സേവനങ്ങളും സംശയങ്ങളും പരിഹരിക്കാൻ.</li>
                <li>FSSAI, GST നിയമപരമായ ഉത്തരവാദിത്തങ്ങൾ പാലിക്കാൻ.</li>
              </ul>
            </Section>

            <Section title="3. പേയ്‌മെന്റ് വിവരങ്ങളുടെ സുരക്ഷ (Payment Security)">
              <p>ഞങ്ങൾ നിങ്ങളുടെ ക്രെഡിറ്റ്/ഡെബിറ്റ് കാർഡ് നമ്പറുകളോ ബാങ്കിംഗ് പാസ്‌വേഡുകളോ ഞങ്ങളുടെ സെർവറുകളിൽ സൂക്ഷിക്കാറില്ല. എല്ലാ ഇടപാടുകളും PCI-DSS സാക്ഷ്യപ്പെടുത്തിയ സുരക്ഷിതമായ <strong>Razorpay</strong> വഴി എൻക്രിപ്റ്റ് ചെയ്താണ് നടത്തപ്പെടുന്നത്.</p>
            </Section>

            <Section title="4. വിവരങ്ങൾ പങ്കിടൽ (Data Sharing)">
              <p>ഞങ്ങൾ നിങ്ങളുടെ സ്വകാര്യ വിവരങ്ങൾ പരസ്യ കമ്പനികൾക്ക് വിൽക്കുകയോ വാടകയ്ക്ക് നൽകുകയോ ഇല്ല. നിങ്ങളുടെ ഓർഡർ വീട്ടിലെത്തിക്കാൻ ആവശ്യമായ കൊറിയർ പങ്കാളികളുമായി മാത്രമേ ആവശ്യമായ വിവരങ്ങൾ പങ്കിടുകയുള്ളൂ.</p>
            </Section>

            <Section title="5. കുക്കീസ് നയം (Cookies Policy)">
              <p>ഉപയോക്താവിന്റെ ലോഗിൻ നിലനിർത്താനും കാർട്ട് വിവരങ്ങൾ ഓർക്കാനും ഞങ്ങൾ കുക്കികൾ ഉപയോഗിക്കുന്നു. നിങ്ങളുടെ ബ്രൗസർ ക്രമീകരണങ്ങൾ വഴി നിങ്ങൾക്ക് കുക്കികൾ നിയന്ത്രിക്കാം.</p>
            </Section>

            <Section title="6. നിങ്ങളുടെ അവകാശങ്ങൾ (DPDPA 2023 പ്രകാരമുള്ള അവകാശങ്ങൾ)">
              <p>ഉപയോക്താക്കൾക്ക് അവരുടെ സ്വകാര്യ വിവരങ്ങൾ കാണാനും തെറ്റുകൾ തിരുത്താനും നിയമപരമായ കാലാവധിക്ക് ശേഷം വിവരങ്ങൾ നീക്കം ചെയ്യാനും ആവശ്യപ്പെടാൻ അവകാശമുണ്ട്.</p>
            </Section>

            <Section title="7. ഡാറ്റാ സുരക്ഷയും SSL എൻക്രിപ്ഷനും">
              <p>നിങ്ങളുടെ വിവരങ്ങൾ SSL 256-ബിറ്റ് എൻക്രിപ്ഷൻ സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.</p>
            </Section>

            <Section title="8. പരാതി പരിഹാര ഓഫീസർ (Grievance Officer)">
              <p>സ്വകാര്യത സംബന്ധിച്ച പരാതികൾക്കായി ബന്ധപ്പെടുക:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>പരാതി പരിഹാര ഓഫീസർ:</strong> ലീഗൽ & കംപ്ലയൻസ് ഡിവിഷൻ</p>
                <p className="mb-1"><strong>കമ്പനി:</strong> വിണ്ണവർ ഓർഗാനിക്‌സ് (എൽപി ട്രേഡേഴ്‌സ്)</p>
                <p className="mb-1"><strong>ഇമെയിൽ:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ഫോൺ:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>വിലാസം:</strong> ചെന്നൈ, തമിഴ്‌നാട്, ഇന്ത്യ</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">നിബന്ധനകളും വ്യവസ്ഥകളും</Link>
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)</h1>
                <p className="text-muted small mb-0">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ — ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್ | ಕೊನೆಯ ನವೀಕರಣ: ಆಗಸ್ಟ್ 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್‌ನಲ್ಲಿ, ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ಕಾಪಾಡುವುದು ನಮ್ಮ ಆದ್ಯತೆಯಾಗಿದೆ. ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ 2023 (DPDPA) ಪ್ರಕಾರ ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಹೇಗೆ ಸಂಗ್ರಹಿಸುತ್ತೇವೆ ಮತ್ತು ರಕ್ಷಿಸುತ್ತೇವೆ ಎಂಬುದನ್ನು ಈ ನೀತಿ ವಿವರಿಸುತ್ತದೆ.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ (Information We Collect)">
              <p>ನಮ್ಮ ಸೇವೆಗಳನ್ನು ಒದಗಿಸಲು ಕೆಳಗಿನ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ:</p>
              <ul>
                <li><strong>ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ:</strong> ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ.</li>
                <li><strong>ವಿತರಣಾ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ ವಿವರಗಳು:</strong> ವಿಳಾಸ, ನಗರ, ರಾಜ್ಯ, ಪಿನ್‌ಕೋಡ್.</li>
                <li><strong>ವಹಿವಾಟು ವಿವರಗಳು:</strong> ಖರೀದಿಸಿದ ಉತ್ಪನ್ನಗಳು, ಮೊತ್ತ, ದಿನಾಂಕ, ಪಾವತಿ ಐಡಿ.</li>
                <li><strong>ತಾಂತ್ರಿಕ ಮಾಹಿತಿ:</strong> IP ವಿಳಾಸ, ಬ್ರೌಸರ್ ಪ್ರಕಾರ, ಭೇಟಿ ನೀಡಿದ ಪುಟಗಳು.</li>
              </ul>
            </Section>

            <Section title="2. ಮಾಹಿತಿಯ ಬಳಕೆಯ ಉದ್ದೇಶಗಳು">
              <p>ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿಯನ್ನು ಈ ಕೆಳಗಿನ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ:</p>
              <ul>
                <li>ನಿಮ್ಮ ಆರ್ಡರ್‌ಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಮತ್ತು ವಿತರಿಸಲು.</li>
                <li>ಡೆಲಿವರಿ ಸ್ಥಿತಿ ಮತ್ತು ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು SMS ಅಥವಾ WhatsApp ಮೂಲಕ ಕಳುಹಿಸಲು.</li>
                <li>ಗ್ರಾಹಕ ಬೆಂಬಲ ಮತ್ತು ವಿಚಾರಣೆಗಳಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು.</li>
                <li>FSSAI, GST ಮತ್ತು ಕಾನೂನು ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಲು.</li>
              </ul>
            </Section>

            <Section title="3. ಪಾವತಿ ಮಾಹಿತಿ ಭದ್ರತೆ (Payment Security)">
              <p>ನಾವು ನಿಮ್ಮ ಕ್ರೆಡಿಟ್/ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆಗಳು ಅಥವಾ ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ನಮ್ಮ ಸರ್ವರ್‌ಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ. ಎಲ್ಲಾ ಪಾವತಿಗಳು PCI-DSS ಪ್ರಮಾಣೀಕೃತ <strong>Razorpay</strong> ಗೇಟ್‌ವೇ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ನಡೆಯುತ್ತವೆ.</p>
            </Section>

            <Section title="4. ಮಾಹಿತಿ ಹಂಚಿಕೆ (Data Sharing)">
              <p>ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾವನ್ನು ನಾವು ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ. ಆರ್ಡರ್ ತಲುಪಿಸಲು ಅಗತ್ಯವಿರುವ ಅಧಿಕೃತ ಕೊರಿಯರ್ ಪಾಲುದಾರರೊಂದಿಗೆ ಮಾತ್ರ ಸೀಮಿತ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.</p>
            </Section>

            <Section title="5. ಕುಕೀಸ್ ನೀತಿ (Cookies Policy)">
              <p>ವೆಬ್‌ಸೈಟ್ ಬಳಕೆದಾರರ ಲಾಗಿನ್ ಮತ್ತು ಶಾಪಿಂಗ್ ಕಾರ್ಟ್ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಲು ಕುಕೀಗಳನ್ನು ಬಳಸಲಾಗುತ್ತದೆ. ನೀವು ಬಯಸಿದರೆ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಕುಕೀಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಬಹುದು.</p>
            </Section>

            <Section title="6. ನಿಮ್ಮ ಹಕ್ಕುಗಳು (DPDPA 2023 ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಹಕ್ಕುಗಳು)">
              <p>ಗ್ರಾಹಕರು ತಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾವನ್ನು ವೀಕ್ಷಿಸಲು, ತಪ್ಪುಗಳನ್ನು ಸರಿಪಡಿಸಲು ಅಥವಾ ಅಗತ್ಯವಿದ್ದಾಗ ಖಾತೆ ಮಾಹಿತಿಯನ್ನು ಅಳಿಸಲು ವಿನಂತಿಸುವ ಹಕ್ಕನ್ನು ಹೊಂದಿರುತ್ತಾರೆ.</p>
            </Section>

            <Section title="7. ಡೇಟಾ ಭದ್ರತೆ ಮತ್ತು SSL">
              <p>ನಿಮ್ಮ ಡೇಟಾವನ್ನು SSL 256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿಡಲಾಗುತ್ತದೆ ಮತ್ತು ಅನಧಿಕೃತ ಪ್ರವೇಶವನ್ನು ತಡೆಯಲು ಸೂಕ್ತ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು ಅಳವಡಿಸಲಾಗಿದೆ.</p>
            </Section>

            <Section title="8. ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ & ಸಂಪರ್ಕ (Grievance Officer)">
              <p>ಗೌಪ್ಯತೆ ಸಂಬಂಧಿತ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ದೂರುಗಳಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ಕುಂದುಕೊರತೆ ಅಧಿಕಾರಿ:</strong> ಕಾನೂನು ಮತ್ತು ಅನುಸರಣಾ ವಿಭಾಗ</p>
                <p className="mb-1"><strong>ಕಂಪನಿ:</strong> ವಿನ್ನವರ್ ಆರ್ಗಾನಿಕ್ಸ್ (ಎಲ್ಪಿ ಟ್ರೇಡರ್ಸ್)</p>
                <p className="mb-1"><strong>ಇಮೇಲ್:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ಫೋನ್:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>ವಿಳಾಸ:</strong> ಚೆನ್ನೈ, ತಮಿಳುನಾಡು, ಭಾರತ</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು</Link>
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
                <i className="fa fa-shield text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>గోప్యతా విధానం (Privacy Policy)</h1>
                <p className="text-muted small mb-0">విన్నవర్ ఆర్గానిక్స్ — ఎల్పీ ట్రేడర్స్ | చివరి నవీకరణ: ఆగస్టు 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">విన్నవర్ ఆర్గానిక్స్ వద్ద, మీ గోప్యతను కాపాడడం మా ప్రాథమిక బాధ్యత. డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ యాక్ట్, 2023 (DPDPA) మరియు భారతీయ చట్టాలకు అనుగుణంగా మీ వ్యక్తిగత సమాచారాన్ని మేము ఎలా సేకరిస్తాము, ఉపయోగిస్తాము మరియు రక్షిస్తాము అనేది ఈ విధానం వివరిస్తుంది.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. మేము సేకరించే సమాచారం (Information We Collect)">
              <p>మా వెబ్‌సైట్ సేవలను అందించడానికి మేము ఈ క్రింది సమాచారాన్ని సేకరించవచ్చు:</p>
              <ul>
                <li><strong>వ్యక్తిగత గుర్తింపు సమాచారం:</strong> పేరు, ఇమెయిల్ చిరునామా, మొబైల్ ఫోన్ నంబర్.</li>
                <li><strong>డెలివరీ మరియు బిల్లింగ్ వివరాలు:</strong> ఇంటి చిరునామా, ల్యాండ్‌మార్క్, నగరం, రాష్ట్రం, పిన్‌కోడ్.</li>
                <li><strong>ఆర్డర్ మరియు లావాదేవీ చరిత్ర:</strong> కొనుగోలు చేసిన ఉత్పత్తులు, తేదీ, మొత్తం, చెల్లింపు ఐడి.</li>
                <li><strong>సాంకేతిక మరియు పరికర సమాచారం:</strong> IP చిరునామా, బ్రౌజర్ రకం, ఆపరేటింగ్ సిస్టమ్, పేజీల వీక్షణ సమయం.</li>
              </ul>
            </Section>

            <Section title="2. సమాచారాన్ని ఉపయోగించే ఉద్దేశ్యాలు">
              <p>సేకరించిన డేటాను మేము క్రింది చట్టబద్ధమైన ప్రయోజనాల కోసం మాత్రమే ఉపయోగిస్తాము:</p>
              <ul>
                <li>మీ ఆర్డర్‌లను ప్రాసెస్ చేయడం, ప్యాక్ చేయడం మరియు మీ ఇంటికి డెలివరీ చేయడం.</li>
                <li>ఆర్డర్ స్థితి, షిప్పింగ్ ట్రాకింగ్ మరియు డెలివరీ అప్‌డేట్‌లను SMS లేదా WhatsApp ద్వారా పంపడం.</li>
                <li>కస్టమర్ సేవలు మరియు ఫిర్యాదులను త్వరితగతిన పరిష్కరించడం.</li>
                <li>మా వెబ్‌సైట్ పనితీరు, వినియోగదారు అనుభవం మరియు భద్రతను మెరుగుపరచడం.</li>
                <li>FSSAI, GST మరియు ఇతర చట్టపరమైన నిబంధనలను పాటించడం.</li>
              </ul>
            </Section>

            <Section title="3. చెల్లింపు సమాచార భద్రత (Payment Security)">
              <p>మేము మీ క్రెడిట్/డెబిట్ కార్డు నంబర్లు, CVV లేదా నెట్ బ్యాంకింగ్ పాస్‌వర్డ్‌లను మా సర్వర్లలో ఎప్పటికీ నిల్వ చేయము. అన్ని ఆన్‌లైన్ లావాదేవీలు PCI-DSS ధృవీకరణ పొందిన అత్యంత సురక్షితమైన <strong>Razorpay</strong> పేమెంట్ గేట్‌వే ద్వారా ఎన్‌క్రిప్ట్ చేయబడి ప్రాసెస్ చేయబడతాయి.</p>
            </Section>

            <Section title="4. మూడవ పక్షాలతో సమాచార భాగస్వామ్యం">
              <p>మేము మీ వ్యక్తిగత సమాచారాన్ని ఎటువంటి మార్కెటింగ్ కంపెనీలకు విక్రయించము లేదా అద్దెకు ఇవ్వము. మీ ఆర్డర్‌ను పూర్తి చేయడానికి అవసరమైన మేరకు మాత్రమే అధీకృత భాగస్వాములతో (కొరియర్ & లాజిస్టిక్స్ సర్వీసులు, SMS సర్వీస్ ప్రొవైడర్లు) పరిమిత సమాచారం పంచుకోబడుతుంది.</p>
            </Section>

            <Section title="5. కుకీలు మరియు ట్రాకింగ్ విధానం (Cookies Policy)">
              <p>మా వెబ్‌సైట్ మీ లాగిన్ సెషన్, షాపింగ్ కార్ట్ వస్తువులను గుర్తుంచుకోవడానికి మరియు వెబ్‌సైట్ పనితీరును విశ్లేషించడానికి అవసరమైన కుకీలను ఉపయోగిస్తుంది. మీరు మీ బ్రౌజర్ సెట్టింగ్‌ల ద్వారా ఎప్పుడైనా కుకీలను నియంత్రించవచ్చు లేదా నిలిపివేయవచ్చు.</p>
            </Section>

            <Section title="6. మీ హక్కులు (DPDPA 2023 ప్రకారం మీ డేటా హక్కులు)">
              <p>డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ చట్టం క్రింద వినియోగదారులకు కింది హక్కులు ఉన్నాయి:</p>
              <ul>
                <li>మీ వ్యక్తిగత డేటా సారాంశాన్ని యాక్సెస్ చేసే హక్కు.</li>
                <li>తప్పుగా ఉన్న సమాచారాన్ని సరిచేసే లేదా నవీకరించే హక్కు.</li>
                <li>చట్టపరమైన మరియు పన్ను నిబంధనలకు అవసరమైన కాలం ముగిసిన తర్వాత మీ వ్యక్తిగత ఖాతా డేటాను తొలగించమని అభ్యర్థించే హక్కు.</li>
              </ul>
            </Section>

            <Section title="7. డేటా నిల్వ మరియు భద్రతా చర్యలు">
              <p>మీ సమాచారం పరిశ్రమ ప్రమాణాలకు అనుగుణంగా SSL (Secure Socket Layer) 256-బిట్ ఎన్‌క్రిప్షన్‌తో రక్షించబడుతుంది. అనధికారిక ప్రాప్యత, మార్పు లేదా బహిర్గతం నుండి రక్షించడానికి మేము కఠినమైన సాంకేతిక మరియు భద్రతా నియంత్రణలను అమలు చేస్తాము.</p>
            </Section>

            <Section title="8. మైనర్ల గోప్యత">
              <p>మా సేవలు 18 సంవత్సరాల కంటే తక్కువ వయస్సు ఉన్న వ్యక్తుల నుండి నేరుగా సమాచారాన్ని సేకరించడానికి ఉద్దేశించబడలేదు. మైనర్లు కేవలం తల్లిదండ్రుల పర్యవేక్షణలో మాత్రమే కొనుగోలు చేయవచ్చు.</p>
            </Section>

            <Section title="9. ఫిర్యాదుల అధికారి & సంప్రదింపు సమాచారం (Grievance Officer)">
              <p>ఈ గోప్యతా విధానం లేదా మీ వ్యక్తిగత సమాచార నిర్వహణ గురించి ఏవైనా సందేహాలు లేదా ఫిర్యాదులు ఉంటే, దయచేసి సంప్రదించండి:</p>
              <div className="bg-light rounded-3 p-3 border">
                <p className="mb-1"><strong>ఫిర్యాదుల అధికారి (Grievance Officer):</strong> లీగల్ అండ్ కంప్లైయన్స్ డివిజన్</p>
                <p className="mb-1"><strong>కంపెనీ:</strong> విన్నవర్ ఆర్గానిక్స్ (ఎల్పీ ట్రేడర్స్)</p>
                <p className="mb-1"><strong>ఇమెయిల్:</strong> <a href="mailto:support@vinnavar.com" className="text-success text-decoration-none">support@vinnavar.com</a></p>
                <p className="mb-1"><strong>ఫోన్:</strong> +91 94441 83387</p>
                <p className="mb-0"><strong>చిరునామా:</strong> చెన్నై, తమిళనాడు, భారతదేశం</p>
              </div>
            </Section>

            <div className="mt-4 pt-3 border-top d-flex gap-3 flex-wrap">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm">నిబంధనలు మరియు షరతులు</Link>
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
                <i className="fa fa-lock text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>गोपनीयता नीति (Privacy Policy)</h1>
                <p className="text-muted small mb-0">विन्नवर ऑर्गेनिक्स — एलपी ट्रेडर्स | अंतिम अद्यतन: अगस्त 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">आपकी गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट या सेवाओं का उपयोग करते हैं, तो <strong>एलपी ट्रेडर्स (विन्नवर ऑर्गेनिक्स)</strong> आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग, सुरक्षित और संग्रहीत करता है।</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. हमारे द्वारा एकत्र की जाने वाली जानकारी">
              <p><strong>क) आपके द्वारा सीधे दी जाने वाली जानकारी:</strong></p>
              <ul>
                <li><strong>खाता जानकारी:</strong> नाम, ईमेल पता, मोबाइल नंबर और पासवर्ड</li>
                <li><strong>ऑर्डर जानकारी:</strong> बिलिंग नाम, डिलीवरी का पता (घर का नंबर, सड़क, शहर, राज्य, पिनकोड), मोबाइल नंबर</li>
                <li><strong>भुगतान जानकारी:</strong> भुगतान विधि का चयन (हम आपका कोई भी कार्ड या UPI पिन सुरक्षित नहीं करते — यह Razorpay द्वारा 100% सुरक्षित रूप से प्रोसेस किया जाता है)</li>
                <li><strong>समीक्षाएं और सुझाव:</strong> आपके द्वारा स्वेच्छा से दी गई समीक्षाएं और उत्पाद तस्वीरें</li>
              </ul>
              <p><strong>ख) स्वचालित रूप से एकत्र की गई जानकारी:</strong></p>
              <ul>
                <li>IP पता, ब्राउज़र प्रकार, स्क्रीन रिज़ॉल्यूशन, भाषा प्राथमिकताएं और ब्राउज़िंग डेटा</li>
              </ul>
            </Section>

            <Section title="2. हम आपकी जानकारी का उपयोग कैसे करते हैं?">
              <ul>
                <li><strong>ऑर्डर प्रसंस्करण:</strong> आपके ऑर्डर पूरे करने, डिलीवरी की व्यवस्था करने और इनवॉइस भेजने के लिए</li>
                <li><strong>ग्राहक सहायता:</strong> सवालों के जवाब देने, शिकायतों के समाधान और रिटर्न/रिफंड के लिए</li>
                <li><strong>खाता प्रबंधन:</strong> आपका खाता, इच्छा-सूची (Wishlist) और ऑर्डर इतिहास सुरक्षित रखने के लिए</li>
                <li><strong>संचार:</strong> ऑर्डर की पुष्टि, शिपिंग अपडेट और नीतिगत बदलावों की जानकारी भेजने के लिए</li>
              </ul>
            </Section>

            <Section title="3. जानकारी साझा करना (Sharing of Information)">
              <p>हम आपकी व्यक्तिगत जानकारी को किसी तीसरे पक्ष को विज्ञापन के लिए नहीं बेचते हैं। यह केवल डिलीवरी कूरियर पार्टनर्स (उदा. Delhivery, DTDC, India Post) और सुरक्षित भुगतान गेटवे (Razorpay) के साथ न्यूनतम आवश्यक सीमा तक ही साझा की जाती है।</p>
            </Section>

            <Section title="4. डेटा सुरक्षा (Data Security)">
              <ul>
                <li><strong>SSL/TLS एन्क्रिप्शन:</strong> वेबसाइट और आपके ब्राउज़र के बीच सभी डेटा संचार HTTPS और SSL/TLS से एन्क्रिप्टेड है</li>
                <li><strong>सुरक्षित भुगतान:</strong> सभी लेनदेन PCI-DSS लेवल 1 प्रमाणित Razorpay द्वारा सुरक्षित हैं</li>
              </ul>
            </Section>

            <Section title="5. शिकायत अधिकारी (Grievance Officer)">
              <div className="border rounded-3 p-3 bg-light mt-2">
                <p className="mb-1"><strong>नाम:</strong> श्री लोकेश राजन शाह</p>
                <p className="mb-1"><strong>पद:</strong> शिकायत अधिकारी / मालिक, एलपी ट्रेडर्स</p>
                <p className="mb-1"><strong>ईमेल:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-1"><strong>पता:</strong> #16, एमएस नगर फेज 2, कुरुमंथंगल रोड, कुन्नात्तूर, अरणी, तमिलनाडु – 632314</p>
                <p className="mb-0"><strong>प्रतिक्रिया समय:</strong> शिकायत प्राप्त होने के 30 दिनों के भीतर</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">नियम और शर्तें</Link>
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
                <i className="fa fa-lock text-success fs-4" />
              </div>
              <div>
                <h1 className="fw-bold text-dark mb-0" style={{ fontSize: "1.6rem" }}>தனியுரிமைக் கொள்கை (Privacy Policy)</h1>
                <p className="text-muted small mb-0">விண்ணவர் ஆர்கானிக்ஸ் — LP டிரேடர்ஸ் | கடைசியாக புதுப்பிக்கப்பட்டது: ஆகஸ்ட் 2025</p>
              </div>
            </div>
            <div className="alert alert-success border-0 rounded-3 mb-0" style={{ background: "#f0fdf4" }}>
              <p className="mb-0 small">உங்கள் தனியுரிமை எங்களுக்கு மிகவும் முக்கியமானது. நீங்கள் எங்கள் இணையதளம் அல்லது சேவைகளைப் பயன்படுத்தும்போது, <strong>LP Traders (விண்ணவர் ஆர்கானிக்ஸ்)</strong> உங்கள் தனிப்பட்ட தகவல்களை எவ்வாறு சேகரிக்கிறது, பயன்படுத்துகிறது, சேமிக்கிறது மற்றும் பாதுகாக்கிறது என்பதை இந்த தனியுரிமைக் கொள்கை விளக்குகிறது.</p>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
            <Section title="1. நாங்கள் சேகரிக்கும் தகவல்கள்">
              <p>அனைத்து வாடிக்கையாளர்களுக்கும் சிறந்த சேவையை வழங்க நாங்கள் பின்வரும் தகவல்களைச் சேகரிக்கிறோம்:</p>
              <p><strong>அ) நீங்கள் நேரடியாக வழங்கும் தகவல்கள்:</strong></p>
              <ul>
                <li><strong>கணக்குத் தகவல்:</strong> பெயர், மின்னஞ்சல் முகவரி, மொபைல் எண் மற்றும் கடவுச்சொல்</li>
                <li><strong>ஆர்டர் விவரங்கள்:</strong> பில்லிங் பெயர், ஷிப்பிங் முகவரி (வீட்டு எண், தெரு, ஊர், மாநிலம், பின்கோட்) மற்றும் தொலைபேசி எண்</li>
                <li><strong>கட்டண விவரங்கள்:</strong> கட்டண முறைத் தேர்வு (கார்டு அல்லது UPI விவரங்களை நாங்கள் சேமிப்பதில்லை — இவை Razorpay ஆல் பாதுகாப்பாக கையாளப்படுகின்றன)</li>
                <li><strong>மதிப்புரைகள் மற்றும் கருத்துக்கள்:</strong> நீங்கள் விருப்பத்துடன் பகிரும் தயாரிப்பு மதிப்புரைகள் மற்றும் புகைப்படங்கள்</li>
              </ul>
              <p><strong>ஆ) தானாகச் சேகரிக்கப்படும் தொழில்நுட்பத் தகவல்கள்:</strong></p>
              <ul>
                <li><strong>சாதனத் தரவு:</strong> IP முகவரி, உலாவி வகை, திரை அளவு, மொழி விருப்பங்கள் மற்றும் பார்க்கும் பக்கங்கள்</li>
              </ul>
            </Section>

            <Section title="2. உங்கள் தகவல்களை எவ்வாறு பயன்படுத்துகிறோம்?">
              <ul>
                <li><strong>ஆர்டர் செயலாக்கம்:</strong> ஆர்டர்களை நிறைவேற்ற, டெலிவரி ஏற்பாடு செய்ய மற்றும் ரசீதுகளை அனுப்ப</li>
                <li><strong>வாடிக்கையாளர் ஆதரவு:</strong> கேள்விகளுக்கு பதிலளிக்க, புகார்களைத் தீர்க்க மற்றும் பணத்திரும்பக் கோரிக்கைகளைக் கையாள</li>
                <li><strong>கணக்கு மேலாண்மை:</strong> உங்கள் கணக்கு, விருப்பப்பட்டியல் மற்றும் ஆர்டர் வரலாற்றைப் பராமரிக்க</li>
                <li><strong>தொடர்பு:</strong> ஆர்டர் உறுதிப்படுத்தல், ஷிப்பிங் நிலவரம் மற்றும் முக்கியமான கொள்கை மாற்றங்களை அறிவிக்க</li>
              </ul>
            </Section>

            <Section title="3. தகவல்களைப் பகிர்தல்">
              <p>நாங்கள் உங்கள் தனிப்பட்ட தகவல்களை விளம்பர நோக்கங்களுக்காக எந்தவொரு மூன்றாம் தரப்பினருக்கும் விற்பனை செய்வதோ அல்லது வாடகைக்கு விடுவதோ இல்லை. பின்வரும் அத்தியாவசியத் தேவைகளுக்கு மட்டுமே பகிரப்படுகிறது:</p>
              <ul>
                <li><strong>டெலிவரி பார்ட்னர்கள்:</strong> பொருட்களை உங்களிடம் சேர்க்க கூரியர் நிறுவனங்களுக்கு உங்கள் பெயர், முகவரி மற்றும் தொலைபேசி எண் பகிரப்படுகிறது</li>
                <li><strong>கட்டண நுழைவாயில் (Razorpay):</strong> கட்டணங்களை 100% பாதுகாப்பாகப் பரிசீலிக்கத் தேவையான குறைந்தபட்ச விவரங்கள்</li>
                <li><strong>சட்டப்பூர்வ கடமைகள்:</strong> அரசாங்க அதிகாரிகளால் சட்டப்பூர்வமாகக் கோரப்படும் போது மட்டும்</li>
              </ul>
            </Section>

            <Section title="4. தரவுப் பாதுகாப்பு (Data Security)">
              <ul>
                <li><strong>SSL/TLS குறியாக்கம்:</strong> உங்கள் உலாவிக்கும் எங்கள் சேவையகத்திற்கும் இடையிலான அனைத்துத் தொடர்புகளும் முழுமையாக என்க்ரிப்ட் செய்யப்பட்டுள்ளன</li>
                <li><strong>பாதுகாப்பான கட்டணம்:</strong> அனைத்துப் பரிவர்த்தனைகளும் PCI-DSS Level 1 சான்றளிக்கப்பட்ட Razorpay மூலம் செயல்படுத்தப்படுகின்றன</li>
                <li>கார்டு எண்கள் அல்லது UPI பின் போன்ற ரகசிய விவரங்களை எங்கள் சேவையகத்தில் ஒருபோதும் சேமிப்பதில்லை</li>
              </ul>
            </Section>

            <Section title="5. குறைதீர்க்கும் அதிகாரி தொடர்பு">
              <div className="border rounded-3 p-3 bg-light mt-2">
                <p className="mb-1"><strong>பெயர்:</strong> திரு. லோகேஷ் ராஜன் ஷா</p>
                <p className="mb-1"><strong>பொறுப்பு:</strong> குறைதீர்க்கும் அதிகாரி / உரிமையாளர், LP Traders</p>
                <p className="mb-1"><strong>மின்னஞ்சல்:</strong> vinnavarbrand@gmail.com</p>
                <p className="mb-1"><strong>முகவரி:</strong> #16, MS நகர் ஃபேஸ் 2, குருமந்தாங்கல் ரோடு, குன்னத்தூர், ஆரணி, தமிழ்நாடு – 632314</p>
                <p className="mb-0"><strong>பதில் அளிக்கும் நேரம்:</strong> புகார் பெறப்பட்ட 30 நாட்களுக்குள்</p>
              </div>
            </Section>

            <div className="border-top pt-4 mt-2 d-flex flex-wrap gap-3">
              <Link to="/terms-conditions" className="btn btn-outline-success btn-sm rounded-pill">விதிமுறைகள் &amp; நிபந்தனைகள்</Link>
              <Link to="/return-policy" className="btn btn-outline-success btn-sm rounded-pill">திரும்பப்பெறும் கொள்கை</Link>
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
