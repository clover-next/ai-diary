import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { initDB } from '../db';
import { useAppStore } from '../store/useAppStore';

// Screens
import {
    HomeScreen,
    ReflectionScreen,
    ConsultationScreen,
    HistoryScreen,
    SettingsScreen,
    SetupScreen,
    VoiceCallScreen
} from '../screens';

export type RootStackParamList = {
    Main: undefined;
    Reflection: { consultationId?: string; notes?: string; category?: string };
    Setup: undefined;
    VoiceCall: { voice?: string };
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
                    if (route.name === 'Home') iconName = 'book';
                    else if (route.name === 'Consultation') iconName = 'psychology';
                    else if (route.name === 'History') iconName = 'history';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <MaterialIcons name={iconName} size={size + 4} color={color} />;
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
    const { hasCompletedSetup } = useAppStore();
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        initDB();
        setIsAppReady(true);
    }, []);

    if (!isAppReady) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasCompletedSetup ? (
                    <Stack.Screen name="Setup">
                        {(props) => <SetupScreen onComplete={() => setHasCompletedSetup(true)} {...props} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen
                            name="Reflection"
                            component={ReflectionScreen}
                            options={{
                                presentation: 'modal',
                                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
                            }}
                        />
                        <Stack.Screen
                            name="VoiceCall"
                            component={VoiceCallScreen}
                            options={{
                                presentation: 'modal',
                                gestureEnabled: false,
                                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
