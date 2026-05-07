import { useState, useEffect } from 'react';
import api from '../services/api';
import StoryCard from '../components/StoryCard';
import { RefreshCw } from 'lucide-react';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stories');
      setStories(data.stories);
    } catch (error) {
      console.error('Failed to fetch stories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await api.post('/scrape');
      await fetchStories();
    } catch (error) {
      console.error('Failed to trigger scrape', error);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div>
      <div className="actions-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Top Stories</h1>
        <button 
          onClick={handleScrape} 
          disabled={scraping}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} className={scraping ? 'spinning' : ''} style={scraping ? { animation: 'spin 1s linear infinite' } : {}} />
          {scraping ? 'Scraping...' : 'Scrape Now'}
        </button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : stories.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No stories found. Try scraping.</p>
      ) : (
        <div className="story-grid">
          {stories.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
