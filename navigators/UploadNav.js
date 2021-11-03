import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function UploadNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white", //탭 글씨 하얀색
        tabBarIndicatorStyle: {
          backgroundColor: "white", //탭 표시줄 하얀색
          top: 0, //탭 표시 위에 두기
        },
        tabBarStyle: {
          backgroundColor: "black", //탭 배경색 검정색
        },
      }}
      tabBarPosition="bottom" //탭 위치 아래로 변경
    >
      <Tab.Screen name="SelectRoot">
        {() => (
          // SelectPhoto는 사진선택하는 탭이 있어야 해서 Stack리턴하는 함수 이용
          <Stack.Navigator
            screenOptions={{
              headerTintColor: "white", //헤더글씨색
              headerBackTitleVisible: false, //전헤더 타이틀제거
              headerBackImage: ({ headerTintColor }) => (
                <Ionicons color={"white"} name="close" size={28} />
              ),
              headerStyle: {
                backgroundColor: "black", //헤더배경색
                shadowOpacity: 0.3, //헤더 밑 border색 투명도조절
              },
            }}
          >
            <Stack.Screen
              name="Select"
              options={{ title: "Choose a Photo" }}
              component={SelectPhoto}
            />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
}
