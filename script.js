const socket = io("https://senin-backend-adresin.railway.app");

const nickInput = document.getElementById('nickInput');
const setNickButton = document.getElementById('setNickButton');
const userCount = document.getElementById('userCount');
const chatWindow = document.getElementById('chatWindow');
const userList = document.getElementById('userList');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const emojiContainer = document.querySelector('.emoji-container');
let currentUser = '';

// Nick belirle
setNickButton.addEventListener('click', () => {
    const nick = nickInput.value.trim();
    if (nick) {
        currentUser = nick;
        socket.emit('setNick', { nick });
    } else {
        alert('Nick alanı boş bırakılamaz!');
    }
});

// Mesaj gönder
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && currentUser) {
        socket.emit('sendMessage', { username: currentUser, message });
        messageInput.value = '';
    } else {
        alert('Önce bir nick girin!');
    }
}

// Emojileri tıklayınca mesaj kutusuna ekleme
emojiContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('emoji')) {
        messageInput.value += e.target.dataset.emoji;
    }
});

// Mesajları al
socket.on('receiveMessage', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <span class="username ${msg.isAdmin ? 'admin' : ''}">${msg.username}</span>
        <span class="time">${msg.time}</span>
        <p>${msg.message}</p>
    `;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Kullanıcı listesini güncelle
socket.on('updateUsers', (users) => {
    userList.innerHTML = users.map(user => `
        <li class="${user.isAdmin ? 'admin' : ''}">
            ${user.username}
        </li>
    `).join('');
});

// Aktif kullanıcı sayısını güncelle
socket.on('updateUserCount', (count) => {
    userCount.textContent = `${count} Aktif Kullanıcı`;
});

// Eski mesajları yükle
socket.on('loadMessages', (messages) => {
    messages.forEach((msg) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <span class="username ${msg.isAdmin ? 'admin' : ''}">${msg.username}</span>
            <span class="time">${msg.time}</span>
            <p>${msg.message}</p>
        `;
        chatWindow.appendChild(messageElement);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
});
