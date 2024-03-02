import express from "express";
import dataController from "../../controllers/dataController.js";
const dataRouter = express.Router();

dataRouter.get("/2d", dataController.threeD);
dataRouter.get("/2d/history", dataController.history2D);
dataRouter.get("/2d/bets",dataController.bets2D );
dataRouter.get("/2d/winners", dataController._2dWinners);
dataRouter.get("/3d/winners",dataController._3dWinners);
dataRouter.get("/topGainer",dataController._topGainers);
dataRouter.get("/isUserRegistered",dataController.isUserRegistered);
dataRouter.get("/calender", dataController._calender);
dataRouter.get("/transactions", dataController._getTransactions);
export default dataRouter