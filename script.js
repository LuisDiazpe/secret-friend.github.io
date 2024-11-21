let players = [];
let availableSecrets = [];

// Referencias a los elementos del DOM
const playerList = document.getElementById('playerList');
const revealSecretButton = document.getElementById('revealSecret');
const secretMessage = document.getElementById('secretMessage');
const gameSection = document.getElementById('game');

// Cargar jugadores desde el archivo JSON
async function loadPlayers() {
  try {
    const response = await fetch('participants.json');
    const data = await response.json();
    players = [...data.players];
    availableSecrets = [...data.players];
    updatePlayerList();
    gameSection.classList.remove('hidden');
  } catch (error) {
    console.error('Error al cargar los jugadores:', error);
  }
}

// Actualizar lista de jugadores en la interfaz
function updatePlayerList() {
  playerList.innerHTML = players.map(name => `<li>${name}</li>`).join('');
}

// Asignar un amigo secreto
revealSecretButton.addEventListener('click', () => {
  if (availableSecrets.length === 0) {
    secretMessage.textContent = 'Todos los amigos secretos han sido asignados.';
    return;
  }

  const currentPlayer = players.shift(); // Sacar al jugador actual
  const secretIndex = Math.floor(Math.random() * availableSecrets.length);
  const secretFriend = availableSecrets.splice(secretIndex, 1)[0]; // Remover de la lista de disponibles

  secretMessage.textContent = `${currentPlayer}, tu amigo secreto es: ${secretFriend}`;
  updatePlayerList();

  if (players.length === 0) {
    revealSecretButton.disabled = true;
    secretMessage.textContent += '\n¡El juego ha terminado!';
  }
});

// Inicializar el juego cargando jugadores
loadPlayers();
