// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-base-200 text-base-content py-4 border-t mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Hamza Ashfaq. All rights reserved.
        </p>
        <p className="text-xs mt-2 sm:mt-0">Made with ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
