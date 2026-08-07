import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { resetPasswordRequest } from '../../services/authApi';
import authStyles from '../../styles/authStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMessage('');
    if (!email) return;
    setLoading(true);
    try {
      await resetPasswordRequest(email);
      setIsError(false);
      setMessage('Check your email for a password reset link.');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <View style={authStyles.logoWrap}>
        <View style={authStyles.logoBadge}>
          <Ionicons name="key-outline" size={30} color={colors.primary} />
        </View>
      </View>

      <Text style={[typography.h1, authStyles.title]}>Reset password</Text>
      <Text style={[typography.body, authStyles.subtitle]}>
        Enter your email and we'll send you a reset link.
      </Text>

      <Input
        icon="mail-outline"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {message ? (
        <Text style={isError ? authStyles.errorText : authStyles.successText}>{message}</Text>
      ) : null}

      <Button title="Send Reset Link" onPress={handleReset} loading={loading} />
    </ScrollView>
  );
};

export default ResetPasswordScreen;
