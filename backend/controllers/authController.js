const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../database");

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = uuidv4();

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [id, name, email, hashedPassword],
    (err) => {
      if (err) return res.status(400).send("Error creating user");
      res.status(201).send("User created successfully");
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) return res.status(404).send("User not found");
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });
    res.status(200).json({ token });
  });
};
