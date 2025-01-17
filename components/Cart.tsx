import Tint from "./Tint";
import { useState } from "react";

export default function Cart() {

  const [items, setItems] = useState(3);

  return(
    <div className="cart">
      <div className="modal">
        <Tint />
        {/* Header */}
        {items <= 0 ? 
          <div className="relative text-center text-3xl font-medium tracking-[-0.01em]">Your cart is empty.</div> : 
          <div className="relative text-3xl font-medium text-center">Cart</div>
        }
        {/* Items */}
        {items > 0 && <div className="relative flex flex-col gap-8 my-8 font-medium text-xs leading-tight">
          {Array.from({length: items}).map((_, index) => (
            <div className="flex gap-4" key={index}>
              <div className="aspect-square w-1/3 bg-white"/>
              <div className="flex flex-col justify-between">
                <div>
                  <div>Product {index + 1}</div>
                  <div>€10.00</div>
                  <div className="flex gap-2">
                    <button className="text-xs">-</button>
                    <div>1</div>
                    <button className="text-xs">+</button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>Item Total</div>
                  <div>€10.00</div>
                </div>
              </div>
            </div>
          ))}
        </div>}
        {/* Summary */}
        {items > 0 && <div className="relative">
          <div className="font-medium my-4">
            <div className="flex justify-between items-center text-sm">
              <div>SUBTOTAL</div>
              <div>€30.00</div>
            </div>
            <p className="text-xs">VAT and shipping are calculated at checkout.</p>
          </div>
          <div className="border-y border-black text-center p-2">
            <button className="serif font-bold text-2xl">Checkout</button>
          </div>
        </div>}
      </div>
    </div>
  );
}