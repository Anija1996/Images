import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            localStorage.removeItem("cart");
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, size = product.sizes?.[0], color = product.colors?.[0]) => {
        setCart((current) => {
            const existing = current.find(
                (item) => item.id === product.id && item.size === size && item.color === color
            );

            if (existing) {
                return current.map((item) =>
                    item.id === product.id && item.size === size && item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...current, { ...product, quantity, size, color }];
        });
    };

    const updateQuantity = (id, size, color, quantity) => {
        if (quantity < 1) {
            removeFromCart(id, size, color);
            return;
        }

        setCart((current) =>
            current.map((item) =>
                item.id === id && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (id, size, color) => {
        setCart((current) =>
            current.filter((item) => !(item.id === id && item.size === size && item.color === color))
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const value = useMemo(
        () => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }),
        [cart, cartCount, cartTotal]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}