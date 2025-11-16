// src/appwrite/auth.js
import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl) 
      .setProject(conf.appWriteProjectId);

    this.account = new Account(this.client);
  }

  // Signup
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      // If account created, create a session (login) and return its result
      return await this.login({ email, password });
    } catch (error) {
      console.error("Appwrite service :: createAccount :: error", error);
      throw error;
    }
  }

  // Login
  async login({ email, password }) {
    try {
      // Use the correct method name for latest Appwrite SDK
      const session = await this.account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error("Appwrite service :: login :: error", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error.code !== 401) {
        console.error("Appwrite service :: getCurrentUser :: error", error);
      }
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
      return true;
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;