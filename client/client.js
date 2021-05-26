// const socket = io.connect('http://localhost:8000');
const socket = io.connect();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const audio = new Audio('./assets/Tone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position == 'left'){
        audio.play();
    }
}


const Name = prompt('Enter your name to join this chat.');

// emit information of new user as the 'new-user-joined' event to be listened by server
socket.emit('new-user-joined', Name);

// listen the 'user-joined' event broadcasted by server 
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});

// listen the 'receive' event broadcasted by server 
socket.on('receive', data => {
    append(`<b>${data.name}</b>: ${data.message}`, 'left');
})

// listen the 'left-chat' event broadcasted by server 
socket.on('left-chat', name => {
    append(`${name} left the chat`, 'left');
})

// listen the 'submit' event
form.addEventListener('submit', e => {
    e.preventDefault(); // It prevents the page from reloading
    const message = messageInput.value;
    append(`You: ${message}`, 'right');

    // emit information of message as the 'send' event to be listened by server
    socket.emit('send', message);
    
    messageInput.value = ''; // so that input box becomes empty again
   
    messageContainer.scrollTo(0, messageContainer.scrollHeight); 
    // automatically scrolls down in case of message overflow
});