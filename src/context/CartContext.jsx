import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShoppingBag, Trash2, PlusCircle, MinusCircle } from 'lucide-react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('unimarket_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('unimarket_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const idToMatch = product.cartId || product.id;
            const existingItem = prevCart.find((item) => (item.cartId || item.id) === idToMatch);
            if (existingItem) {
                return prevCart.map((item) =>
                    (item.cartId || item.id) === idToMatch ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1, cartId: idToMatch }];
        });

        const idToMatch = product.cartId || product.id;
        const isExisting = cart.some(item => (item.cartId || item.id) === idToMatch);
        if (isExisting) {
            toast.success(`Increased ${product.name} quantity`, {
                icon: <PlusCircle size={18} className="text-primary" />
            });
        } else {
            toast.success(`Added ${product.name} to Collection`, {
                icon: <ShoppingBag size={18} className="text-primary" />
            });
        }
    };

    const removeFromCart = (cartId) => {
        const itemToRemove = cart.find(item => (item.cartId || item.id) === cartId);
        setCart((prevCart) => prevCart.filter((item) => (item.cartId || item.id) !== cartId));

        if (itemToRemove) {
            toast.success(`Removed ${itemToRemove.name}${itemToRemove.selectedVariantName ? ` (${itemToRemove.selectedVariantName})` : ''}`, {
                icon: <Trash2 size={18} className="text-red-500" />
            });
        }
    };

    const updateQuantity = (cartId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                (item.cartId || item.id) === cartId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
