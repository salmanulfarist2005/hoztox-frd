import React from "react";
import HeaderSection4 from "../components/header/HeaderSection4";
import FooterSection from "../components/footer/FooterSection";
import BreadcrumbSection2 from "../components/breadcrumb/BreadcrumbSection2";
import FeatureSection from "../components/feature/FeatureSection";
 
import BottomMobileMenu from "../components/navigation/BottomMobileMenu";

const Shop2 = () => {
  return (
    <main className="fz-5-body">
      <HeaderSection4/>
      <BreadcrumbSection2 title="Shop Page" currentPage="Products" />
      
   
      <FooterSection />
      {/* <BottomMobileMenu
        style="fz-5-mobile-menu"
        logo="assets/images/logo-5.png"
      /> */}
    </main>
  );
};

export default Shop2;
