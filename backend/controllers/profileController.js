const { db } = require("../database");

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  db.get(
    "SELECT id, name, email FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err || !user) return res.status(404).send("User not found");
      res.status(200).json(user);
    }
  );
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

  db.run(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, hashedPassword, userId],
    (err) => {
      if (err) return res.status(400).send("Error updating profile");
      res.status(200).send("Profile updated successfully");
    }
  );
};
