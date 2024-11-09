import {
  Alert,
  Image,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "@/constants";
import { router, usePathname } from "expo-router";
import { useState } from "react";

interface SearchInputProps extends TextInputProps {
  initialQuery?: string;
}

export function SearchInput({ initialQuery, ...props }: SearchInputProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery ?? "");

  return (
    <View className="relative">
      <TextInput
        className={`flex-1 text-white font-pregular text-base focus:border-2 w-full min- h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row`}
        value={query}
        placeholder={"Search for a video topic"}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(v: string) => setQuery(v)}
        {...props}
      />
      <TouchableOpacity
        className="absolute right-4 top-1/2 -translate-y-3"
        onPress={() => {
          if (!query) {
            Alert.alert(
              "Missing Query",
              "Please enter a search query to search results accross the database",
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
