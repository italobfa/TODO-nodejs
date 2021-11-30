const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const users = [];

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

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
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    created_at: new Date(),
    done: false,
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "TODO not found" });
  }

  todo.title = title;

  return response.json(todo);
});

app.patch("/todos/:id/done", checkExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({ error: "TODO not found" });
  }

  todo.done = true

  return response.json(todo)
});

app.listen(3333);
