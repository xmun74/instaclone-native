import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";
import TabIcon from "../components/nav/TabIcon";
import SharedStackNav from "./SharedStackNav";
import useMe from "../hooks/useMe";

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
  const { data } = useMe();
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white", // tab 클릭했을때 색
        tabBarShowLabel: false, // tab 라벨 지우기
        tabBarStyle: {
          borderTopColor: "rgba(255,255,255,0.3)", // tab border 색
          backgroundColor: "black",
        },
        headerShown: false, //헤더 지우기
      }}
    >
      <Tabs.Screen
        name="FeedRoot"
        options={{
          tabBarIcon: (
            //tabBarIcon: 탭 아이콘 넣기
            { focused, color, size } // focused:클릭했을때 color: 위에 tabBarActiveTintColor 와 같은 색
          ) => <TabIcon iconName={"home"} color={color} focused={focused} />,
        }}
      >
        {() => <SharedStackNav screenName="Feed" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="SearchRoot"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"search"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Search" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="CameraRoot"
        component={View}
        listeners={({ navigation }) => {
          //listeners: 클릭감지/ 함수(route, navigation사용가능) or 객체형태로 사용가능
          return {
            tabPress: (e) => {
              e.preventDefault(); // 기본 이벤트 차단
              navigation.navigate("Upload"); //클릭시 Upload스크린으로 이동
            },
          };
        }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"camera"} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="NotificationsRoot"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon iconName={"heart"} color={color} focused={focused} />
          ),
        }}
      >
        {() => <SharedStackNav screenName="Notifications" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="MeRoot"
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            data?.me?.avatar ? ( // 아바타가 있으면 이미지 출력함.
              <Image // Image: width,height 필수입력해야함
                source={{ uri: data.me.avatar }}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  ...(focused && { borderColor: "white", borderWidth: 1 }),
                }}
              />
            ) : (
              <TabIcon iconName={"person"} color={color} focused={focused} />
            ),
        }}
      >
        {() => <SharedStackNav screenName="Me" />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
