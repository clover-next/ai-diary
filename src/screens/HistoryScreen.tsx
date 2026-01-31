import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDB } from '../db';
import { useFocusEffect } from '@react-navigation/native';

interface DiaryEntry {
    id: string;
    created_at: number;
    mood_icon: string;
    color: string;
    note: string;
}

export const HistoryScreen = () => {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDiaries = async () => {
        try {
            const db = await getDB();
            const result = await db.getAllAsync<DiaryEntry>(
                'SELECT * FROM diaries ORDER BY created_at DESC'
            );
            setDiaries(result);
        } catch (e) {
            console.error(e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDiaries();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDiaries();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: DiaryEntry }) => {
        const date = new Date(item.created_at);
        return (
            <View style={[styles.card, { borderLeftColor: item.color }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.date}>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text style={styles.moodIcon}>{item.mood_icon}</Text>
                </View>
                {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>履歴</Text>
            <View style={styles.listWrapper}>
                <FlashList
                    data={diaries}
                    renderItem={renderItem}
                    estimatedItemSize={100}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.text.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>記録はまだありません。</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    title: {
        fontSize: theme.typography.sizes.h1,
        color: theme.colors.text.primary,
        fontWeight: 'bold',
        padding: theme.spacing.m,
    },
    listWrapper: {
        flex: 1,
        minHeight: 2, // Required for FlashList sometimes
    },
    listContent: {
        padding: theme.spacing.m,
    },
    card: {
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing.m,
        borderRadius: 20,
        marginBottom: theme.spacing.m,
        borderLeftWidth: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    date: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.caption,
    },
    moodIcon: {
        fontSize: 24,
    },
    note: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.sizes.body,
        marginTop: theme.spacing.xs,
    },
    emptyContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.text.muted,
    }
});
