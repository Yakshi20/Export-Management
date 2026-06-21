import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

const ProfileCard = ({ user, role }) => (
  <Card>
    <Text style={styles.name}>{user?.name || user?.email || 'User'}</Text>
    <Text style={styles.email}>{user?.email}</Text>
    <Text style={styles.role}>{role?.toUpperCase()}</Text>
  </Card>
);

const styles = StyleSheet.create({
  name: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  email: { color: '#a8b2d8', fontSize: 14, marginBottom: 8 },
  role: { color: '#6366f1', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
});

export default ProfileCard;
