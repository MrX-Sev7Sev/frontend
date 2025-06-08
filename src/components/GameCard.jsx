import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './GameCard.css';

export default function GameCard({ game }) {
  if (!game?.id || !game?.name) return null;
  const { user } = useAuth();
  const isAdmin = game.admin === user?.email;

  const getGameImage = (type) => {
    const images = {
      'Uno': '/assets/games/uno.jpg',
      'Шахматы': '/assets/games/chess.jpg',
      'Монополия': '/assets/games/monopoly.jpg',
      'Дженга': '/assets/games/jenga.jpg',
      'Добавить свою игру': '/assets/games/custom.jpg', // Обрабатываем кастомные игры
      'default': '/assets/games/default.jpg'
    };
    return images[type] || images.default;
  };

  return (
    <Link to={`/lobby/${game.id}`} className="game-card">
      <img 
        src={getGameImage(game.type)} 
        alt={game.name} 
        className="game-card-image"
      />
      <div className="game-card-overlay">
        <h3 className="game-card-title">{game.name}</h3>
        <div className="game-card-info">
          {isAdmin && <span className="admin-badge">Админ</span>}
          <span>{game.players.length}/{game.maxPlayers} игроков</span>
        </div>
      </div>
    </Link>
  );
}
