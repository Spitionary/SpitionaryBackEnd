import { findOne } from "../model/user";
import { use } from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

// verified bearer token
use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    findOne({
      attributes: ["id", "username", "email"],
      where: {
        id: jwt_payload._id,
      },
    })
      .then((user) => {
        // verify user found and token is equals with database
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);
