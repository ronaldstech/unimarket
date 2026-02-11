import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Try fetching from the suggested path based on products structure
                const categoriesRef = collection(db, "data", "stock", "categories");
                const q = query(categoriesRef, orderBy("name", "asc"));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const fetchedCategories = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setCategories(fetchedCategories);
                } else {
                    // Fallback to derive from products or use defaults if collection empty
                    // For now, let's use the defaults found in Browse.jsx as fallback
                    setCategories([
                        { id: 'all', name: 'All' },
                        { id: 'hygne', name: 'hygne' },
                        { id: 'food', name: 'food' },
                        { id: 'electronics', name: 'electronics' },
                        { id: 'fashion', name: 'fashion' }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError(err);
                // Fallback on error
                setCategories([
                    { id: 'all', name: 'All' },
                    { id: 'hygne', name: 'hygne' },
                    { id: 'food', name: 'food' },
                    { id: 'electronics', name: 'electronics' },
                    { id: 'fashion', name: 'fashion' }
                ]);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
