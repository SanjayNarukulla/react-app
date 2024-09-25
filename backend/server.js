// backend/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)"
  );
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, "secretKey", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) {
        return res.status(400).json({ message: "User already exists" });
      }
      res.status(201).json({ message: "User created" });
    }
  );
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(403).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id, name: user.name }, "secretKey");
    res.json({ token });
  });
});

app.get("/api/profile", authenticateToken, (req, res) => {
  db.get(
    "SELECT name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) return res.status(400).json({ message: "User not found" });
      res.json(user);
    }
  );
});

app.put("/api/profile", authenticateToken, (req, res) => {
  const { name, email } = req.body;
  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.user.id],
    (err) => {
      if (err) return res.status(400).json({ message: "Update failed" });
      res.json({ message: "Profile updated" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
