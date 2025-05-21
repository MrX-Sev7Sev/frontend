export const GamesAPI = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem('games')) || [];
    } catch (error) {
      console.error('Ошибка чтения игр:', error);
      return [];
    }
  },

  save(games) {
    localStorage.setItem('games', JSON.stringify(games));
    window.dispatchEvent(new Event('games-updated'));
  },

  initializeTestGames() {
    const TEST_GAMES = [
      {
        id: 1717592400000,
        name: 'Вечерние шахматы',
        type: 'Шахматы',
        location: 'РТФ, аудитория 304',
        date: '2024-03-20T18:00:00.000Z',
        maxPlayers: 4,
        players: ['player1@example.com'],
        admin: 'admin@example.com'
      },
      {
        id: 1717592400001,
        name: 'Uno турнир',
        type: 'Uno',
        location: 'ГУК, холл 2 этаж',
        date: '2024-03-21T19:30:00.000Z',
        maxPlayers: 6,
        players: ['user3@example.com'],
        admin: 'user3@example.com'
      }
    ];

    const existingGames = this.getAll();
    const newGames = TEST_GAMES.filter(
      testGame => !existingGames.some(g => g.id === testGame.id)
    );
    
    if (newGames.length > 0) {
      this.save([...existingGames, ...newGames]);
    }
  }
};