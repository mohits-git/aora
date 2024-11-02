import SignIn from "@/app/(auth)/sign-in";
import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.mohits_org.aora",
  projectId: "67260bb30003fffd2792",
  databaseId: "67260c14003dfedaf077",
  usersCollectionId: "67260c2300298a4704f0",
  videosCollectionId: "67260c2a001ac9ab66a4",
  storageId: "67260ddd002d697abafa",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (!newAccount) {
      throw Error;
    }
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email, 
        username,
        avatar: avatarUrl
      }
    );
    return newUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if (!session) {
      throw Error;
    }
    return session;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
