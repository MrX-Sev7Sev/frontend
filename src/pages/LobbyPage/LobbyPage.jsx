import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NavigationSidebar from '../../components/NavigationSidebar';
import { GamesAPI } from '../../api/games';
import './LobbyPage.css';

const GAME_GENRES = {
  'Uno': 'Карточная',
  'Шахматы': 'Стратегия',
  'Монополия': 'Экономическая'
};

export default function LobbyPage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDeleteGame = () => {
    const updatedGames = GamesAPI.getAll().filter(g => g.id !== Number(gameId));
    GamesAPI.save(updatedGames);
    navigate('/main');
  };

  const handleLeaveGame = () => {
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

  const isAdmin = game.admin === user?.email;
  const isParticipant = game.players.includes(user?.email);

  return (
    <div className="lobby-container">
      <NavigationSidebar />
      <div className="lobby-content">
        <div className="lobby-header">
          <h1>{game?.name || 'Неизвестная игра'}</h1>
          <div className="lobby-meta">
            <span className="game-type">
              {game?.type} ({GAME_GENRES[game?.type] || 'Другая'})
            </span>
            <span className="game-location">📍 {game?.location}</span>
          </div>
        </div>

        <div className="lobby-details">
          <div className="detail-block">
            <h3>Дата и время</h3>
            <p className="datetime">
              {game?.date ? new Date(game.date).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Не указано'}
            </p>
          </div>

          <div className="detail-block">
            <h3>Участники ({game?.players?.length || 0}/{game?.maxPlayers || 0})</h3>
            <div className="players-list">
              {game?.players?.map((player, index) => (
                <div key={index} className="player-card">
                  <span className="player-name">
                    {player}
                    {game.admin === player && (
                      <span className="admin-badge">👑 Создатель</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lobby-actions">
          {isAdmin ? (
            <button 
              className="delete-button"
              onClick={handleDeleteGame}
            >
              Удалить комнату
            </button>
          ) : isParticipant ? (
            <button 
              className="leave-button"
              onClick={handleLeaveGame}
            >
              Покинуть комнату
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}