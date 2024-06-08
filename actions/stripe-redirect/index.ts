'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { StripeRedirect } from './schema'
import { absoluteUrl } from '@/lib/utils'
import { stripe } from '@/lib/stripe'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth()
  const user = await currentUser()

  if (!userId || !orgId || !user) {
    return {
      error: 'Unauthorized',
    }
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`)

  let url = ''

  try {
    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: {
        orgId,
      },
    })

    if (orgSubscription && orgSubscription.stripeCostumerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCostumerId,
        return_url: settingsUrl,
      })
      url = stripeSession.url
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        customer_email: user?.emailAddresses[0]?.emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'Taskify Pro',
                description: 'Unlimited board for your organization',
              },
              unit_amount: 2000,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      })
      url = stripeSession.url || ''
    }
  } catch (error) {
    return {
      error: 'Something went wrong, please try again later',
    }
  }

  revalidatePath(`/organization/${orgId}`)
  return {
    data: url,
  }
}

export const stripeRedirect = createSafeAction(StripeRedirect, handler)
