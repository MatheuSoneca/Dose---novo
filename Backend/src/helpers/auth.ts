import jwt from "jsonwebtoken"

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    // Pega a chave secreta a partir de variável de ambiente ou outro local seguro
    const secret = process.env.JWT_SECRET as string

    // Verifica o token
    const decoded = jwt.verify(token, secret)

    // Se chegar aqui, o token é válido e `decoded` é o payload decodificado
    return decoded
  } catch (error) {
    // Se houver erro, pode ser porque o token expirou, foi adulterado, etc.
    throw new Error("Token inválido ou expirado")
  }
}

export const extractAuthToken = (
  authorizationHeader: string | undefined,
): string | undefined => {
  if (!authorizationHeader) return undefined

  const [bearer, token] = authorizationHeader.split(" ")

  if (bearer !== "Bearer" || !token) return undefined
  return token
}
