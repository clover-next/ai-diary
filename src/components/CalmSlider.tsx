import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../theme';

interface Props {
    value: number;
    onValueChange: (val: number) => void;
}

export const CalmSlider: React.FC<Props> = ({ value, onValueChange }) => {
    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>ざわつき</Text>
                <Text style={styles.label}>静寂</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor={theme.colors.accent.pop}
                maximumTrackTintColor={theme.colors.background.tertiary}
                thumbTintColor={theme.colors.accent.pop}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.m,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 24, // pop
        paddingHorizontal: theme.spacing.m,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.s,
    },
    label: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.caption,
        fontWeight: '600',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
