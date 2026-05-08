import { useState, useEffect } from 'react';
import api from '../services/api';
import StoryCard from '../components/StoryCard';
import { RefreshCw } from 'lucide-react';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrapeLimit, setScrapeLimit] = useState(30);

  const fetchStories = async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    try {
      const { data } = await api.get(`/stories?page=${pageNum}&limit=10`);
      if (append) {
        setStories(prev => [...prev, ...data.stories]);
      } else {
        setStories(data.stories);
      }
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      console.error('Failed to fetch stories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(1, false);
  }, []);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await api.post('/scrape', { limit: scrapeLimit });
      setPage(1);
      await fetchStories(1, false);
    } catch (error) {
      console.error('Failed to trigger scrape', error);
    } finally {
      setScraping(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStories(nextPage, true);
  };

  return (
    <div>
      <div className="actions-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Top Stories</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="scrapeLimit" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetch:</label>
            <input 
              id="scrapeLimit"
              type="number" 
              value={scrapeLimit} 
              onChange={(e) => setScrapeLimit(parseInt(e.target.value) || 30)} 
              min="10" 
              max="200"
              style={{ 
                width: '70px', 
                padding: '0.5rem', 
                borderRadius: '6px', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
                outline: 'none'
              }} 
            />
          </div>
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
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : stories.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No stories found. Try scraping.</p>
      ) : (
        <>
          <div className="story-grid">
            {stories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={loadMore} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
