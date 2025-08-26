import React from 'react';
import { Platform, TextInput, View } from 'react-native';

export type DateTimePickerEvent = any;

export type Props = {
  value: Date;
  mode: 'date' | 'time';
  display?: any;
  onChange: (e: DateTimePickerEvent, date?: Date) => void;
};

// Web fallback using native input elements
export default function DateTimePickerWeb({ value, mode, onChange }: Props) {
  const handleChange = (e: any) => {
    const v = e.target.value as string;
    if (!v) return onChange(e, undefined);
    const d = new Date(value ?? new Date());
    if (mode === 'date') {
      // v: YYYY-MM-DD
      const [y, m, day] = v.split('-').map((n) => parseInt(n, 10));
      d.setFullYear(y, (m ?? 1) - 1, day ?? 1);
    } else {
      // v: HH:MM
      const [hh, mm] = v.split(':').map((n) => parseInt(n, 10));
      d.setHours(hh ?? 0, mm ?? 0, 0, 0);
    }
    onChange(e, d);
  };

  const toDateValue = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const toTimeValue = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <View style={{ paddingVertical: 8 }}>
      <TextInput
        accessibilityRole="spinbutton"
        inputMode={mode === 'date' ? 'numeric' : 'numeric'}
        onChange={handleChange}
        defaultValue={mode === 'date' ? toDateValue(value) : toTimeValue(value)}
        // @ts-expect-error web prop
        type={mode === 'date' ? 'date' : 'time'}
        style={{
          paddingHorizontal: 12,
          paddingVertical: Platform.OS === 'web' ? 8 : 12,
          borderWidth: 1,
          borderRadius: 8,
        }}
      />
    </View>
  );
}

