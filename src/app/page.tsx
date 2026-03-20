import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { ProductsSection } from "@/components/ProductsSection";
import { StorySection } from "@/components/StorySection";
import { StoresSection } from "@/components/StoresSection";
import { InstagramSection } from "@/components/InstagramSection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProductsSection />
        <StorySection />
        <StoresSection />
        <InstagramSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
