export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        PartyPilot
      </h1>
      <p style={{ 
        fontSize: '1.25rem',
        marginBottom: '2rem',
        color: '#666'
      }}>
        Natural language event planning and booking system
      </p>
      <div style={{
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%'
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Welcome to PartyPilot! The app is now running.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          Start planning your next event by describing what you want to do.
        </p>
      </div>
    </main>
  );
}
