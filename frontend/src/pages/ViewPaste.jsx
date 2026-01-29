import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await apiClient.get(`/api/pastes/${id}`);
        setPaste(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Paste not found';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading paste...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card error-card">
          <h1>❌ Paste Not Found</h1>
          <p className="error-text">{error}</p>
          <p className="help-text">
            This paste may have expired, reached its view limit, or never existed.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            ← Create New Paste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="paste-header">
          <h1>📄 Paste Content</h1>
          <button onClick={() => navigate('/')} className="btn-secondary">
            ← New Paste
          </button>
        </div>

        <div className="paste-info">
          {paste.remaining_views !== null && (
            <div className="info-item">
              <strong>Remaining Views:</strong> {paste.remaining_views}
            </div>
          )}
          {paste.expires_at && (
            <div className="info-item">
              <strong>Expires At:</strong> {new Date(paste.expires_at).toLocaleString()}
            </div>
          )}
        </div>

        <div className="paste-content-wrapper">
          <button
            onClick={() => navigator.clipboard.writeText(paste.content)}
            className="btn-copy"
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          <pre className="paste-content">{paste.content}</pre>
        </div>
      </div>
    </div>
  );
}

export default ViewPaste;
