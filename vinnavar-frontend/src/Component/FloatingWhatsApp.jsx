import React from "react";

const FloatingWhatsApp = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center"
      }}
    >
      <a
        href="https://wa.me/917550210447"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: "52px",
          height: "52px",
          backgroundColor: "#25D366",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37, 211, 102, 0.45)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          cursor: "pointer",
          textDecoration: "none"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(37, 211, 102, 0.45)";
        }}
        title="Chat on WhatsApp (+91 7550210447)"
      >
        <i className="bx bxl-whatsapp text-white" style={{ fontSize: "32px" }}></i>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
