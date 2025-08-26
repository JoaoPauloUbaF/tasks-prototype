import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AddTaskPlaceholderScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const pageBg = (colorScheme === 'dark' ? Colors.light.background : Colors.dark.background) as string;

  return (
    <RNView style={[styles.container, { backgroundColor: pageBg }]}>
      <RNView style={[styles.inner, { backgroundColor: theme.surface }]}> 
        <Text style={styles.title}>Add Task</Text>
        <Text style={{ textAlign: 'center' }}>Use the center tab button to open the Add Task modal.</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

