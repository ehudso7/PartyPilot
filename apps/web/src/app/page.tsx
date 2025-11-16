export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        fontWeight: 'bold',
        color: '#1a1a1a'
      }}>
        PartyPilot
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        color: '#666',
        textAlign: 'center'
      }}>
        AI-Powered Event Planning for Social Outings
      </p>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%'
      }}>
        <p style={{ marginBottom: '1rem', color: '#333' }}>
          Welcome to PartyPilot! Start planning your next event by describing what you want.
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          The application is being set up. Check back soon for full functionality.
        </p>
      </div>
    </main>
  )
}
