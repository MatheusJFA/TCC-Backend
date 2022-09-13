export const Token = {
    ACCESS_TOKEN: "ACCESS_TOKEN",
    REFRESH_TOKEN: "REFRESH_TOKEN",
    VERIFY_EMAIL: "VERIFY_EMAIL",
    RESET_PASSWORD: "RESET_PASSWORD"
};

export type TokenType = keyof typeof Token;

export const TokenValues = Object.values(Token);
