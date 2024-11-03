import {
  Image,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "@/constants";

interface SearchInputProps extends TextInputProps {
  title: string;
  value?: string;
  handleChangeText?: (e: string) => void;
  className?: string;
}

export function SearchInput({
  title,
  value,
  handleChangeText,
  className,
  keyboardType,
  ...props
}: SearchInputProps) {
  return (
    <View className="relative">
      <TextInput
        className={`flex-1 text-white font-pregular text-base focus:border-2 w-full min- h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row`}
        value={value}
        placeholder={"Search for a video topic"}
        placeholderTextColor={"#7b7b8b"}
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        {...props}
      />
      <TouchableOpacity className="absolute right-4 top-1/2 -translate-y-3">
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
