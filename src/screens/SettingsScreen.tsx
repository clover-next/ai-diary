import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image, TextInput, Alert, Modal } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useAppStore } from '../store/useAppStore';

const VOICES = [
    { id: 'anna', name: 'アンナ', desc: '明るく遊び心のある声', color: '#FF7E5F', sample: 'こんにちは！今日はどんな一日でしたか？アンナがお聞きしますね。' },
    { id: 'ryo', name: 'リョウ', desc: '落ち着いた誠実な声', color: '#7B61FF', sample: 'お疲れ様です。リョウです。ゆっくりとお話しを聞かせてください。' },
    { id: 'yuki', name: 'ユキ', desc: '静かで透明感のある声', color: '#00D2FF', sample: '心穏やかになれるよう、ユキがお手伝いします。今日を振り返ってみましょう。' },
];

export const SettingsScreen = () => {
    const {
        userName,
        setUserName,
        selectedVoice,
        setSelectedVoice,
        isAudioEnabled,
        setIsAudioEnabled,
        setHasCompletedSetup
    } = useAppStore();

    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showAIDetails, setShowAIDetails] = useState(false);

    const playSample = (text: string) => {
        Speech.stop();
        Speech.speak(text, { language: 'ja-JP', rate: 0.9 });
    };

    const handleClearData = () => {
        Alert.alert(
            "データの消去",
            "すべての記録を消去しますか？この操作は取り消せません。",
            [
                { text: "キャンセル", style: "cancel" },
                { text: "消去する", style: "destructive", onPress: () => console.log("Clear data") }
            ]
        );
    };

    const InfoModal = ({ visible, title, content, onClose }: any) => (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView style={styles.modalBody}>
                        <Text style={styles.modalText}>{content}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                        <Text style={styles.modalCloseText}>閉じる</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/logo.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>設定</Text>
                </View>

                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>プロフィール</Text>
                    <View style={styles.inputCard}>
                        <MaterialIcons name="person" size={24} color={theme.colors.accent.teal} />
                        <TextInput
                            style={styles.userNameInput}
                            value={userName}
                            onChangeText={setUserName}
                            placeholder="お名前を入力"
                        />
                    </View>
                </View>

                {/* Voice Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AIの声設定</Text>
                    <View style={styles.settingItem}>
                        <View>
                            <Text style={styles.settingLabel}>音声読み上げ</Text>
                            <Text style={styles.settingDesc}>AIの回答を自動で読み上げます</Text>
                        </View>
                        <Switch
                            value={isAudioEnabled}
                            onValueChange={setIsAudioEnabled}
                            trackColor={{ false: '#767577', true: theme.colors.accent.teal }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.voiceList}>
                        {VOICES.map((v) => (
                            <TouchableOpacity
                                key={v.id}
                                style={[styles.voiceCard, selectedVoice === v.id && { borderColor: v.color }]}
                                onPress={() => setSelectedVoice(v.id)}
                            >
                                <View style={[styles.avatar, { backgroundColor: v.color }]}>
                                    <MaterialIcons name="face" size={30} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.voiceName}>{v.name}</Text>
                                    <Text style={styles.voiceDesc}>{v.desc}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.playButton}
                                    onPress={() => playSample(v.sample)}
                                >
                                    <MaterialIcons name="volume-up" size={24} color={v.color} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>その他</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowAIDetails(true)}>
                        <MaterialIcons name="smart-toy" size={24} color={theme.colors.text.secondary} />
                        <Text style={styles.menuText}>AIモデル詳細</Text>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowPrivacy(true)}>
                        <MaterialIcons name="security" size={24} color={theme.colors.text.secondary} />
                        <Text style={styles.menuText}>プライバシーポリシー</Text>
                        <MaterialIcons name="chevron-right" size={24} color={theme.colors.text.muted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setHasCompletedSetup(false)}>
                        <MaterialIcons name="refresh" size={24} color={theme.colors.accent.pop} />
                        <Text style={[styles.menuText, { color: theme.colors.accent.pop }]}>セットアップをやり直す</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleClearData}>
                        <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
                        <Text style={[styles.menuText, { color: '#FF3B30' }]}>データを消去する</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>Clover Next - Version 1.0.0</Text>
                    <Text style={styles.copyright}>© 2026 Wordless Diary Project</Text>
                </View>
            </ScrollView>

            <InfoModal
                visible={showAIDetails}
                title="AIエンジンについて"
                content="本アプリはGoogleの最新・最軽量LLM『Gemma-3 1B (4-bit INT4)』をデバイス上で実行しています。メモリ負荷を約900MB以下に抑えながら、高度な対話を実現しています。すべての処理はスマホ内部で完結するため、非常に高速かつ安全です。"
                onClose={() => setShowAIDetails(false)}
            />

            <InfoModal
                visible={showPrivacy}
                title="プライバシーポリシー"
                content="1. データ管理: ユーザーの入力内容、およびAIとの会話履歴はすべて端末内の暗号化された領域に保存されます。\n2. 外部送信: 広告表示や分析を除き、ユーザー生成コンテンツが外部サーバーに送信されることはありません。\n3. AI学習: AIとの対話内容がモデルの学習に利用されることはありません。"
                onClose={() => setShowPrivacy(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
        padding: theme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 14,
        color: theme.colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
    },
    inputCard: {
        backgroundColor: theme.colors.background.secondary,
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userNameInput: {
        flex: 1,
        marginLeft: 15,
        fontSize: 18,
        color: theme.colors.text.primary,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 20,
    },
    settingLabel: {
        fontSize: 18,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    settingDesc: {
        fontSize: 13,
        color: theme.colors.text.muted,
        marginTop: 4,
    },
    voiceList: {
        gap: 12,
    },
    voiceCard: {
        backgroundColor: theme.colors.background.secondary,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    voiceName: {
        fontSize: 16,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    voiceDesc: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.background.secondary,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
        marginLeft: 15,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 20,
    },
    version: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    copyright: {
        fontSize: 10,
        color: theme.colors.text.muted,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: theme.colors.background.primary,
        borderRadius: 20,
        padding: 25,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.text.primary,
    },
    modalBody: {
        marginBottom: 25,
    },
    modalText: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        lineHeight: 24,
    },
    modalCloseButton: {
        backgroundColor: theme.colors.accent.teal,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
