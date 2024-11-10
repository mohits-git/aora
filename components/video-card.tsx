import { icons } from "@/constants";
//import { updateLike } from "@/lib/appwrite";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface VideoCardProps {
  userId?: string;
  video: {
    $id: string;
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string };
    likes: { $id: string }[];
  };
}

export function VideoCard({
  userId,
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    likes,
  },
}: VideoCardProps) {
  const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(likes.some((like) => like.$id === userId));
  console.log(userId);
  console.log(likes);

  const handleLike = async () => {
    // update like in db

    //await updateLike($id, userId!)

    setLiked((prev) => !prev);
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>

          <View className="pt-2">
            <TouchableOpacity onPress={handleLike}>
              {!liked ? (
                <Image
                  source={icons.heartHollow}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={icons.heartFilled}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          style={{
            width: "100%",
            height: 240,
            borderRadius: 35,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            // @ts-ignore
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
