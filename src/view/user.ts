import User from "../entity/user"

export const userView = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    birthDate: user.birthDate,
  }
}

export const userEmail = (user: User) => {
  return {
    email: user.email
  }
}