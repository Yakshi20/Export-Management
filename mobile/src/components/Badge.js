import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColor = (status) => {
  const s = (status || '').toLowerCase();
  if (['active', 'confirmed', 'completed', 'cleared'].includes(s)) return '#10b981';
  if (['pending', 'processing', 'under examination'].includes(s)) return '#f59e0b';
  if (['cancelled', 'rejected', 'on hold'].includes(s)) return '#e94560';
  return '#6366f1';
};

const Badge = ({ status }) => (
  <View style={[styles.badge, { backgroundColor: getColor(status) + '33', borderColor: getColor(status) }]}>
    <Text style={[styles.text, { color: getColor(status) }]}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});

export default Badge;
