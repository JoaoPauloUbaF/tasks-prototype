import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import GreetingHeader from '@/features/tasks-list/view/components/GreetingHeader';
import TaskList from '@/features/tasks-list/view/TaskList';

const TopTabs = createMaterialTopTabNavigator();

function TasksScreen() {
  return (
    <RNView style={styles.tabScreen}>
      <TaskList />
    </RNView>
  );
}

function RemindersScreen() {
  return (
    <View style={styles.tabScreen}>
      <Text>Reminders</Text>
    </View>
  );
}

function MeetingsScreen() {
  return (
    <View style={styles.tabScreen}>
      <Text>Meetings</Text>
    </View>
  );
}

function NotesScreen() {
  return (
    <View style={styles.tabScreen}>
      <Text>Notes</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const inner = { alignSelf: 'center' as const, width: '100%', maxWidth: 900 };

  return (
    <RNView style={[styles.container, { backgroundColor: theme.surface }]}>
      <GreetingHeader greeting="Good morning, Louis!" style={inner} />
      <RNView style={[styles.tabsContainer, inner]}>
        <TopTabs.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.tint,
            tabBarIndicatorStyle: { backgroundColor: theme.tint },
            tabBarLabelStyle: { fontWeight: '600' },
            tabBarStyle: { backgroundColor: theme.surface },
          }}
        >
          <TopTabs.Screen name="Tasks" component={TasksScreen} />
          <TopTabs.Screen name="Reminders" component={RemindersScreen} />
          <TopTabs.Screen name="Meetings" component={MeetingsScreen} />
          <TopTabs.Screen name="Notes" component={NotesScreen} />
        </TopTabs.Navigator>
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  greeting: {
    fontSize: 24,
    fontWeight: '700',
  },
  tabsContainer: {
    flex: 1,
  },
  tabScreen: {
    flex: 1,
  },
});
