import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="erp-footer text-center">
      <div className="container-fluid">
        <p className="mb-1">
          Copyright © {new Date().getFullYear()}{" "}
          <strong>GNIOT GROUP ERP</strong>
        </p>
        <p className="mb-0">
          Designed & Developed by:{" "}
          <strong>Abhishek Gupta</strong> – Developer |{" "}
          <a href="mailto:abhishekgupta1864@gmail.com">
            abhishekgupta1864@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
