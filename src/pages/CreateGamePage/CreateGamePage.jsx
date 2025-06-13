import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './CreateGamePage.css';

// Массив с популярными играми
const POPULAR_GAMES = [
  {
    id: 2,
    title: 'Uno',
    image: '/assets/games/uno.jpg',
    genre: 'Карточная'
  },
  {
    id: 3,
    title: 'Карты',
    image: '/assets/games/cards.jpg',
    genre: 'Карточная'
  },
  {
    id: 4,
    title: 'Шахматы',
    image: '/assets/games/chess.jpg',
    genre: 'Стратегическая'
  },
  {
    id: 5,
    title: 'Шашки',
    image: '/assets/games/checkers.jpg',
    genre: 'Стратегическая'
  },
  {
    id: 6,
    title: 'Нарды',
    image: '/assets/games/backgammon.jpg',
    genre: 'Стратегическая'
  },
  {
    id: 7,
    title: 'Мафия',
    image: '/assets/games/mafia.jpg',
    genre: 'Социальная'
  },
  {
    id: 8,
    title: 'Монополия',
    image: '/assets/games/monopoly.jpg',
    genre: 'Экономическая'
  },
  {
    id: 9,
    title: 'Дженга',
    image: '/assets/games/jenga.jpg',
    genre: 'Активная'
  },
  {
    id: 10,
    title: 'Dungeons & Dragons',
    image: '/assets/games/dnd.jpg',
    genre: 'Ролевая'
  },
  {
    id: 11,
    title: 'Каркассон',
    image: '/assets/games/carcassonn.jpg',
    genre: 'Стратегическая'
  },
  {
    id: 12,
    title: 'Бункер',
    image: '/assets/games/bunker.jpg',
    genre: 'Социальная'
  },
  {
    id: 13,
    title: 'Пандемия',
    image: '/assets/games/pandemic.jpg',
    genre: 'Стратегическая'
  },
  {
    id: 14,
    title: 'Эрудит',
    image: '/assets/games/scrabble.jpg',
    genre: 'Логическая'
  },
  {
    id: 15,
    title: 'Алиас',
    image: '/assets/games/alias.jpg',
    genre: 'Социальная'
  },
  {
    id: 16,
    title: 'Угадай, Кто?',
    image: '/assets/games/guess_who.jpg',
    genre: 'Логическая'
  },
  {
    id: 17,
    title: 'Имаджинариум',
    image: '/assets/games/imaginarium.jpg',
    genre: 'Креативная'
  },
  {
    id: 18,
    title: 'Свинтус',
    image: '/assets/games/svintus.jpg',
    genre: 'Карточная'
  },
  {
    id: 19,
    title: 'Крокодил',
    image: '/assets/games/crocodile.jpg',
    genre: 'Активная'
  },
  {
    id: 1,
    title: 'Добавить свою игру',
    image: '/assets/games/custom.jpg',
    genre: ''
  },
];

