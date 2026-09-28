import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_POSTS } from '../../services/mockSocialData';

export default function ResidentProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const myPosts = INITIAL_POSTS.filter(
    (p) => p.authorId === user?.id || p.authorName.includes('Samir')
  );

  const handleCallManager = () => {
    if (!user?.buildingManager?.phone) return;
    const phoneUrl = `tel:${user.buildingManager.phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            'Appel Téléphonique',
            `Numéro de votre Chef de Bâtiment : ${user.buildingManager.phone}`
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Chef de Bâtiment',
          `Téléphone : ${user?.buildingManager?.phone}`
        );
      });
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de votre compte résident ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {user?.name?.charAt(0) || 'R'}
            </Text>
          </View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>✓ Résident Vérifié</Text>
          </View>
          <Text style={styles.residenceNameText}>{user?.residenceName}</Text>
        </View>

        {/* Section 1: Housing & Apartment Details (Bâtiment, Appartement, Étage) */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeaderTitle}>
            🏢 Coordonnées du Logement
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Résidence :</Text>
            <Text style={styles.infoValueBold}>{user?.residenceName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bâtiment / Bloc :</Text>
            <Text style={styles.infoValueBold}>{user?.buildingName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Numéro d'Appartement :</Text>
            <View style={styles.aptHighlightBadge}>
              <Text style={styles.aptHighlightText}>
                {user?.apartmentNumber}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Étage :</Text>
            <Text style={styles.infoValue}>{user?.floor}ème Étage</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Statut des Charges :</Text>
            <View style={styles.duesPaidBadge}>
              <Text style={styles.duesPaidText}>
                ● À jour (Quittance Espèces Encaissée)
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Contact Details (Phone, Email) */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeaderTitle}>
            📱 Coordonnées Personnelles
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Numéro de Téléphone :</Text>
            <Text style={styles.infoValuePhone}>{user?.phone}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Adresse Email :</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        {/* Section 3: Dedicated Building Manager Card */}
        <View style={styles.managerCard}>
          <View style={styles.managerCardHeader}>
            <View style={styles.managerIconBadge}>
              <Text style={styles.managerIconText}>👨‍💼</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.managerCardTitle}>Mon Chef de Bâtiment</Text>
              <Text style={styles.managerName}>
                {user?.buildingManager?.name}
              </Text>
              <Text style={styles.managerApt}>
                Loge à : {user?.buildingManager?.apartment}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.callManagerBtn}
            onPress={handleCallManager}
            activeOpacity={0.8}
          >
            <Text style={styles.callManagerBtnText}>
              📞 Appeler le Chef de Bâtiment ({user?.buildingManager?.phone})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 4: My Posts History on the Social Network */}
        <View style={styles.cardSection}>
          <View style={styles.myPostsHeader}>
            <Text style={styles.sectionHeaderTitle}>
              📝 Mes Publications sur le Fil
            </Text>
            <Text style={styles.postsCountText}>
              {myPosts.length} publication{myPosts.length > 1 ? 's' : ''}
            </Text>
          </View>

          {myPosts.length === 0 ? (
            <Text style={styles.emptyPostsText}>
              Vous n'avez pas encore publié de message. Partagez votre première
              annonce dans l'onglet "Publier".
            </Text>
          ) : (
            myPosts.map((post) => (
              <View key={post.id} style={styles.myPostItem}>
                <Text style={styles.myPostContent} numberOfLines={2}>
                  "{post.content}"
                </Text>
                <View style={styles.myPostMeta}>
                  <Text style={styles.myPostDate}>{post.createdAt}</Text>
                  <Text style={styles.myPostStats}>
                    ❤️ {post.reactions.LIKE + post.reactions.LOVE} • 💬{' '}
                    {post.commentsCount} réponses
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Section 5: Logout Action */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Se Déconnecter de la Cité</Text>
        </TouchableOpacity>

        <Text style={styles.legalNotice}>
          Cité Connect v1.0 • Espace Résident Vérifié
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    backgroundColor: '#fbfaf8',
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ece7dd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarLargeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181b',
  },
  verifiedBadge: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop: 6,
    marginBottom: 4,
  },
  verifiedBadgeText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '800',
  },
  residenceNameText: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '600',
  },
  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ece7dd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181b',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f4ee',
  },
  infoLabel: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#27272a',
    fontWeight: '600',
  },
  infoValueBold: {
    fontSize: 13,
    color: '#18181b',
    fontWeight: '800',
  },
  infoValuePhone: {
    fontSize: 13,
    color: '#18181b',
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  aptHighlightBadge: {
    backgroundColor: '#18181b',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  aptHighlightText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  duesPaidBadge: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  duesPaidText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  managerCard: {
    backgroundColor: '#f9f7f2',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e0d4',
  },
  managerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  managerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e0d4',
  },
  managerIconText: {
    fontSize: 22,
  },
  managerCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
  },
  managerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#18181b',
  },
  managerApt: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
  callManagerBtn: {
    backgroundColor: '#18181b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  callManagerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  myPostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postsCountText: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '600',
  },
  emptyPostsText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  myPostItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f4ee',
  },
  myPostContent: {
    fontSize: 13,
    color: '#27272a',
    lineHeight: 18,
  },
  myPostMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  myPostDate: {
    fontSize: 10,
    color: '#a1a1aa',
  },
  myPostStats: {
    fontSize: 10,
    color: '#71717a',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '800',
  },
  legalNotice: {
    fontSize: 10,
    color: '#a1a1aa',
    textAlign: 'center',
    marginTop: 8,
  },
});
