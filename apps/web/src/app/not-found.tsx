export default function NotFound() {
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
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        The page you're looking for doesn't exist.
      </p>
      <a 
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          display: 'inline-block'
        }}
      >
        Go Home
      </a>
    </main>
  );
}
