import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NavigationSidebar from '../../components/NavigationSidebar';
import { GamesAPI } from '../../api/games';
import './LobbyPage.css';

const GAME_GENRES = {
  'Uno': 'Карточная',
  'Карты': 'Карточная',
  'Шахматы': 'Стратегическая',
  'Шашки': 'Стратегическая',
  'Нарды': 'Стратегическая',
  'Мафия': 'Социальная',
  'Монополия': 'Экономическая',
  'Дженга': 'Активная',
  'Dungeons & Dragons': 'Ролевая',
  'Каркассон': 'Стратегическая',
  'Бункер': 'Социальная',
  'Пандемия': 'Стратегическая',
  'Эрудит': 'Логическая',
  'Алиас': 'Социальная',
  'Имаджинариум': 'Креативная',
  'Свинтус': 'Карточная',
  'Крокодил': 'Активная',
  'Добавить свою игру': 'Другая'
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

  const getGameImage = (type) => {
    const images = {
      'Uno': '/assets/games/uno.jpg',
      'Карты': '/assets/games/cards.jpg',
      'Шахматы': '/assets/games/chess.jpg',
      'Шашки': '/assets/games/checkers.jpg',
      'Нарды': '/assets/games/backgammon.jpg',
      'Мафия': '/assets/games/mafia.jpg',
      'Монополия': '/assets/games/monopoly.jpg',
      'Дженга': '/assets/games/jenga.jpg',
      'Dungeons & Dragons': '/assets/games/dnd.jpg',
      'Каркассон': '/assets/games/carcassonn.jpg',
      'Бункер': '/assets/games/bunker.jpg',
      'Пандемия': '/assets/games/pandemic.jpg',
      'Эрудит': '/assets/games/scrabble.jpg',
      'Алиас': '/assets/games/alias.jpg',
      'Имаджинариум': '/assets/games/imaginarium.jpg',
      'Свинтус': '/assets/games/svintus.jpg',
      'Крокодил': '/assets/games/crocodile.jpg',
      'default': '/assets/games/custom.jpg'
    };

    // Если тип игры не в списке, возвращаем custom.jpg
    return images[type] || images.default;
  };

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

  return (
    <div className="lobby-container">
      <NavigationSidebar />
      <div className="lobby-content">
        <div className="lobby-header">
          <h1>{game?.name || 'Неизвестная игра'}</h1>
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

        <div className="lobby-main">
          {/* Секция с изображением и списком игроков */}
          <div className="lobby-avatar-section">
            <div className="game-avatar">
              <img 
                src={getGameImage(game.type)} 
                alt="Аватар игры" 
              />
            </div>
            {/* Список игроков */}
            <h3>
              Участники
              <span className="players-count">
                {game?.players?.length || 0}/{game?.maxPlayers || '∞'} игроков
              </span>
            </h3>
            <div className="players-list">
              {game?.players
                ?.filter(player => player !== null) // Фильтруем null-игроков
                ?.map((player, index) => (
                  <div key={index} className="player-card">
                    <img 
                      src="/assets/img/avatar-default.png" // Дефолтная аватарка
                      alt="Аватар игрока" 
                      className="player-avatar"
                    />
                    <span className="player-name">
                      {player || 'Неизвестный игрок'}
                      {game.admin === player && (
                        <span className="admin-badge">👑 Создатель</span>
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Секция с информацией о комнате */}
          <div className="lobby-info">
            <div className="info-item">
              <label>Название комнаты:</label>
              <span>{game?.name}</span>
            </div>
            <div className="info-item">
              <label>Игра:</label>
              <span>{game?.type}</span>
            </div>
            <div className="info-item">
              <label>Жанр:</label>
              <span>{game?.genre || 'Другая'}</span>
            </div>
            <div className="info-item">
              <label>Место проведения:</label>
              <span>{game?.location}</span>
            </div>
            <div className="info-item">
              <label>Дата и время:</label>
              <span>
                {game?.date ? new Date(game.date).toLocaleString('ru-RU', {
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

        {/* Кнопки действий удалены из этого места и перемещены в header */}
      </div>
    </div>
  );
}
