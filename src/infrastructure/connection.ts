import { Connection, ConnectionManager, createConnection, getConnectionManager } from 'typeorm';
import connectionOptions from '../configuration/database';

export class Database {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(name: string): Promise<Connection> {
    let connection: Connection = {} as Connection;
    const CONNECTION_NAME: string = name;

    try {
      const hasConnection = this.connectionManager.has(CONNECTION_NAME);
      if (hasConnection) {
        connection = this.connectionManager.get(CONNECTION_NAME);
        if (!connection.isConnected)
          connection = await connection.connect();
      }
      else 
        connection = await createConnection(connectionOptions);
    } catch (error) {
      connection = await createConnection(connectionOptions);
    } finally {
      return connection;
    }
  }
}

export default new Database();
