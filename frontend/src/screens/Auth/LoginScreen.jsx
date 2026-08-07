import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import authStyles from '../../styles/authStyles';
import typography from '../../styles/typography';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Navigation to Home happens automatically via AppNavigator once
      // `user` is set in AuthContext.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      <View style={authStyles.logoWrap}>
        <Image
          source={require('../../../assets/logo-mark.png')}
          style={authStyles.logoImage}
          resizeMode="contain"
        />
        <Text style={[typography.h3, authStyles.logoText]}>Ecolink</Text>
      </View>

      <Text style={[typography.h1, authStyles.title]}>Welcome back</Text>
      <Text style={[typography.body, authStyles.subtitle]}>
        Sign in to track climate and weather updates for your region.
      </Text>

      <Input
        icon="mail-outline"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        icon="lock-closed-outline"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

      <Button title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={[typography.bodySmall, authStyles.forgotLink]}>Forgot your password?</Text>
      </TouchableOpacity>

      <View style={authStyles.linkRow}>
        <Text style={typography.body}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[typography.body, authStyles.linkText]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
