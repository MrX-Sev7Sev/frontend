import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NavigationSidebar from '../../components/NavigationSidebar';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSave = () => {
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
                  src={avatar || '/assets/img/default-avatar.png'} 
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
                <label>Имя:</label>
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
                <label>Email:</label>
                <span>{user?.email}</span>
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