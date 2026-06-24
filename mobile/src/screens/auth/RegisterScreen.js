import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';
import api from '../../api/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

const roleFields = {
  exporter: [
    { key: 'companyName', label: 'Company Name', placeholder: 'Your Company Ltd' },
    { key: 'iecCode', label: 'IEC Code', placeholder: '10-digit IEC Code' },
    { key: 'gstNumber', label: 'GST Number', placeholder: '15-char GST Number' },
  ],
  farmer: [
    { key: 'farmerName', label: 'Farmer Name', placeholder: 'Your Name' },
    { key: 'farmLocation', label: 'Farm Location', placeholder: 'Village, District' },
    { key: 'farmSize', label: 'Farm Size', placeholder: 'e.g. 5 acres' },
    { key: 'cropType', label: 'Crop Type', placeholder: 'e.g. Rice, Wheat' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', placeholder: '12-digit Aadhaar' },
  ],
  cha: [
    { key: 'customBrokerLicense', label: 'Custom Broker License', placeholder: 'License Number' },
    { key: 'portCode', label: 'Port Code', placeholder: 'Port Code' },
  ],
  forwarder: [
    { key: 'mtoLicenseNumber', label: 'MTO License Number', placeholder: 'License Number' },
  ],
  adviser: [
    { key: 'name', label: 'Full Name', placeholder: 'Your Full Name' },
    { key: 'specialization', label: 'Specialization', placeholder: 'e.g. Export Compliance' },
    { key: 'yearsOfExperience', label: 'Years of Experience', placeholder: '5', keyboardType: 'numeric' },
  ],
  beginner: [],
};

const RegisterScreen = ({ navigation, route }) => {
  const { role = 'exporter' } = route.params || {};
  const [form, setForm] = useState({
    email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const register = async () => {
    if (!form.email || !form.mobile || !form.password) {
      Alert.alert('Error', 'Please fill all required fields'); return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return;
    }
    setLoading(true);
    try {
      await api.post(`/${role}/register`, { ...form, role });
      Alert.alert('Success', 'Account created! Please login.');
      navigation.navigate('Login', { role });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const extraFields = roleFields[role] || [];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.role}>{role.toUpperCase()}</Text>

        <Input label="Email" value={form.email} onChangeText={v => setField('email', v)} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Mobile" value={form.mobile} onChangeText={v => setField('mobile', v)} placeholder="+91 9999999999" keyboardType="phone-pad" />
        <Input label="Password" value={form.password} onChangeText={v => setField('password', v)} placeholder="Password" secureTextEntry />
        <Input label="Re-enter Password" value={form.confirmPassword} onChangeText={v => setField('confirmPassword', v)} placeholder="Re-enter Password" secureTextEntry />

        {extraFields.map(f => (
          <Input
            key={f.key}
            label={f.label}
            value={form[f.key] || ''}
            onChangeText={v => setField(f.key, v)}
            placeholder={f.placeholder}
            keyboardType={f.keyboardType || 'default'}
          />
        ))}

        <Button title="Create Account" onPress={register} loading={loading} />

        <TouchableOpacity onPress={() => navigation.navigate('Login', { role })} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginHighlight}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: 24 },
  backText: { color: '#6366f1', fontSize: 16 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 4 },
  role: { color: '#6366f1', fontSize: 13, fontWeight: '600', marginBottom: 24, letterSpacing: 1 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginText: { color: '#a8b2d8', fontSize: 14 },
  loginHighlight: { color: '#6366f1', fontWeight: '600' },
});

export default RegisterScreen;
