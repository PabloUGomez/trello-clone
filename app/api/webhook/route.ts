import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    const orgSubscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.orgId) {
      return new Response('Org id is required', { status: 400 })
    }
    await prisma.orgSubscription.create({
      data: {
        orgId: session?.metadata.orgId,
        stripeSubscriptionId: orgSubscription.id,
        stripeCostumerId: orgSubscription.customer as string,
        stripePriceId: orgSubscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          orgSubscription.current_period_end * 1000
        ),
      },
    })
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await prisma.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}
