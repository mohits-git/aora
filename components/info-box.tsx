import { View, Text } from "react-native";

interface InfoBoxProps {
  title: string;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
}

export function InfoBox({
  title,
  titleStyles,
  subtitle,
  containerStyles,
}: InfoBoxProps) {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
}
