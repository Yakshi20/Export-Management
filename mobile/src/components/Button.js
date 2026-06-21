import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const bgColor = variant === 'danger' ? '#e94560' : variant === 'secondary' ? '#2a2a4e' : '#6366f1';
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bgColor, opacity: disabled || loading ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Button;
