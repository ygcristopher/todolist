import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/routes";

// Configuração do aplicativo
const app = express();
const PORT = 3003;

// Configuração do CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Configuração do bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotas
app.use("/", router);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
