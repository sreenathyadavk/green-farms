import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductsSection } from "@/components/ProductsSection";
import { PackagesSection } from "@/components/PackagesSection";
import { RecipeSection } from "@/components/RecipeSection";
import { WhyUs } from "@/components/WhyUs";
import { FarmStory } from "@/components/FarmStory";
import { DeliveryInfo } from "@/components/DeliveryInfo";
import { Testimonials } from "@/components/Testimonials";
import { SocialStrip } from "@/components/SocialStrip";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { Toast } from "@/components/Toast";

const Index = () => {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("btw-loaded");
  });

  useEffect(() => {
    if (!loading) sessionStorage.setItem("btw-loaded", "1");
  }, [loading]);

  return (
    <div className="min-h-screen bg-mist">
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Header />
      <main>
        <Hero />
        <ProductsSection />
        <PackagesSection />
        <RecipeSection />
        <WhyUs />
        <FarmStory />
        <DeliveryInfo />
        <Testimonials />
        <SocialStrip />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFAB />
      <Toast />
    </div>
  );
};

export default Index;
