import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDB } from '../db';

export const SettingsScreen = () => {
    const [audioEnabled, setAudioEnabled] = useState(true);

    const handleClearData = async () => {
        Alert.alert(
            'データ削除',
            'すべての記録を削除してもよろしいですか？',
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '削除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const db = await getDB();
                            await db.runAsync('DELETE FROM diaries');
                            await db.runAsync('DELETE FROM consultations');
                            Alert.alert('データを削除しました');
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            ]
        );
    };

    const openWeb = () => {
        Linking.openURL('https://clover-next.com');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/logo.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>設定</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>AI 音声読み上げ</Text>
                    <Switch
                        value={audioEnabled}
                        onValueChange={setAudioEnabled}
                        trackColor={{ true: theme.colors.accent.teal, false: theme.colors.background.tertiary }}
                    />
                </View>
                <Text style={styles.description}>
                    リフレクション時にAIが静かな声で読み上げます。
                </Text>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.button} onPress={handleClearData}>
                    <Text style={styles.buttonText}>全データを削除する</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.branding} onPress={openWeb}>
                <Text style={styles.brandText}>Developed by Clover Next</Text>
                <Text style={styles.url}>https://clover-next.com</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.version}>Wordless Diary v1.0.0 (Japanese MVP)</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing.l,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
        marginTop: theme.spacing.m,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 25,
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: theme.typography.sizes.h2,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.l,
        borderRadius: 24, // pop
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    label: {
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },
    description: {
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.text.muted,
    },
    button: {
        alignItems: 'center',
        padding: theme.spacing.m,
    },
    buttonText: {
        color: theme.colors.accent.rose,
        fontSize: theme.typography.sizes.body,
        fontWeight: 'bold',
    },
    branding: {
        marginTop: 'auto',
        alignItems: 'center',
        padding: theme.spacing.m,
    },
    brandText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.body,
        fontWeight: '600',
    },
    url: {
        color: theme.colors.accent.indigo,
        fontSize: theme.typography.sizes.caption,
        marginTop: theme.spacing.xs,
        textDecorationLine: 'underline',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: theme.spacing.m,
    },
    version: {
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.caption,
    }
});
