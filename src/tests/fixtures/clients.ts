export const correctUser = {
    name: "testonildo",
    email: "client-correct@gmail.com",
    birthdate: "2000-01-01",
    role: "USER",
    sex: "OTHER",
    height: 1.89,
    weight: 105,
    image: "../assets/image/default-avatar.png"
};

export const userWithMissingParameters = {
    name: "testonildo",
    email: "client-missing@gmail.com",
    role: "USER",
    sex: "OTHER",
    height: 1.89,
    weight: 105.00,
    image: "../assets/image/default-avatar.png"
};

export const userWithInvalidParameters = {
    name: "testonildo",
    email: "invalidClient.br",
    birthdate: "2000-01-01",
    role: "USER",
    sex: "OTHER",
    height: 1.89,
    weight: 105.00,
    image: "../assets/image/default-avatar.png"
};
