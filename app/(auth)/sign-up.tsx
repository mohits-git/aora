import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/form-field";
import { useState } from "react";
import CustomButton from "@/components/custom-button";
import { Link } from "expo-router";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit() {

  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[80vh] h-full my-6 px-4">
          <View className="w-full flex-row items-center justify-center">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          </View>
          <Text className="text-2xl text-white font-semibold font-psemibold mt-10 text-center">
            SignUp to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            className="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            className="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            className="mt-7"
          />

          <CustomButton
            title="Sign Up"
            containerStyles="mt-7"
            handlePress={onSubmit}
            isLoading={isSubmitting}
          />

        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Already have an account? {" "}
            <Link href={"/sign-in"} className="text-secondary font-psemibold text-lg">
              Sign In
            </Link>
          </Text>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
