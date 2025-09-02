import cors from "cors";
import express, { Request, Response } from "express";
import notFound from "./app/middleware/notFound";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import passport from "passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import { envVariables } from "./app/config/envVeriables";
import './app/config/passport';

const app = express()
app.use(expressSession({
    secret: envVariables.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet Backend"
    })
})
app.use(globalErrorHandler);
app.use(notFound);

export default app