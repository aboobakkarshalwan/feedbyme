import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="aurora-bg" />
      <div className="not-found-code">404</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        Page Not Found
      </h2>
      <p className="not-found-text">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary btn-lg">
        <HiOutlineHome /> Go Home
      </Link>
    </div>
  );
}
