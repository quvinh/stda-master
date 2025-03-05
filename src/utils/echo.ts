import Echo from 'laravel-echo';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1';

window.io = io;

const echo = new Echo({
  broadcaster: 'socket.io',
  host: `${String(BACKEND_URL).replace(':8000', '')}:6002`, // Địa chỉ của Laravel Echo Server
  transports: ['websocket', 'polling', 'flashsocket'],
});

export default echo;
