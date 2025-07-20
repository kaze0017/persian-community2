export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d1fae5',
        padding: '1rem',
      }}
    >
      <h1
        style={{ fontSize: '2.5rem', color: '#047857', marginBottom: '1rem' }}
      >
        🎉 Successfully connected your account to LinkedIn!
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#065f46' }}>
        You can now enjoy the benefits of your LinkedIn connection.
      </p>
    </main>
  );
}
