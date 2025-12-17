const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//function for register
exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    try {
      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Insert user
      const insertUserQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(
        insertUserQuery,
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error creating user", error: err });
          }

          res.status(201).json({
            message: "User registered successfully",
          });
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Password hashing failed" });
    }
  });
};
//for login 
exports.login = (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Check user exists
  const findUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(findUserQuery, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};

