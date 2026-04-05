'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [status, setStatus] = useState('Bağlantı kontrol ediliyor...')

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase.from('test').select('*').limit(1)
        if (error && error.code !== 'PGRST116') {
          setStatus('Bağlantı Hatası: ' + error.message)
        } else {
          setStatus('Bağlantı Başarılı! 🐾')
        }
      } catch (err) {
        setStatus('Sistem Hazır.')
      }
    }
    checkConnection()
  }, [])

  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#121212', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ color: '#3ecf8e' }}>Pet Tracker Pro</h1>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        border: '2px solid #3ecf8e', 
        borderRadius: '15px',
        display: 'inline-block'
      }}>
        <h3>Durum: {status}</h3>
      </div>
      <p style={{ marginTop: '30px', color: '#888' }}>Vercel Build Modu: Aktif</p>
    </div>
  )
}
