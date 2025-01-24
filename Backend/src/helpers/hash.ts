import bcrypt from "bcrypt"

export const passwordToHash = async (senha: string): Promise<string> => {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(senha, salt)
  return hash
}

export const checkPassword = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}
