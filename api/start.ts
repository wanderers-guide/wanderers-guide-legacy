import { prisma } from "./config";
import { bootstrapFeats } from "./resources/feats";
import { createApi } from "./controllerBuilder";
import express from "express";

const feats = bootstrapFeats({ prisma });

const api = createApi({ prisma, resources: [feats] });

const app = express();
app.use(express.json());
app.use('/api/v2/', (req, res) => {
  console.log("here!");
  try {
    api.handleRequest(req, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong!");
  }
});
app.listen(9000, () => {
  console.log("listening on port 9000!");
});
