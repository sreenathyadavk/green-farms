import { Instagram } from "lucide-react";

export const SocialStrip = () => {
  return (
    <section className="bg-charcoal py-10 border-t border-cream/5">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-5 text-center">
        <div>
          <p className="font-display text-cream text-xl italic">Follow the farm journey</p>
          <p className="text-gold text-sm mt-1">@btechwalahydrofarm</p>
        </div>
        <div className="flex gap-3 sm:ml-6">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-cream/20 inline-flex items-center justify-center text-cream transition">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-cream/20 inline-flex items-center justify-center text-cream transition">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M20.5 3.5C18.3 1.2 15.3 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.3zM12 21.8c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C2 6.5 6.5 2 12 2c2.7 0 5.2 1 7.1 2.9 1.9 1.9 2.9 4.4 2.9 7.1 0 5.5-4.5 9.8-10 9.8z"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
};
