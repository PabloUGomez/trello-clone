import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

const DAY_IN_MS = 84_600_800

export const checkSubscription = async () => {
  const { orgId } = auth()

  if (!orgId) {
    return false
  }

  const orgSubscription = await prisma.orgSubscription.findFirst({
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
