import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { Dimensions, Pressable, TouchableOpacity, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const theme = Colors[colorScheme ?? 'light'];
  const pageBg = (colorScheme === 'dark' ? Colors.light.background : Colors.dark.background) as string;
  const isWide = Dimensions.get('window').width >= 600;

  return (
    <View style={{ flex: 1, backgroundColor: pageBg, ...(isWide ? { paddingTop: 64, paddingBottom: 64 } : {}) }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tint,
          headerShown: false,
          tabBarStyle: {
            height: 84,
            paddingHorizontal: 18,
            backgroundColor: theme.surface,
            borderTopColor: theme.surfaceVariant,
            borderTopWidth: 1,
            // Center the bar on wide screens
            alignSelf: 'center',
            width: '100%',
            maxWidth: 900,
          },
          tabBarIconStyle: { marginTop: 12 },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={28} />,
          }}
        />

        <Tabs.Screen
          name="my-work"
          options={{
            title: 'My Work',
            tabBarIcon: ({ color }) => <FontAwesome name="briefcase" color={color} size={28} />,
          }}
        />

        <Tabs.Screen
          name="add-task"
          options={{
            title: 'Add Task',
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => router.push('/modal')}
                accessibilityRole="button"
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 150,
                  marginTop: -36,
                  backgroundColor: Colors[colorScheme ?? 'light'].tint,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 6,
                }}
              >
                <FontAwesome name='plus' size={36} color={Colors[colorScheme ?? 'light'].background} />
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color }) => <FontAwesome name="line-chart" color={color} size={28} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={28} />,
          }}
        />
      </Tabs>
    </View>

  );
}
