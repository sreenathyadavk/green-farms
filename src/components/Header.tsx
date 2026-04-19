import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import logo from "@/assets/logo.png";

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
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-dark border-b border-cream/5" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 sm:h-20">
          <a href="#home" className="flex items-center gap-2.5 group">
            <motion.img
              src={logo}
              alt="B.Tech Wala Hydro Farm"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6 }}
            />
            <span className="flex flex-col leading-none">
              <span className="font-display text-cream text-base sm:text-lg">B.Tech Wala</span>
              <span className="text-[8px] sm:text-[10px] tracking-[0.3em] text-cream/80">
                <span className="text-gold">HYDRO</span> FARM
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="relative text-cream/85 hover:text-gold text-sm tracking-wide transition-colors group">
                {l.label}
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
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
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-charcoal text-[10px] font-semibold flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
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
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[82%] max-w-sm bg-charcoal text-cream p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2.5">
                  <img src={logo} alt="" className="w-9 h-9 object-contain" />
                  <span className="font-display text-xl">Menu</span>
                </div>
                <button aria-label="Close" onClick={() => setMenuOpen(false)} className="w-11 h-11 inline-flex items-center justify-center">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-3xl text-cream hover:text-gold transition-colors"
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>
              <div className="mt-auto label-eyebrow text-gold">Hyderabad · COD Available</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
