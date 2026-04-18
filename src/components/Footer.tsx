export const Footer = () => {
  return (
    <footer className="bg-charcoal text-cream py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="font-display text-2xl">B.Tech Wala</div>
            <div className="text-[10px] tracking-[0.32em] mt-1"><span className="text-gold">HYDRO</span> FARM</div>
            <p className="mt-5 text-sm text-sand/80">Precision grown. Premium delivered.</p>
          </div>
          <div>
            <p className="label-eyebrow text-gold mb-4">Quick Links</p>
            <ul className="space-y-2.5 text-sm text-sand/85">
              <li><a href="#home" className="hover:text-gold transition">Home</a></li>
              <li><a href="#shop" className="hover:text-gold transition">Shop</a></li>
              <li><a href="#packages" className="hover:text-gold transition">Salad Packages</a></li>
              <li><a href="#about" className="hover:text-gold transition">About</a></li>
              <li><a href="#order" className="hover:text-gold transition">Order Now</a></li>
            </ul>
          </div>
          <div>
            <p className="label-eyebrow text-gold mb-4">Products</p>
            <ul className="space-y-2.5 text-sm text-sand/85">
              <li>Kale</li><li>Lettuce</li><li>Microgreens</li><li>Bell Pepper</li><li>Broccoli</li><li>Cherry Tomatoes</li>
            </ul>
          </div>
          <div>
            <p className="label-eyebrow text-gold mb-4">Contact & Delivery</p>
            <ul className="space-y-2.5 text-sm text-sand/85">
              <li>WhatsApp: +91 99999 99999</li>
              <li>Delivering in Hyderabad</li>
              <li>COD Available</li>
              <li>Fresh weekly deliveries</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-cream/10 text-xs text-text-muted">
          © 2025 B.Tech Wala Hydro Farm. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
