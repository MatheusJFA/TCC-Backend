import Database from "@configuration/database";
import User from "@/entity/user.entity";
import Token from "@/entity/token.entity";

export const clearAllDatabase = async () => {
    try {
        const tokenRepository = Database.getRepository(Token);
        const userRepository = Database.getRepository(User);
        
        await tokenRepository.delete({});
        await userRepository.delete({});

        return "🗑️ All Databases are clear";
    } catch (error) {
        return "❌ Database clear failed: " + error;
    }
}

export const clearTokenDatabase = async () => {
    try {
        const tokenRepository = Database.getRepository(Token);
        
        await tokenRepository.delete({});

        return "🗑️ Token Databases are clear";
    } catch (error) {
        return "❌ Token Database clear failed: " + error;
    }
}