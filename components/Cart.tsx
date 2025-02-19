import { useCart } from "@/context/cart";
import Tint from "./Tint";
import { useState } from "react";
import Image from "next/image";

export default function Cart({ setCartOpen }: { setCartOpen: any }) {

  const { items, addItem, removeItem, totalPrice, totalItems, updateQuantity, clearCart } = useCart();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      console.log("Cart is empty");
      return;
    }

    setLoadingCheckout(true);

    const lineItems = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    const response = await fetch(`/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lineItems }),
    });

    const data = await response.json();

    if (data.error) {
      setLoadingCheckout(false);
      setCheckoutError(true);
      return;
    }

    window.location.href = data.checkoutUrl;
    // setLoadingCheckout(false);
    setCartOpen(false);
    clearCart();
  }

  return(
    <div className="cart" onClick={() => setCartOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <Tint />
        {/* Header */}
        {items.length <= 0 ? 
          <div className="relative text-center text-2xl md:text-3xl font-medium tracking-[-0.01em]">Your cart is empty.</div> : 
          <div className="relative text-3xl font-medium text-center">Cart</div>
        }
        {/* Items */}
        {items.length > 0 && <div className="relative flex flex-col max-h-[55vh] overflow-y-scroll gap-8 my-8 font-medium text-xs md:text-sm leading-tight">
          {items.map((item, index) => (
            <div className="flex gap-4" key={index}>
              <div className="aspect-square w-1/3">
                <Image 
                  src={item.images[0].src}
                  alt={item.title}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div>{item.title} {item.variants.length > 1 && `(${item.variants.find(v => v.id === item.variantId)?.title})`}</div>
                  <div>€{Number(item.variants[0]?.price.amount).toFixed(2)}</div>
                  <div className="flex gap-2">
                    <button className="text-xs md:text-sm" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>-</button>
                    <div>{item.quantity}</div>
                    <button className="text-xs md:text-sm" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>Item Total</div>
                  <div>€{item.variants.find(v => v.id === item.variantId)?.price.amount * item.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>}
        {/* Summary */}
        {items.length > 0 && <div className="relative">
          <div className="font-medium my-4">
            <div className="flex justify-between items-center text-sm md:text-base">
              <div>SUBTOTAL</div>
              <div>€{items.reduce((acc: any, item: any) => acc + item.variants.find((v: any) => v.id === item.variantId)?.price.amount * item.quantity, 0)}</div>
            </div>
            <p className="text-xs md:text-sm">VAT and shipping are calculated at checkout.</p>
          </div>
          <div className="">
            <button 
              className="relative w-full serif font-bold text-2xl md:text-3xl group overflow-hidden border-y border-black text-center p-2" 
              onClick={handleCheckout} 
              disabled={loadingCheckout}
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500 ease-in-out">
                {loadingCheckout ? 'Loading...' : 'Checkout'}
              </span>
              <div className="absolute inset-0 bg-black w-full h-full -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            </button>
            {checkoutError && <div className="text-[var(--red)] text-center text-sm font-bold mt-2">Error Processing Checkout</div>}
          </div>
        </div>}
      </div>
    </div>
  );
}