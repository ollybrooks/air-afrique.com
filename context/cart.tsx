import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  price: any;
  image?: string;
  variants: any[];
  images: any[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (variantId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    // Ensure quantity is at least 1
    if (!newItem.quantity || newItem.quantity < 1) {
      newItem.quantity = 1;
    }

    setItems(currentItems => {
      // Check if item with same variant ID exists
      const existingItem = currentItems.find(item => item.variantId === newItem.variantId);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      // Add new item
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      setItems(currentItems => currentItems.filter(item => item.variantId !== variantId));
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
