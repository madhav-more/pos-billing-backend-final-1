// Icons/IconsSymbol.js
import React from "react";
import { Ionicons as IIcon } from "@expo/vector-icons";

export function Ionicons({ name, size = 24, color, style }) {
  return <IIcon name={name} size={size} color={color} style={style} />;
}
