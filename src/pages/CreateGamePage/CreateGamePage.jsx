import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateGamePage.css';

// Изображения для разных типов игр
const GAME_IMAGES = {
  'Uno': '/assets/games/uno.jpg',
  'Шахматы': '/assets/games/chess.jpg',
  'Карты': '/assets/games/cards.jpg',
  'Дженга': '/assets/games/jenga.jpg',
  'custom': '/assets/games/custom.jpg'
};

export default function CreateGamePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    type: 'Uno',
    customType: '',
    location: 'ГУК',
    date: '',
    time: '',
    maxPlayers: 4
  });
  
  // Показывать ли поле для кастомной игры
  const [showCustomGameInput, setShowCustomGameInput] = useState(false);
  
  // Обработка изменения типа игры
  const handleGameTypeChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      type: value,
      customType: value === 'custom' ? '' : formData.customType
    });
    setShowCustomGameInput(value === 'custom');
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const gameType = formData.type === 'custom' ? formData.customType : formData.type;
    
    const newGame = {
      id: Date.now(),
      ...formData,
      type: gameType,
      admin: user.email,
      players: [user.email],
      date: new Date(`${formData.date}T${formData.time}`).toISOString()
    };

    const existingGames = JSON.parse(localStorage.getItem('games')) || [];
    const updatedGames = [...existingGames, newGame];
    
    localStorage.setItem('games', JSON.stringify(updatedGames));
    navigate('/main');
  };

  return (
    <div className="create-game-page">
      <h1>Создание игры</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Верхняя секция: изображение + название */}
        <div className="top-section">
          <div className="game-image-container">
            <img 
              src={GAME_IMAGES[formData.type === 'custom' ? 'custom' : formData.type]} 
              alt="Тип игры" 
              className="game-image"
            />
          </div>
          
          <div className="game-name-group">
            <label>Название комнаты</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
            <option value="Uno">Uno</option>
            <option value="Шахматы">Шахматы</option>
            <option value="Карты">Карты</option>
            <option value="Дженга">Дженга</option>
            <option value="custom">Добавить свою игру</option>
          </select>
          
          {showCustomGameInput && (
            <div className="custom-game-input">
              <input
                type="text"
                value={formData.customType}
                onChange={(e) => setFormData({...formData, customType: e.target.value})}
                placeholder="Введите название игры"
                required
              />
            </div>
          )}
        </div>

        {/* Дата и время */}
        <div className="form-group">
          <label>Дата и время</label>
          <div className="datetime-group">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Место проведения */}
        <div className="form-group">
          <label>Место проведения</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          >
            <option value="ГУК">Главный учебный корпус</option>
            <option value="РТФ">Радиотехнический корпус</option>
            <option value="УГИ">Уральский гуманитарный институт</option>
            <option value="ИЕНиМ">Институт естественных наук</option>
            <option value="other">Другое место</option>
          </select>
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
              onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})}
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