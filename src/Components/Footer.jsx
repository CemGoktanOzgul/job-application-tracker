import React from "react";

const Footer = ({ theme }) => {
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
      <small
        className={`fw-bold ${theme === "dark" ? "text-light" : "text-muted"}`}
        style={{ opacity: 0.7 }}
      >
        Made by CemGoktanOzgul
      </small>
    </div>
  );
};

export default Footer;
