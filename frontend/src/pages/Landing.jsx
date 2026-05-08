import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="landing-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
      <div className="hero-section" style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1rem', 
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Terminal size={48} color="var(--text-primary)" />
          </div>
        </div>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 700, 
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          The premium way to read <br /> Hacker News.
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          maxWidth: '600px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Stay ahead of the curve with real-time scraping, beautiful dark mode reading, and seamless bookmarking. Engineered for developers.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/feed" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Go to Feed <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </Link>
          {!user && (
            <Link to="/register" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Create Account
            </Link>
          )}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem',
        marginTop: '6rem',
        textAlign: 'left'
      }}>
        <div className="feature-card" style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Zap size={24} style={{ marginBottom: '1rem', color: '#fbbf24' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-time Scraping</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Fetch the absolute latest top stories from Hacker News instantly with a single click.
          </p>
        </div>
        <div className="feature-card" style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Shield size={24} style={{ marginBottom: '1rem', color: '#60a5fa' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Secure Bookmarks</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Create an account to securely save and access your favorite reads from anywhere.
          </p>
        </div>
        <div className="feature-card" style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Globe size={24} style={{ marginBottom: '1rem', color: '#34d399' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Beautiful UI</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Enjoy reading in a sleek, distraction-free environment designed for maximum focus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
