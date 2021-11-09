import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const preloadAssets = () => {
    // Asset: 폰트,사진 프리로드
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font)); //.loadAsync의 프로미스배열 리턴
    const imagesToLoad = [require("./assets/logo2.png")];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]); //Promise.all:배열에 promise들 끝까지 기다려줌
  };
  // preload는 항상 Promise를 리턴
  const preload = async () => {
    // 2. 토큰을 AsyncStorage에서 받아옴 (복원)
    const token = await AsyncStorage.getItem("token");
    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    //persistCache :cache를 Asyncstorage에 저장해줌/ ApolloProvider 초기화 전인 preload단계에서 해주기.
    // await persistCache({
    //   cache,
    //   storage: new AsyncStorageWrapper(AsyncStorage),
    //   serialize: false, //언제든 schema를 변경할수있다
    // });
    return preloadAssets();
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
    <ApolloProvider client={client}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
      </NavigationContainer>
    </ApolloProvider>
  );
}
