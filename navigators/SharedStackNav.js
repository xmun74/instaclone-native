import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import Photo from "../screens/Photo";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Me from "../screens/Me";
import { Image } from "react-native";
import Likes from "../screens/Likes";
import Comments from "../screens/Comments";

const Stack = createStackNavigator();
// Tab Nav에 공유할 Stack Nav화면들을 정의한 것.
// 피드or검색or알림  + Profile,Photo   이런방식.
// 첫화면이 Feed면, Feed + Profile + Photo 화면 구성됨
export default function SharedStackNav({ screenName }) {
  return (
    <Stack.Navigator
      headerMode="screen" // 페이지같이 넘기기
      screenOptions={{
        headerBackTitleVisible: false, //헤더 전타이틀 안보이게하기
        headerTintColor: "white", //헤더 글자색
        headerStyle: {
          borderBottomColor: "rgba(255,255,255,0.3)", // 헤더 border 색
          backgroundColor: "black",
        },
      }}
    >
      {screenName === "Feed" ? (
        <Stack.Screen
          name={"Feed"}
          component={Feed}
          options={{
            headerTitle: () => (
              //headerTitle :string이나 react node 리턴하는 함수생성 가능함
              <Image
                style={{
                  width: 120,
                  height: 40,
                }}
                resizeMode="cover" // width,height를 적용해야 보임
                source={require("../assets/logo2.png")}
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name={"Search"} component={Search} />
      ) : null}
      {screenName === "Notifications" ? (
        <Stack.Screen name={"Notifications"} component={Notifications} />
      ) : null}
      {screenName === "Me" ? <Stack.Screen name={"Me"} component={Me} /> : null}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
}
