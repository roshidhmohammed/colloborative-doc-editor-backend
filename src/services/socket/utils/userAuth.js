import { jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

const getTokenFromCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")
    .slice(1)
    .join("=");
};

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken.startsWith("Bearer") ? authToken.slice(7) : authToken;
  }
  return getTokenFromCookies(socket.handshake.headers.cookie);
};

const authorizeSocket = async (socket, next) => {
  const token = getTokenFromSocket(socket);

  if (!token) {
    return next(new Error("Authorization token is required"));
  }

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });

    socket.user = payload.userId;
    return next();
  } catch (error) {
    return next(new Error("Invalid or expired authorization token"));
  }
};

export default authorizeSocket;
