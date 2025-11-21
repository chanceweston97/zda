import { prisma } from '@/lib/prismaDB';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { createClient } from '@sanity/client';

// Sanity client for creating orders
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2023-03-09',
  useCdn: false,
  token: process.env.SANITY_PROJECT_API_TOKEN!,
});

export async function POST(request: Request) {
  const body = await request.text();

  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email?.toLowerCase() as string;

  if (!email) {
    return new Response(null, {
      status: 200,
    });
  }

  // when first purchased
  if (event.type === 'checkout.session.completed') {
    console.log(
      session?.customer_details,
      session?.payment_intent,
      session?.amount_total,
      session?.metadata
    );

    const { email, address: shipping_address } = session?.customer_details!;

    const isAlreadyExist = await prisma.order.findUnique({
      where: {
        orderId: session.payment_intent as string,
      },
    });

    if (isAlreadyExist) {
      return new Response(null, {
        status: 200,
      });
    } else {
      const doc = {
        orderId: session.payment_intent as string,
        status: 'processing',
        totalPrice: Math.round(session.amount_total! / 100), // Convert cents to dollars
        userId: 'dddddddddd',
        userEmail: email?.toLowerCase()!,
        productQuantity: session?.metadata?.quantity!,
        orderTitle: session?.metadata?.names!,
        country: session?.customer_details?.address?.country!,
        city: shipping_address?.city!,
        postalCode: shipping_address?.postal_code!,
        line1: shipping_address?.line1!,
        line2: shipping_address?.line2!,
      };

      await prisma.order.create({ data: doc });

      // Also create order in Sanity CMS for admin panel
      try {
        const sanityOrder = {
          _type: "order",
          orderId: doc.orderId,
          status: "processing", // Stripe orders are always processing initially
          totalPrice: doc.totalPrice,
          userId: doc.userId,
          userEmail: doc.userEmail.toLowerCase(),
          productQuantity: doc.productQuantity,
          orderTitle: doc.orderTitle || "Order from ZDAComm",
          country: doc.country || "",
          city: doc.city || "",
          postalCode: doc.postalCode || "",
          line1: doc.line1 || "",
          line2: doc.line2 || "",
        };

        await sanityClient.create(sanityOrder);
        console.log("Order created in Sanity via webhook:", doc.orderId);
      } catch (sanityError: any) {
        // Log error but don't fail the request if Sanity creation fails
        console.error("Failed to create order in Sanity via webhook:", sanityError?.message || sanityError);
      }
    }
  }

  return new Response(null, { status: 200 });
}
