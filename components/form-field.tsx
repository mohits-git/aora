import { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { icons } from "@/constants";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  className?: string;
  placeholder?: string;
}

const FormField = ({
  title,
  value,
  handleChangeText,
  className,
  keyboardType,
  placeholder,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${className}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="relative">
        <TextInput
          className={`flex-1 text-white font-psemibold text-base border-2 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row ${title === "Password" ? "pr-16" : ""}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-3">
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
