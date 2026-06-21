import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = ({ icon = '📭', title = 'Nothing here', subtitle = 'No items found' }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  icon: { fontSize: 60, marginBottom: 16 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  subtitle: { color: '#a8b2d8', fontSize: 14, textAlign: 'center' },
});

export default EmptyState;
