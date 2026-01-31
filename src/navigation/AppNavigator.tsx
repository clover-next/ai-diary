import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { initDB } from '../db';

// Screens
import {
    HomeScreen,
    ReflectionScreen,
    ConsultationScreen,
    HistoryScreen,
    SettingsScreen
} from '../screens';

export type RootStackParamList = {
    Main: undefined;
    Reflection: { consultationId?: string };
};

export type TabParamList = {
    Home: undefined;
    Consultation: undefined;
    History: undefined;
    Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background.primary,
                    borderTopColor: theme.colors.background.secondary,
                    height: 65,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: theme.colors.accent.teal,
                tabBarInactiveTintColor: theme.colors.text.muted,
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === 'Home') iconName = 'book-open-variant';
                    else if (route.name === 'Consultation') iconName = 'comment-quote-outline';
                    else if (route.name === 'History') iconName = 'history';
                    else if (route.name === 'Settings') iconName = 'cog-outline';
                    return <MaterialCommunityIcons name={iconName} size={size + 4} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '記録' }} />
            <Tab.Screen name="Consultation" component={ConsultationScreen} options={{ tabBarLabel: '相談' }} />
            <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: '履歴' }} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '設定' }} />
        </Tab.Navigator>
    );
}

export const AppNavigator = () => {
    useEffect(() => {
        initDB();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen
                    name="Reflection"
                    component={ReflectionScreen}
                    options={{ presentation: 'modal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
