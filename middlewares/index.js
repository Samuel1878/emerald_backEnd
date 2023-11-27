import bodyparser from "body-parser";
import cors from "cors";
import express from "express";
const middleware = (app) => {
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(bodyparser.json());
    app.use(express.json({extended:false}));
    app.use(cors());
};
export default middleware;