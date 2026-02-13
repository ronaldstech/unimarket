import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, getDocs, limit, startAfter, where, orderBy } from 'firebase/firestore';
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

            // Normalize category for case-insensitive matching
            const normalizedCategory = selectedCategory && typeof selectedCategory === "string" ? selectedCategory.toLowerCase() : selectedCategory;

            let q = query(productsRef, limit(PAGE_SIZE));

            if (normalizedCategory !== "all") {
                q = query(productsRef, where("category", "==", normalizedCategory), limit(PAGE_SIZE));
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

                lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
                setProducts(prev => isInitial ? fetchedProducts : [...prev, ...fetchedProducts]);

                if (querySnapshot.docs.length < PAGE_SIZE) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            // Check for missing index error (Firebase provides a link in the error message)
            if (err.message && err.message.includes("index")) {
                console.error("FIREBASE INDEX ERROR: You likely need to create a composite index. Check the console for a link or visit the Firebase Console > Firestore > Indexes.");
            }
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
