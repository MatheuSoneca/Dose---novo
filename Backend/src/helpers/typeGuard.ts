type TypeGuard = "string" | "number" | "boolean" | ((value: any) => boolean)

export const ensureProperty = (
  obj: Record<string, any>,
  propName: string,
  typeGuard: TypeGuard,
): boolean => {
  if (!(propName in obj)) return false
  if (typeof typeGuard === "string") return typeof obj[propName] === typeGuard

  return typeGuard(obj[propName])
}

export const validateObject = <T extends Record<string, any>>(
  obj: Record<string, any>,
  schema: Record<string, TypeGuard>,
): obj is T => {
  return Object.entries(schema).every(([key, value]) =>
    ensureProperty(obj, key, value),
  )
}
