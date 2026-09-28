import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Link } from 'expo-router';

export default function MobileDashboard() {
  const [userRole, setUserRole] = useState<'RESIDENT' | 'STAFF'>('RESIDENT');
  const [balance, setBalance] = useState(-4000); // 2 months unpaid
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentType, setIncidentType] = useState('Plomberie');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Concierge task state
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Nettoyage cage d’escalier Bloc A1', done: true },
    { id: '2', title: 'Contrôle pression surpresseur sous-sol', done: false },
    { id: '3', title: 'Remplacement ampoule palier 4ème étage', done: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleReportIncident = () => {
    if (!incidentTitle) return;
    setIsIncidentModalOpen(false);
    setIncidentTitle('');
    setToastMessage('Votre signalement a été envoyé au syndic avec succès !');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>CITÉ CONNECT</Text>
            <Text style={styles.residenceName}>Cité 1500 Logements AADL</Text>
          </View>

          {/* Mode Switcher */}
          <TouchableOpacity
            onPress={() => setUserRole(userRole === 'RESIDENT' ? 'STAFF' : 'RESIDENT')}
            style={styles.roleBadge}
          >
            <Text style={styles.roleBadgeText}>
              {userRole === 'RESIDENT' ? 'Mode : Résident' : 'Mode : Gardien / Staff'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Toast */}
        {toastMessage && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* ============================================================== */}
        {/* RESIDENT VIEW */}
        {/* ============================================================== */}
        {userRole === 'RESIDENT' && (
          <>
            {/* Apartment Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.unitHeader}>
                <View>
                  <Text style={styles.unitLabel}>VOTRE LOGEMENT</Text>
                  <Text style={styles.unitNumber}>Bâtiment A2 — Apt 08</Text>
                  <Text style={styles.residentName}>Rachid Mebarki (Locataire)</Text>
                </View>
                <View style={[styles.statusBadge, balance < 0 ? styles.statusDebt : styles.statusOk]}>
                  <Text style={[styles.statusText, balance < 0 ? styles.textDebt : styles.textOk]}>
                    {balance < 0 ? 'Retard de paiement' : 'À jour'}
                  </Text>
                </View>
              </View>

              {/* Balance Due Display */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>SOLDE MENSUEL ACTUEL</Text>
                <Text
                  style={[
                    styles.balanceAmount,
                    balance < 0 ? { color: '#f87171' } : { color: '#34d399' },
                  ]}
                >
                  {balance < 0 ? `${balance.toLocaleString()} DZD` : '0 DZD'}
                </Text>
                <Text style={styles.balanceSub}>
                  {balance < 0
                    ? '2 Mois d’impayés (Charges communes : 2 000 DZD / mois)'
                    : 'Vos charges de copropriété sont réglées.'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setBalance(0);
                  setToastMessage('Paiement BaridiMob validé ! Reçu #REC-2026-00483 généré.');
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                style={styles.payButton}
              >
                <Text style={styles.payButtonText}>Régler via Carte Edahabia / BaridiMob</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionHeader}>SERVICES DU RÉSIDENT</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                onPress={() => setIsIncidentModalOpen(true)}
                style={[styles.actionCard, { borderColor: '#f59e0b' }]}
              >
                <Text style={styles.actionIcon}>⚠️</Text>
                <Text style={styles.actionTitle}>Signaler Panne</Text>
                <Text style={styles.actionSub}>Fuite d’eau, ascenseur, lumière</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setToastMessage('Téléchargement du dernier reçu PDF en cours...');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                style={[styles.actionCard, { borderColor: '#3b82f6' }]}
              >
                <Text style={styles.actionIcon}>📄</Text>
                <Text style={styles.actionTitle}>Mes Reçus PDF</Text>
                <Text style={styles.actionSub}>Historique des paiements</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Residence Announcement */}
            <Text style={styles.sectionHeader}>AVIS DU SYNDIC & URGENCES</Text>
            <View style={styles.announcementCard}>
              <View style={styles.annHeader}>
                <Text style={styles.annCategory}>ALERTE SEAAL</Text>
                <Text style={styles.annDate}>27 Fév 2026</Text>
              </View>
              <Text style={styles.annTitle}>Coupure d’eau programmée pour travaux</Text>
              <Text style={styles.annContent}>
                Les services de la SEAAL effectueront des raccordements ce jeudi de 08h00 à 18h00.
                Veuillez prendre vos dispositions et vérifier vos réservoirs.
              </Text>
            </View>
          </>
        )}

        {/* ============================================================== */}
        {/* STAFF / CONCIERGE VIEW */}
        {/* ============================================================== */}
        {userRole === 'STAFF' && (
          <>
            <View style={styles.staffHeaderCard}>
              <Text style={styles.staffLabel}>ESPACE PERSONNEL DE LA CITÉ</Text>
              <Text style={styles.staffName}>Amine Boudiaf</Text>
              <Text style={styles.staffRole}>Concierge Principal • Blocs A1 & A2</Text>
            </View>

            <Text style={styles.sectionHeader}>FEUILLE DE ROUTE DU JOUR</Text>
            <View style={styles.tasksList}>
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => toggleTask(task.id)}
                  style={[styles.taskItem, task.done && styles.taskDoneItem]}
                >
                  <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                    {task.done && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={[styles.taskText, task.done && styles.taskTextDone]}>
                    {task.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setIsIncidentModalOpen(true)}
              style={styles.staffReportBtn}
            >
              <Text style={styles.staffReportText}>+ Déclarer une anomalie constatée</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Incident Modal */}
      <Modal visible={isIncidentModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signaler un Problème / Panne</Text>
            <Text style={styles.modalSub}>
              Le syndic et l'équipe technique seront prévenus immédiatement.
            </Text>

            <Text style={styles.inputLabel}>Intitulé de la panne</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fuite d’eau palier ou Ascenseur en panne"
              placeholderTextColor="#64748b"
              value={incidentTitle}
              onChangeText={setIncidentTitle}
            />

            <Text style={styles.inputLabel}>Catégorie</Text>
            <View style={styles.categoryRow}>
              {['Plomberie', 'Ascenseur', 'Électricité'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setIncidentType(cat)}
                  style={[
                    styles.catBadge,
                    incidentType === cat && { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
                  ]}
                >
                  <Text style={styles.catText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setIsIncidentModalOpen(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReportIncident} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Envoyer le Signalement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  appTitle: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  residenceName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  toast: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    padding: 12,
    borderRadius: 12,
  },
  toastText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 16,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unitLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  unitNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  residentName: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDebt: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusOk: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  textDebt: {
    color: '#f87171',
  },
  textOk: {
    color: '#34d399',
  },
  balanceContainer: {
    backgroundColor: '#0b0f19',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  balanceLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  balanceSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  payButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  actionSub: {
    color: '#64748b',
    fontSize: 10,
  },
  announcementCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  annHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  annCategory: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  annDate: {
    color: '#64748b',
    fontSize: 10,
  },
  annTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  annContent: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  staffHeaderCard: {
    backgroundColor: '#111827',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  staffLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
  },
  staffName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  staffRole: {
    color: '#3b82f6',
    fontSize: 12,
    marginTop: 2,
  },
  tasksList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  taskDoneItem: {
    opacity: 0.6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  staffReportBtn: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  staffReportText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSub: {
    color: '#64748b',
    fontSize: 12,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  catText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
