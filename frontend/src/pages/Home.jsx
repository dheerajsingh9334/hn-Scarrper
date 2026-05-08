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

  const prevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchStories(newPage, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextPage = () => {
    if (hasMore) {
      const newPage = page + 1;
      setPage(newPage);
      fetchStories(newPage, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
            <button 
              onClick={prevPage} 
              disabled={page === 1}
              className="btn btn-outline" 
              style={{ padding: '0.8rem 2rem', opacity: page === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              Page {page}
            </span>
            <button 
              onClick={nextPage} 
              disabled={!hasMore}
              className="btn btn-outline" 
              style={{ padding: '0.8rem 2rem', opacity: !hasMore ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
