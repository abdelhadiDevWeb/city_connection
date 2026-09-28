import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { StoriesBar } from '../../components/StoriesBar';
import { PostCard } from '../../components/PostCard';
import { CommentModal } from '../../components/CommentModal';
import {
  INITIAL_POSTS,
  MOCK_STORIES,
  MOCK_COMMENTS,
} from '../../services/mockSocialData';
import { SocialPost, ReactionType, PostComment } from '../../types/social';

export default function SocialFeedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>(MOCK_COMMENTS);
  const [selectedPostForComments, setSelectedPostForComments] = useState<SocialPost | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle reaction on a post
  const handleReact = (postId: string, reactionType: ReactionType) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const isCurrentlyReacted = post.userReaction === reactionType;
        const newReaction = isCurrentlyReacted ? undefined : reactionType;

        const updatedReactions = { ...post.reactions };

        // If previously had a reaction, decrement old one
        if (post.userReaction) {
          updatedReactions[post.userReaction] = Math.max(
            0,
            (updatedReactions[post.userReaction] || 1) - 1
          );
        }

        // If adding a new reaction, increment it
        if (!isCurrentlyReacted) {
          updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
        }

        return {
          ...post,
          userReaction: newReaction,
          reactions: updatedReactions,
        };
      })
    );
  };

  // Handle adding a new comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      postId,
      authorId: user?.id || 'res_user_01',
      authorName: user?.name || 'Résident',
      authorBuilding: user?.buildingName || 'Bâtiment B',
      authorApartment: user?.apartmentNumber || 'Apt 12',
      content: text,
      createdAt: 'À l\'instant',
    };

    setCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // Update post comments count
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
      )
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Application Bar */}
      <View style={styles.topBar}>
        <View>
          <View style={styles.residenceBadge}>
            <Text style={styles.residenceBadgeDot}>●</Text>
            <Text style={styles.residenceBadgeText}>
              {user?.residenceName || 'Résidence El Bahdja'}
            </Text>
          </View>
          <Text style={styles.buildingSubtext}>
            {user?.buildingName} • {user?.apartmentNumber}
          </Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() =>
              Alert.alert(
                'Notifications Voisins',
                'Vous êtes à jour ! Aucune alerte urgente pour le moment dans votre bâtiment.'
              )
            }
          >
            <Text style={styles.notifIcon}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Flash Stories Bar from Syndic & Building Managers */}
        <StoriesBar stories={MOCK_STORIES} />

        {/* Quick Post Prompt Bar */}
        <View style={styles.quickPromptCard}>
          <View style={styles.quickPromptAvatar}>
            <Text style={styles.quickPromptAvatarText}>
              {user?.name?.charAt(0) || 'R'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quickPromptInput}
            onPress={() => router.push('/(tabs)/create')}
            activeOpacity={0.8}
          >
            <Text style={styles.quickPromptPlaceholder}>
              Partager une info, photo ou entraide...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickPhotoBtn}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Text style={styles.quickPhotoIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Feed Posts */}
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Fil d'Actualité de la Cité</Text>
          <Text style={styles.feedCount}>{posts.length} publications</Text>
        </View>

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReact={handleReact}
            onOpenComments={(p) => setSelectedPostForComments(p)}
          />
        ))}

        <View style={styles.feedEnd}>
          <Text style={styles.feedEndText}>
            ✓ Vous avez vu toutes les nouvelles publications de vos voisins
          </Text>
        </View>
      </ScrollView>

      {/* Interactive Comments Drawer Modal */}
      {selectedPostForComments && (
        <CommentModal
          visible={!!selectedPostForComments}
          post={selectedPostForComments}
          comments={commentsMap[selectedPostForComments.id] || []}
          onClose={() => setSelectedPostForComments(null)}
          onAddComment={handleAddComment}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  residenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  residenceBadgeDot: {
    color: '#16a34a',
    fontSize: 10,
  },
  residenceBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#18181b',
    letterSpacing: -0.3,
  },
  buildingSubtext: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '600',
    marginTop: 1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f6f4ee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifIcon: {
    fontSize: 18,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#dc2626',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfaf8',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  quickPromptCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece7dd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  quickPromptAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickPromptAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickPromptInput: {
    flex: 1,
    backgroundColor: '#f8f7f4',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e4db',
  },
  quickPromptPlaceholder: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '500',
  },
  quickPhotoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f7f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e4db',
  },
  quickPhotoIcon: {
    fontSize: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  feedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181b',
  },
  feedCount: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '600',
  },
  feedEnd: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  feedEndText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: '600',
  },
});