export default function CreateGamePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    type: 'Добавить свою игру', // По умолчанию выбрана "Добавить свою игру"
    customType: '',
    customGenre: '',
    location: 'ГУК',
    date: '',
    time: '',
    maxPlayers: 4
  });

  // Поле для ввода "Другое место"
  const [customLocation, setCustomLocation] = useState('');

  // Показывать ли поле для кастомной игры
  const [showCustomGameInput, setShowCustomGameInput] = useState(formData.type === 'Добавить свою игру');

  // Обработка изменения типа игры
  const handleGameTypeChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      type: value,
      customType: value === 'Добавить свою игру' ? '' : formData.customType
    });
    setShowCustomGameInput(value === 'Добавить свою игру');
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();

  // Определяем тип игры и жанр
  const gameType = formData.type === 'Добавить свою игру' ? formData.customType : formData.type;
  const gameGenre = formData.type === 'Добавить свою игру'
    ? formData.customGenre
    : POPULAR_GAMES.find((game) => game.title === formData.type)?.genre || 'Другая';

    // изображение
    image: POPULAR_GAMES.find((game) => game.title === formData.type)?.image || '/assets/games/custom.jpg'

  // Определяем место проведения
  const gameLocation = formData.location === 'other' ? customLocation : formData.location;

    const newGame = {
      id: Date.now(),
      ...formData,
      type: gameType,
      image: POPULAR_GAMES.find((game) => game.title === formData.type)?.image || '/assets/games/custom.jpg',
      genre: gameGenre, // Передаём жанр игры
      location: gameLocation,
      admin: user.email,
      players: [user.email],
      date: new Date(`${formData.date}T${formData.time}`).toISOString()
    };

    // Сохраняем игру
    const existingGames = JSON.parse(localStorage.getItem('games')) || [];
    const updatedGames = [...existingGames, newGame];
    localStorage.setItem('games', JSON.stringify(updatedGames));
    navigate('/main');
  };

  // хуйня для вычисления заливки ползунка колва игроков
    useEffect(() => {
        const rangeInput = document.querySelector('.players-input input[type="range"]');

        if (rangeInput) {
          const handleInput = () => {
            const value = rangeInput.value;
            const max = rangeInput.max;
            const min = rangeInput.min;
            const progress = ((value - min) / (max - min)) * 100; // Точное вычисление прогресса
            rangeInput.style.setProperty('--range-progress', `${progress}%`);
          };
          handleInput();
          rangeInput.addEventListener('input', handleInput);

          // Отписка при размонтировании компонента
          return () => {
            rangeInput.removeEventListener('input', handleInput);
          };
        }
      }, []); // Пустой массив зависимостей, чтобы эффект выполнился только при монтировании

    return (
    <div className="create-game-page">
      <h1>Создание игры</h1>

      <form onSubmit={handleSubmit}>
        {/* Верхняя секция: изображение + название */}
        <div className="top-section">
          <div className="game-image-container">
            <img 
              src={POPULAR_GAMES.find((game) => game.title === formData.type)?.image || '/assets/games/custom.jpg'} 
              alt="Тип игры" 
              className="game-image"
            />
          </div>

          <div className="game-name-group">
            <label>Название комнаты</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Введите название игровой комнаты"
            />
          </div>
        </div>

        {/* Выбор типа игры */}
        <div className="form-group">
          <label>Тип игры</label>
          <select
            value={formData.type}
            onChange={handleGameTypeChange}
          >
            {POPULAR_GAMES.map((game) => (
              <option key={game.id} value={game.title}>
                {game.title}
              </option>
            ))}
          </select>

          {showCustomGameInput && (
            <>
              <div className="custom-game-input">
                <label>Название игры</label>
                <input
                  type="text"
                  value={formData.customType}
                  onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                  placeholder="Введите название игры"
                  required
                />
              </div>
              <div className="custom-game-input">
                <label>Жанр игры</label>
                <input
                  type="text"
                  value={formData.customGenre}
                  onChange={(e) => setFormData({ ...formData, customGenre: e.target.value })}
                  placeholder="Введите жанр игры"
                  required
                />
              </div>
            </>
          )}
        </div>

        {/* Дата и время */}
        <div className="form-group">
          <label>Дата и время</label>
          <div className="datetime-group">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Место проведения */}
        <div className="form-group">
          <label>Место проведения</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          >
            <option value="ГУК">Главный учебный корпус</option>
            <option value="РТФ">Радиотехнический корпус</option>
            <option value="УГИ">Уральский гуманитарный институт</option>
            <option value="ИЕНиМ">Институт естественных наук</option>
            <option value="other">Другое место</option>
          </select>

          {formData.location === 'other' && (
            <div className="custom-location-input">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Введите место проведения"
                required
              />
            </div>
          )}
        </div>

        {/* Количество участников */}
        <div className="form-group">
          <label>Количество участников</label>
          <div className="players-input">
            <input
              type="range"
              min="2"
              max="10"
              value={formData.maxPlayers}
              onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
            />
            <span className="players-count">{formData.maxPlayers} игроков</span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="form-buttons">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/main')}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className="submit-button"
          >
            Создать игру
          </button>
        </div>
      </form>
    </div>
  );
}