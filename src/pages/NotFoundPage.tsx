import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '1.5rem',
        color: 'var(--fg-text)',
        fontFamily: 'var(--fg-font-sans)',
        textAlign: 'center',
        padding: '2rem',
        background: 'var(--fg-bg)',
      }}
    >
      <span style={{ fontSize: '4rem', lineHeight: 1, color: 'var(--fg-text-heading)' }}>404</span>
      <h1 style={{ color: 'var(--fg-text-heading)', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
        Page not found
      </h1>
      <p style={{ margin: 0, fontSize: '0.9375rem', maxWidth: '28rem' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.5rem 1.25rem',
          background: 'var(--fg-accent)',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
