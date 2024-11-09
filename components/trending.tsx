import { icons } from "@/constants";
import React, { useState } from "react";
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const zoomIn = {
  0: {
    scaleX: 0.85,
    scaleY: 0.85,
  },
  1: {
    scaleX: 1,
    scaleY: 1,
  },
};

const zoomOut = {
  0: {
    scaleX: 1,
    scaleY: 1,
  },
  1: {
    scaleX: 0.85,
    scaleY: 0.85,
  },
};

interface TrendingPostProps {
  activePost: string;
  post: Post;
}

const TrendingPost = ({ activePost, post }: TrendingPostProps) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      animation={activePost === post.$id ? zoomIn : zoomOut}
      duration={500}
      className="mr-5"
    >
      {play ? (
        <Video
          source={{ uri: post.video }}
          style={{
            width: 208,
            height: 288,
            borderRadius: 35,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            // @ts-ignore
            if (status.didJustFinish) setPlay(false);
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: post.thumbnail }}
            className="w-[208px] h-[288px] rounded-[35px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

interface TrendingProps {
  posts: Post[];
}

export function Trending({ posts }: TrendingProps) {
  const [activePost, setActivePost] = useState<string>(posts[1]?.$id ?? "0");

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: { key: string }[];
  }) => {
    if (viewableItems.length) {
      setActivePost(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      horizontal
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingPost activePost={activePost} post={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
}
