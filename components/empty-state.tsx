import { images } from "@/constants";
import { View, Text, Image } from "react-native";
import CustomButton from "./custom-button";
import { router } from "expo-router";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <Text className="text-xl text-white font-psemibold mt-2">{title}</Text>

      <CustomButton
        title="Back to explore"
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
}
