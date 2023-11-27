import { Server } from "socket.io";

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  return io;
};
export default socketServer;
