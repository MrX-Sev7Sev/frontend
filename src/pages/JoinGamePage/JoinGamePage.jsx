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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    date: '',
    customType: '',
    customLocation: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Загрузка доступных игр
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

  // Функция для присоединения к игре
  const handleJoinGame = (gameId) => {
    const games = GamesAPI.getAll().map(game => 
      game.id === gameId ? {
        ...game,
        players: [...new Set([...game.players, user.email])]
      } : game
    );
    GamesAPI.save(games);
    navigate('/main'); // Редирект на главную страницу
  };

  // Обновляем функцию фильтрации
  const filterGames = (games) => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Тип игры: либо из списка, либо ручной ввод
      const matchesType = !filters.type || 
        game.type.toLowerCase() === filters.type.toLowerCase() ||
        (filters.customType && game.type.toLowerCase().includes(filters.customType.toLowerCase()));

      // Место проведения: либо из списка, либо ручной ввод
      const matchesLocation = !filters.location || 
        game.location.toLowerCase() === filters.location.toLowerCase() ||
        (filters.customLocation && game.location.toLowerCase().includes(filters.customLocation.toLowerCase()));

      // Дата
      const matchesDate = !filters.date || new Date(game.date).toISOString().split('T')[0] === filters.date;

      return matchesSearch && matchesType && matchesLocation && matchesDate;
    });
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
                  onChange={(e) => setFilters({ ...filters, type: e.target.value, customType: '' })}
                >
                  <option value="">Все</option>
                  <option value="Uno">Uno</option>
                  <option value="Шахматы">Шахматы</option>
                  <option value="Карты">Карты</option>
                  <option value="Дженга">Дженга</option>
                  <option value="custom">Другое</option>
                </select>

                {filters.type === 'custom' && (
                  <input
                    type="text"
                    value={filters.customType}
                    onChange={(e) => setFilters({ ...filters, customType: e.target.value })}
                    placeholder="Введите тип игры"
                  />
                )}
              </div>

              <div className="filter-group">
                <label>Место:</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value, customLocation: '' })}
                >
                  <option value="">Все</option>
                  <option value="ГУК">Главный учебный корпус</option>
                  <option value="РТФ">Радиотехнический корпус</option>
                  <option value="УГИ">Уральский гуманитарный институт</option>
                  <option value="ИЕНиМ">Институт естественных наук</option>
                  <option value="custom">Другое</option>
                </select>

                {filters.location === 'custom' && (
                  <input
                    type="text"
                    value={filters.customLocation}
                    onChange={(e) => setFilters({ ...filters, customLocation: e.target.value })}
                    placeholder="Введите место проведения"
                  />
                )}
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
                <tr 
                  key={game.id}
                  onClick={() => handleJoinGame(game.id)}
                  className="game-row"
                >
                  <td>{game.location}</td>
                  <td>{game.name}</td>
                  <td>{game.type}</td>
                  <td>
                    {new Date(game.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </td>
                  <td>
                    <div className="creator-info">
                      <img 
                        src={game.adminAvatar || '/assets/img/avatar-default.png'} 
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
  );
}