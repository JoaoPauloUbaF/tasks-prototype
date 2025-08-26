import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AddTaskPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
      <Text>Use the center tab button to open the Add Task modal.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

