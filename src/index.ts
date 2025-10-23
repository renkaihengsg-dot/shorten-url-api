import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { urlRoutes } from "#routes/index.js";
import { errorHandler } from "#middlewares/index.js";
import { Url } from "#models/index.js";
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

const sync = process.env.DB_SYNC === "true";
if (sync) {
  await Url.sync({ alter: true });
}

app.use("/api/url", urlRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
