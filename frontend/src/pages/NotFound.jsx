import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card error-card">
        <h1>🔍 404 - Page Not Found</h1>
        <p className="error-text">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
