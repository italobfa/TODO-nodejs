const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const users = [];

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todo: [],
  }

  users.push(user);

  return response.status(201).json(user)
});

app.listen(3333);
