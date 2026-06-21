import React, { useState } from 'react';
import {
  View, Text, ScrollView, Alert, KeyboardAvoidingView,
  Platform, TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const LoginScreen = ({ navigation, route }) => {
  const { role = 'exporter' } = route.params || {};
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(role, email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome Back</Text>
        <Badge status={role} />
        <View style={styles.form}>
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          <Button title="Login" onPress={handleLogin} loading={loading} style={styles.loginBtn} />
          <TouchableOpacity onPress={() => navigation.navigate('Register', { role })} style={styles.registerLink}>
            <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerHighlight}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  back: { marginBottom: 24 },
  backText: { color: '#6366f1', fontSize: 16 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 12 },
  form: { marginTop: 24 },
  loginBtn: { marginTop: 16 },
  registerLink: { marginTop: 16, alignItems: 'center' },
  registerText: { color: '#a8b2d8', fontSize: 14 },
  registerHighlight: { color: '#6366f1', fontWeight: '600' },
});

export default LoginScreen;
