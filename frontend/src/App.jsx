import React from "react";
import Navbar from "./components/CommonPages/Navbar";
import Footer from "./components/CommonPages/Footer";



function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-fill container my-4">
        <h2>Welcome to School ERP System</h2>
      </main>

      <Footer />
    </div>
  );
}


export default App;
