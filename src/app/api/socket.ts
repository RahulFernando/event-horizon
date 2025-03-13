/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    res.status(200).json({ message: "Socket server is running" });
  } else if (req.method === "POST") {
    // Setup Socket.io server
    if (!res.socket.server.io) {
      console.log("Setting up socket.io server...");
      const io = new Server(res.socket.server);

      io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("sendMessage", (message) => {
          console.log("Message received:", message);
          io.emit("newMessage", message);
        });

        socket.on("disconnect", () => {
          console.log("user disconnected");
        });
      });

      res.socket.server.io = io;
    }
    res.status(200).json({ message: "Socket.io is ready" });
  }
}
