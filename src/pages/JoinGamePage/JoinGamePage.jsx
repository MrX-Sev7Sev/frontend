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
  const [searchQuery, setSearchQuery] = useState(''); // Поиск по названию
  const [filters, setFilters] = useState({
  type: '',
  location: '',
  date: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Открыт ли фильтр

  const filterGames = (games) => {
  return games.filter(game => {
    // Поиск по названию (без учёта регистра)
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтрация по типу, месту и дате
    const matchesType = !filters.type || game.type === filters.type;
    const matchesLocation = !filters.location || game.location === filters.location;
    const matchesDate = !filters.date || new Date(game.date).toISOString().split('T')[0] === filters.date;

    return matchesSearch && matchesType && matchesLocation && matchesDate;
  });
};

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

      {/* Поиск и фильтры */}
      <div className="search-and-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск по названию комнаты"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <img src="/assets/img/filter-icon.svg" alt="Фильтр" />
        </div>

        {isFilterOpen && (
          <div className="filter-dropdown">
            <div className="filter-group">
              <label>Тип игры:</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Все</option>
                <option value="Uno">Uno</option>
                <option value="Шахматы">Шахматы</option>
                <option value="Карты">Карты</option>
                <option value="Дженга">Дженга</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Место:</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">Все</option>
                <option value="ГУК">ГУК</option>
                <option value="РТФ">РТФ</option>
                <option value="УГИ">УГИ</option>
                <option value="ИЕНиМ">ИЕНиМ</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Дата:</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Таблица комнат */}
      <div className="games-table">
        <table>
          <thead>
            <tr>
              <th>Место</th>
              <th>Название комнаты</th>
              <th>Игра</th>
              <th>Время</th>
              <th>Создатель</th>
            </tr>
          </thead>
          <tbody>
            {filterGames(availableGames).map(game => (
              <tr key={game.id}>
                <td>{game.location}</td>
                <td>{game.name}</td>
                <td>{game.type}</td>
                <td>
                  {new Date(game.date).toLocaleString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td>
                  <div className="creator-info">
                    <img 
                      src={game.adminAvatar || '/assets/img/default-avatar.png'} 
                      alt="Создатель" 
                      className="creator-avatar"
                    />
                    <span>{game.admin}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filterGames(availableGames).length === 0 && (
        <div className="no-games">
          <p>Нет доступных игр по вашему запросу</p>
        </div>
      )}
    </div>
  </div>
)};
