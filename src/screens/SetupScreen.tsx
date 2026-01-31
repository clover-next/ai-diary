import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import * as FileSystem from 'expo-file-system';
import { aiService } from '../services/AIService';

const VOICES = [
    { id: 'anna', name: 'アンナ (Anna)', desc: '明るく遊び心のある声', color: '#FF7E5F' },
    { id: 'ryo', name: 'リョウ (Ryo)', desc: '落ち着いた誠実な声', color: '#7B61FF' },
    { id: 'yuki', name: 'ユキ (Yuki)', desc: '静かで透明感のある声', color: '#00D2FF' },
];

export const SetupScreen = ({ onComplete }: { onComplete: () => void }) => {
    const { setUserName: saveName, setSelectedVoice: saveVoice, setHasCompletedSetup } = useAppStore();
    const [step, setStep] = useState(0);
    const [userName, setUserName] = useState('');
    const [selectedVoice, setSelectedVoice] = useState('anna');
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('準備中...');
    const [isDownloading, setIsDownloading] = useState(false);

    const fadeAnim = new Animated.Value(1);

    const startDownload = async () => {
        setStep(2);
        setIsDownloading(true);

        // PLACEHOLDER URLs - User should replace with real Git Raw URLs
        const LLM_MODEL_URL = 'https://huggingface.co/lmstudio-community/gemma-3-1b-it-GGUF/resolve/main/gemma-3-1b-it-Q4_K_M.gguf';
        const TTS_MODEL_URL = 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf'; // Placeholder for Qwen3-TTS

        const dir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
        const llmFileUri = dir + (dir.endsWith('/') ? '' : '/') + 'llm_model.gguf';
        const ttsFileUri = dir + (dir.endsWith('/') ? '' : '/') + 'tts_model.gguf';

        const downloadFile = async (url: string, fileUri: string, label: string) => {
            const info = await FileSystem.getInfoAsync(fileUri);
            if (info.exists) {
                console.log(`${label} already exists.`);
                return true;
            }

            setLoadingText(`${label} を準備中...`);
            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                fileUri,
                { headers: { 'User-Agent': 'WordlessDiary-App/1.0' } },
                (downloadProgress) => {
                    const total = downloadProgress.totalBytesExpectedToWrite;
                    if (total > 0) {
                        const prog = downloadProgress.totalBytesWritten / total;
                        setProgress(prog);
                        setLoadingText(`${label} をダウンロード中... ${Math.round(prog * 100)}%`);
                    } else {
                        setLoadingText(`${label} をダウンロード中... (${(downloadProgress.totalBytesWritten / 1024 / 1024).toFixed(1)} MB)`);
                    }
                }
            );

            const result = await downloadResumable.downloadAsync();
            return !!(result && result.uri);
        };

        try {
            // 1. Download LLM
            const llmSuccess = await downloadFile(LLM_MODEL_URL, llmFileUri, '思考エンジン (LLM)');
            if (!llmSuccess) throw new Error('LLMのダウンロードに失敗しました');

            // 2. Download TTS
            setProgress(0);
            const ttsSuccess = await downloadFile(TTS_MODEL_URL, ttsFileUri, '音声エンジン (TTS)');
            if (!ttsSuccess) throw new Error('TTSのダウンロードに失敗しました');

            setLoadingText('システムを初期化中...');
            // Initialize main model
            await aiService.loadModel(llmFileUri);

            // NOTE: If AIService supports loading multiple models, call it here for TTS too.
            // For now, we ensure both are physically present.

            saveName(userName);
            saveVoice(selectedVoice);
            setHasCompletedSetup(true);
            setTimeout(onComplete, 1000);

        } catch (e: any) {
            console.error("Download error:", e);
            const errorMsg = e.message || 'Unknown error';
            setLoadingText(`エラー: ${errorMsg}\n\n手動で配置する場合は以下へ保存してください:\n1. ${llmFileUri}\n2. ${ttsFileUri}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {step === 0 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>ようこそ</Text>
                        <Text style={styles.subtitle}>
                            AIがあなたをどのようにお呼びすればいいですか？
                        </Text>

                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person-outline" size={24} color={theme.colors.text.muted} />
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
                    </View>
                )}

                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>{userName}さん、こんにちは</Text>
                        <Text style={styles.subtitle}>
                            あなたに寄り添うAIの「声」を選んでください。
                        </Text>

                        <Text style={styles.infoText}>
                            💎 このAIは完全にオンデバイスで動作します
                        </Text>

                        <View style={styles.voiceGrid}>
                            {VOICES.map((v) => (
                                <TouchableOpacity
                                    key={v.id}
                                    style={[
                                        styles.voiceCard,
                                        selectedVoice === v.id && {
                                            borderColor: v.color,
                                            borderWidth: 3,
                                            backgroundColor: `${v.color}10`
                                        }
                                    ]}
                                    onPress={() => setSelectedVoice(v.id)}
                                >
                                    <View style={[styles.voiceIcon, { backgroundColor: v.color }]}>
                                        <MaterialIcons name="record-voice-over" size={32} color="#fff" />
                                    </View>
                                    <View style={styles.voiceInfo}>
                                        <Text style={styles.voiceName}>{v.name}</Text>
                                        <Text style={styles.voiceDesc}>{v.desc}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.mainButton} onPress={startDownload}>
                            <Text style={styles.buttonText}>セットアップ開始</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.nowLoading}>Now Loading...</Text>
                        <Text style={styles.loadingSubtitle}>{loadingText}</Text>

                        <View style={styles.progressWrapper}>
                            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                        </View>

                        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoBoxTitle}>🔒 完全オフライン動作</Text>
                            <Text style={styles.infoBoxText}>
                                AI推論はすべてあなたのスマホ内で実行されます。{'\n'}
                                プライバシーが完全に保護されています。
                            </Text>
                            <Text style={styles.infoBoxText}>
                                推論: Gemma-3 1B (INT4){'\n'}
                                音声: Qwen3-TTS 0.6B (Ono_Anna){'\n'}
                                合計メモリ: 約1.2GB (超軽量)
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center',
    },
    stepContainer: {
        alignItems: 'center',
        width: '100%',
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
    infoText: {
        fontSize: 14,
        color: theme.colors.accent.teal,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        fontWeight: '600',
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
    input: {
        flex: 1,
        fontSize: 18,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.s,
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
        borderWidth: 2,
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
    voiceInfo: {
        flex: 1,
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
        textAlign: 'center',
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
        marginBottom: 30,
    },
    infoBox: {
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.l,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: theme.colors.accent.teal,
        width: '100%',
    },
    infoBoxTitle: {
        fontSize: 16,
        color: theme.colors.accent.teal,
        fontWeight: 'bold',
        marginBottom: theme.spacing.s,
    },
    infoBoxText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: theme.spacing.xs,
    },
});
