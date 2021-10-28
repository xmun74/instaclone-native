import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import Upload from "../screens/Upload";
// Stack(LoggedInNav) - Tab(TabsNav) - 각 Tab에 Stack스크린 있음
const Stack = createStackNavigator();

export default function LoggedInNav() {
  return (
    <Stack.Navigator
      headerMode="none" //헤더 제거
      screenOptions={{ presentation: "modal" }} //스크린이 밑에서부터 올라옴
    >
      <Stack.Screen name="Tab" component={TabsNav} />
      <Stack.Screen name="Upload" component={Upload} />
    </Stack.Navigator>
  );
}
