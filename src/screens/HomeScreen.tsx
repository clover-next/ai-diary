import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MoodSelector } from '../components/MoodSelector';
import { CalmSlider } from '../components/CalmSlider';
import { ColorPicker } from '../components/ColorPicker';
import { getDB } from '../db';
import * as Crypto from 'expo-crypto';

export const HomeScreen = () => {
    const [calmLevel, setCalmLevel] = useState(0.5);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(theme.colors.moods[0]);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!selectedMood) {
            Alert.alert('確認', '今日の気分（アイコン）を選んでください。');
            return;
        }

        try {
            setSaving(true);
            const db = await getDB();
            const id = Crypto.randomUUID();
            const createdAt = Date.now();

            await db.runAsync(
                'INSERT INTO diaries (id, created_at, mood_icon, calm_level, color, note) VALUES (?, ?, ?, ?, ?, ?)',
                id, createdAt, selectedMood, calmLevel, selectedColor, note
            );

            Alert.alert('記録完了', 'あなたの心の色が静かに記録されました。');
            // Reset form
            setNote('');
            setSelectedMood(null);
            setCalmLevel(0.5);

        } catch (e) {
            console.error(e);
            Alert.alert('エラー', '記録に失敗しました。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/header.jpg')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Wordless Diary</Text>
                        <Text style={styles.subtitle}>今、あなたの心は何色ですか？</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>気分</Text>
                    <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>心の落ち着き</Text>
                    <CalmSlider value={calmLevel} onValueChange={setCalmLevel} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>心の色</Text>
                    <ColorPicker selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>一言メモ (任意)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="言葉にできない思いも、そのままで..."
                        placeholderTextColor={theme.colors.text.muted}
                        value={note}
                        onChangeText={setNote}
                        maxLength={50}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: selectedColor }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <Text style={styles.saveButtonText}>{saving ? '記録中...' : '静かに記録する'}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    header: {
        height: 220,
        position: 'relative',
        marginBottom: theme.spacing.m,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    headerTextContainer: {
        position: 'absolute',
        bottom: theme.spacing.l,
        left: theme.spacing.l,
    },
    title: {
        fontSize: theme.typography.sizes.h1,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    subtitle: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.text.secondary,
    },
    section: {
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.l,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.s,
        fontWeight: '600',
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        color: theme.colors.text.primary,
        padding: theme.spacing.m,
        borderRadius: 16,
        fontSize: theme.typography.sizes.body,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    saveButton: {
        margin: theme.spacing.m,
        padding: theme.spacing.l,
        borderRadius: 30, // More rounded for 'pop' feel
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.l,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: theme.typography.sizes.h3,
        fontWeight: 'bold',
    }
});
