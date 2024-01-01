const { Server } = require("socket.io");
import { sql } from "@vercel/postgres";
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const KEY = "safasfgasgasasvasdfva";

let users = [{ id: "1", email: "user1@example.com" }];

export default async function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running, skipping");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("a user connected");

    //Adding users to online list
    socket.on("addUser", (email) => {
      console.log("User to add:", email);
      let ids = socket.id;
      const userToUpdate = users.find((user) => user.ids === ids);
      if (!userToUpdate) {
        users.push({ ids, email, socket });
        console.log("User added");
        console.log("Users:", users);
      } else {
        console.log("User already added");
      }
    });

    //Send recieved messages
    socket.on("getRecievedMessages", async (email) => {
      console.log("Email Recieved:", email);
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE receiver_email = ${email};`;
        io.emit("getRecievedMessages", result.rows, email);
      } catch (error) {
        console.log("Error cought on getRecievedMessages:", error);
      }
    });

    //Send sent messages
    socket.on("getSentMessages", async (email) => {
      console.log("Email Sent:", email);
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        console.log("trying");
        const result =
          await sql`SELECT * FROM messages WHERE sender_email = ${email};`;
        console.log("email to send back: ", email);
        io.emit("getSentMessages", result.rows, email);
      } catch (error) {
        console.log("Error counght on getSentMessages:", error);
      }
    });

    socket.on("refreshOther", async (email3) => {
      console.log("Email on refresh:", email3);
      if (!email3 || email3 === "" || email3 === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE receiver_email = ${email3};`;

        for (const user of users) {
          if (user.email3 === email3) {
            user.socket.emit("refreshOther", result.rows, email3);
          }
        }
      } catch (error) {
        console.log("Error counght on getSentMessages:", error);
      }
    });

    //Removing dicsonnected users from online list
    socket.on("disconnect", () => {
      console.log("user disconnected");
      users = users.filter((user) => user.ids !== socket.id);
    });
  });

  res.end();
}

// export async function Trigger(email) {
//   console.log("Triggered", email);
//   const io = new Server();

//   io.on("connection", async (socket) => {
//     console.log("before trying");
//     try {
//       console.log("trying");
//       const result =
//         await sql`SELECT * FROM messages WHERE receiver_email = ${email};`;
//       console.log("result: ", result);
//       io.emit("getReceivedMessages", result.rows);
//     } catch (error) {
//       console.log("Error caught on getReceivedMessages:", error);
//     }
//   });
// }
