import { useState, useEffect } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useNewArrivals(count = 6) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const productsRef = collection(db, "data", "stock", "products");
                // This query specifically targets products with a createdAt field
                // Documents missing the field will be excluded, which is intended for this hook
                const q = query(
                    productsRef,
                    orderBy("createdAt", "desc"),
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
                        isPromotion: data.isPromotion,
                        promotionLabel: data.promotionLabel,
                        discount: data.discount
                    };
                });
                setProducts(fetchedProducts);
            } catch (err) {
                console.error("Error fetching new arrivals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, [count]);

    return { products, loading };
}
