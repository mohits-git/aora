import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/form-field";
import { useState } from "react";
import CustomButton from "@/components/custom-button";
import { Link, router } from "expo-router";
import { signIn } from "@/lib/appwrite";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const results = await signIn(
        form.email,
        form.password,
      );

      if (!results) throw Error("Sign in failed. Please try again.");

      // TODO: set the results to the global state

      router.replace("/home")
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
            Login to Aora
          </Text>

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
            title="Sign In"
            containerStyles="mt-7"
            handlePress={onSubmit}
            isLoading={isSubmitting}
          />

        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Don't have an account? {" "}
            <Link href={"/sign-up"} className="text-secondary font-psemibold text-lg">
              Sign Up
            </Link>
          </Text>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
