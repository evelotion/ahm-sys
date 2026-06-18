'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Master Aset', path: '/assets' },
    { name: 'Inspeksi', path: '/submit-report' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1120]/70 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 hover:opacity-80 transition-opacity">
              AHM-SYS
            </Link>
          </div>
          
          {/* Menu Items */}
          <div className="flex gap-2 md:gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/30 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {item.name}
                </Link>
              )
            })}
          </div>

        </div>
      </div>
    </nav>
  )
}