export const correctUser = {
    name: "teste",
    email: "teste@gmail.com",
    birthdate: "2000-01-01",
    role: "USER",
    sex: "OTHER",
};

export const userWithMissingParameters = {
    name: "teste",
    email: "testonildes@gmail.com",
    role: "USER",
    sex: "OTHER",
};

export const userWithInvalidParameters = {
    name: "teste",
    email: "teste.br",
    birthdate: "2000-01-01",
    role: "USER",
    sex: "OTHER",
};
