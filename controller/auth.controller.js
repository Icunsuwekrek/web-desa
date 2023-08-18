const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authenticate = async (request, response) => {
  const { username, password } = request.body;

  const dataAdmin = await adminModel.findOne({
    where: { username },
  });

  if (dataAdmin && bcrypt.compareSync(password, dataAdmin.password)) {
    const payload = { id: dataAdmin.id, username: dataAdmin.username };

    const accessTokenSecret = "CibooxSecret";
    const refreshTokenSecret = "CibooxSecret";

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.json({
      success: true,
      logged: true,
      message: "Authentication successful",
      accessToken,
    });
  }

  return response.json({
    success: false,
    logged: false,
    message: "Authentication failed. Invalid username or password",
  });
};

const logout = (request, response) => {
  response.clearCookie("refreshToken");
  return response.json({
    success: true,
    message: "Logged out successfully",
  });
};

const authorize = (request, response, next) => {
  const refreshToken = request.cookies.refreshToken;
  const refreshTokenSecret = "CibooxSecret";

  if (!refreshToken) {
    return response.json({
      success: false,
      message: "User not authenticated",
    });
  }

  // Verify either the refresh token or the access token
  const tokenToVerify = request.headers.authorization
    ? request.headers.authorization.split(" ")[1]
    : refreshToken;

  jwt.verify(tokenToVerify, refreshTokenSecret, (error, user) => {
    if (error) {
      return response.json({
        success: false,
        message: "Token not valid",
      });
    }

    // Attach user information to the request for later use
    request.user = user;

    next();
  });
};

const register = async (request, response) => {
  const { username, password } = request.body;

  // Check if the username is already taken
  const existingAdmin = await adminModel.findOne({ where: { username } });
  if (existingAdmin) {
    return response.json({
      success: false,
      message: "Username already taken",
    });
  }

  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10); // Salt factor of 10

  // Create a new admin user
  const newAdmin = await adminModel.create({
    username,
    password: hashedPassword,
  });

  return response.json({
    success: true,
    message: "Registration successful",
    data: newAdmin,
  });
};

module.exports = { authenticate, authorize, logout, register };
