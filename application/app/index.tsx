import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';

export default function MobileDashboard() {
  const [activeOrg, setActiveOrg] = useState('Acme Global Corp');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active Tenant Card */}
        <View style={styles.tenantCard}>
          <View style={styles.tenantHeader}>
            <View>
              <Text style={styles.tenantLabel}>ACTIVE WORKSPACE</Text>
              <Text style={styles.tenantName}>{activeOrg}</Text>
            </View>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>PRO TIER</Text>
            </View>
          </View>

          <View style={styles.securityIndicator}>
            <View style={styles.dot} />
            <Text style={styles.securityText}>Zero-Trust Gateways Operational</Text>
          </View>
        </View>

        {/* Real-Time Metrics */}
        <Text style={styles.sectionTitle}>WORKSPACE METRICS</Text>
        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>API CALLS</Text>
            <Text style={styles.metricValue}>41.2k</Text>
            <Text style={styles.metricSub}>99.98% Success</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>BUN LATENCY</Text>
            <Text style={[styles.metricValue, { color: '#34d399' }]}>12ms</Text>
            <Text style={styles.metricSub}>Optimal</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Invite Team Member</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#1e293b' }]}
          >
            <Text style={[styles.actionButtonText, { color: '#cbd5e1' }]}>
              Audit & Activity Logs
            </Text>
          </TouchableOpacity>

          <Link href="/login" asChild>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#334155' },
              ]}
            >
              <Text style={[styles.actionButtonText, { color: '#94a3b8' }]}>
                Switch Identity / Sign Out
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  tenantCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 12,
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tenantLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tenantName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tierBadge: {
    backgroundColor: '#1e1b4b',
    borderWidth: 1,
    borderColor: '#4338ca',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tierText: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  securityText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 4,
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  metricSub: {
    color: '#94a3b8',
    fontSize: 10,
  },
  actionContainer: {
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
