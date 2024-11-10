import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/empty-state";
import { useState } from "react";
import useAppWrite from "@/lib/useAppWrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { VideoCard } from "@/components/video-card";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import { InfoBox } from "@/components/info-box";
import { router } from "expo-router";

export default function Profile() {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite(() =>
    getUserPosts(user?.$id as string),
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onLogout = async () => {
    setRefreshing(true);
    await signOut();
    setIsLoggedIn(false);
    setUser(null);
    setRefreshing(false);
    router.replace("/sign-in")
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item as any} />}
        ListHeaderComponent={() => (
          <View className="mt-6 mb-12 px-4 w-full justify-center items-center">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={onLogout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex flex-row">
              <InfoBox
                title={`${posts.length}`}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title={"1.2k"}
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query."
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor={"white"} // android
            tintColor={"white"} // iOS
          />
        }
      />
    </SafeAreaView>
  );
}
