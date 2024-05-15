'use client'

import React, { ReactNode } from 'react'
import { useSession } from 'next-auth/react'

type RequireFeatureProps = {
  features: string[]
  children: ReactNode,
}

// this component can be used when you need more granular control of what's available to users.
// the route level protection is taken care of in middleware

const RequireFeature = ({ features, children }: RequireFeatureProps) => {
  const { data: session } = useSession()

  const userFeatures = session?.user.features || []

  const hasFeatures = userFeatures.every(userFeature => features.includes(userFeature))

  return hasFeatures
    ? <>{children}</>
    : <>{'Access Denied'}</>
}

export default RequireFeature
