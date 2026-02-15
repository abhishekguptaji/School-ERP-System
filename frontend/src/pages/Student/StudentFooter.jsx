import "./css/StudentFooter.css";

function StudentFooter() {
  return (
    <footer className="studentFooter">
      <div className="container-fluid">
        <div className="footerInner">
          <span className="footerText text-center">
            © {new Date().getFullYear()}{" "}
            <span className="footerBrand">GUPTA'S GROUP ERP</span>
          </span>

          <span className="footerDivider">|</span>

          <span className="footerText">
            Designed & Developed by{" "}
            <span className="footerDev">Abhishek Gupta</span> – Developer |{" "}
            <a
              className="footerMail"
              href="mailto:abhishekgupta1864@gmail.com"
            >
              abhishekgupta1864@gmail.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default StudentFooter;