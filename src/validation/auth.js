import { check } from "express-validator";

let validateUserInfo = [
  check("email", "Invalid email").isEmail().trim(),
  check("password", "Password must be atleast 5 chars long").isLength({ min: 5 }),
  check("cpassword", "Password Confirmation does not match password").custom((value, { req }) => {
    return value === req.body.password
  })
]

const auth = {
  validateUserInfo: validateUserInfo
}

export default auth;