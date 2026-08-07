import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { createReport, uploadReportImage } from '../../services/reportApi';
import { CAMEROON_REGIONS } from '../../utils/cameroonRegions';
import { SEVERITY_LEVELS, severityColor } from '../../utils/severity';
import floodStyles from '../../styles/floodStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const initialForm = {
  region: '',
  division: '',
  subdivision: '',
  village: '',
  description: '',
  severity: 'Low',
  latitude: null,
  longitude: null,
};

const FloodReportFormScreen = ({ navigation }) => {
  const [form, setForm] = useState(initialForm);
  const [photoUri, setPhotoUri] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const captureLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required to attach GPS coordinates.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setForm((prev) => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    } catch {
      setError('Could not fetch your current location.');
    } finally {
      setLocating(false);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Photo library permission is required to attach an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    setError('');
    const { region, division, subdivision, village, description, latitude, longitude } = form;
    if (!region || !division || !subdivision || !village || description.length < 10) {
      setError('Please fill in all fields — description needs at least 10 characters.');
      return;
    }
    if (latitude == null || longitude == null) {
      setError('Please capture your GPS location before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      let image_url;
      if (photoUri) {
        const uploadRes = await uploadReportImage(photoUri);
        image_url = uploadRes.data?.url ?? uploadRes.url;
      }
      await createReport({ ...form, image_url });
      Alert.alert('Report submitted', 'Thank you — your flood report is now live for others to see.');
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={floodStyles.formContainer}>
      <Header title="Report a Flood" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={floodStyles.formBody}>
        <Text style={[typography.bodySmall, floodStyles.label]}>Region</Text>
        <View style={floodStyles.chipRow}>
          {CAMEROON_REGIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[floodStyles.chip, form.region === r && floodStyles.chipActive]}
              onPress={() => update('region')(r)}
            >
              <Text style={[floodStyles.chipText, form.region === r && floodStyles.chipTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[typography.bodySmall, floodStyles.label]}>Division</Text>
        <TextInput
          style={floodStyles.input}
          placeholder="e.g. Mfoundi"
          value={form.division}
          onChangeText={update('division')}
        />

        <Text style={[typography.bodySmall, floodStyles.label]}>Subdivision</Text>
        <TextInput
          style={floodStyles.input}
          placeholder="e.g. Yaoundé 6"
          value={form.subdivision}
          onChangeText={update('subdivision')}
        />

        <Text style={[typography.bodySmall, floodStyles.label]}>Village / Neighbourhood</Text>
        <TextInput
          style={floodStyles.input}
          placeholder="e.g. Biyem-Assi"
          value={form.village}
          onChangeText={update('village')}
        />

        <Text style={[typography.bodySmall, floodStyles.label]}>Description</Text>
        <TextInput
          style={[floodStyles.input, floodStyles.textArea]}
          placeholder="Describe what you're seeing..."
          multiline
          value={form.description}
          onChangeText={update('description')}
        />

        <Text style={[typography.bodySmall, floodStyles.label]}>Severity</Text>
        <View style={floodStyles.chipRow}>
          {SEVERITY_LEVELS.map((level) => {
            const active = form.severity === level;
            const color = severityColor(level);
            return (
              <TouchableOpacity
                key={level}
                style={[
                  floodStyles.severityChip,
                  { borderColor: color },
                  active && { backgroundColor: color },
                ]}
                onPress={() => update('severity')(level)}
              >
                <Text style={[floodStyles.chipText, active && floodStyles.chipTextActive, !active && { color }]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[typography.bodySmall, floodStyles.label]}>Location</Text>
        <TouchableOpacity style={floodStyles.locationButton} onPress={captureLocation} disabled={locating}>
          <Ionicons name="locate-outline" size={18} color={colors.primary} />
          <Text style={floodStyles.locationButtonText}>
            {locating
              ? 'Locating...'
              : form.latitude
              ? `${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}`
              : 'Use current location'}
          </Text>
        </TouchableOpacity>

        <Text style={[typography.bodySmall, floodStyles.label]}>Photo (optional)</Text>
        <TouchableOpacity style={floodStyles.locationButton} onPress={pickPhoto}>
          <Ionicons name="camera-outline" size={18} color={colors.primary} />
          <Text style={floodStyles.locationButtonText}>{photoUri ? 'Change photo' : 'Add a photo'}</Text>
        </TouchableOpacity>
        {photoUri ? <Image source={{ uri: photoUri }} style={floodStyles.photoPreview} /> : null}

        {error ? <Text style={floodStyles.errorText}>{error}</Text> : null}

        <View style={{ marginTop: 24 }}>
          <Button title="Submit Report" onPress={handleSubmit} loading={submitting} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FloodReportFormScreen;
