import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, TextInput } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';

const VOICES = [
    { id: 'anna', name: 'アンナ (Anna)', desc: '明るく遊び心のある声', color: '#FF7E5F' },
    { id: 'ryo', name: 'リョウ (Ryo)', desc: '落ち着いた誠実な声', color: '#7B61FF' },
    { id: 'yuki', name: 'ユキ (Yuki)', desc: '静かで透明感のある声', color: '#00D2FF' },
];

export const SetupScreen = ({ onComplete }: { onComplete: () => void }) => {
    const { setUserName: saveName, setSelectedVoice: saveVoice, setHasCompletedSetup } = useAppStore();
    const [step, setStep] = useState(0); // 0: Name, 1: Voice Selection, 2: Download
    const [userName, setUserName] = useState('');
    const [selectedVoice, setSelectedVoice] = useState('anna');
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('準備中...');
    const [isDownloading, setIsDownloading] = useState(false);

    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const startDownload = () => {
        setStep(2);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 0.05;
            setProgress(currentProgress);

            if (currentProgress < 0.3) setLoadingText('AIモデル構成を読み込み中...');
            else if (currentProgress < 0.6) setLoadingText('Qwen3-TTS 0.6B (TLL) を展開中...');
            else if (currentProgress < 0.9) setLoadingText('音声エンジンを設定中...');
            else setLoadingText('まもなく完了します...');

            if (currentProgress >= 1) {
                clearInterval(interval);
                saveName(userName);
                saveVoice(selectedVoice);
                setHasCompletedSetup(true);
                setTimeout(onComplete, 1000);
            }
        }, 300);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {step === 0 ? (
                    <>
                        <Text style={styles.title}>ようこそ</Text>
                        <Text style={styles.subtitle}>AIがあなたをどのようにお呼びすればいいですか？</Text>

                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person-outline" size={24} color={theme.colors.text.muted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="あなたのお名前"
                                placeholderTextColor={theme.colors.text.muted}
                                value={userName}
                                onChangeText={setUserName}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.mainButton, !userName && { opacity: 0.5 }]}
                            onPress={() => userName && setStep(1)}
                            disabled={!userName}
                        >
                            <Text style={styles.buttonText}>次へ</Text>
                        </TouchableOpacity>
                    </>
                ) : step === 1 ? (
                    <>
                        <Text style={styles.title}>{userName}さん、こんにちは</Text>
                        <Text style={styles.subtitle}>あなたに寄り添うAIの「声」を選んでください。</Text>

                        <View style={styles.voiceGrid}>
                            {VOICES.map((v) => (
                                <TouchableOpacity
                                    key={v.id}
                                    style={[
                                        styles.voiceCard,
                                        selectedVoice === v.id && { borderColor: v.color, borderWidth: 3 }
                                    ]}
                                    onPress={() => setSelectedVoice(v.id)}
                                >
                                    <View style={[styles.voiceIcon, { backgroundColor: v.color }]}>
                                        <MaterialIcons name="record-voice-over" size={32} color="#fff" />
                                    </View>
                                    <View>
                                        <Text style={styles.voiceName}>{v.name}</Text>
                                        <Text style={styles.voiceDesc}>{v.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.mainButton} onPress={startDownload}>
                            <Text style={styles.buttonText}>セットアップ開始</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.nowLoading}>Now Loading...</Text>
                        <Text style={styles.loadingSubtitle}>{loadingText}</Text>

                        <View style={styles.progressWrapper}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                        </View>

                        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>

                        <Text style={styles.hint}>
                            ※この操作は最初の一回だけ必要です。{'\n'}
                            モデル: Qwen3-TTS 0.6B / メモリ負荷: 約600MB (超軽量)
                        </Text>
                    </View>
                )}
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
        justifyContent: 'center',
    },
    content: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        marginBottom: 40,
        height: 60,
        borderWidth: 1,
        borderColor: theme.colors.background.tertiary,
    },
    inputIcon: {
        marginRight: theme.spacing.s,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: theme.colors.text.primary,
    },
    voiceGrid: {
        width: '100%',
        marginBottom: theme.spacing.xl,
    },
    voiceCard: {
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.m,
        borderRadius: 20,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    voiceIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    voiceName: {
        fontSize: 18,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    voiceDesc: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginTop: 2,
    },
    mainButton: {
        backgroundColor: theme.colors.accent.pop,
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        width: '100%',
    },
    nowLoading: {
        fontSize: 32,
        color: theme.colors.accent.teal,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: theme.spacing.s,
    },
    loadingSubtitle: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: 40,
    },
    progressWrapper: {
        width: '100%',
        height: 12,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.accent.pop,
    },
    percentage: {
        fontSize: 24,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    downloadProgressContainer: {
        width: '100%',
        backgroundColor: 'rgba(0, 210, 255, 0.05)',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    downloadStatus: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: 10,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.accent.teal,
    },
    downloadPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.accent.teal,
        textAlign: 'center',
        marginTop: 8,
    },
    latencyNote: {
        fontSize: 10,
        color: theme.colors.text.muted,
        textAlign: 'center',
        marginTop: 4,
        fontStyle: 'italic',
    },
    hint: {
        marginTop: 60,
        fontSize: 12,
        color: theme.colors.text.muted,
        textAlign: 'center',
        lineHeight: 18,
    }
});
