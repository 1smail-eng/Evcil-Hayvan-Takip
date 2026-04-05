export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ 
        background: 'black', 
        color: '#00ff00', 
        margin: 0, 
        fontFamily: 'monospace' 
      }}>
        {children}
      </body>
    </html>
  )
}