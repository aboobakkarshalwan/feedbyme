import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowRight } from 'react-icons/hi';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 70, position: 'fixed',
        top: 0, left: 0, right: 0, zIndex: 50,
        background: '#ffffff',
        borderBottom: '2px solid #1b1b1b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="FeedByMe Logo" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem',
            color: 'var(--text-1)', textTransform: 'uppercase', textDecoration: 'none'
          }}>FeedByMe</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '160px 24px 80px',
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--glass-border)'
      }}>
        {/* Official badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px 6px 8px', borderRadius: 4,
          background: 'var(--accent-muted)', border: '1px solid var(--accent)',
          fontSize: '0.85rem', color: 'var(--accent-hover)', fontWeight: 700,
          marginBottom: 32
        }}>
          <span style={{
            padding: '2px 10px', borderRadius: 2,
            background: 'var(--accent)', color: 'white', fontSize: '0.75rem',
            fontWeight: 700
          }}>NEW</span>
          Now with analytics dashboard
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
          fontWeight: 800, lineHeight: 1.1,
          color: 'var(--text-1)', marginBottom: 24, maxWidth: 700
        }}>
          Feedback that<br />
          <span style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationColor: 'var(--accent)' }}>
            drives product forward
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem', color: 'var(--text-2)', lineHeight: 1.6,
          maxWidth: 520, marginBottom: 40
        }}>
          Collect, organize, and prioritize feedback from your team and users — all in one place.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard <HiOutlineArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Get started free <HiOutlineArrowRight />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Log in
              </Link>
            </>
          )}
        </div>

        {/* Metrics */}
        <div style={{
          marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0, border: '1px solid var(--glass-border)', borderRadius: 4,
          overflow: 'hidden', maxWidth: 560, width: '100%',
          background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {[
            { val: '2.4k', label: 'Feedback collected' },
            { val: '89%', label: 'Resolution rate' },
            { val: '4.8', label: 'Avg satisfaction' }
          ].map((m, i) => (
            <div key={i} style={{
              padding: '24px 16px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid var(--glass-border)' : 'none'
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '2rem',
                fontWeight: 800, color: 'var(--accent)', lineHeight: 1
              }}>{m.val}</div>
              <div style={{
                fontSize: '0.85rem', color: 'var(--text-2)', marginTop: 8, fontWeight: 600
              }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '64px 40px 100px', maxWidth: 1100, margin: '0 auto'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
          textAlign: 'center', marginBottom: 12,
          color: 'var(--text-1)'
        }}>Everything you need</h2>
        <p style={{
          textAlign: 'center', color: 'var(--text-2)', fontSize: '1.1rem',
          marginBottom: 48, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto'
        }}>
          From submission to resolution, we've got you covered.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24
        }}>
          {[
            { icon: '🎯', title: 'Categorize & Prioritize', desc: 'Bug, feature request, improvement — tag and rate every submission for clarity.' },
            { icon: '📊', title: 'Visual Analytics', desc: 'Track submission volume, resolution trends, and category distribution over time.' },
            { icon: '🔒', title: 'Role-Based Access', desc: 'Users submit feedback. Admins triage, assign, and update statuses.' },
            { icon: '👍', title: 'Upvote & Discuss', desc: 'Community-driven prioritization with upvotes and threaded comments.' },
            { icon: '🕶️', title: 'Anonymous Mode', desc: 'Encourage honest feedback. Submitters can hide their identity.' },
            { icon: '🔍', title: 'Search & Filter', desc: 'Find anything fast across status, category, priority, and free text.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '28px', borderRadius: 4,
              background: '#ffffff',
              border: '1px solid var(--glass-border)',
              borderTop: '4px solid var(--accent)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.15rem',
                fontWeight: 700, color: 'var(--text-1)', marginBottom: 8
              }}>{f.title}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '56px 24px',
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--bg-surface)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800,
          marginBottom: 16, color: 'var(--text-1)'
        }}>Ready to ship better products?</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: 32 }}>
          Start collecting feedback today. Free to use.
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="btn btn-primary btn-lg">
            Get started <HiOutlineArrowRight />
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '32px 24px',
        fontSize: '0.9rem', color: 'var(--text-2)',
        borderTop: '4px solid var(--text-1)', background: 'var(--bg-secondary)'
      }}>
        Built with React, Node.js & MongoDB
      </footer>
    </div>
  );
}
