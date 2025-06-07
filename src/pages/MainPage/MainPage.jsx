import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GameCard from '../../components/GameCard';
import NavigationSidebar from '../../components/NavigationSidebar';
import './MainPage.css';

export default function MainPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [articles] = useState([
    {
      id: 1,
      title: 'Правила Uno',
      image: '/assets/articles/uno.jpg',
      link: '/articles/uno'
    },
    {
      id: 2,
      title: 'Стратегии в шахматах',
      image: '/assets/articles/chess.jpg',
      link: '/articles/chess'
    },
    {
      id: 3,
      title: 'Как выиграть в Мафию',
      image: '/assets/articles/mafia.jpg',
      link: '/articles/mafia'
    },
    {
      id: 4,
      title: 'Секреты игры в Монополию',
      image: '/assets/articles/monopoly.jpg',
      link: '/articles/monopoly'
    },
    {
      id: 5,
      title: 'Тактики в Дженге',
      image: '/assets/articles/jenga.jpg',
      link: '/articles/jenga'
    },
    {
      id: 6,
      title: 'Как играть в Каркассон',
      image: '/assets/articles/carcassonne.jpg',
      link: '/articles/carcassonne'
    }
  ]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 < articles.length ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };


  useEffect(() => {
    const updateGames = () => {
      const savedGames = JSON.parse(localStorage.getItem('games')) || [];
      setGames(savedGames.filter(game => 
        game.players.includes(user?.email) || 
        game.admin === user?.email
      ));
    };

    window.addEventListener('storage', updateGames);
    updateGames();
    
    return () => window.removeEventListener('storage', updateGames);
  }, [user?.email]);

  const handleDeleteGame = (gameId) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    localStorage.setItem('games', JSON.stringify(updatedGames));
    setGames(updatedGames);
  };

  return (
    <div className="main-page-container">
      <NavigationSidebar />
      
      <div className="main-content">
        <section className="user-games-section">
          <div className="section-header">
            <h2 className="section-title">Ваши игры</h2>
            <button onClick={logout} className="logout-button">
              Выйти
            </button>
          </div>

          <div className="games-grid">
            {games.length > 0 ? (
              games.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game}
                  onDelete={handleDeleteGame}
                />
              ))
            ) : (
              <p className="no-games">Нет активных игр</p>
            )}
          </div>
        </section>

        <section className="articles-section">
        <h2 className="articles-title">Статьи</h2>
        <div className="articles-gallery">
          <button 
            className="gallery-button prev-button" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            ◀️
          </button>
                    
          <div className="articles-grid">
            {articles.slice(currentIndex, currentIndex + 4).map(article => (
              <div 
                key={article.id} 
                className="article-card"
                onClick={() => navigate(article.link)}
              >
                <div 
                  className="article-image"
                  style={{ backgroundImage: `url(${article.image})` }}
                >
                  <div className="article-overlay">
                    <h3>{article.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="gallery-button next-button" 
            onClick={handleNext}
            disabled={currentIndex + 3 >= articles.length}
          >
            ▶️
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}