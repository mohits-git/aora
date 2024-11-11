import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { useState } from "react";
import useAppWrite from "@/lib/useAppWrite";
import { getLikedVideos } from "@/lib/appwrite";
import { VideoCard } from "@/components/video-card";
import { useGlobalContext } from "@/context/GlobalProvider";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppWrite(() => getLikedVideos(user?.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard userId={user?.$id} video={item as any} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-4">
            <View className="mb-6">
              <Text className="font-pmedium text-sm text-gray-100">
                {user?.username}{"'s"}
              </Text>
              <Text className="font-pmedium text-2xl text-white">
                Bookmarked Videos
              </Text>
            </View>

            <SearchInput placeholder="Search your bookmarks" />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video!"
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
};

export default Bookmark;
