import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
// Stack(LoggedInNav) - Tab(TabsNav) - 각 Tab에 Stack스크린 있음
const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator
      screenOptions={{ presentation: "modal", headerShown: false }} //스크린이 밑에서부터 올라옴,헤더제거
    >
      <Stack.Screen name="Tabs" component={TabsNav} />
      <Stack.Screen name="Upload" component={UploadNav} />
    </Stack.Navigator>
  );
}
