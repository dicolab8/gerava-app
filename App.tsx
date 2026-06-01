// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ThemeScreen from './src/screens/ThemeScreen';
import ModuleScreen from './src/screens/ModuleScreen';
import FiltersScreen from './src/screens/FiltersScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import EmptyStateScreen from './src/screens/EmptyStateScreen';
import AboutScreen from './src/screens/AboutScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { evaluationId: string };
  Messages: undefined;
  Search: undefined;
  Settings: undefined;
  Theme: undefined;
  Module: undefined;
  Filters: undefined;
  Favorites: undefined;
  Feedback: undefined;
  Success: undefined;
  Calendar: undefined;
  EmptyState: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />

          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right', // pode usar tranquilo
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Theme" component={ThemeScreen} />
            <Stack.Screen name="Module" component={ModuleScreen} />
            <Stack.Screen name="Filters" component={FiltersScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="EmptyState" component={EmptyStateScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </Stack.Navigator>

        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}