import jwt from 'jsonwebtoken';

const getTokenFromCookies = (cookieHeader = '') => {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')
    .slice(1)
    .join('=');
};

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  console.log("auth", socket.handshake.auth)
    console.log("token", socket.handshake.auth?.token)
  if (authToken) {
    return authToken.startsWith('Bearer') ? authToken.slice(7) : authToken;
  }
console.log(getTokenFromCookies(socket.handshake.headers.cookie))
  return getTokenFromCookies(socket.handshake.headers.cookie);
};

const authorizeSocket = (io, socket) => {

  return (socket, next) => {
    const token = getTokenFromSocket(socket);

    if (!token) {
      return next(new Error('Authorization token is required'));
    }

    try {
  
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );

      socket.user = user;
      io.users.push({
        socketId: socket.id,
        user,
      });

      return next();
    } catch (error) {
      return next(new Error('Invalid or expired authorization token'));
    }
  };
};

export default authorizeSocket;
