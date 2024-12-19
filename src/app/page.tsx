import AppBar from "./components/app-bar";
import CategoriesSection from "./components/categories-section";
import HeroSection from "./components/hero-section";
import TopServiceProvidersSection from "./components/top-service-providers-section";
import HowToBookSection from "./components/how-to-book-section";
import FAQSection from "./components/faq-section";

export default function Home() {
  return (
    <>
      <AppBar />
      <HeroSection />
      <CategoriesSection />
      <TopServiceProvidersSection />
      <HowToBookSection />
      <FAQSection />
    </>
  );
}
