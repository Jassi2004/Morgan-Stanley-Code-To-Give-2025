import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Import your i18n config

import GetStarted from "./src/screens/GetStarted";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import Messages from "./src/screens/Messages";
import Menu from "./src/screens/Menu";

const Stack = createStackNavigator();

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GetStarted" component={GetStarted} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="Menu" component={Menu} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
