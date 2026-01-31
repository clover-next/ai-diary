import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';

interface ColorPickerProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

const COLORS = [
    '#E57373', '#DA4040', '#902020', // Reds
    '#F0B429', '#D69E2E', '#975A16', // Oranges/Yellows
    '#64D2C3', '#38B2AC', '#234E52', // Teals
    '#7AA2E3', '#4299E1', '#2B6CB0', // Blues
    '#9F7AEA', '#805AD5', '#553C9A', // Purples
    '#A0A0B0', '#718096', '#2D3748', // Greys
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorItem,
                            { backgroundColor: color },
                            selectedColor === color && styles.selected
                        ]}
                        onPress={() => onSelectColor(color)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.m,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.xs,
    },
    colorItem: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: theme.spacing.s,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selected: {
        borderColor: theme.colors.text.primary,
        borderWidth: 2,
        transform: [{ scale: 1.1 }],
    }
});
