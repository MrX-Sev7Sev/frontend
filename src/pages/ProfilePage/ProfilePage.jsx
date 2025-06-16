import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import NavigationSidebar from '../../components/NavigationSidebar';
import { UsersAPI } from '../../api/users';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [vkLink, setVkLink] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      const profile = UsersAPI.getProfile(user.email);
      setEditedName(profile.nickname || '');
      setVkLink(profile.vkLink || 'https://vk.com/');
      setEmail(profile.email || user.email || '');
      setPassword(profile.password || '');
      setAvatar(profile.avatar || '/assets/img/avatar-default.png');
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      const profileData = {
        nickname: editedName,
        vkLink,
        email,
        password,
        avatar,
      };
      UsersAPI.saveProfile(user.email, profileData);
    }
    setIsEditing(false);
  };

  const handleVkLinkChange = (value) => {
    if (!value.startsWith('https://vk.com/')) {
      // Если пользователь удалил или изменил шаблон, добавляем его автоматически
      setVkLink(`https://vk.com/${value.replace('https://vk.com/', '')}`);
    } else {
      setVkLink(value);
    }
  };

  return (
    <div className="main-page-container">
      <NavigationSidebar />
      
      <div className="main-content">
        <div className="profile-page">
          <div className="profile-header">
            <h1>Личный профиль</h1>
          </div>

          <div className="profile-content">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img 
                  src={avatar} 
                  alt="Аватар" 
                  className="profile-avatar"
                />
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
                    className="avatar-upload"
                  />
                )}
              </div>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <label>Имя пользователя:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  <span>{editedName || 'Не указано'}</span>
                )}
              </div>

              <div className="info-item">
                <label>Ссылка на VK:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={vkLink.includes('https://vk.com/') ? vkLink : `https://vk.com/${vkLink}`}
                    onChange={(e) => handleVkLinkChange(e.target.value)}
                  />
                ) : (
                  <span>{vkLink === 'https://vk.com/' ? 'Не указано' : vkLink}</span>
                )}
              </div>

              <div className="info-item">
                <label>Email:</label>
                <span>{email || 'Не указано'}</span> {/* Логин (email) всегда только для чтения */}
              </div>

              <div className="info-item">
                <label>Пароль:</label>
                <span>{password ? '••••••••' : '••••••••'}</span> {/* Пароль всегда только для чтения */}
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button className="save-button" onClick={handleSave}>
                      Сохранить
                    </button>
                    <button 
                      className="cancel-button" 
                      onClick={() => setIsEditing(false)}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <button 
                    className="edit-button" 
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
