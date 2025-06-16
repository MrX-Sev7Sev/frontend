export const UsersAPI = {
  saveProfile: (userId, profileData) => {
    const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
    profiles[userId] = profileData;
    localStorage.setItem('profiles', JSON.stringify(profiles));
  },

  getProfile: (userId) => {
    const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
    return profiles[userId] || {};
  },
};
