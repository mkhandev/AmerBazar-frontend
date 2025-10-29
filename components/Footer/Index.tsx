import { APP_NAME } from "@/lib/constants";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="bg-[#1a1a1a] mt-10 border-t-1 border#37a001 py-15 text-[17px] text-[#FFF] text-center">
      &copy; {currentYear} {APP_NAME}. All rights reserved.
    </div>
  );
};

export default Footer;
