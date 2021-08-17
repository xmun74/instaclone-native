import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const preload = () => {
    // preload는 항상 promise를 리턴
    const fontsToLoad = [Ionicons.font]; // 폰트 프리로드
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font)); //Font.loadAsync의 프로미스배열 리턴하기
    const imagesToLoad = [
      // 사진 프리로드
      require("./assets/logo2.png"),
      "https://en.wikipedia.org/wiki/Instagram#/media/File:Instagram_logo.svg",
    ];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]); //Promise.all은 배열에 있는 프로미스들이 다 끝날때까지 기다려줌
  };
  if (loading) {
    return (
      <AppLoading
        startAsync={preload} // 로딩시작
        onError={console.warn} // 에러발생 시
        onFinish={onFinish} // 실행종료 시
      />
    );
  }
  return (
    <NavigationContainer>
      <LoggedOutNav />
    </NavigationContainer>
  );
}
