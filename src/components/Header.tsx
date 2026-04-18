import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "Shop", href: "#shop" },
    { label: "Salad Packages", href: "#packages" },
    { label: "About", href: "#about" },
    { label: "Order", href: "#order" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-dark border-b border-cream/5" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 sm:h-20">
          <a href="#home" className="flex flex-col leading-none">
            <span className="font-display text-cream text-lg sm:text-xl">B.Tech Wala</span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.32em] text-cream/80">
              <span className="text-gold">HYDRO</span> FARM
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-cream/85 hover:text-gold text-sm tracking-wide transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="#order"
              className="hidden lg:inline-flex items-center px-5 h-10 rounded-full border border-gold text-gold text-sm font-semibold tracking-wider hover:bg-gold hover:text-charcoal transition-colors"
            >
              Order via WhatsApp
            </a>
            <button
              aria-label="Open cart"
              onClick={openCart}
              className="relative w-11 h-11 inline-flex items-center justify-center text-cream hover:text-gold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-charcoal text-[10px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-11 h-11 inline-flex items-center justify-center text-cream"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-md animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[82%] max-w-sm bg-charcoal text-cream p-7 flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <span className="font-display text-xl">Menu</span>
              <button aria-label="Close" onClick={() => setMenuOpen(false)} className="w-11 h-11 inline-flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-3xl text-cream hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto label-eyebrow text-gold">Hyderabad · COD Available</div>
          </div>
        </div>
      )}
    </>
  );
};
