import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SocialPost, ReactionType } from '../types/social';

interface PostCardProps {
  post: SocialPost;
  onReact: (postId: string, reaction: ReactionType) => void;
  onOpenComments: (post: SocialPost) => void;
}

const CATEGORY_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  COMMUNITY: { label: '🌸 Vie de Résidence', bg: '#fdf4ff', color: '#86198f' },
  ALERT: { label: '⚠️ Alerte & Urgence', bg: '#fee2e2', color: '#991b1b' },
  LOST_FOUND: { label: '🔑 Objet Trouvé / Perdu', bg: '#fef3c7', color: '#92400e' },
  MAINTENANCE: { label: '🔧 Bricolage & Entraide', bg: '#f0fdf4', color: '#166534' },
  EVENT: { label: '📅 Événement Voisinage', bg: '#eff6ff', color: '#1e40af' },
  MARKET: { label: '🛍️ Petites Annonces', bg: '#faf5ff', color: '#6b21a8' },
};

const REACTIONS_CONFIG: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'LOVE', emoji: '❤️', label: 'J\'aime' },
  { type: 'APPLAUD', emoji: '👏', label: 'Bravo' },
  { type: 'HELPFUL', emoji: '💡', label: 'Utile' },
  { type: 'LIKE', emoji: '🤝', label: 'Solidaire' },
  { type: 'ALERT', emoji: '⚠️', label: 'Alerte' },
];

export function PostCard({ post, onReact, onOpenComments }: PostCardProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const categoryInfo = CATEGORY_LABELS[post.category] || {
    label: 'Voisinage',
    bg: '#f4f4f5',
    color: '#3f3f46',
  };

  const totalReactions =
    (post.reactions.LIKE || 0) +
    (post.reactions.LOVE || 0) +
    (post.reactions.APPLAUD || 0) +
    (post.reactions.HELPFUL || 0) +
    (post.reactions.ALERT || 0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `[Cité Connect - ${post.authorBuilding}] ${post.authorName} : "${post.content}"`,
      });
    } catch {
      // ignore
    }
  };

  const currentReactionEmoji =
    REACTIONS_CONFIG.find((r) => r.type === post.userReaction)?.emoji || '🤍';

  return (
    <View style={styles.card}>
      {/* Pinned banner if official notice */}
      {post.isPinned && (
        <View style={styles.pinnedBanner}>
          <Text style={styles.pinnedText}>📌 Publication Épinglée par le Syndic</Text>
        </View>
      )}

      {/* Header : Author Info */}
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{post.authorName.charAt(0)}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <View style={styles.aptBadge}>
                <Text style={styles.aptBadgeText}>
                  {post.authorBuilding} • {post.authorApartment}
                </Text>
              </View>
            </View>
            <Text style={styles.timestamp}>{post.createdAt}</Text>
          </View>
        </View>

        {/* Category Pill */}
        <View style={[styles.categoryPill, { backgroundColor: categoryInfo.bg }]}>
          <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
            {categoryInfo.label}
          </Text>
        </View>
      </View>

      {/* Post Text Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Attached Media / Image */}
      {post.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Reactions Summary Counter */}
      <View style={styles.summaryRow}>
        <View style={styles.reactionSummaryLeft}>
          <Text style={styles.reactionEmojisStack}>❤️ 👏 💡</Text>
          <Text style={styles.summaryCount}>
            {totalReactions > 0 ? `${totalReactions} réactions` : 'Soyez le premier à réagir'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onOpenComments(post)}
          activeOpacity={0.7}
        >
          <Text style={styles.summaryCount}>
            {post.commentsCount} commentaire{post.commentsCount > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons Bar (Instagram / Facebook Style) */}
      <View style={styles.actionsBar}>
        {/* React Button with Long-press / Toggle Picker */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            post.userReaction && styles.actionButtonActive,
          ]}
          onPress={() => {
            if (post.userReaction) {
              onReact(post.id, post.userReaction); // toggles off
            } else {
              setShowReactionPicker(!showReactionPicker);
            }
          }}
          onLongPress={() => setShowReactionPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>{currentReactionEmoji}</Text>
          <Text
            style={[
              styles.actionLabel,
              post.userReaction && styles.actionLabelActive,
            ]}
          >
            {post.userReaction ? 'Réagi' : 'Réagir'}
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onOpenComments(post)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>💬</Text>
          <Text style={styles.actionLabel}>Commenter ({post.commentsCount})</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Text style={styles.actionEmoji}>↗️</Text>
          <Text style={styles.actionLabel}>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Reaction Picker Popup */}
      {showReactionPicker && (
        <View style={styles.reactionPickerBox}>
          {REACTIONS_CONFIG.map((r) => (
            <TouchableOpacity
              key={r.type}
              style={[
                styles.pickerEmojiBtn,
                post.userReaction === r.type && styles.pickerEmojiBtnActive,
              ]}
              onPress={() => {
                onReact(post.id, r.type);
                setShowReactionPicker(false);
              }}
            >
              <Text style={styles.pickerEmoji}>{r.emoji}</Text>
              <Text style={styles.pickerLabel}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ece8e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  pinnedBanner: {
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    paddingBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#18181b',
  },
  aptBadge: {
    backgroundColor: '#f3efe6',
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e0d4',
  },
  aptBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3f3f46',
  },
  timestamp: {
    fontSize: 10,
    color: '#71717a',
    marginTop: 1,
  },
  categoryPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#27272a',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  imageContainer: {
    marginTop: 8,
    width: '100%',
    height: 240,
    backgroundColor: '#f4f4f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f4f0',
  },
  reactionSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionEmojisStack: {
    fontSize: 12,
  },
  summaryCount: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: '#fef2f2',
  },
  actionEmoji: {
    fontSize: 16,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525b',
  },
  actionLabelActive: {
    color: '#dc2626',
    fontWeight: '700',
  },
  reactionPickerBox: {
    position: 'absolute',
    bottom: 48,
    left: 14,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  pickerEmojiBtn: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 20,
  },
  pickerEmojiBtnActive: {
    backgroundColor: '#f4f4f5',
  },
  pickerEmoji: {
    fontSize: 22,
  },
  pickerLabel: {
    fontSize: 8,
    color: '#71717a',
    fontWeight: 'bold',
  },
});
