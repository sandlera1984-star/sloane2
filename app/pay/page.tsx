"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Modal from "@/components/Modal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripeInfo, setStripeInfo] = useState<{
    customerId: string;
    subscriptionId: string;
    subscriptionStatus: string;
  } | null>(null);

  const handleStartPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setTermsOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const response = await fetch("/api/stripe/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Unable to start subscription");
      setLoading(false);
      return;
    }
    const data = await response.json();
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Missing card details");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { email },
      },
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    setStripeInfo({
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      subscriptionStatus: data.subscriptionStatus,
    });
    setAccountOpen(true);
    setTermsOpen(false);
    setLoading(false);
  };

  const handleCreateAccount = async () => {
    if (!stripeInfo) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
        subscriptionStatus: stripeInfo.subscriptionStatus,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Account creation failed");
      setLoading(false);
      return;
    }
    router.push("/exclusive");
  };

  return (
    <div className="card p-10">
      <h1 className="text-3xl font-semibold">Subscribe for $5 CAD / month</h1>
      <p className="mt-2 text-sm text-night/60">
        Unlock the full gallery and receive immediate access to new drops.
      </p>
      <form onSubmit={handleStartPayment} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <div className="rounded-2xl border border-rose/40 bg-white/80 px-4 py-5">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="button-primary w-full" disabled={!stripe}>
          Continue
        </button>
      </form>

      <Modal
        title="Terms & Conditions"
        open={termsOpen}
        onClose={() => (loading ? null : setTermsOpen(false))}
        footer={
          <>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
              />
              I agree to the Terms & Conditions
            </label>
            <button
              type="button"
              className="button-primary"
              disabled={!agree || loading}
              onClick={handleConfirmPayment}
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </>
        }
      >
        <p>
          By subscribing, you authorize recurring monthly billing of CAD $5.00 until
          cancellation. You may cancel anytime and access continues through the billing
          period. No refunds are provided unless required by law. Service is provided
          “as is” without warranties. We limit liability to the fullest extent permitted
          by law and are not liable for indirect damages. You agree to indemnify us from
          misuse of the platform and follow acceptable use standards. Privacy practices
          are described in our privacy notice. Chargebacks or disputes may result in
          account suspension. Contact support for billing questions.
        </p>
      </Modal>

      <Modal
        title="Create your account"
        open={accountOpen}
        footer={
          <button
            type="button"
            className="button-primary"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        }
      >
        <div className="space-y-4">
          <input type="email" value={email} readOnly className="input" />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="input"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default function PayPage() {
  const options = useMemo(() => ({ appearance: { theme: "stripe" } }), []);
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-6 py-12">
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm />
      </Elements>
    </main>
  );
}
