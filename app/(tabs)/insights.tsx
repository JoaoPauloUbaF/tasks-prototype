import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const pageBg = (colorScheme === 'dark' ? Colors.light.background : Colors.dark.background) as string;

  return (
    <RNView style={[styles.container, { backgroundColor: pageBg }]}>
      <RNView style={[styles.inner, { backgroundColor: theme.surface }]}>
        <Text style={styles.title}>Insights</Text>
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 900,
    backgroundColor: '#fff',
    paddingVertical: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

