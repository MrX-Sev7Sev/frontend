import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavigationSidebar from '../../components/NavigationSidebar';
import { GamesAPI } from '../../api/games';
import './LobbyPage.css';

export default function LobbyPage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    const loadGame = () => {
      const games = GamesAPI.getAll();
      const foundGame = games.find(g => g.id === Number(gameId));
      
      if (!foundGame) {
        navigate('/main', { replace: true });
        return;
      }
      
      setGame(foundGame);
      setIsLoading(false);
    };

    loadGame();
    window.addEventListener('games-updated', loadGame);
    
    return () => {
      window.removeEventListener('games-updated', loadGame);
    };
  }, [gameId, navigate]);

  const handleNextPlayers = () => {
    if (currentPlayerIndex + 3 < game.players.length) {
      setCurrentPlayerIndex((prev) => prev + 1);
    }
  };

  const handlePrevPlayers = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="lobby-container">
        <NavigationSidebar />
        <div className="lobby-content">
          <h2>Загрузка данных игры...</h2>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="lobby-container">
        <NavigationSidebar />
        <div className="lobby-content">
          <h2>Игра не найдена</h2>
        </div>
      </div>
    );
  }

  const isAdmin = game.admin === user?.email;
  const isParticipant = game.players.includes(user?.email);

  const visiblePlayers = game.players.slice(
    currentPlayerIndex,
    currentPlayerIndex + 3
  );

  return (
    <div className="lobby-container">
      <NavigationSidebar />
      <div className="lobby-content">
        <div className="lobby-header">
          <h1>{game?.name || 'Неизвестная игра'}</h1>
          {isAdmin ? (
            <button 
              className="delete-button"
              onClick={() => {
                const updatedGames = GamesAPI.getAll().filter(g => g.id !== Number(gameId));
                GamesAPI.save(updatedGames);
                navigate('/main');
              }}
            >
              Удалить комнату
            </button>
          ) : isParticipant ? (
            <button 
              className="leave-button"
              onClick={() => {
                const updatedGames = GamesAPI.getAll()
                  .map(game => {
                    if (game.id === Number(gameId)) {
                      return {
                        ...game,
                        players: game.players.filter(p => p !== user?.email)
                      };
                    }
                    return game;
                  })
                  .filter(g => g.players.length > 0);

                GamesAPI.save(updatedGames);
                navigate('/main');
              }}
            >
              Покинуть комнату
            </button>
          ) : null}
        </div>

        <div className="lobby-main">
          <div className="lobby-avatar-section">
            <div className="game-avatar">
              <img 
                src={game.image || '/assets/games/custom.jpg'} 
                alt="Аватар игры" 
              />
            </div>

            <h3>
              Участники
              <span className="players-count">
                {game.players.length}/{game.maxPlayers || '∞'} игроков
              </span>
            </h3>

            <div className="players-gallery">
              <button
                className={`gallery-button up-button ${currentPlayerIndex === 0 ? 'disabled' : ''}`}
                onClick={handlePrevPlayers}
                disabled={currentPlayerIndex === 0}
              >
                <img src="/assets/img/arrow-up.svg" alt="Вверх" />
              </button>

              <div className="players-list">
                {visiblePlayers.map((player, index) => (
                  <div className="player-card">
                    {game.admin === player && (
                      <span className="admin-badge">👑 Создатель</span>
                    )}
                    <img 
                      src="/assets/img/avatar-default.png" 
                      alt="Аватар игрока" 
                      className="player-avatar"
                    />
                    <span className="player-name">
                      {player || 'Неизвестный игрок'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`gallery-button down-button ${currentPlayerIndex + 3 >= game.players.length ? 'disabled' : ''}`}
                onClick={handleNextPlayers}
                disabled={currentPlayerIndex + 3 >= game.players.length}
              >
                <img src="/assets/img/arrow-down.svg" alt="Вниз" />
              </button>
            </div>
          </div>

          <div className="lobby-info">
            <div className="info-item">
              <label>Название комнаты:</label>
              <span>{game.name}</span>
            </div>
            <div className="info-item">
              <label>Игра:</label>
              <span>{game.type}</span>
            </div>
            <div className="info-item">
              <label>Жанр:</label>
              <span>{game.genre || 'Другая'}</span>
            </div>
            <div className="info-item">
              <label>Место проведения:</label>
              <span>{game.location}</span>
            </div>
            <div className="info-item">
              <label>Дата и время:</label>
              <span>
                {game.date ? new Date(game.date).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Не указано'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}