import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl font-pblack">Aora!</Text>
      <Link href={"/home"} className="text-blue-400">
        Go to Home
      </Link>
    </View>
  );
}
