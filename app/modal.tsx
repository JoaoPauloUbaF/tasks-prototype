import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Pressable, KeyboardAvoidingView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@/components/DateTimePicker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useTasksStore } from '@/features/tasks-list/model/store';
import { buildTask, formatDueDate } from '@/features/tasks-list/model/types';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const pageBg = (colorScheme === 'dark' ? Colors.light.background : Colors.dark.background) as string;
  const setTasks = useTasksStore((s) => s.setTasks);

  const [title, setTitle] = useState('');
  const [contextLabel, setContextLabel] = useState('');
  const [due, setDue] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dueLabel = useMemo(() => (due ? formatDueDate(due) : 'No due date'), [due]);

  const onChangeDate = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) {
      // keep time if already chosen
      if (due) {
        const d = new Date(date);
        d.setHours(due.getHours(), due.getMinutes(), 0, 0);
        setDue(d);
      } else {
        setDue(date);
      }
    }
  };

  const onChangeTime = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) {
      const base = due ?? new Date();
      const d = new Date(base);
      d.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setDue(d);
    }
  };

  const onSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    const id = String(Date.now());
    const task = buildTask({ id, title: title.trim(), contextLabel: contextLabel.trim() || undefined, due });
    setTasks((prev) => [task, ...prev]);
    router.back();
  };

  return (
<KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={[styles.container, { backgroundColor: pageBg }]}>
      <View style={styles.card}>
        <Text style={styles.heading}>Create Task</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <View style={styles.inputRow}>
            <FontAwesome name="pencil" size={16} color={'#8aa5a3'} style={styles.inputIcon} />
            <TextInput
              placeholder="e.g., Prepare estimate for Johnson"
              placeholderTextColor={'#8aa5a3'}
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (error) setError(null);
              }}
              style={[styles.input, { borderColor: error ? '#cc3b3b' : 'transparent' }]}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Context</Text>
          <View style={styles.inputRow}>
            <FontAwesome name="folder" size={16} color={'#8aa5a3'} style={styles.inputIcon} />
            <TextInput
              placeholder="e.g., Clients, Maintenance"
              placeholderTextColor={'#8aa5a3'}
              value={contextLabel}
              onChangeText={setContextLabel}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Due</Text>
          <View style={styles.row}>
            <View style={styles.metaInline}>
              <FontAwesome name="calendar" size={14} color={'#6b6b6b'} />
              <Text>{dueLabel}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable accessibilityRole="button" onPress={() => { setShowDatePicker((s) => !s); setShowTimePicker(false); }} style={[styles.chip, { borderColor: theme.tint }]}>
              <Text style={[styles.chipText, { color: theme.tint }]}>Pick date</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => { setShowTimePicker((s) => !s); setShowDatePicker(false); }} style={[styles.chip, { marginLeft: 8, borderColor: theme.tint }]}>
              <Text style={[styles.chipText, { color: theme.tint }]}>Pick time</Text>
            </Pressable>
            {due ? (
              <Pressable accessibilityRole="button" onPress={() => setDue(null)} style={[styles.chip, { marginLeft: 8, borderColor: '#b3b3b3' }]}>
                <Text style={[styles.chipText, { color: '#666' }]}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
          {showDatePicker ? (
            <DateTimePicker
              value={due ?? new Date()}
              mode="date"
              display={Platform.select({ ios: 'inline', android: 'default' }) as any}
              onChange={onChangeDate}
            />
          ) : null}
          {showTimePicker ? (
            <DateTimePicker
              value={due ?? new Date()}
              mode="time"
              display={Platform.select({ ios: 'spinner', android: 'default' }) as any}
              onChange={onChangeTime}
            />
          ) : null}
        </View>

        <Pressable accessibilityRole="button" onPress={onSubmit} style={[styles.submit, { backgroundColor: theme.tint }]}>
          <Text style={styles.submitText}>Create Task</Text>
        </Pressable>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 900,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 36,
    paddingVertical: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontWeight: '700',
  },
  submit: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: '#cc3b3b',
    fontSize: 12,
    marginTop: -4,
  },
});
