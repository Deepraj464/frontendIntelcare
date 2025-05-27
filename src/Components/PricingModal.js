import React, { useEffect, useState } from 'react';
import '../Styles/PricingModal.css';
import { PiWarningBold } from "react-icons/pi";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const PricingModal = ({ email }) => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const isDevMode = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');

    useEffect(() => {
        if (email && user?.metadata?.creationTime) {
            fetch(`https://curki-api-ecbybqa6d5bmdzdh.australiaeast-01.azurewebsites.net/check-payment-status?email=${email}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("✅ API Response Body:", data);
                    const status = data.status === 'paid' ? 'paid' : 'not paid';
                    setPaymentStatus(status);

                    if (status === 'paid') {
                        const creationTime = user.metadata.creationTime;
                        const paymentTime = new Date().toISOString();

                        set(ref(db, `users/${user.uid}/paymentInfo`), {
                            email: email,
                            creationTime: creationTime,
                            paymentTime: paymentTime,
                            paymentStatus: status,
                        })
                            .then(() => console.log('✅ Payment info updated in DB'))
                            .catch((error) => console.error('❌ Failed to update DB:', error));
                    } else {
                        console.log('ℹ️ Payment not completed, skipping DB update.');
                    }
                })
                .catch(err => {
                    console.error('❌ Error checking payment status:', err);
                    setPaymentStatus('error');
                });
        }
    }, [email, user]);

    // if (paymentStatus === 'paid') {
    //     return null; // Uncomment to hide modal if paid
    // }

    return (
        <div className='pricing-pop-up-layout'>
            <div className="pricing-popup">
                <div className='warning'>
                    <PiWarningBold size={24} color='red' />
                    <div>Your Free trial has ended!</div>
                </div>
                <div className="offer-tag">Introductory offer</div>

                <div className="price">
                    $49<span className="price-month">/ Month</span>
                </div>

                <hr />

                <ul className="features">
                    <li>✔ 1 User</li>
                    <li>✔ Unlimited use</li>
                    <li>✔ Access to all features</li>
                    <li>✔ No lock-in, Cancel anytime</li>
                </ul>
                <hr />

                <button
                    className="buy-button"
                    onClick={() => {
                        const emailParam = `?prefilled_email=${email}`;
                        const devUrl = `https://buy.stripe.com/test_4gM7sMcd199udwEaxD5kk00${emailParam}`;
                        const prodUrl = `https://buy.stripe.com/3csbJ40Bv5Y26mQfYY${emailParam}`;
                        window.location.href = isDevMode ? devUrl : prodUrl;
                    }}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default PricingModal;
