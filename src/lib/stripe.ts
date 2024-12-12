import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (userId: string, priceId: string) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: userId,
    line_items: [{price: priceId, quantity: 1}],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });

  return session;
}; 