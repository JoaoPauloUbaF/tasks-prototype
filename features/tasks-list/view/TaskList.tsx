import React, { useEffect } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Easing, SlideInUp, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation, runOnJS, SlideInDown } from 'react-native-reanimated';

import { View, Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import type { Task } from '../model/types';
import { useTasksController } from '../hooks/useTasksController';
import TaskItem from './components/TaskItem';

export default function TaskList() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const { tasks, completeTask, undoLast, dismissUndo, lastCompleted } = useTasksController();

  const contentPaddingBottom = 120; // space for undo banner

  const renderItem = ({ item }: ListRenderItemInfo<Task>) => (
    <TaskItem task={item} onComplete={completeTask} />
  );

  const keyExtractor = (item: Task) => item.id;

  // Progress bar animation
  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  useEffect(() => {
    if (lastCompleted) {
      // reset and start progress
      progress.value = 0;
      progress.value = withTiming(1, { duration: 7000, easing: Easing.linear }, (finished) => {
        if (finished) {
          runOnJS(dismissUndo)();
        }
      });
    }
    return () => {
      // cancel any running animation on unmount/change
      cancelAnimation(progress);
    };
  }, [lastCompleted, dismissUndo]);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom, paddingHorizontal: 16, paddingTop: 18 }}
      />

      {lastCompleted ? (
        <SafeAreaView edges={['bottom']} style={styles.bannerWrap}>
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={[styles.banner, { backgroundColor: '#FFF4D9' }]}>
            <Text style={styles.bannerText}>Task completed</Text>
            <View style={styles.bannerSpacer} />
            <View style={[styles.undoBtn, { backgroundColor: theme.tint }]}>
              <Text style={styles.undoText} onPress={() => { cancelAnimation(progress); undoLast(); }}>Undo</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { backgroundColor: theme.tint }, progressStyle]} />
            </View>
          </Animated.View>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bannerWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  banner: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    width: '70%'
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bannerSpacer: { flex: 1 },
  undoBtn: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  undoText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  progressTrack: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 3,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transformOrigin: 'left',
  },
});

