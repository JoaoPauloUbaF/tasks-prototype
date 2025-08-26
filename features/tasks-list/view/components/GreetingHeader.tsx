import React from 'react';
import { StyleSheet, TextStyle, ViewStyle, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTasksStore } from '@/features/tasks-list/model/store';
import { useThemeStore } from '@/features/ui/themeStore';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

function FilterDropdown() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const filter = useTasksStore((s) => s.filter);
  const setFilter = useTasksStore((s) => s.setFilter);
  const [open, setOpen] = React.useState(false);
  const label = filter === 'all' ? 'All' : filter === 'today' ? 'Today' : 'Overdue';
  return (

    <View
      style={{ position: 'relative', backgroundColor: 'transparent' }} >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filter tasks"
        onPress={() => setOpen((o) => !o)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <FontAwesome name="folder" size={16} color={theme.text} />
        <Text style={styles.filterLabel}>{label}</Text>
        <FontAwesome name="chevron-down" size={14} color={theme.text} />
      </Pressable>
      {open ? (
        <Animated.View
          entering={FadeIn} exiting={FadeOut} style={[styles.menu, { backgroundColor: theme.surfaceVariant, borderColor: theme.surface }]}>
          {(['all', 'today', 'overdue'] as const).map((opt) => (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${opt}`}
              onPress={() => {
                setFilter(opt);
                setOpen(false);
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>{opt === 'all' ? 'All' : opt === 'today' ? 'Today' : 'Overdue'}</Text>
            </Pressable>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
}

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
        <FontAwesome name="bell-o" size={20} color={theme.text} style={styles.icon} accessibilityLabel="Notifications" />
        <ThemeToggleIcon />
        <FontAwesome name="history" size={20} color={theme.text} style={styles.icon} accessibilityLabel="History" />
      </View>
      <View style={styles.bottomRow}>
        <Text style={[styles.greeting, textStyle]}>{greeting}</Text>
        <View style={{ flex: 1 }} />
        <FilterDropdown />
      </View>
    </SafeAreaView>
  );
}

function ThemeToggleIcon() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const cs = useColorScheme();
  const theme = Colors[cs ?? 'light'];
  const isDark = (mode === 'dark') || (mode === 'system' && cs === 'dark');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={toggle}
    >
      <FontAwesome name={isDark ? 'sun-o' : 'moon-o'} size={20} color={theme.text} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    position: 'relative',
    zIndex: 10,
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
  menu: {
    position: 'absolute',
    right: 0,
    top: 28,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 1000,
    width: 120,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

