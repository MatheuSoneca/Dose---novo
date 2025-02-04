import express, { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { signupHandler } from "./handlers/signup"
import { loginHandler } from "./handlers/login"
import dotenv from "dotenv"
import { drinksHandler } from "./handlers/drinks"
import { newDrinkHandler } from "./handlers/newDrink"
import { drinkHandler } from "./handlers/drink"
import { commentHandler } from "./handlers/comment"
import { deleteCommentHandler } from "./handlers/deleteComment"

dotenv.config()

const app = express()
const port = 3000

// Permite que o Express entenda JSON no body das requisições e aumenta o limtie da req para 10mb
app.use(express.json({ limit: "10mb" }))

app.post("/signup", signupHandler)
app.post("/login", loginHandler)
app.get("/drinks", drinksHandler)
app.post("/drinks/new", newDrinkHandler)
app.get("/drinks/:id", drinkHandler)
app.post("/drinks/:id/comment", commentHandler)
app.delete("/drinks/:drinkId/comment/:commentId", deleteCommentHandler)

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!")
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`)
    })
  })
  .catch((error) => console.log("Erro ao conectar no banco de dados", error))
