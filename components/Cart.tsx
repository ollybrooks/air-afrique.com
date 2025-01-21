import { useCart } from "@/context/cart";
import Tint from "./Tint";
import { useState } from "react";
import Image from "next/image";

export default function Cart() {

  // const [items, setItems] = useState(3);

  const { items, addItem, removeItem, totalPrice, totalItems, updateQuantity, clearCart } = useCart();


  const [loadingCheckout, setLoadingCheckout] = useState(false);

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
    // console.log(data);
    window.location.href = data.checkoutUrl;
    setLoadingCheckout(false);
    // clearCart();
  }

  return(
    <div className="cart">
      <div className="modal">
        <Tint />
        {/* Header */}
        {items.length <= 0 ? 
          <div className="relative text-center text-3xl font-medium tracking-[-0.01em]">Your cart is empty.</div> : 
          <div className="relative text-3xl font-medium text-center">Cart</div>
        }
        {/* Items */}
        {items.length > 0 && <div className="relative flex flex-col gap-8 my-8 font-medium text-xs leading-tight">
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
                  <div>{item.title}</div>
                  <div>€{item.variants[0]?.price.amount}</div>
                  <div className="flex gap-2">
                    <button className="text-xs" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <div>{item.quantity}</div>
                    <button className="text-xs" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>Item Total</div>
                  <div>€{item.variants[0]?.price.amount * item.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>}
        {/* Summary */}
        {items.length > 0 && <div className="relative">
          <div className="font-medium my-4">
            <div className="flex justify-between items-center text-sm">
              <div>SUBTOTAL</div>
              <div>€{items.reduce((acc: any, item: any) => acc + item.price?.amount * item.quantity, 0)}</div>
            </div>
            <p className="text-xs">VAT and shipping are calculated at checkout.</p>
          </div>
          <div className="border-y border-black text-center p-2">
            <button 
              className="serif font-bold text-2xl" 
              onClick={handleCheckout} 
              disabled={loadingCheckout}
            >
              {loadingCheckout ? 'Loading...' : 'Checkout'}
            </button>
          </div>
        </div>}
      </div>
    </div>
  );
}