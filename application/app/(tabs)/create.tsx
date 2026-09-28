import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { PostCategory } from '../../types/social';

const CATEGORIES: { id: PostCategory; label: string; icon: string }[] = [
  { id: 'COMMUNITY', label: 'Vie de Résidence', icon: '🌸' },
  { id: 'MAINTENANCE', label: 'Entraide & Bricolage', icon: '🔧' },
  { id: 'LOST_FOUND', label: 'Objet Trouvé / Perdu', icon: '🔑' },
  { id: 'ALERT', label: 'Alerte & Panne', icon: '⚠️' },
  { id: 'MARKET', label: 'Petite Annonce', icon: '🛍️' },
  { id: 'EVENT', label: 'Événement & Réunion', icon: '📅' },
];

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('COMMUNITY');
  const [scope, setScope] = useState<'ALL_RESIDENCE' | 'BUILDING_ONLY'>('ALL_RESIDENCE');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = () => {
    if (!content.trim()) {
      Alert.alert('Message requis', 'Veuillez rédiger un texte pour vos voisins.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Publication Partagée !',
        'Votre publication a été diffusée avec succès auprès de vos voisins de la résidence.',
        [
          {
            text: 'Voir sur le fil',
            onPress: () => {
              setContent('');
              setSelectedImage(null);
              router.push('/(tabs)');
            },
          },
        ]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Nouvelle Publication</Text>
              <Text style={styles.headerSubtitle}>
                Partagez une information ou une entraide avec vos voisins
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>

          {/* Author Badge */}
          <View style={styles.authorBadgeCard}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {user?.name?.charAt(0) || 'R'}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{user?.name} (Vous)</Text>
              <Text style={styles.authorApt}>
                {user?.residenceName} • {user?.buildingName} • {user?.apartmentNumber}
              </Text>
            </View>
          </View>

          {/* Scope Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Audience & Visibilité :</Text>
            <View style={styles.scopeRow}>
              <TouchableOpacity
                style={[
                  styles.scopeOption,
                  scope === 'ALL_RESIDENCE' && styles.scopeOptionActive,
                ]}
                onPress={() => setScope('ALL_RESIDENCE')}
              >
                <Text style={styles.scopeIcon}>🏢</Text>
                <View>
                  <Text
                    style={[
                      styles.scopeTitle,
                      scope === 'ALL_RESIDENCE' && styles.scopeTitleActive,
                    ]}
                  >
                    Toute la Résidence
                  </Text>
                  <Text style={styles.scopeDesc}>Tous les bâtiments</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.scopeOption,
                  scope === 'BUILDING_ONLY' && styles.scopeOptionActive,
                ]}
                onPress={() => setScope('BUILDING_ONLY')}
              >
                <Text style={styles.scopeIcon}>🚪</Text>
                <View>
                  <Text
                    style={[
                      styles.scopeTitle,
                      scope === 'BUILDING_ONLY' && styles.scopeTitleActive,
                    ]}
                  >
                    Mon Bâtiment
                  </Text>
                  <Text style={styles.scopeDesc}>Uniquement {user?.buildingName}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Catégorie du message :</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardActive,
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={styles.catEmoji}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.catLabel,
                        isSelected && styles.catLabelActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Text Content Input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Exprimez-vous ou posez votre question à vos voisins..."
              placeholderTextColor="#a1a1aa"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Image Attachment */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Ajouter une photo (facultatif) :</Text>
            {selectedImage ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.removeImageText}>✕ Retirer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.presetsRow}>
                {PHOTO_PRESETS.map((url, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedImage(url)}
                    style={styles.presetThumbWrap}
                  >
                    <Image source={{ uri: url }} style={styles.presetThumb} />
                    <View style={styles.presetOverlay}>
                      <Text style={styles.presetOverlayPlus}>+</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Publish Action Button */}
          <TouchableOpacity
            style={[styles.publishBtn, isSubmitting && styles.publishBtnDisabled]}
            onPress={handlePublish}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.publishBtnText}>
              {isSubmitting ? 'Publication en cours...' : 'Publier pour mes voisins →'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#fbfaf8',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#18181b',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f4f4f5',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717a',
  },
  authorBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ece7dd',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181b',
  },
  authorApt: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 1,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#27272a',
    marginBottom: 8,
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scopeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ece7dd',
  },
  scopeOptionActive: {
    borderColor: '#18181b',
    backgroundColor: '#f8f7f4',
    borderWidth: 2,
  },
  scopeIcon: {
    fontSize: 20,
  },
  scopeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3f3f46',
  },
  scopeTitleActive: {
    color: '#18181b',
    fontWeight: '900',
  },
  scopeDesc: {
    fontSize: 10,
    color: '#71717a',
  },
  categoryScroll: {
    gap: 8,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ece7dd',
    minWidth: 90,
  },
  categoryCardActive: {
    backgroundColor: '#18181b',
    borderColor: '#18181b',
  },
  catEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  catLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3f3f46',
    textAlign: 'center',
  },
  catLabelActive: {
    color: '#ffffff',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ece7dd',
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    lineHeight: 22,
    color: '#18181b',
    minHeight: 120,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  presetThumbWrap: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e5e0d4',
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  presetOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetOverlayPlus: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  previewContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    height: 180,
    borderWidth: 1,
    borderColor: '#e5e0d4',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  removeImageText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  publishBtn: {
    height: 52,
    backgroundColor: '#18181b',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  publishBtnDisabled: {
    backgroundColor: '#71717a',
  },
  publishBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
