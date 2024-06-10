import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

const DAY_IN_MS = 86_400_000

export const checkSubscription = async () => {
  const { orgId } = auth()

  if (!orgId) {
    return false
  }

  const orgSubscription = await prisma.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeCostumerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!orgSubscription) {
    return false
  }

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid
}
