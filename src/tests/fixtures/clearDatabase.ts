import Database from "@configuration/database";
import Token from "@/entity/token.entity";
import Helper from "@/entity/helper.entity";
import Client from "@/entity/client.entity";

export const clearAllDatabase = async () => {
    try {
        const tokenRepository = Database.getRepository(Token);
        const clientRepository = Database.getRepository(Client);
        const helperRepository = Database.getRepository(Helper);
        
        await tokenRepository.delete({});
        await clientRepository.delete({});
        await helperRepository.delete({});


        return "🗑️ All Databases are clear";
    } catch (error) {
        return "❌ Database clear failed: " + error;
    }
}