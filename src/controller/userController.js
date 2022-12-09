import { genSaltSync, compareSync, hashSync } from "bcryptjs";
import { object, string } from "joi";
import { sign } from "jsonwebtoken";
import { findOne, findOrCreate } from "../model/user";
const salt = genSaltSync(10);

const login = async (req, res) => {
  try {
    // validation form data
    const rules = object({
      email: string().email().max(50).required(),
      password: string().min(8).required(),
    });
    const { error } = rules.validate(req.body);

    // if form data is invalid
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // find user data
    const user = await findOne({
      attributes: [["id", "userId"], "username", "email", "password"],
      where: {
        email: email,
      },
    });

    // if user found and password are equals
    if (user && compareSync(password, user.password)) {
      // generate token
      const token = sign(
        { _id: user.getDataValue("userId") },
        process.env.SECRET_KEY
      );

      // convert id to string
      user.setDataValue("userId", user.getDataValue("userId").toString());

      // remove property password from object
      delete user.dataValues.password;

      return res.status(200).json({
        error: false,
        message: "Login successful",
        loginResult: {
          ...user.dataValues,
          token: token,
        },
      });
    }

    /**
     * if user not found
     * or password is not equals
     */
    return res.status(400).json({
      error: true,
      message: "Email / Password doesn't match",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).end();
  }
};

const register = async (req, res) => {
  try {
    // validation form data
    const rules = object({
      username: string().max(50).required(),
      email: string().email().max(50).required(),
      password: string().min(8).required(),
    });
    const { error } = rules.validate(req.body);

    // if form data is invalid
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }

    const { username, email, password } = req.body;
    const created_at = Date.now();
    const updated_at = created_at;

    // find or create user
    const [user, created] = await findOrCreate({
      where: { email: email },
      defaults: {
        username: username,
        password: hashSync(password, salt),
        created_at: created_at,
        updated_at: updated_at,
      },
    });

    // if email has already in database
    if (!created) {
      return res.status(400).json({
        error: !created,
        message: "Email has been used!",
      });
    }

    // if user has already created
    return res.status(201).json({
      error: !created,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).end();
  }
};

export default { register, login };
