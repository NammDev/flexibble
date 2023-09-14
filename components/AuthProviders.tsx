'use client'

import { getProviders, signIn } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Button from './Button'

type Provider = {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
  signinUrlParams?: Record<string, string> | null
}

type Providers = Record<string, Provider>

const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  if (providers) {
    // loop through values of each providers
    return (
      <div>
        <Button title='Sign In' handleClick={() => signIn()} />
      </div>
    )
  }
}

export default AuthProviders
