import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { updatePasswordRequest } from '../../services/authApi';
import authStyles from '../../styles/authStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const NewPasswordScreen = ({ route, navigation }) => {
  const accessToken = route.params?.accessToken;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!accessToken) {
      setError('This reset link is invalid or has expired. Request a new one.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await updatePasswordRequest(accessToken, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={authStyles.logoWrap}>
          <View style={authStyles.logoBadge}>
            <Ionicons name="checkmark-circle-outline" size={30} color={colors.primary} />
          </View>
        </View>
        <Text style={[typography.h1, authStyles.title]}>Password updated</Text>
        <Text style={[typography.body, authStyles.subtitle]}>
          Your password has been changed. Sign in with your new password.
        </Text>
        <Button title="Back to Login" onPress={() => navigation.replace('Login')} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <View style={authStyles.logoWrap}>
        <View style={authStyles.logoBadge}>
          <Ionicons name="lock-closed-outline" size={30} color={colors.primary} />
        </View>
      </View>

      <Text style={[typography.h1, authStyles.title]}>Set a new password</Text>
      <Text style={[typography.body, authStyles.subtitle]}>
        Choose a new password for your account.
      </Text>

      <Input
        icon="lock-closed-outline"
        placeholder="New password (min. 8 characters)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Input
        icon="lock-closed-outline"
        placeholder="Confirm new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

      <Button title="Update Password" onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
};

export default NewPasswordScreen;
