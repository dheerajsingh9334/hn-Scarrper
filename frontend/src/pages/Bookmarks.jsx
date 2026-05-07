import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
  const [bookmarkedStories, setBookmarkedStories] = useState([]);

  useEffect(() => {
    // In our implementation, user.bookmarks is populated with the full story objects by the backend 'getMe'
    // However, if it's just IDs we might need to fetch them. 
    // Let's assume the backend `populate('bookmarks')` successfully populated the stories.
    if (user && user.bookmarks) {
      // Filter out any IDs that didn't get populated (e.g., if a story was deleted)
      const validBookmarks = user.bookmarks.filter(b => typeof b === 'object');
      setBookmarkedStories(validBookmarks);
    }
  }, [user]);

  return (
    <div>
      <h1 className="page-title">Your Bookmarks</h1>
      
      {bookmarkedStories.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          You haven't bookmarked any stories yet.
        </p>
      ) : (
        <div className="story-grid">
          {bookmarkedStories.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
