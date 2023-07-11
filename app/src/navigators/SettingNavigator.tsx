import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SettingStackParamList } from "../types";
import SettingScreen from "../screens/SettingScreen";
import PostProfileScreen from "../screens/PostProfileScreen";
import PostRentalScreen from "../screens/PostRentalScreen";
import RentalListScreen from "../screens/RentalListScreen";

const SettingStack = createNativeStackNavigator<SettingStackParamList>();

const SettingNavigator = () => {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="Setting" component={SettingScreen} />
      <SettingStack.Group screenOptions={{ presentation: "fullScreenModal" }}>
        <SettingStack.Screen name="PostProfile" component={PostProfileScreen} />
        <SettingStack.Screen name="PostRental" component={PostRentalScreen} />
        <SettingStack.Screen name="RentalList" component={RentalListScreen} />
      </SettingStack.Group>
    </SettingStack.Navigator>
  );
};

export default SettingNavigator;
