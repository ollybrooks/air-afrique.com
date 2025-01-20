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
  updateQuantity: (id: string, quantity: number) => void;
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

    // Assume newItem has a variants array and we need to use the first variant
    const { title, variants } = newItem;
    const variant = variants[0];

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.variantId === variant.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      // For new items, ensure we're using the validated quantity, variant, and price
      return [...currentItems, { ...newItem, variantId: variant.id, title, price: variant.price }];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
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
