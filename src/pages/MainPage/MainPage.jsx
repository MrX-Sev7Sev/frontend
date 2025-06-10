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
      title: 'Uno',
      image: '/assets/articles/uno.jpg',
      link: '/articles/uno'
    },
    {
      id: 2,
      title: 'Шахматы',
      image: '/assets/articles/chess.jpg',
      link: '/articles/chess'
    },
    {
      id: 3,
      title: 'Мафия',
      image: '/assets/articles/mafia.jpg',
      link: '/articles/mafia'
    },
    {
      id: 4,
      title: 'Монополия',
      image: '/assets/articles/monopoly.jpg',
      link: '/articles/monopoly'
    },
    {
      id: 5,
      title: 'Дженга',
      image: '/assets/articles/jenga.jpg',
      link: '/articles/jenga'
    },
    {
      id: 6,
      title: 'Каркассон',
      image: '/assets/articles/carcassonne.jpg',
      link: '/articles/carcassonne'
    },
    {
      id: 7,
      title: 'Dungeons & Dragons',
      image: '/assets/articles/dnd.jpg',
      link: '/articles/dnd'
    },
    {
      id: 8,
      title: 'Бункер',
      image: '/assets/articles/bunker.jpg',
      link: '/articles/bunker'
    },
    {
      id: 9,
      title: 'Эволюция',
      image: '/assets/articles/evolution.jpg',
      link: '/articles/evolution'
    },
    {
      id: 10,
      title: 'Диксит',
      image: '/assets/articles/dixit.jpg',
      link: '/articles/dixit'
    },
    {
      id: 11,
      title: 'Колонизаторы',
      image: '/assets/articles/catan.jpg',
      link: '/articles/catan'
    },
    {
      id: 12,
      title: 'Алиас',
      image: '/assets/articles/alias.jpg',
      link: '/articles/alias'
    },
    {
      id: 13,
      title: 'Манчкин',
      image: '/assets/articles/munchkin.jpg',
      link: '/articles/munchkin'
    },
    {
      id: 14,
      title: 'Кодовые имена',
      image: '/assets/articles/codenames.jpg',
      link: '/articles/codenames'
    },
    {
      id: 15,
      title: 'Скрэббл',
      image: '/assets/articles/scrabble.jpg',
      link: '/articles/scrabble'
    },
    {
      id: 16,
      title: 'Имаджинариум',
      image: '/assets/articles/imaginarium.jpg',
      link: '/articles/imaginarium'
    },
    {
      id: 17,
      title: 'Свинтус',
      image: '/assets/articles/svintus.jpg',
      link: '/articles/svintus'
    },
    {
      id: 18,
      title: 'Крокодил',
      image: '/assets/articles/crocodile.jpg',
      link: '/articles/crocodile'
    },
    {
      id: 19,
      title: 'Эпичные схватки боевых магов',
      image: '/assets/articles/epic-battle-wizards.jpg',
      link: '/articles/epic-battle-wizards'
    },
    {
      id: 20,
      title: 'Пандемия',
      image: '/assets/articles/pandemic.jpg',
      link: '/articles/pandemic'
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
              <div className="no-games-content">
                <p className="no-games-text">У вас пока нет предстоящих игр</p>
                <img 
                  src="/assets/img/no-games-dino.png" 
                  alt="Нет активных игр" 
                  className="no-games-image"
                />
              </div>
            )}
          </div>
        </section>

        <section className="articles-section">
        <h2 className="articles-title">Популярные игры</h2>
        <div className="articles-gallery">
          <button 
            className="gallery-button prev-button" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <img 
              src={"../../../public/assets/img/arrow-left.svg"}
            />
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
            <img 
              src={"../../../public/assets/img/arrow-right.svg"}
            />
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}