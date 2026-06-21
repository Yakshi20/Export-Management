import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import ProfileCard from '../components/ProfileCard';
import Input from '../components/Input';
import Button from '../components/Button';

const ProfileScreen = () => {
  const { user, role, logout } = useAuth();
  const [mobile, setMobile] = useState(user?.phone || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);

  const updateMobile = async () => {
    setLoading(true);
    try {
      await api.put(`/${role}/profile`, { phone: mobile });
      Alert.alert('Success', 'Mobile number updated');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (!currentPass || !newPass) { Alert.alert('Error', 'Fill both password fields'); return; }
    setLoading(true);
    try {
      await api.put(`/${role}/profile/password`, { currentPassword: currentPass, newPassword: newPass });
      Alert.alert('Success', 'Password changed');
      setCurrentPass(''); setNewPass('');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <ProfileCard user={user} role={role} />
        <Text style={styles.sectionTitle}>Update Mobile</Text>
        <Input label="Mobile Number" value={mobile} onChangeText={setMobile} placeholder="+1234567890" keyboardType="phone-pad" />
        <Button title="Update Mobile" onPress={updateMobile} loading={loading} />
        <Text style={styles.sectionTitle}>Change Password</Text>
        <Input label="Current Password" value={currentPass} onChangeText={setCurrentPass} secureTextEntry />
        <Input label="New Password" value={newPass} onChangeText={setNewPass} secureTextEntry />
        <Button title="Change Password" onPress={changePassword} loading={loading} />
        <Button title="Logout" onPress={logout} variant="danger" style={styles.logoutBtn} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  sectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  logoutBtn: { marginTop: 32 },
});

export default ProfileScreen;
