"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Lock,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  ArrowLeft,
  X,
  Package,
  Shield,
  Clock,
} from "lucide-react";
import { ffListings } from "@/lib/ff-data";

interface CartItem {
  id: string;
  product: string;
  brand: string;
  price: number;
  quantity: number;
  maxQty: number;
  image?: string;
}

export default function FFShop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categories = ["All", ...Array.from(new Set(ffListings.map((l) => l.category)))];

  const filteredListings = ffListings.filter((l) => {
    if (l.status === "Upcoming") return false;
    const catMatch = categoryFilter === "All" || l.category === categoryFilter;
    const searchMatch =
      !searchQuery ||
      l.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const addToCart = (listing: typeof ffListings[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === listing.id);
      if (existing) {
        if (existing.quantity >= listing.maxPerBuyer) return prev;
        return prev.map((c) =>
          c.id === listing.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, {
        id: listing.id,
        product: listing.product,
        brand: listing.brand,
        price: listing.ffPrice,
        quantity: 1,
        maxQty: listing.maxPerBuyer,
        image: listing.image,
      }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: Math.max(0, Math.min(c.quantity + delta, c.maxQty)) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartItems = cart.reduce((s, c) => s + c.quantity, 0);
  const spendingCap = 200;
  const remainingBudget = spendingCap - cartTotal;

  const handleCheckout = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Top bar — branded white-label header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2D1B4E] to-[#6B3FA0] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">L&apos;Oréal Employee F&F Store</h1>
              <p className="text-[10px] text-gray-500">Friends & Family Sale · Apr 25 – May 2, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#6B3FA0]/40 w-64 bg-gray-50"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Lock size={12} className="text-[#6B3FA0]" />
              <span>SSO Verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <User size={14} />
              <span className="font-medium">Sarah Chen</span>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-1.5 bg-[#6B3FA0] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#4A2B73] transition-colors"
            >
              <ShoppingCart size={14} />
              Cart
              {cartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {cartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-[#2D1B4E] to-[#6B3FA0] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-purple-300" />
            <span className="text-[10px] text-purple-300 uppercase tracking-widest font-medium">Invite Only · Verified Employees</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Friends & Family Exclusive Sale</h2>
          <p className="text-sm text-purple-200 max-w-xl">
            Up to 60% off across premium beauty brands. Limited quantities — fair access guaranteed with per-item purchase limits.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-lg font-bold">${remainingBudget.toFixed(2)}</p>
              <p className="text-[10px] text-purple-200">Budget Remaining</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2">
              <p className="text-lg font-bold">{ffListings.filter((l) => l.status === "Live").length}</p>
              <p className="text-[10px] text-purple-200">Products Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
              <Clock size={14} className="text-yellow-300" />
              <div>
                <p className="text-sm font-bold">3 days left</p>
                <p className="text-[10px] text-purple-200">Sale ends May 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-[#6B3FA0] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredListings.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            const isSoldOut = item.status === "Sold Out";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md ${
                  isSoldOut ? "opacity-60" : ""
                }`}
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center h-48">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />
                  ) : (
                    <Package size={40} className="text-gray-300" />
                  )}
                  {item.ffDiscount >= 60 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      HOT DEAL
                    </span>
                  )}
                  {isSoldOut && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">SOLD OUT</span>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-[#6B3FA0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{item.ffDiscount}%
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{item.brand}</p>
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-relaxed">{item.product}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#6B3FA0]">${item.ffPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 line-through">${item.retailPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>Max {item.maxPerBuyer} per person</span>
                    {item.remainingQty > 0 && item.remainingQty <= 100 && (
                      <span className="text-red-500 font-medium">Only {item.remainingQty} left</span>
                    )}
                  </div>
                  {!isSoldOut && (
                    <>
                      {inCart ? (
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold">{inCart.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            disabled={inCart.quantity >= item.maxPerBuyer}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full bg-[#6B3FA0] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#4A2B73] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus size={12} /> Add to Cart
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo watermark */}
      <div className="fixed bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xs z-50 flex items-center gap-2">
        <ShoppingBag size={14} />
        <span>White-label F&F Buyer Frontend (Demo)</span>
        <a href="/channels" className="text-purple-300 hover:text-purple-200 ml-2 flex items-center gap-1">
          <ArrowLeft size={10} /> Back to Seller View
        </a>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <ShoppingCart size={16} /> Your Cart ({cartItems})
              </h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.product} className="max-h-full max-w-full object-contain p-1" />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-500 font-medium">{item.brand}</p>
                      <p className="text-xs font-medium text-gray-900 truncate">{item.product}</p>
                      <p className="text-sm font-bold text-[#6B3FA0] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        disabled={item.quantity >= item.maxQty}
                        className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        <Plus size={10} />
                      </button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        <Minus size={10} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Spending Cap Remaining</span>
                  <span className={`font-medium ${remainingBudget < 0 ? "text-red-500" : "text-green-600"}`}>
                    ${remainingBudget.toFixed(2)}
                  </span>
                </div>
                {remainingBudget < 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2">
                    <Lock size={12} className="text-red-500" />
                    <p className="text-[10px] text-red-600">You have exceeded your spending cap of $200.</p>
                  </div>
                )}
                <button
                  onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  disabled={remainingBudget < 0 || cart.length === 0}
                  className="w-full bg-[#6B3FA0] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#4A2B73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout · ${cartTotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in">
            {!orderPlaced ? (
              <>
                <div className="p-5 border-b border-gray-200">
                  <h3 className="text-base font-semibold">Checkout</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Employee</span>
                      <span className="font-medium">Sarah Chen (sarah.chen@loreal.com)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Department</span>
                      <span className="font-medium">Marketing</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Items</span>
                      <span className="font-medium">{cartItems} items</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-gray-200 pt-2">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-[#6B3FA0]">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <p className="text-xs text-green-700">Payment will be deducted from your next payroll</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCheckout}
                      className="flex-1 bg-[#6B3FA0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#4A2B73] transition-colors"
                    >
                      Place Order
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Order Placed!</h3>
                <p className="text-sm text-gray-500">
                  Your order will be shipped to the L&apos;Oréal Indonesia office within 2-3 business days.
                  A confirmation has been sent to sarah.chen@loreal.com.
                </p>
                <p className="text-xs text-gray-400">Order ID: FFO-{String(Math.floor(Math.random() * 900 + 100))}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
