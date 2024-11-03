import React from "react";
import { FlatList, Text } from "react-native";

interface TrendingProps {
  posts: { id: string }[];
}
export function Trending({ posts }: TrendingProps) {
  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
    />
  );
}
