import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';
import api from '../../api/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

const RegisterScreen = ({ navigation, route }) => {
  const { role = 'exporter' } = route.params || {};
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) { Alert.alert('Error', 'Please enter email'); return; }
    setLoading(true);
    try {
      await api.post(`/${role}/register/send-otp`, { email });
      setStep(1);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!otp) { Alert.alert('Error', 'Please enter OTP'); return; }
    setLoading(true);
    try {
      await api.post(`/${role}/register/verify-otp`, { email, otp });
      setStep(2);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const complete = async () => {
    if (!name) { Alert.alert('Error', 'Please enter your name'); return; }
    setLoading(true);
    try {
      await api.post(`/${role}/register/complete`, { email, name, companyName, phone });
      Alert.alert('Success', 'Registration complete! Please login.');
      navigation.navigate('Login', { role });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.dots}>
          {[0,1,2].map(i => (
            <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
          ))}
        </View>
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Step 1: Enter Email</Text>
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
            <Button title="Send OTP" onPress={sendOtp} loading={loading} />
          </View>
        )}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Step 2: Verify OTP</Text>
            <Text style={styles.sub}>OTP sent to {email}</Text>
            <Input label="OTP" value={otp} onChangeText={setOtp} placeholder="Enter OTP" keyboardType="numeric" />
            <Button title="Verify OTP" onPress={verifyOtp} loading={loading} />
            <Button title="Back" onPress={() => setStep(0)} variant="secondary" />
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Step 3: Your Details</Text>
            <Input label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
            <Input label="Company Name" value={companyName} onChangeText={setCompanyName} placeholder="Company (optional)" />
            <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+1234567890" keyboardType="phone-pad" />
            <Button title="Complete Registration" onPress={complete} loading={loading} />
            <Button title="Back" onPress={() => setStep(1)} variant="secondary" />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  back: { marginBottom: 24 },
  backText: { color: '#6366f1', fontSize: 16 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 20 },
  dots: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2a2a4e' },
  dotActive: { backgroundColor: '#6366f1' },
  stepTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  sub: { color: '#a8b2d8', marginBottom: 12 },
});

export default RegisterScreen;
