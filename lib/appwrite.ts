import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
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
const storage = new Storage(client);

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
      [Query.orderDesc("$createdAt")],
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

export const getFilePreview = async (
  fileId: string,
  type: "video" | "image",
) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100,
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw Error("No file found");
    return fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const uploadFile = async (file: any, type: "video" | "image") => {
  if (!file) return;
  const asset = {
    name: file.fileName,
    size: file.fileSize,
    uri: file.uri,
    type: file.mimeType,
  };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset,
    );
    if (!uploadedFile) throw Error("Failed to upload file");
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createVideo = async (form: {
  userId: string;
  title: string;
  thumbnail: any;
  video: any;
  prompt: string;
}) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    );
    if (!newPost) throw Error("Failed to create post");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getLikedVideos = async (userId?: string) => {
  if (!userId) return [];
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt")],
    );
    if (!posts || !posts.documents) {
      throw Error("No posts found");
    }
    const likedVideos = posts.documents.filter((post) =>
      post.likes.some((like: any) => like.$id === userId),
    );
    return likedVideos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateLike = async (postId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw Error("Login to like a video");
    const post = await databases.getDocument(
      config.databaseId,
      config.videosCollectionId,
      postId,
    );
    if (!post) throw Error("Post not found");
    const liked = post.likes.some((like: any) => like.$id === user.$id);
    if (liked) {
      post.likes = post.likes.filter((like: any) => like.$id !== user.$id);
    } else {
      post.likes.push({ ...user });
    }
    await databases.updateDocument(
      config.databaseId,
      config.videosCollectionId,
      postId,
      {
        likes: post.likes,
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
