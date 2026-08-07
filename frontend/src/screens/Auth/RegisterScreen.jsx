import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import authStyles from '../../styles/authStyles';
import typography from '../../styles/typography';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ fullname: '', email: '', password: '', region: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    setError('');
    if (!form.fullname || !form.email || !form.password) {
      setError('Full name, email, and password are required.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigation.navigate('Login');
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

      <Text style={[typography.h1, authStyles.title]}>Create an account</Text>
      <Text style={[typography.body, authStyles.subtitle]}>
        Join the community reporting and tracking climate change in Cameroon.
      </Text>

      <Input
        icon="person-outline"
        placeholder="Full name"
        value={form.fullname}
        onChangeText={update('fullname')}
      />
      <Input
        icon="mail-outline"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={update('email')}
      />
      <Input
        icon="lock-closed-outline"
        placeholder="Password (min. 8 characters)"
        secureTextEntry
        value={form.password}
        onChangeText={update('password')}
      />
      <Input
        icon="location-outline"
        placeholder="Region (e.g. Centre, Far North)"
        value={form.region}
        onChangeText={update('region')}
      />

      {error ? <Text style={authStyles.errorText}>{error}</Text> : null}

      <Button title="Sign Up" onPress={handleRegister} loading={loading} />

      <View style={authStyles.linkRow}>
        <Text style={typography.body}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[typography.body, authStyles.linkText]}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
