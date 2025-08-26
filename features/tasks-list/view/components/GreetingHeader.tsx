import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function GreetingHeader({
  greeting,
  style,
  textStyle,
}: {
  greeting: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.surface }, style]}>
      <View style={styles.topRow}>
        <Text style={styles.topTitle}>My Work</Text>
        <View style={{ flex: 1 }} />
        <FontAwesome name='bell-o' size={20} color={theme.text} style={styles.icon} />
        <FontAwesome name="history" size={20} color={theme.text} style={styles.icon} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={[styles.greeting, textStyle]}>{greeting}</Text>
        <View style={{ flex: 1 }} />
        <FontAwesome name="folder" size={16} color={theme.text} />
        <Text style={styles.filterLabel}>All</Text>
        <FontAwesome name="chevron-down" size={14} color={theme.text} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 16,
  },
  bottomRow: {
    marginTop: 32,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
  },
  filterLabel: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

