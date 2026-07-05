/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components, @typescript-eslint/no-require-imports, prefer-const */
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, MessageCircle, Truck, Clock, Banknote, User, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/store/cart";
import { buildCartMessage, openWhatsApp } from "@/lib/whatsapp";
import { DELIVERY_CHARGE } from "@/data/catalog";
import { placeOrder } from "@/services/OrderService";
import { PaymentService } from "@/services/PaymentService";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types/models";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

export const CartDrawer = () => {
  const { items, isOpen, close, updateQty, remove, clear } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<"idle" | "driving" | "done">("idle");
  const [savedDetails, setSavedDetails] = useState<{name: string, phone: string, address: string} | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset step when cart closes, and check for saved details when opens
  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      setOrderSuccess("idle");
    } else {
      const stored = localStorage.getItem("greenCanvasUserDetails");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name && parsed.phone && parsed.address) {
            setSavedDetails(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved user details", e);
        }
      }
    }
  }, [isOpen]);

  const hasMicrogreens = useMemo(() => items.some((i) => i.id.startsWith("mg-")), [items]);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Step 1: collect customer details
    if (step === "cart") {
      setStep("details");
      return;
    }

    // Step 2: process order
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;

    setIsProcessing(true);

    // COD: open WhatsApp immediately (synchronous user gesture — no payment wait needed)
    // Online: must wait for payment + order confirmation first
    const whatsAppMessage = buildCartMessage(items, customerName.trim(), customerAddress.trim(), paymentMethod);
    if (paymentMethod === "cod") {
      openWhatsApp(whatsAppMessage);
    }

    try {
      const subtotal = items.reduce((s, i) => s + (i.priceValue ?? 0) * i.qty, 0);
      const totalAmount = subtotal + DELIVERY_CHARGE;

      let paymentDetails: any = null;
      if (paymentMethod === "online") {
        try {
          paymentDetails = await PaymentService.initiateRazorpayPayment({
            amount: totalAmount,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
          });
        } catch (paymentErr: any) {
          toast.error(paymentErr.message || "Payment failed");
          setIsProcessing(false);
          return;
        }
      }

      // Save order to backend (Google Sheets)
      const order = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        paymentMethod,
        items,
        paymentDetails,
      });

      // Save details to localStorage for next time
      localStorage.setItem("greenCanvasUserDetails", JSON.stringify({
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim()
      }));

      // Online: payment confirmed + order saved → now safe to open WhatsApp
      if (paymentMethod === "online") {
        const waUrl = `https://wa.me/${(await import("@/data/catalog")).WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      // 🚚 Truck animation before navigating
      setOrderSuccess("driving");
      setTimeout(() => {
        setOrderSuccess("done");
        setTimeout(() => {
          clear();
          close();
          navigate(`/success?order=${order.orderNumber}`);
        }, 1200);
      }, 1600);

    } catch (err) {
      console.error("Order failed:", err);
      clear();
      close();
      navigate("/success");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-charcoal/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[91] w-full sm:w-[420px] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
              <div>
                <p className="label-eyebrow text-gold">
                  {step === "cart" ? `${items.length} item${items.length !== 1 ? "s" : ""}` : "Your Details"}
                </p>
                <h3 className="font-display text-2xl text-text-dark">
                  {step === "cart" ? "Your Selection" : "Almost Done"}
                </h3>
              </div>
              <button aria-label="Close cart" onClick={close} className="w-11 h-11 inline-flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <AnimatePresence mode="wait">
              {step === "cart" ? (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto px-6 py-4"
                >
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 rounded-full bg-sand/60 flex items-center justify-center mb-4">
                        <span className="text-3xl">🌿</span>
                      </div>
                      <p className="font-display text-xl text-text-dark">Your selection is empty</p>
                      <p className="text-sm text-text-muted mt-2">Add curated greens or a weekly box.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-sand">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="py-4 flex gap-3"
                          >
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-text-dark text-sm leading-snug truncate">{item.name}</p>
                              <p className="text-xs text-text-muted truncate">{item.short}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 bg-sand/60 rounded-full p-1">
                                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center active:scale-90 transition-transform"><Minus className="w-3 h-3" /></button>
                                  <motion.span key={item.qty} initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="text-xs w-6 text-center font-medium">{item.qty}</motion.span>
                                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full bg-cream inline-flex items-center justify-center active:scale-90 transition-transform"><Plus className="w-3 h-3" /></button>
                                </div>
                                <span className="text-sm font-semibold text-forest">{item.price}</span>
                              </div>
                            </div>
                            <button aria-label="Remove" onClick={() => remove(item.id)} className="text-text-muted hover:text-forest"><X className="w-4 h-4" /></button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
                >
                  <p className="text-sm text-text-muted">We'll include your name in the WhatsApp message so we can personalise your order.</p>
                  
                  {savedDetails && (
                    <div className="mb-4 p-4 bg-forest/10 border border-forest/20 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-[10px] font-bold text-forest mb-1 uppercase tracking-widest">Saved Address Found</h4>
                          <p className="text-sm text-text-dark font-semibold">{savedDetails.name}</p>
                          <p className="text-xs text-text-muted">{savedDetails.phone}</p>
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">{savedDetails.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => {
                            setCustomerName(savedDetails.name);
                            setCustomerPhone(savedDetails.phone);
                            setCustomerAddress(savedDetails.address);
                            setSavedDetails(null); // Hide the card after filling
                          }}
                          className="flex-1 text-xs px-3 py-2 bg-forest text-white rounded-lg hover:bg-forest/90 font-medium transition-colors"
                        >
                          Use this Address
                        </button>
                        <button 
                          onClick={() => setSavedDetails(null)}
                          className="text-xs px-3 py-2 bg-cream text-text-dark border border-sand rounded-lg hover:bg-mist font-medium transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold tracking-widest uppercase text-sage block mb-2">Your Name</label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-sand/40 border border-sand focus-within:border-forest transition-colors">
                      <User className="w-4 h-4 text-text-muted shrink-0" />
                      <input
                        className="flex-1 bg-transparent text-sm text-text-dark outline-none placeholder:text-text-muted/60"
                        placeholder="e.g. Priya Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold tracking-widest uppercase text-sage block mb-2">Phone Number</label>
                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl bg-sand/40 border border-sand focus-within:border-forest transition-colors">
                      <Phone className="w-4 h-4 text-text-muted shrink-0" />
                      <input
                        className="flex-1 bg-transparent text-sm text-text-dark outline-none placeholder:text-text-muted/60"
                        placeholder="+91 98765 43210"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <AddressAutocomplete
                    value={customerAddress}
                    onChange={setCustomerAddress}
                  />
                  <button onClick={() => setStep("cart")} className="text-sm text-text-muted hover:text-forest transition-colors">← Back to cart</button>
                </motion.div>
              )}
            </AnimatePresence>

            {items.length > 0 && (
              <div className="border-t border-sand px-6 py-5 space-y-4">
                {step === "cart" && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-forest/5 border border-forest/10 p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <Truck className="w-4 h-4 text-forest mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-text-dark">Delivery Charge</p>
                        <p className="text-xs text-text-muted">Flat ₹{DELIVERY_CHARGE} across Hyderabad</p>
                      </div>
                      <span className="font-display text-base text-forest font-semibold">₹{DELIVERY_CHARGE}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-text-dark">
                          {hasMicrogreens ? "7-day harvest cycle" : "24–48 hr delivery"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {hasMicrogreens
                            ? "Microgreens are sown to order — delivered fresh after the 7-day grow cycle."
                            : "Delivered before 11 AM in your slot."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Payment Selection */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-sage">Payment Method</p>
                  
                  {/* Razorpay Option */}
                  <motion.div
                    layout
                    onClick={() => setPaymentMethod("online")}
                    className={`rounded-xl border-2 p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === "online" ? "border-forest bg-forest/5" : "border-sand bg-transparent hover:bg-sand/30"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === "online" ? "border-forest" : "border-sand"
                    }`}>
                      {paymentMethod === "online" && <div className="w-2.5 h-2.5 rounded-full bg-forest" />}
                    </div>
                    <Banknote className={`w-5 h-5 ${paymentMethod === "online" ? "text-forest" : "text-text-muted"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-dark">Online Payment</p>
                      <p className="text-[11px] text-text-muted">Pay securely via Razorpay (UPI, Cards, NetBanking)</p>
                    </div>
                  </motion.div>

                  {/* COD Option */}
                  <motion.div
                    layout
                    onClick={() => setPaymentMethod("cod")}
                    className={`rounded-xl border-2 p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === "cod" ? "border-forest bg-forest/5" : "border-sand bg-transparent hover:bg-sand/30"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === "cod" ? "border-forest" : "border-sand"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-forest" />}
                    </div>
                    <Truck className={`w-5 h-5 ${paymentMethod === "cod" ? "text-forest" : "text-text-muted"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-dark">Cash on Delivery</p>
                      <p className="text-[11px] text-text-muted">Pay when you receive your fresh box</p>
                    </div>
                  </motion.div>
                </div>

                {/* Hidden SVG goo filter */}
                <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
                  <defs>
                    <filter id="cart-goo">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                      <feColorMatrix in="blur" mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo" />
                      <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                  </defs>
                </svg>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || orderSuccess !== "idle" || (step === "details" && (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()))}
                  className="blob-checkout-btn"
                  style={{
                    position: "relative",
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "9999px",
                    border: "2px solid #25D366",
                    background: "transparent",
                    color: "#25D366",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "color 0.4s",
                    outline: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 8px 24px rgba(37,211,102,0.25)",
                    opacity: (isProcessing || orderSuccess !== "idle") ? 0.8 : 1,
                  }}
                  onMouseEnter={e => {
                    if (orderSuccess !== "idle") return;
                    const btn = e.currentTarget;
                    btn.style.color = "#ffffff";
                    btn.querySelectorAll<HTMLElement>(".checkout-blob").forEach(b => {
                      b.style.transform = "translateZ(0) scale(1.4)";
                    });
                  }}
                  onMouseLeave={e => {
                    if (orderSuccess !== "idle") return;
                    const btn = e.currentTarget;
                    btn.style.color = "#25D366";
                    btn.querySelectorAll<HTMLElement>(".checkout-blob").forEach(b => {
                      b.style.transform = "translate3d(0,150%,0) scale(1.4)";
                    });
                  }}
                >
                  {/* Blob inner container */}
                  <span style={{
                    position: "absolute", inset: 0,
                    borderRadius: "9999px",
                    overflow: "hidden",
                    zIndex: 0,
                    background: "transparent"
                  }}>
                    <span style={{ display: "block", position: "relative", height: "100%", filter: "url('#cart-goo')" }}>
                      {[0, 1, 2, 3].map(i => (
                        <span
                          key={i}
                          className="checkout-blob"
                          style={{
                            position: "absolute",
                            top: "2px",
                            left: `${i * 25}%`,
                            width: "25%",
                            height: "100%",
                            background: orderSuccess === "done" ? "#16a34a" : "#25D366",
                            borderRadius: "50%",
                            transform: orderSuccess !== "idle"
                              ? "translateZ(0) scale(1.4)"
                              : "translate3d(0,150%,0) scale(1.4)",
                            transition: `transform 0.45s ${i * 0.08}s`,
                          }}
                        />
                      ))}
                    </span>
                  </span>

                  {/* Button content */}
                  <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "8px",
                    color: orderSuccess !== "idle" ? "#fff" : "inherit"
                  }}>
                    <AnimatePresence mode="wait">
                      {orderSuccess === "idle" && (
                        <motion.span key="idle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MessageCircle size={16} />
                          {isProcessing ? "Processing..."
                            : step === "cart" ? "Continue to Checkout"
                            : paymentMethod === "online" ? "Pay securely via Razorpay"
                            : "Confirm Order via WhatsApp"}
                        </motion.span>
                      )}
                      {orderSuccess === "driving" && (
                        <motion.span key="driving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "space-between", padding: "0 8px" }}>
                          <span style={{ fontSize: "11px", opacity: 0.8 }}>On the way</span>
                          <motion.span initial={{ x: -20 }} animate={{ x: 60 }} transition={{ duration: 1.5, ease: "easeInOut" }}>🚚</motion.span>
                          <span>🏡</span>
                        </motion.span>
                      )}
                      {orderSuccess === "done" && (
                        <motion.span key="done" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          ✅ Order Placed!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
