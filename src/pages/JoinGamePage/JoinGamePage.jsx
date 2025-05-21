import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/NavigationSidebar';
import { GamesAPI } from '../../api/games';
import './JoinGamePage.css';

export default function JoinGamePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableGames, setAvailableGames] = useState([]);

  useEffect(() => {
    GamesAPI.initializeTestGames();
    
    const handleGamesUpdate = () => {
      const games = GamesAPI.getAll();
      const filtered = games.filter(game => 
        game.admin !== user?.email &&
        !game.players.includes(user?.email) &&
        game.players.length < game.maxPlayers
      );
      
      const uniqueGames = [...new Map(filtered.map(g => [g.id, g])).values()];
      setAvailableGames(uniqueGames);
    };

    handleGamesUpdate();
    window.addEventListener('games-updated', handleGamesUpdate);
    window.addEventListener('storage', handleGamesUpdate);

    return () => {
      window.removeEventListener('games-updated', handleGamesUpdate);
      window.removeEventListener('storage', handleGamesUpdate);
    };
  }, [user?.email]);

  const handleJoinGame = (gameId) => {
    const games = GamesAPI.getAll().map(game => 
      game.id === gameId ? {
        ...game,
        players: [...new Set([...game.players, user.email])]
      } : game
    );
    
    GamesAPI.save(games);
    navigate('/main');
  };

  return (
    <div className="join-page-container">
      <NavigationSidebar />
      
      <div className="join-content">
        <h1>Доступные игры</h1>
        
        {availableGames.length === 0 ? (
          <div className="no-games">
            <p>Нет доступных игр для присоединения</p>
            <button 
              className="refresh-button"
              onClick={() => window.location.reload()}
            >
              Обновить список
            </button>
          </div>
        ) : (
          <div className="games-list">
            {availableGames.map(game => (
              <div 
                key={game.id}
                className="game-card"
              >
                <div className="game-header">
                  <h2 className="game-title">{game.name}</h2>
                  <span className="game-type">{game.type}</span>
                </div>
                
                <div className="game-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Место:</span>
                    <span className="detail-value">{game.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🕒 Время:</span>
                    <span className="detail-value">
                      {new Date(game.date).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">👥 Игроков:</span>
                    <span className="detail-value">
                      {game.players.length}/{game.maxPlayers}
                    </span>
                  </div>
                </div>

                <div className="game-actions">
                  <button 
                    className="join-button"
                    onClick={() => handleJoinGame(game.id)}
                    disabled={game.players.includes(user?.email)}
                  >
                    {game.players.includes(user?.email) 
                      ? 'Вы уже участвуете' 
                      : 'Присоединиться'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}