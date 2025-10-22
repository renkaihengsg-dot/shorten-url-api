import express, { Request, Response, NextFunction } from "express";

import { urlRoutes } from "#routes/index.js";
import { errorHandler } from "#middlewares/index.js";
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/url", urlRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
