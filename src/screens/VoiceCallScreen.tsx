import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { aiService } from '../services/AIService';
import { useAppStore } from '../store/useAppStore';

export const VoiceCallScreen = ({ navigation }: any) => {
    const { userName, selectedVoice } = useAppStore();
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [aiStatus, setAiStatus] = useState('接続中...');
    const [isProcessing, setIsProcessing] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Initial Greeting
        const timer = setTimeout(() => {
            handleAIResponse("こんにちは！今日はお話しできて嬉しいです。何かあったんですか？");
        }, 1500);

        const callTimer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        return () => {
            clearTimeout(timer);
            clearInterval(callTimer);
            Speech.stop();
        };
    }, []);

    const handleAIResponse = async (text: string) => {
        setAiStatus('お話し中...');
        setIsProcessing(false);

        const voiceId = selectedVoice === 'anna' ? 'ja-jp-x-vsk-local' : selectedVoice === 'ryo' ? 'ja-jp-x-jab-local' : 'ja-jp-x-medium-local';

        Speech.speak(text, {
            language: 'ja-JP',
            pitch: 1.1,
            rate: 0.9,
            voice: voiceId,
            onDone: () => setAiStatus('お話しください...'),
        });
    };

    const simulateUserSpeaking = async () => {
        if (isProcessing) return;

        setAiStatus('思考中...');
        setIsProcessing(true);

        try {
            const response = await aiService.generateResponse("音声通話での相談", "悩み", userName);
            handleAIResponse(response);
        } catch (e) {
            console.error(e);
            setAiStatus('お話しください...');
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.callType}>AI Voice Consultation</Text>
                    <Text style={styles.timer}>{formatTime(callDuration)}</Text>
                </View>

                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={simulateUserSpeaking}
                    disabled={isProcessing}
                >
                    <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
                    <View style={styles.avatar}>
                        <MaterialIcons name="face" size={80} color="#fff" />
                    </View>
                    <Text style={styles.aiName}>{selectedVoice === 'anna' ? 'Anna' : selectedVoice === 'ryo' ? 'Ryo' : 'Yuki'}</Text>
                    <Text style={[styles.aiStatus, isProcessing && { color: theme.colors.accent.pop }]}>
                        {aiStatus}
                    </Text>
                </TouchableOpacity>

                <View style={styles.hintContainer}>
                    <Text style={styles.hintText}>アバターをタップしてお話しください</Text>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <MaterialIcons name={isMuted ? "mic-off" : "mic"} size={32} color={isMuted ? "#fff" : theme.colors.text.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="call-end" size={40} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton}>
                        <MaterialIcons name="volume-up" size={32} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C1C1E' },
    safeArea: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
    header: { alignItems: 'center' },
    callType: { color: 'rgba(255,255,255,0.6)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
    timer: { color: '#fff', fontSize: 20, fontWeight: '200', marginTop: 5 },
    avatarContainer: { alignItems: 'center' },
    pulseCircle: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(0, 210, 255, 0.2)' },
    avatar: { width: 140, height: 140, borderRadius: 70, backgroundColor: theme.colors.accent.teal, justifyContent: 'center', alignItems: 'center' },
    aiName: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 20 },
    aiStatus: { color: theme.colors.accent.teal, fontSize: 16, marginTop: 10, fontWeight: '500' },
    hintContainer: { alignItems: 'center', marginBottom: 20 },
    hintText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
    controls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
    controlButton: { width: 65, height: 65, borderRadius: 33, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    controlButtonActive: { backgroundColor: theme.colors.accent.pop },
    endCallButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center' }
});
