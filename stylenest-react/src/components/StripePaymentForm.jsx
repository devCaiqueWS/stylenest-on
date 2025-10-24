import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function StripePaymentForm({ items = [], amount = 0, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        // Default to Netlify Functions path when deploying to Netlify
        const serverUrl = import.meta.env.VITE_PAYMENT_SERVER_URL || "./.netlify/functions";
        const body = { items };
        // If parent provided an explicit amount (in BRL float), convert to cents and send
        if (amount && typeof amount === "number") {
          body.amount = Math.round(amount * 100);
        }

        // Use a relative functions path when serverUrl points to the Netlify functions folder
        const functionsBase = serverUrl.replace(/\/$/, '');
        const endpoint = functionsBase.endsWith('/.netlify/functions') || functionsBase.startsWith('./')
          ? `${functionsBase}/create-payment-intent`
          : `${functionsBase}/create-payment-intent`;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create PaymentIntent");
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Erro ao iniciar pagamento");
        if (onError) onError(err);
      }
    }

    if ((items && items.length > 0) || amount > 0) createPaymentIntent();
  }, [items, amount, onError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setMessage(null);

    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name, email },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
        if (onError) onError(result.error);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMessage("Pagamento confirmado com sucesso!");
        if (onSuccess) onSuccess(result.paymentIntent);
      } else {
        setMessage("Pagamento não finalizado.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erro ao processar pagamento");
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment-form">
      <div className="payment-header">
        <h4>Pagamento com cartão</h4>
        {amount > 0 && <div className="amount">Total: {formatCurrency(amount)}</div>}
      </div>
      {!clientSecret && <p>Iniciando pagamento...</p>}
      {message && <div className="payment-message">{message}</div>}
      {clientSecret && (
        <form onSubmit={handleSubmit} className="payment-form">
          <label>
            Nome
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label>
            Cartão
            <div className="card-element-wrapper">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
          </label>

          <button type="submit" disabled={!stripe || loading} className="btn">
            {loading ? "Processando..." : "Pagar"}
          </button>
        </form>
      )}
    </div>
  );
}
