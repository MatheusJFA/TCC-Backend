import { getEmailAndPassword, getPassword, validEmail, validPassword } from "../../../utils/autenticator";

jest.setTimeout(60 * 1000);
jest.useFakeTimers();

describe("Test authenticator functions", () => {
    test("should return the password from the authorization header", () => {
        const password = "Basic cGFzc3dvcmQxMjNQQA";
        const expected = "password123P@";

        expect(getPassword(password)).toBe(expected);
    });

    test("should return the password and email from the authorization header", () => {
        const authorization = "Basic dGVzdGVAZ21haWwuY29tOnBhc3N3b3JkMTIzUEA";
        const email = "teste@gmail.com";
        const password = "password123P@";

        expect(getEmailAndPassword(authorization)).toEqual([email, password]);
    });


    describe("Test validPassword function", () => {
        test("should return false if the password field is empty", () => {
            const password = "";

            expect(validPassword(password)).toBe(false);
        })

        test("should return false if the password field is weak", () => {
            const password = "123456";

            expect(validPassword(password)).toBe(false);
        })

        test("should return true if the password is ok", () => {
            const password = "password123P@";

            expect(validPassword(password)).toBe(true);
        })
    });

    describe("Test validEmail function", () => {
        test("should return false if the email field is empty", () => {
            const email = "";

            expect(validEmail(email)).toBe(false);
        });

        test("should return false if the email field is invalid", () => {
            const email = "teste@gmail";

            expect(validEmail(email)).toBe(false);
        });

        test("should return true if the email is ok", () => {
            const email = "testonildes@gmail.com";

            expect(validEmail(email)).toBe(true);
        });
    });
});