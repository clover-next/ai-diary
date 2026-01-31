import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getDB } from '../db';
import * as Crypto from 'expo-crypto';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const CATEGORIES = [
    { id: 'distance', label: '友達との距離感', icon: '🤝' },
    { id: 'communication', label: '伝え方・言い方', icon: '💬' },
    { id: 'ignore', label: '無視・既読スルー', icon: '😶' },
    { id: 'misunderstanding', label: '誤解・すれ違い', icon: '😕' },
    { id: 'feelings', label: '自分の気持ち整理', icon: '🌱' },
];

export const ConsultationScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleSave = async () => {
        if (!selectedCategory) {
            Alert.alert('選択してください', '相談したい内容のカテゴリを選んでください。');
            return;
        }

        try {
            setSaving(true);
            const db = await getDB();
            const id = Crypto.randomUUID();
            const createdAt = Date.now();

            await db.runAsync(
                'INSERT INTO consultations (id, created_at, category, mood_level, user_note) VALUES (?, ?, ?, ?, ?)',
                id, createdAt, selectedCategory, 0.5, note
            );

            setNote('');
            setSelectedCategory(null);

            // Direct navigation to reflection
            navigation.navigate('Reflection', { consultationId: id });

        } catch (e) {
            console.error(e);
            Alert.alert('エラー', '保存に失敗しました。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.headerTitle}>相談</Text>
                <Text style={styles.subtitle}>今、どのような悩みがありますか？</Text>

                <View style={styles.categories}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryItem,
                                selectedCategory === cat.id && styles.selectedCategory
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={styles.catIcon}>{cat.icon}</Text>
                            <Text style={[styles.catLabel, selectedCategory === cat.id && styles.selectedLabel]}>{cat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>詳細 (任意・最大3行)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="起こったことを短く教えてください..."
                    placeholderTextColor={theme.colors.text.muted}
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    maxLength={100}
                />

                <TouchableOpacity
                    style={[styles.button, { opacity: selectedCategory ? 1 : 0.5 }]}
                    onPress={handleSave}
                    disabled={!selectedCategory || saving}
                >
                    <Text style={styles.buttonText}>{saving ? '保存中...' : '静かに相談する'}</Text>
                </TouchableOpacity>

                <Text style={styles.footerNote}>© Clover Next | https://clover-next.com</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scroll: {
        padding: theme.spacing.l,
    },
    headerTitle: {
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
        marginBottom: theme.spacing.s,
    },
    subtitle: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.l,
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.l,
    },
    categoryItem: {
        width: '48%',
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.m,
        borderRadius: 24,
        marginBottom: theme.spacing.m,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCategory: {
        borderColor: theme.colors.accent.pop,
        backgroundColor: theme.colors.background.tertiary,
    },
    catIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.s,
    },
    catLabel: {
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.text.muted,
        textAlign: 'center',
    },
    selectedLabel: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.s,
        marginTop: theme.spacing.m,
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        color: theme.colors.text.primary,
        padding: theme.spacing.m,
        borderRadius: 16,
        textAlignVertical: 'top',
        height: 100,
    },
    button: {
        backgroundColor: theme.colors.accent.pop,
        padding: theme.spacing.m,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: theme.typography.sizes.h3,
    },
    footerNote: {
        marginTop: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.text.muted,
        fontSize: theme.typography.sizes.caption,
    }
});
