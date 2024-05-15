'use client'

import { SyntheticEvent, useRef, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { login } from '../../../utils/auth'

import styles from './LoginPage.module.scss'
import { useSession } from 'next-auth/react'

const LoginPage = () => {
  const router = useRouter()
  const params = useSearchParams()
  const username = useRef('')
  const password = useRef('')
  const [error, setError] = useState(params?.get('error') || '')
  const { data: session } = useSession()

  useEffect(() => {
    if (session) router.push('/')
  }, [session?.user.id])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const response = await login(username.current, password.current)
    if (response.error) return setError(response.error || '')
    router.push(response.callbackUrl)
  }

  return (
    <form className={styles.LoginPage} onSubmit={handleSubmit}>
      <h1 className={styles.LoginPage__header}>Login</h1>
      <div>
        <label htmlFor='username'>Username</label>
        <input name='username' onChange={(e) => username.current = e.target.value}/>
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input name='password' type='password' onChange={(e) => password.current = e.target.value}/>
      </div>
      {
        error && <h4>{error}</h4>
      }
      <button className={styles.LoginPage__button} type='submit'>Login</button>
    </form>
  )
}

export default LoginPage
