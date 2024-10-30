import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-[#232323]"
    >
      <Text
        className="text-[#fff]"
      >
        Welcome To Aora!
      </Text>
      <Link
        href={"/profile"}
        className="text-blue-400"
      >
        Go to Profile
      </Link>
    </View >
  );
}
