import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';

const MOODS = [
    { id: 'calm', icon: '🍃', label: '穏やか' },
    { id: 'happy', icon: '✨', label: '幸せ' },
    { id: 'anxious', icon: '🌫️', label: '不安' },
    { id: 'angry', icon: '🔥', label: '怒り' },
    { id: 'sad', icon: '💧', label: '悲しい' },
    { id: 'tired', icon: '☁️', label: '疲れ' },
];

interface Props {
    selectedMood: string | null;
    onSelectMood: (id: string) => void;
}

export const MoodSelector: React.FC<Props> = ({ selectedMood, onSelectMood }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {MOODS.map((mood) => (
                <TouchableOpacity
                    key={mood.id}
                    style={[
                        styles.moodItem,
                        selectedMood === mood.icon && styles.selectedItem
                    ]}
                    onPress={() => onSelectMood(mood.icon)}
                >
                    <Text style={styles.icon}>{mood.icon}</Text>
                    <Text style={[
                        styles.label,
                        selectedMood === mood.icon && styles.selectedLabel
                    ]}>{mood.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.s,
    },
    moodItem: {
        alignItems: 'center',
        marginRight: theme.spacing.m,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 20, // pop
        width: 80,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedItem: {
        backgroundColor: theme.colors.background.tertiary,
        borderColor: theme.colors.accent.pop,
    },
    icon: {
        fontSize: 32,
        marginBottom: theme.spacing.xs,
    },
    label: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.caption,
    },
    selectedLabel: {
        color: theme.colors.text.primary,
        fontWeight: 'bold',
    }
});
