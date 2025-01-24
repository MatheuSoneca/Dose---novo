import express, { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { signupHandler } from "./handlers/signup"
import { loginHandler } from "./handlers/login"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = 3000

// Permite que o Express entenda JSON no body das requisições
app.use(express.json())

app.post("/signup", signupHandler)
app.post("/login", loginHandler)

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!")
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`)
    })
  })
  .catch((error) => console.log("Erro ao conectar no banco de dados", error))
