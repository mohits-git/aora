import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { useEffect, useState } from "react";
import useAppWrite from "@/lib/useAppWrite";
import { searchPosts } from "@/lib/appwrite";
import { VideoCard } from "@/components/video-card";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppWrite(() =>
    searchPosts(query as string),
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item as any} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-4">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Search Results
              </Text>
              <Text className="font-pmedium text-2xl text-white">{query}</Text>
            </View>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query as string} />
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
};

export default Search;
