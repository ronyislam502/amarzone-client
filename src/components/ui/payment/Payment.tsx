"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AZModal from "@/components/shared/AZModal";
import CheckOutForm from "./CheckOutForm";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export interface PaymentProps {
    isOpen: boolean;
    onClose: () => void;
    clientSecret?: string;
    orderId?: string;
    orderNo?: string;
    totalAmount?: number;
    onSuccess?: (transactionId: string) => void;
}

const Payment: React.FC<PaymentProps> = ({
    isOpen,
    onClose,
    clientSecret,
    orderId,
    orderNo,
    totalAmount,
    onSuccess,
}) => {
    return (
        <AZModal
            isOpen={isOpen}
            onClose={onClose}
            title="Complete Payment"
            description="Enter your card details to securely finalize your order via Stripe"
            icon={<CreditCard className="w-5 h-5 text-amber-400" />}
            size="lg"
            closeOnBackdropClick={false}
        >
            <div className="pt-2">
                <Elements stripe={stripePromise}>
                    <CheckOutForm
                        clientSecret={clientSecret}
                        orderId={orderId}
                        orderNo={orderNo}
                        totalAmount={totalAmount}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                </Elements>
            </div>
        </AZModal>
    );
};

export default Payment;
