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
      setVkLink(profile.vkLink || '');
      setEmail(profile.email || user.email || '');
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
                <label>Nickname:</label>
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
                <label>VK Link:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={vkLink}
                    onChange={(e) => setVkLink(e.target.value)}
                    placeholder="https://vk.com/your_id"
                  />
                ) : (
                  <span>{vkLink || 'Не указано'}</span>
                )}
              </div>

              <div className="info-item">
                <label>Email:</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <span>{email || 'Не указано'}</span>
                )}
              </div>

              <div className="info-item">
                <label>Password:</label>
                {isEditing ? (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                  />
                ) : (
                  <span>{password ? '••••••••' : 'Не указано'}</span>
                )}
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
