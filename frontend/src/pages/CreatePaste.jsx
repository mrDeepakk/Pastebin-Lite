import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function CreatePaste() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareableUrl, setShareableUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShareableUrl('');
    setLoading(true);

    try {
      // Prepare request payload
      const payload = { content };
      
      if (ttlSeconds && parseInt(ttlSeconds) > 0) {
        payload.ttl_seconds = parseInt(ttlSeconds);
      }
      
      if (maxViews && parseInt(maxViews) > 0) {
        payload.max_views = parseInt(maxViews);
      }

      // Create paste
      const response = await apiClient.post('/api/pastes', payload);
      
      // Show shareable URL
      const baseUrl = window.location.origin;
      const shareAble = `${baseUrl}/p/${response.data.id}`;
      console.log(shareAble)
      setShareableUrl(shareAble)
      // Clear form
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details?.[0]?.msg || 
                          'Failed to create paste';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPaste = () => {
    if (shareableUrl) {
      const pasteId = shareableUrl.split('/').pop();
      navigate(`/p/${pasteId}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📋 Pastebin Lite</h1>
        <p className="subtitle">Share text snippets with TTL and view limits</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">
              Paste Content <span className="required">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              rows="12"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ttl">TTL (seconds)</label>
              <input
                type="number"
                id="ttl"
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(e.target.value)}
                placeholder="e.g., 3600"
                min="1"
                disabled={loading}
              />
              <small>Optional: Paste will expire after this duration</small>
            </div>

            <div className="form-group">
              <label htmlFor="maxViews">Max Views</label>
              <input
                type="number"
                id="maxViews"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                placeholder="e.g., 5"
                min="1"
                disabled={loading}
              />
              <small>Optional: Maximum number of times this can be viewed</small>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {shareableUrl && (
            <div className="success-message">
              <strong>✓ Paste created successfully!</strong>
              <div className="url-container">
                <input
                  type="text"
                  value={shareableUrl}
                  readOnly
                  className="url-input"
                  onClick={(e) => e.target.select()}
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareableUrl)}
                  className="btn-secondary"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleViewPaste}
                  className="btn-secondary"
                >
                  View
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : '🚀 Create Paste'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePaste;
