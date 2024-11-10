import CustomButton from "@/components/custom-button";
import FormField from "@/components/form-field";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null as ImagePicker.ImagePickerAsset | null,
    thumbnail: null as ImagePicker.ImagePickerAsset | null,
    prompt: "",
  });

  const openPicker = async (selectType: "video" | "thumbnail") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "thumbnail"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length)
      setForm({ ...form, [selectType]: result.assets[0] });
    else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const onSubmit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Please fill all fields.");
      return;
    }

    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user?.$id ?? "",
      });
      Alert.alert("Success", "Post uploaded successfully.");
      router.push("/home");
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert("error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          className="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                style={{
                  width: "100%",
                  height: 240,
                  borderRadius: 16,
                }}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("thumbnail")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode={ResizeMode.COVER}
                style={{
                  width: "100%",
                  height: 240,
                  borderRadius: 16,
                }}
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 ">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-1/2 h-1/2"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to generate this video."
          handleChangeText={(v) => setForm({ ...form, prompt: v })}
          className="mt-7"
          multiline={true}
          numberOfLines={4}
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={onSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
