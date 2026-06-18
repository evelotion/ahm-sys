import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast' // <-- Import ini

export const metadata = {
  title: 'AHM-SYS | Asset Health Monitoring',
  description: 'Sistem pengawasan terpusat aset krusial cabang',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-[#0B1120] text-white min-h-screen antialiased flex flex-col">
        <Navbar />
        
        {/* Mesin Notifikasi Premium */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              borderRadius: '16px',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }} 
        />
        
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}