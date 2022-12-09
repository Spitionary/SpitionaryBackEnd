require("dotenv").config();
import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";
import { initialize } from "passport";
import routes from "./src/routes/routes";

app.disable("x-powered-by");

// use cors
app.use(cors());

// use passport
app.use(initialize());

// parse requests of json
app.use(json());

// parse requests of body on form data
app.use(urlencoded({ extended: true }));

// define routes
app.use("/", routes);

// running server
const port = process.env.APP_PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
