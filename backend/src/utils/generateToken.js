import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    "mySecretKey",
    { expiresIn: "7d" }
  );
};

export default generateToken;