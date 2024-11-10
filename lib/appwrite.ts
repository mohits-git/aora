import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

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
        avatar: avatarUrl,
      },
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

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) {
      throw Error;
    }
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
    );
    if (!posts || !posts.documents) {
      throw Error("No posts found");
    }
    return posts.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    );
    if (!posts || !posts.documents) {
      throw Error("No posts found");
    }
    return posts.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query)],
    );
    if (!posts || !posts.documents) {
      throw Error("No posts found");
    }
    return posts.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("creator", userId)],
    );
    if (!posts || !posts.documents) {
      throw Error("No posts found");
    }
    return posts.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
  }
};
