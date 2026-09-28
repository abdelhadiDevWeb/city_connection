import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryAnnouncement } from '../types/social';

interface StoriesBarProps {
  stories: StoryAnnouncement[];
}

export function StoriesBar({ stories }: StoriesBarProps) {
  const [activeStory, setActiveStory] = useState<StoryAnnouncement | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Annonces Flash & Syndic</Text>
        <Text style={styles.sectionSubtitle}>Officielles</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            activeOpacity={0.8}
            onPress={() => setActiveStory(story)}
          >
            <View
              style={[
                styles.storyRing,
                story.urgency === 'URGENT' && styles.storyRingUrgent,
              ]}
            >
              <View style={styles.storyAvatar}>
                <Text style={styles.storyIcon}>{story.previewIcon}</Text>
              </View>
            </View>
            <Text style={styles.storyTitle} numberOfLines={1}>
              {story.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Story View Modal */}
      {activeStory && (
        <Modal
          visible={!!activeStory}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveStory(null)}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAuthorInfo}>
                    <Text style={styles.modalIconBig}>{activeStory.previewIcon}</Text>
                    <View>
                      <Text style={styles.modalAuthorName}>
                        {activeStory.authorName} ({activeStory.authorRole})
                      </Text>
                      <Text style={styles.modalDate}>{activeStory.date}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setActiveStory(null)}
                    style={styles.closeBtn}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {activeStory.urgency === 'URGENT' && (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>
                      ⚠️ AVIS IMPORTANT DE LA RÉSIDENCE
                    </Text>
                  </View>
                )}

                <Text style={styles.modalTitle}>{activeStory.title}</Text>
                <Text style={styles.modalBody}>{activeStory.content}</Text>

                <TouchableOpacity
                  style={styles.ackButton}
                  onPress={() => setActiveStory(null)}
                >
                  <Text style={styles.ackButtonText}>J'ai bien pris note</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede6',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181b',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
  },
  scrollList: {
    paddingHorizontal: 12,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
  },
  storyRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2.5,
    borderWidth: 2,
    borderColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  storyRingUrgent: {
    borderColor: '#dc2626',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#f6f3eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyIcon: {
    fontSize: 22,
  },
  storyTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#27272a',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalIconBig: {
    fontSize: 28,
  },
  modalAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181b',
  },
  modalDate: {
    fontSize: 11,
    color: '#71717a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4f4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#71717a',
    fontWeight: 'bold',
  },
  urgentBadge: {
    backgroundColor: '#fee2e2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  urgentBadgeText: {
    color: '#b91c1c',
    fontSize: 10,
    fontWeight: '800',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#18181b',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3f3f46',
    marginBottom: 20,
  },
  ackButton: {
    backgroundColor: '#18181b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ackButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
