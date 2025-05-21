import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CreateGamePage.css';

export default function CreateGamePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Uno',
    location: 'ГУК',
    date: '',
    time: '',
    maxPlayers: 4
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newGame = {
      id: Date.now(),
      ...formData,
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
        <div className="form-group">
          <label>Название игры</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Тип игры</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="Uno">Uno</option>
              <option value="Шахматы">Шахматы</option>
              <option value="Монополия">Монополия</option>
            </select>
          </div>

          <div className="form-group">
            <label>Локация</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            >
              <option value="ГУК">Главный корпус</option>
              <option value="РТФ">Радиотехнический</option>
              <option value="УГИ">Гуманитарный</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дата</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Время</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Количество игроков</label>
          <input
            type="number"
            min="2"
            max="10"
            value={formData.maxPlayers}
            onChange={(e) => setFormData({...formData, maxPlayers: e.target.value})}
          />
        </div>

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