import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';

const roles = [
  { id: 'beginner', icon: '🌱', name: 'Beginner', desc: 'Learn export basics' },
  { id: 'exporter', icon: '📦', name: 'Exporter', desc: 'Manage your exports' },
  { id: 'farmer', icon: '🌾', name: 'Farmer', desc: 'Export farm products' },
  { id: 'cha', icon: '🛃', name: 'CHA', desc: 'Customs handling' },
  { id: 'forwarder', icon: '🚢', name: 'Freight Forwarder', desc: 'Logistics management' },
  { id: 'adviser', icon: '💼', name: 'Trade Adviser', desc: 'Expert consultation' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>ExportPro</Text>
        <Text style={styles.tagline}>Simplify Global Trade</Text>
        <Text style={styles.sectionTitle}>Select Your Role</Text>
        <FlatList
          data={roles}
          numColumns={2}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => navigation.navigate('Login', { role: item.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>{item.icon}</Text>
              <Text style={styles.roleName}>{item.name}</Text>
              <Text style={styles.roleDesc}>{item.desc}</Text>
            </TouchableOpacity>
          )}
          columnWrapperStyle={styles.row}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  appName: { color: '#6366f1', fontSize: 36, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  tagline: { color: '#a8b2d8', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  row: { justifyContent: 'space-between' },
  roleCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4e',
    width: '48%',
    alignItems: 'center',
  },
  roleIcon: { fontSize: 32, marginBottom: 8 },
  roleName: { color: '#ffffff', fontSize: 14, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  roleDesc: { color: '#a8b2d8', fontSize: 12, textAlign: 'center' },
});

export default HomeScreen;
