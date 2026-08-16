// S (SRP): Only defines the bottom tab navigator for the authenticated app.

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { HomeScreen } from '../screens/app/HomeScreen';
import { HistoryScreen } from '../screens/app/HistoryScreen';
import { ProfilesScreen } from '../screens/app/ProfilesScreen';
import { SettingsScreen } from '../screens/app/SettingsScreen';
import { Colors, FontFamily, FontSize } from '../theme';

export type AppTabParamList = {
  Home: undefined;
  History: undefined;
  Profiles: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof AppTabParamList, { active: IoniconsName; inactive: IoniconsName }> = {
  Home: { active: 'heart-circle', inactive: 'heart-circle-outline' },
  History: { active: 'pulse', inactive: 'pulse-outline' },
  Profiles: { active: 'people', inactive: 'people-outline' },
  Settings: { active: 'options', inactive: 'options-outline' },
};

export const AppNavigator: React.FC = () => (
  <Tab.Navigator
    backBehavior="history"
    screenOptions={({ route }) => ({
      // Header
      headerStyle: { backgroundColor: Colors.surface },
      headerTintColor: Colors.textPrimary,
      headerTitleStyle: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
      headerShadowVisible: false,
      // Animation & Transition
      animation: 'fade',
      // Tab bar
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.surfaceBorder,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        height: Platform.OS === 'ios' ? 84 : 64,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarLabelStyle: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
      // Icon
      tabBarIcon: ({ focused, color, size }) => {
        const icons = TAB_ICONS[route.name as keyof AppTabParamList];
        return (
          <Ionicons
            name={focused ? icons.active : icons.inactive}
            size={size}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'BMI Tracker' }} />
    <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
    <Tab.Screen name="Profiles" component={ProfilesScreen} options={{ title: 'Profiles' }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
  </Tab.Navigator>
);
