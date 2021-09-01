import React from "react";
import { ActivityIndicator, View } from "react-native";
// 로딩일때 로딩중(ActivityIndicator)띄우고, 로딩끝나면 component 리턴하기
export default function ScreenLayout({ loading, children }) {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <ActivityIndicator color="white" /> : children}
    </View>
  );
}
