import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, getDocs, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PAGE_SIZE = 6;

export function useProducts(selectedCategory = "All") {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const lastDocRef = useRef(null);

    const fetchProducts = useCallback(async (isInitial = true) => {
        if (isInitial) {
            setLoading(true);
            setProducts([]);
            lastDocRef.current = null;
            setHasMore(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const productsRef = collection(db, "data", "stock", "products");
            let q = query(productsRef, limit(PAGE_SIZE));

            if (selectedCategory !== "All") {
                q = query(productsRef, where("category", "==", selectedCategory), limit(PAGE_SIZE));
            }

            if (!isInitial && lastDocRef.current) {
                q = query(q, startAfter(lastDocRef.current));
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setHasMore(false);
            } else {
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
                        school: data.school,
                        stock: data.stock
                    };
                });

                lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                setProducts(prev => isInitial ? fetchedProducts : [...prev, ...fetchedProducts]);

                if (querySnapshot.docs.length < PAGE_SIZE) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchProducts(true);
    }, [fetchProducts]);

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(false);
        }
    };

    return { products, loading, loadingMore, error, hasMore, loadMore };
}
