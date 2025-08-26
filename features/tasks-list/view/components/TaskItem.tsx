import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { Layout, SlideOutLeft, SlideInRight, LinearTransition } from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Task } from '../../model/types';

export default function TaskItem({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [completing, setCompleting] = useState(false);
  return (
    <Animated.View
      layout={LinearTransition.springify()}
      entering={SlideInRight.duration(280)}
      exiting={SlideOutLeft.duration(400)}
      style={styles.cardWrap}
    >
      <View style={[styles.card, { backgroundColor: theme.surfaceVariant ?? 'rgba(0,0,0,0.03)', borderColor: theme.surface, borderWidth: 1 }]}>
        <FontAwesome name='check' size={18} color={'#9D8CF5'} style={styles.leftTick} />
        <View style={styles.content}>
          <Text style={styles.title}>{task.title}</Text>
          {task.metadata.contextLabel ? (
            <View style={styles.metaItem}>
              <FontAwesome name="folder" size={12} color={'#6b6b6b'} />
              <Text style={styles.metaText}>{task.metadata.contextLabel}</Text>
            </View>
          ) : null}
          <View style={styles.metaRow}>
            {task.metadata.dueDateFormatted ? (
              <View style={styles.metaItem}>
                <FontAwesome name="calendar" size={12} color={'#6b6b6b'} />
                <Text style={styles.metaText}>{task.metadata.dueDateFormatted}</Text>
              </View>
            ) : null}
            {task.metadata.overdue ? (
              <View style={styles.metaItem}>
                <View style={styles.overdueDot} />
                <Text style={[styles.metaText, { color: '#cc3b3b' }]}>Overdue</Text>
              </View>
            ) : null}
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setCompleting(true);
            setTimeout(() => onComplete(task.id), 10);
          }}
          hitSlop={10}
          style={[
            styles.checkBox,
            completing ? styles.checkBoxFilled : styles.checkBoxEmpty,
          ]}
        >
          {completing ? <FontAwesome name="check" size={18} color={'#ffffff'} /> : null}
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    paddingVertical: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  leftTick: {
    width: 18,
    height: 18,
    marginRight: 10,
    alignSelf: 'flex-start',
    opacity: 0.7,
  },
  content: {
    flex: 1,
    gap: 6,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: 'transparent',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  metaText: {
    fontSize: 12,
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
  overdueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cc3b3b',
  },
  checkBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxEmpty: {
    backgroundColor: '#E6FAEF',
    borderWidth: 1,
    borderColor: '#BFEBD2',
  },
  checkBoxFilled: {
    backgroundColor: '#8BD3A4',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

