import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabIcon({ iconName, color, focused }) {
  return (
    <Ionicons
      name={focused ? iconName : `${iconName}-outline`} // 클릭되면 채워진아이콘 : 아니면 비워진아이콘
      color={color}
      size={22}
    />
  );
}
