'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Loader2, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/components/providers/auth-provider';
import { formatPrice } from '@/lib/utils';
import { shippingAddressSchema, type ShippingAddressInput } from '@/lib/validations/checkout';
import { ordersApi } from '@/lib/api';

const steps = ['Shipping Address', 'Payment', 'Review & Place Order'];
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type PaymentState = {
  clientSecret: string;
  paymentId: string;
  mode: 'stripe' | 'mock';
} | null;

function StripePaymentForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: (paymentId: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const submitPayment = async () => {
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Payment could not be confirmed.');
      return;
    }

    if (paymentIntent && ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status)) {
      toast.success('Payment authorized. Review your order to finish.');
      onSuccess(paymentIntent.id);
      return;
    }

    toast.error('Payment is not complete yet. Please try again.');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-center gap-3 font-medium"><CreditCard className="h-5 w-5 text-primary" /> Secure card payment</div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
        <Button className="rounded-full" onClick={submitPayment} disabled={!stripe || !elements || submitting}>
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Confirm payment
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { status, accessToken } = useAuth();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [payment, setPayment] = useState<PaymentState>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const shipping = total > 5000 ? 0 : 699;
  const tax = Math.round(total * 0.0825);
  const grandTotal = total + shipping + tax;

  const form = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { fullName: '', street: '', city: '', state: '', country: 'United States', zip: '', phone: '' },
  });

  const address = form.watch();
  const canReview = useMemo(() => items.length > 0 && total > 0, [items.length, total]);

  useEffect(() => {
    if (step !== 1 || payment || loadingPayment) return;

    let active = true;
    setLoadingPayment(true);

    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ amount: grandTotal, address, items }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Payment setup failed');
        const clientSecret = String(payload.data.clientSecret || '');
        if (!active) return;
        setPayment({
          clientSecret,
          paymentId: clientSecret,
          mode: stripePromise && !clientSecret.startsWith('pi_mock_') ? 'stripe' : 'mock',
        });
      })
      .catch((error) => {
        if (!active) return;
        toast.error(error instanceof Error ? error.message : 'Payment setup failed.');
      })
      .finally(() => {
        if (active) setLoadingPayment(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, address, grandTotal, items, loadingPayment, payment, step]);

  if (status === 'loading') {
    return <div className="min-h-[70vh] px-4 py-16 text-center text-muted-foreground">Preparing secure checkout...</div>;
  }

  if (status === 'guest') {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <ShieldCheck className="mb-4 h-12 w-12 text-primary" />
        <h1 className="font-playfair text-3xl font-bold">Sign in to checkout</h1>
        <p className="mt-3 text-muted-foreground">Checkout is protected so your shipping details, payment status, and order history stay tied to your account.</p>
        <Button className="mt-6 rounded-full" onClick={() => router.push('/login?next=/checkout')}>Go to login</Button>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
        <h1 className="font-playfair text-3xl font-bold">Your cart is ready for a refill</h1>
        <p className="mt-3 text-muted-foreground">Add a few Caffora favorites before starting checkout.</p>
        <Button className="mt-6 rounded-full" onClick={() => router.push('/products')}>Browse products</Button>
      </div>
    );
  }

  const nextFromShipping = form.handleSubmit(() => {
    setPayment(null);
    setPaymentVerified(false);
    setStep(1);
  });

  const placeOrder = async () => {
    if (!paymentVerified || !payment) {
      toast.error('Confirm payment before placing the order.');
      setStep(1);
      return;
    }

    setPlacing(true);
    try {
      if (accessToken) {
        const payload = await ordersApi.create(address, accessToken);
        clearCart();
        toast.success('Order placed successfully.');
        router.push(`/orders/${payload.id}`);
      } else {
        // Fallback for mock/guest mode (though normally they'd be blocked by the auth check earlier)
        const orderId = `ord-${Date.now()}`;
        const order = { id: orderId, items, total: grandTotal, subtotal: total, shipping, tax, status: 'PROCESSING', address, paymentId: payment.paymentId, createdAt: new Date().toISOString() };
        localStorage.setItem(`caffora-order-${orderId}`, JSON.stringify(order));
        clearCart();
        toast.success('Order placed successfully.');
        router.push(`/orders/${orderId}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Unable to place order.');
    } finally {
      setPlacing(false);
    }
  };

  const stripeOptions: StripeElementsOptions | undefined = payment?.mode === 'stripe'
    ? {
        clientSecret: payment.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: { colorPrimary: '#f59e0b', borderRadius: '12px' },
        },
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-playfair text-4xl font-bold">Checkout</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <main className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {steps.map((label, index) => (
                <div key={label} className={`rounded-xl border p-3 text-sm ${index === step ? 'border-primary bg-primary/10 text-foreground' : index < step ? 'border-primary/40 text-foreground' : 'border-border text-muted-foreground'}`}>{index + 1}. {label}</div>
              ))}
            </div>

            {step === 0 && (
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={nextFromShipping} noValidate>
                {(['fullName', 'street', 'city', 'state', 'country', 'zip', 'phone'] as const).map((field) => (
                  <div key={field} className={`space-y-2 ${field === 'street' ? 'sm:col-span-2' : ''}`}>
                    <Label htmlFor={field}>{field === 'zip' ? 'Postal code' : field.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</Label>
                    <Input id={field} {...form.register(field)} aria-describedby={`${field}-error`} aria-invalid={Boolean(form.formState.errors[field])} />
                    {form.formState.errors[field] && <p id={`${field}-error`} className="text-sm text-destructive">{form.formState.errors[field]?.message}</p>}
                  </div>
                ))}
                <div className="flex justify-end sm:col-span-2"><Button type="submit" className="rounded-full">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
              </form>
            )}

            {step === 1 && (
              <div className="space-y-6">
                {loadingPayment ? (
                  <div className="rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Preparing payment form...</div>
                ) : payment?.mode === 'stripe' && stripePromise && stripeOptions ? (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripePaymentForm onBack={() => setStep(0)} onSuccess={(paymentId) => { setPayment((current) => current ? { ...current, paymentId } : current); setPaymentVerified(true); setStep(2); }} />
                  </Elements>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-background p-5">
                      <div className="flex items-center gap-3 font-medium"><CreditCard className="h-5 w-5 text-primary" /> Simulated Stripe payment</div>
                      <p className="mt-2 text-sm text-muted-foreground">Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and connect the backend Stripe secret to render the live Stripe Payment Element. This local mode keeps checkout testable without keys.</p>
                    </div>
                    <div className="flex justify-between gap-3"><Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button><Button className="rounded-full" onClick={() => { setPaymentVerified(true); setStep(2); toast.success('Simulated payment authorized.'); }}>Authorize test payment <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-background p-5">
                  <div className="mb-2 flex items-center gap-2 font-medium"><MapPin className="h-5 w-5 text-primary" /> Shipping to</div>
                  <p className="text-sm text-muted-foreground">{address.fullName}, {address.street}, {address.city}, {address.state} {address.zip}, {address.country}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-5">
                  <div className="mb-2 flex items-center gap-2 font-medium"><ShieldCheck className="h-5 w-5 text-primary" /> Payment</div>
                  <p className="text-sm text-muted-foreground">{payment?.mode === 'stripe' ? 'Stripe payment confirmed' : 'Simulated Stripe payment authorized'}: {payment?.paymentId}</p>
                </div>
                <div className="space-y-3">{items.map(item => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.product.title} x {item.quantity}</span><span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span></div>)}</div>
                <div className="flex justify-between gap-3"><Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button><Button className="rounded-full" onClick={placeOrder} disabled={placing}>{placing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{placing ? 'Placing order...' : 'Place order'}</Button></div>
              </div>
            )}
          </main>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-playfair text-2xl font-bold">Order Summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
            </div>
            <Separator className="my-5" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{formatPrice(grandTotal)}</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
