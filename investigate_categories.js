import { collection, getDocs, limit } from 'firebase/firestore';
import { db } from './src/lib/firebase.js';

async function checkProducts() {
    try {
        const productsRef = collection(db, "data", "stock", "products");
        const querySnapshot = await getDocs(limit(productsRef, 20));

        console.log("Found", querySnapshot.size, "products");
        const categories = new Set();
        querySnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`Product: ${data.title}, Category: "${data.category}"`);
            categories.add(data.category);
        });

        console.log("\nUnique Categories in DB:", Array.from(categories));

        const categoriesRef = collection(db, "data", "stock", "categories");
        const catSnapshot = await getDocs(categoriesRef);
        console.log("\nCategories Collection:");
        catSnapshot.forEach(doc => {
            console.log(`ID: ${doc.id}, Name: "${doc.data().name}"`);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

checkProducts();
