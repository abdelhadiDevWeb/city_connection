import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ResidentLoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('0552445566');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    const result = await login(identifier, password);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Identifiants incorrects');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Branding */}
          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🏢</Text>
            </View>
            <Text style={styles.brandTitle}>CITÉ CONNECT</Text>
            <Text style={styles.brandSubtitle}>
              Le Réseau Social Privé de Votre Résidence
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connexion Résident</Text>
            <Text style={styles.cardDesc}>
              Connectez-vous avec le numéro de téléphone ou l'email transmis par votre Chef de Bâtiment
            </Text>

            {errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {/* Inputs */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de Téléphone ou Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: 0550 12 34 56 ou email@..."
                placeholderTextColor="#a1a1aa"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mot de Passe ou Code PIN</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Code fourni par le syndic"
                placeholderTextColor="#a1a1aa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? 'Connexion en cours...' : 'Accéder à ma Résidence →'}
              </Text>
            </TouchableOpacity>

            {/* Crucial Note : No Public Registration */}
            <View style={styles.noRegisterNotice}>
              <Text style={styles.noticeTitle}>
                ℹ️ Pourquoi n'y a-t-il pas de page d'inscription ?
              </Text>
              <Text style={styles.noticeBody}>
                Pour garantir la sécurité et la confidentialité de la communauté,
                les comptes résidents sont créés exclusivement par votre{' '}
                <Text style={styles.noticeBold}>Chef de Bâtiment</Text> ou le{' '}
                <Text style={styles.noticeBold}>Syndic de copropriété</Text>.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Accès Résident',
                    'Veuillez contacter le responsable de votre bloc ou le bureau du syndic pour obtenir vos accès nominatifs vérifiés.'
                  )
                }
              >
                <Text style={styles.contactManagerLink}>
                  Besoin d'aide ? Rapprochez-vous de votre Chef de Bâtiment
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footerNote}>
            Plateforme Cité Connect • Résidence Sécurisée & Vérifiée
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf8f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#18181b',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#71717a',
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e0d4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181b',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#71717a',
    lineHeight: 18,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: {
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#27272a',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fbfaf8',
    borderWidth: 1,
    borderColor: '#e4dfd5',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#18181b',
  },
  loginBtn: {
    height: 50,
    backgroundColor: '#18181b',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  loginBtnDisabled: {
    backgroundColor: '#71717a',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  noRegisterNotice: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0ede6',
    backgroundColor: '#fdfcf9',
    padding: 14,
    borderRadius: 12,
  },
  noticeTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3f3f46',
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 11,
    color: '#71717a',
    lineHeight: 16,
  },
  noticeBold: {
    fontWeight: '700',
    color: '#18181b',
  },
  contactManagerLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  footerNote: {
    fontSize: 11,
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
