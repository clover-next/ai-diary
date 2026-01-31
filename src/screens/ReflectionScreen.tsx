import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { aiService } from '../services/AIService';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';

type ReflectionRouteProp = RouteProp<RootStackParamList, 'Reflection'>;

export const ReflectionScreen = () => {
    const route = useRoute<ReflectionRouteProp>();
    const navigation = useNavigation();
    const [response, setResponse] = useState('');
    const [displayBuffer, setDisplayBuffer] = useState('');
    const [loading, setLoading] = useState(true);
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        generateReflection();
        return () => {
            Speech.stop();
        };
    }, []);

    const generateReflection = async () => {
        setLoading(true);
        // Prompt for the AI (Context can be fetched from DB via consultationId)
        const prompt = "私は今、少し不安を感じています。";
        const result = await aiService.reflect(prompt);
        setResponse(result);
        setLoading(false);
        startTyping(result);
    };

    const startTyping = (fullText: string) => {
        let index = 0;
        setDisplayBuffer('');

        const interval = setInterval(() => {
            if (index < fullText.length) {
                setDisplayBuffer(prev => prev + fullText.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                handleSpeech(fullText);
            }
        }, 80);
    };

    const handleSpeech = (text: string) => {
        // Find best Japanese voice
        Speech.getAvailableVoicesAsync().then(voices => {
            const jpVoice = voices.find(v => v.language.includes('ja')) || voices[0];

            Speech.speak(text, {
                voice: jpVoice?.identifier,
                language: 'ja-JP',
                pitch: 1.0,  // Standard pitch for more human feel
                rate: 0.9,   // Slightly slower for clarity and calmness
                onStart: () => setSpeaking(true),
                onDone: () => setSpeaking(false),
                onStopped: () => setSpeaking(false),
            });
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <Text style={styles.title}>思考の整理...</Text>

                <View style={styles.card}>
                    {loading ? (
                        <Text style={styles.loadingText}>...</Text>
                    ) : (
                        <Text style={styles.responseText}>{displayBuffer}</Text>
                    )}
                </View>

                {!loading && (
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.closeText}>戻る</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.secondary,
        justifyContent: 'center',
    },
    content: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.h3,
        marginBottom: theme.spacing.xl,
    },
    card: {
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing.xl,
        borderRadius: 24, // pop
        width: '100%',
        minHeight: 250,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
    },
    loadingText: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.h1,
        letterSpacing: 8,
    },
    responseText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.h3,
        lineHeight: 34,
        textAlign: 'center',
        fontWeight: '500',
    },
    closeButton: {
        marginTop: theme.spacing.xxl,
        padding: theme.spacing.m,
    },
    closeText: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.body,
    }
});
