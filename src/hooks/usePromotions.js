import { useState, useEffect } from 'react';
import { collection, query, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function usePromotions(count = 6) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const productsRef = collection(db, "data", "stock", "products");

                // We fetch products where isPromotion is true
                const q = query(
                    productsRef,
                    where("isPromotion", "==", true),
                    limit(count)
                );

                const querySnapshot = await getDocs(q);
                const fetchedProducts = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.title || "Untitled Product",
                        price: parseFloat(data.price) || 0,
                        originalPrice: parseFloat(data.actualPrice) || 0,
                        category: data.category || "General",
                        description: data.description || "",
                        image: data.images && data.images.length > 0
                            ? data.images[0]
                            : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80",
                        images: data.images || [],
                        school: data.school,
                        stock: data.stock,
                        variants: data.variants || [],
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        isNew: data.isNew,
                        isPromotion: data.isPromotion,
                        promotionLabel: data.promotionLabel,
                        discount: data.discount
                    };
                });

                // If no specific promotions found via flag, fallback to products with discount field
                if (fetchedProducts.length === 0) {
                    const fallbackQuery = query(
                        productsRef,
                        where("discount", ">", 0),
                        limit(count)
                    );
                    const fallbackSnapshot = await getDocs(fallbackQuery);
                    const fallbacks = fallbackSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.title || "Untitled Product",
                            price: parseFloat(data.price) || 0,
                            originalPrice: parseFloat(data.actualPrice) || 0,
                            category: data.category || "General",
                            description: data.description || "",
                            image: data.images && data.images.length > 0
                                ? data.images[0]
                                : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80",
                            images: data.images || [],
                            school: data.school,
                            stock: data.stock,
                            variants: data.variants || [],
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                            isNew: data.isNew,
                            isPromotion: data.isPromotion,
                            promotionLabel: data.promotionLabel,
                            discount: data.discount
                        };
                    });
                    setProducts(fallbacks);
                } else {
                    setProducts(fetchedProducts);
                }
            } catch (err) {
                console.error("Error fetching promotions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [count]);

    return { products, loading };
}
