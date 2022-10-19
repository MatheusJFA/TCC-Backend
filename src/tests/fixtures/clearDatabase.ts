import Database from "@configuration/database";
import Token from "@/entity/token.entity";
import User from "@/entity/user.entity";

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