import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bookmark, ExternalLink, Clock, User, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const StoryCard = ({ story }) => {
  const { user, toggleBookmarkContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isBookmarked = user?.bookmarks?.some(b => b._id === story._id || b === story._id);

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      await api.post(`/stories/${story._id}/bookmark`);
      toggleBookmarkContext(story._id);
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-card">
      <div>
        <h3 className="story-title">
          <a href={story.url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  }}>
            {story.title}
          </a>
        </h3>
        <div className="story-meta">
          <span className="meta-item"><TrendingUp size={14} /> {story.points} pts</span>
          <span className="meta-item"><User size={14} /> {story.author}</span>
          <span className="meta-item"><Clock size={14} /> {story.postedAt}</span>
        </div>
      </div>
      
      <div className="story-footer">
        <button 
          onClick={() => {
            if (user) {
              window.open(story.url, '_blank', 'noopener,noreferrer');
            } else {
              navigate('/login');
            }
          }}
          className="btn btn-outline"
        >
          <ExternalLink size={14} style={{ marginRight: '6px' }} /> Read More
        </button>
        <button 
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          disabled={loading}
          title={user ? (isBookmarked ? 'Remove bookmark' : 'Bookmark story') : 'Login to bookmark'}
        >
          <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
