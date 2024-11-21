let players = [];
let availableSecrets = [];
let currentPlayer = ''; // Jugador actual que intenta descubrir su amigo secreto
let playedPlayers = new Set(); // Jugadores que ya han jugado

// Referencias a los elementos del DOM
const playerNameInput = document.getElementById('playerName');
const validatePlayerButton = document.getElementById('validatePlayer');
const revealSecretButton = document.getElementById('revealSecret');
const secretMessage = document.getElementById('secretMessage');
const playerList = document.getElementById('playerList');
const gameSection = document.getElementById('game');

// Cargar jugadores desde la base de datos
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

// Validar jugador actual
validatePlayerButton.addEventListener('click', () => {
  const inputName = playerNameInput.value.trim();

  // Verificar si el nombre esta en la lista y si ya jugo para no arruinar el juego
  if (players.includes(inputName)) {
    if (playedPlayers.has(inputName)) {
      secretMessage.textContent = `¡${inputName}, ya descubriste tu amigo secreto! No puedes jugar de nuevo.`;
      revealSecretButton.disabled = true; // Desactivar boton
    } else {
      currentPlayer = inputName;
      revealSecretButton.disabled = false; // Activar boton de descubrir
      secretMessage.textContent = `Hola ${currentPlayer}! Puedes descubrir tu amigo secreto.`;
    }
  } else {
    secretMessage.textContent = 'El nombre ingresado no esta en la lista. Intenta nuevamente.';
    revealSecretButton.disabled = true; // Desactivar boton
  }
});

// Asignar un amigo secreto
revealSecretButton.addEventListener('click', () => {
  if (availableSecrets.length === 0) {
    secretMessage.textContent = 'Todos los amigos secretos han sido asignados.';
    return;
  }

  // Filtrar para evitar que un jugador sea su propio amigo secreto
  const validSecrets = availableSecrets.filter(name => name !== currentPlayer);
  if (validSecrets.length === 0) {
    secretMessage.textContent = 'No hay amigos secretos validos disponibles para ti.';
    return;
  }

  // Asignar un amigo secreto aleatorio
  const secretIndex = Math.floor(Math.random() * validSecrets.length);
  const secretFriend = validSecrets[secretIndex];

  // Marcar al jugador como que ya jugo
  playedPlayers.add(currentPlayer);

  // Remover al jugador actual y al amigo secreto de las listas
  players = players.filter(name => name !== currentPlayer);
  availableSecrets = availableSecrets.filter(name => name !== secretFriend);

  // Actualizar la lista visible y mensaje
  updatePlayerList();
  secretMessage.textContent = `${currentPlayer}, tu amigo secreto es: ${secretFriend}`;

  // Desactivar boton despues de asignar
  revealSecretButton.disabled = true;
  playerNameInput.value = ''; // Limpiar el input
  currentPlayer = ''; // Reiniciar jugador actual
});

// Inicializar el juego cargando jugadores
loadPlayers();
