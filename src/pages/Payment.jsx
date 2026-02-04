import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaCreditCard, FaArrowLeft, FaUser, FaStore, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ plan, userDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const toastId = toast.loading("Processing Payment...");

    try {
      // 1. Create Stripe Payment Method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          phone: userDetails.mobile,
          address: {
            line1: userDetails.address,
            city: userDetails.city,
            postal_code: userDetails.pincode,
            country: 'IN',
          },
        },
      });

      if (error) throw new Error(error.message);

      // 2. Create Payment Intent (Client-side simulation logic)
      const amountInPaise = parseInt(plan.rawPrice || plan.price.replace(/[^0-9]/g, '')) * 100;

      const response = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: amountInPaise,
          currency: 'inr',
          'payment_method_types[]': 'card',
          description: `Subscription: ${plan.duration} - ${userDetails.storeName} (${userDetails.storeId})`,
        }),
      });

      const paymentData = await response.json();
      if (paymentData.error) throw new Error(paymentData.error.message);

      // 3. Confirm Payment
      const confirmResult = await stripe.confirmCardPayment(paymentData.client_secret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.error) throw new Error(confirmResult.error.message);

      if (confirmResult.paymentIntent.status === 'succeeded') {

        // ✅ 4. Store Payment History (Including StoreID)
        await addDoc(collection(db, "subscribed_payments"), {
          uid: userDetails.uid,
          paymentId: confirmResult.paymentIntent.id,
          amount: amountInPaise / 100,
          currency: 'inr',
          status: 'succeeded',
          planName: plan.duration,
          planDuration: plan.period,
          storeId: userDetails.storeId || "N/A", // ✅ Storing Store ID
          storeName: userDetails.storeName,
          customerName: `${userDetails.firstName} ${userDetails.lastName}`,
          email: userDetails.email,
          mobile: userDetails.mobile,
          purchasedAt: new Date(),
        });

        // ✅ 5. UPDATE Admin Status (Activate)
        if (userDetails.uid) {
          const userRef = doc(db, "adminDetails", userDetails.uid);
          await updateDoc(userRef, {
            subscriptionStatus: 'active',
            plan: plan.duration,
            updatedAt: new Date()
          });
        }

        toast.success("Payment Successful! Account Activated.", { id: toastId });
        navigate('/order-success', { state: { ...confirmResult.paymentIntent, planName: plan.duration } });
      }

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Payment Failed", { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: { color: "#fff", fontFamily: '"Inter", sans-serif', fontSize: "16px", "::placeholder": { color: "#94a3b8" }, iconColor: "#3b82f6" },
      invalid: { color: "#ef4444", iconColor: "#ef4444" }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Card Details</label>
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-700/80 focus-within:border-blue-500 transition-colors shadow-inner">
          <CardElement options={cardStyle} />
        </div>
      </div>
      <button type="submit" disabled={!stripe || processing} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all">
        {processing ? "Processing..." : <><FaLock /> Pay {plan.price}</>}
      </button>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, ...userDetails } = location.state || {};

  useEffect(() => { if (!plan) navigate('/services'); }, [plan, navigate]);
  if (!plan) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 flex items-center justify-center font-sans">
      <Toaster position="top-right" />

      <div className="max-w-lg w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition"><FaArrowLeft /></button>
          <h2 className="text-xl font-bold">Secure Checkout</h2>
        </div>

        {/* User & Store Details Display */}
        <div className="bg-slate-950/50 rounded-2xl p-5 mb-6 border border-white/5 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer & Plan Details</h3>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><FaStore /></div>
            <div>
              <p className="text-sm font-bold text-white">{userDetails.storeName}</p>
              <p className="text-xs text-slate-400 font-mono">{userDetails.storeId}</p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-slate-500 text-xs" />
              <span className="text-sm text-slate-300 truncate">{userDetails.firstName} {userDetails.lastName}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-slate-500 text-xs" />
              <span className="text-sm text-slate-300">{userDetails.mobile}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-slate-500 text-xs" />
            <span className="text-sm text-slate-300 truncate">{userDetails.email}</span>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="bg-linear-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-5 mb-8 border border-blue-500/20">
          <div className="flex justify-between items-center text-sm text-blue-200 mb-1">
            <span>Selected Plan</span>
            <span className="font-bold">{plan.duration}</span>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-white">
            <span>Total Payable</span>
            <span>{plan.price}</span>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm plan={plan} userDetails={userDetails} />
        </Elements>

        <p className="text-[10px] text-center text-slate-600 mt-6">
          Payments are encrypted and secured by Stripe.
        </p>
      </div>
    </div>
  );
};

export default Payment;