import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // SSLCommerz posts form-encoded data

app.get("/", (req, res) => {
  res.json({ success: true, message: "RentNest API is running" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
