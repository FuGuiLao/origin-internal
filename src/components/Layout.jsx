import Link from 'next/link'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { SectionProvider } from '@/components/SectionProvider'
import { Login } from './Login'
import { useEffect, useState } from 'react'

export function Layout({ children, sections = [] }) {
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    const currentTime = new Date().getTime()
    const expiresAt = sessionStorage.getItem('expiresAt')
    const token = sessionStorage.getItem('token')
    if (token) {
      if (currentTime > expiresAt) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('expiresAt')
        setIsLogged(false)
      } else {
        setIsLogged(true)
      }
    } else {
      setIsLogged(false)
    }
  }, [])
  return (
    <>
      <SectionProvider sections={sections}>
        <div className="lg:ml-72 xl:ml-80">
          <motion.header
            layoutScroll
            className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
          >
            <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
              <div className="hidden lg:flex">
                <Link href="/" aria-label="Home">
                  <Logo className="h-6" />
                </Link>
              </div>
              <Header />
              <Navigation className="hidden lg:mt-10 lg:block" />
            </div>
          </motion.header>
          <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
            <main className="py-16">
              <Prose as="article">{children}</Prose>
            </main>
            <Footer />
          </div>
        </div>
      </SectionProvider>
      {/*!isLogged && <Login />*/}
    </>
  )
}
