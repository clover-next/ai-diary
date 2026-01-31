import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { aiService } from '../services/AIService';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';

export const ReflectionScreen = ({ navigation, route }: any) => {
    const [response, setResponse] = useState('');
    const [displayBuffer, setDisplayBuffer] = useState('');
    const [loading, setLoading] = useState(true);
    const [speaking, setSpeaking] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        generateReflection();
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            Speech.stop();
        };
    }, []);

    const generateReflection = async () => {
        setLoading(true);
        try {
            const result = await aiService.generateResponse(
                route.params.notes || '今日を振り返りたい',
                route.params.category || '全般',
                'ユーザー' // This should come from a store like Zustand
            );
            setResponse(result);
            startTyping(result);
        } catch (error) {
            console.error("Error generating reflection:", error);
            setResponse("申し訳ありませんが、振り返りを生成できませんでした。");
        } finally {
            setLoading(false);
        }
    };

    const startTyping = (fullText: string) => {
        let index = 0;
        setDisplayBuffer('');
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        typingIntervalRef.current = setInterval(() => {
            if (index < fullText.length) {
                setDisplayBuffer(prev => prev + fullText.charAt(index));
                index++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
                // Automatically start speech after typing is complete
                handleSpeech(fullText);
            }
        }, 80);
    };

    const handleSpeech = async (text: string) => {
        const isSpeakingNow = await Speech.isSpeakingAsync();
        if (isSpeakingNow) {
            Speech.stop();
            setIsAudioPlaying(false);
            return;
        }

        // Find best Japanese voice
        const voices = await Speech.getAvailableVoicesAsync();
        const jpVoice = voices.find(v => v.language.includes('ja')) || voices[0];

        Speech.speak(text, {
            voice: jpVoice?.identifier,
            language: 'ja-JP',
            pitch: 1.0,  // Standard pitch for more human feel
            rate: 0.9,   // Slightly slower for clarity and calmness
            onStart: () => {
                setSpeaking(true);
                setIsAudioPlaying(true);
            },
            onDone: () => {
                setSpeaking(false);
                setIsAudioPlaying(false);
            },
            onStopped: () => {
                setSpeaking(false);
                setIsAudioPlaying(false);
            },
            onError: () => {
                setSpeaking(false);
                setIsAudioPlaying(false);
            }
        });
    };

    const toggleAudio = () => {
        if (response) {
            handleSpeech(response);
        }
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
                    <>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.actionButton} onPress={toggleAudio}>
                                <MaterialIcons name={isAudioPlaying ? "pause" : "play-arrow"} size={24} color="#fff" />
                                <Text style={styles.buttonText}>{isAudioPlaying ? "停止" : "読み上げ"}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.callButton]}
                                onPress={() => navigation.navigate('VoiceCall', { voice: 'Anna' })}
                            >
                                <MaterialIcons name="call" size={24} color="#fff" />
                                <Text style={styles.buttonText}>通話で相談</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.closeText}>戻る</Text>
                        </TouchableOpacity>
                    </>
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
    buttonRow: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.accent.teal,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    callButton: {
        backgroundColor: theme.colors.accent.pop,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: theme.spacing.xl,
        padding: theme.spacing.m,
    },
    closeText: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.body,
    }
});
