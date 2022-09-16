import Database from "@configuration/database";
import Client from "@/entity/client.entity";
import Token from "@/entity/token.entity";
import Helper from "@/entity/helper.entity";

export const clearAllDatabase = async () => {
    try {
        const tokenRepository = Database.getRepository(Token);
        const clientRepository = Database.getRepository(Client);
        const helpersRepository = Database.getRepository(Helper);
        
        await tokenRepository.delete({});
        await clientRepository.delete({});
        await helpersRepository.delete({});

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