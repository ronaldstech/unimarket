import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [message, setMessage] = useState('Verifying your transaction with the payment gateway...');
    const [orderDetails, setOrderDetails] = useState(null);
    const tx_ref = searchParams.get('tx_ref');

    useEffect(() => {
        if (!tx_ref) {
            setStatus('failed');
            setMessage('No transaction reference found in the URL.');
            return;
        }

        verifyPayment(tx_ref);
    }, [tx_ref]);

    const verifyPayment = async (reference) => {
        try {
            // 1. Find the order in Firestore first
            const q = query(collection(db, "orders"), where("tx_ref", "==", reference));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setStatus('failed');
                setMessage('Order record not found for this transaction.');
                return;
            }

            const orderDoc = querySnapshot.docs[0];
            const orderData = orderDoc.data();
            setOrderDetails({ id: orderDoc.id, ...orderData });

            // 2. Call PayChangu Verification API
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer sec-live-Bg66AXsH6yJAskyTguhXjrzH06O62L6H'
                }
            };

            const response = await fetch(`https://api.paychangu.com/verify-payment/${reference}`, options);
            const data = await response.json();

            if (data.status === 'success' && data.data.status === 'success') {
                // 3. Update Order Status
                await updateDoc(doc(db, "orders", orderDoc.id), {
                    status: 'success',
                    paymentDetails: data.data // Store full payment response for audit
                });
                setStatus('success');
                setMessage('Payment verified successfully! Your order is now being processed.');
            } else {
                await updateDoc(doc(db, "orders", orderDoc.id), {
                    status: 'failed',
                    paymentFailureReason: data.message || 'Gateway verification failed'
                });
                setStatus('failed');
                setMessage(data.message || 'Payment verification failed. Please try again or contact support.');
            }

        } catch (error) {
            console.error('Verification Error:', error);
            setStatus('failed');
            setMessage('A connection error occurred while verifying your payment.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-border/10"
            >
                {status === 'verifying' && (
                    <div className="flex flex-col items-center py-10">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Verifying Payment</h2>
                        <p className="text-muted-foreground text-sm font-medium">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-emerald-900">Payment Successful</h2>
                        <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs mx-auto">{message}</p>

                        <div className="w-full bg-secondary/30 rounded-xl p-4 mb-8 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Reference</span>
                                <span className="text-[10px] font-black">{tx_ref}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Amount</span>
                                <span className="text-[10px] font-black">MWK {orderDetails?.total?.toLocaleString()}</span>
                            </div>
                        </div>

                        <Link
                            to="/orders"
                            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                            <span>Start generating Receipt</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-red-900">Payment Failed</h2>
                        <p className="text-muted-foreground text-sm font-medium mb-8 max-w-xs mx-auto">{message}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <Link
                                to="/cart"
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                            >
                                Try Again
                            </Link>
                            <Link
                                to="/browse"
                                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary py-2"
                            >
                                Return to Shop
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>

            <div className="mt-12 opacity-30 grayscale">
                <img src="/logo.png" alt="Unimarket" className="h-8" />
            </div>
        </div>
    );
}
