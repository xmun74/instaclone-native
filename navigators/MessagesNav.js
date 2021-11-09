import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import Rooms from "../screens/Rooms";
import Room from "../screens/Room";

const Stack = createStackNavigator();

export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerBackTitleVisible: false, //헤더타이틀 삭제
        headerStyle: {
          backgroundColor: "black", //헤더배경
        },
        headerBackImage: (
          { tintColor } //밑화살표로 헤더전페이지에 아이콘변경
        ) => <Ionicons color={tintColor} name="chevron-down" size={28} />,
      }}
    >
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}
