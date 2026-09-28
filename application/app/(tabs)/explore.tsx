import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { INITIAL_POSTS } from '../../services/mockSocialData';
import { PostCard } from '../../components/PostCard';
import { CommentModal } from '../../components/CommentModal';
import { SocialPost, PostCategory, ReactionType } from '../../types/social';

const CATEGORIES: { id: PostCategory | 'ALL'; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Toutes les Catégories', icon: '🌟' },
  { id: 'COMMUNITY', label: 'Vie de Résidence', icon: '🌸' },
  { id: 'MAINTENANCE', label: 'Entraide & Bricolage', icon: '🔧' },
  { id: 'LOST_FOUND', label: 'Objets Perdus / Trouvés', icon: '🔑' },
  { id: 'ALERT', label: 'Alertes & Pannes', icon: '⚠️' },
  { id: 'MARKET', label: 'Petites Annonces', icon: '🛍️' },
];

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [selectedPostForComments, setSelectedPostForComments] = useState<SocialPost | null>(null);

  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorBuilding.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReact = (postId: string, reactionType: ReactionType) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const isCurrentlyReacted = post.userReaction === reactionType;
        const newReaction = isCurrentlyReacted ? undefined : reactionType;
        const updatedReactions = { ...post.reactions };
        if (post.userReaction) {
          updatedReactions[post.userReaction] = Math.max(0, (updatedReactions[post.userReaction] || 1) - 1);
        }
        if (!isCurrentlyReacted) {
          updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
        }
        return { ...post, userReaction: newReaction, reactions: updatedReactions };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorer la Communauté</Text>
        <Text style={styles.headerSubtitle}>
          Recherchez une entraide, un objet égaré ou une annonce de voisin
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par mot-clé, nom, bâtiment..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Horizontal Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryBtnText,
                    isSelected && styles.categoryBtnTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Feed */}
      <ScrollView contentContainerStyle={styles.resultsContent}>
        <View style={styles.resultsCountRow}>
          <Text style={styles.resultsCountText}>
            {filteredPosts.length} résultat{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
          </Text>
        </View>

        {filteredPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>Aucune publication trouvée</Text>
            <Text style={styles.emptySubtitle}>
              Essayez avec un autre mot-clé ou sélectionnez une autre catégorie
            </Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReact={handleReact}
              onOpenComments={(p) => setSelectedPostForComments(p)}
            />
          ))
        )}
      </ScrollView>

      {/* Comments Drawer */}
      {selectedPostForComments && (
        <CommentModal
          visible={!!selectedPostForComments}
          post={selectedPostForComments}
          comments={[]}
          onClose={() => setSelectedPostForComments(null)}
          onAddComment={(postId, text) => {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
              )
            );
          }}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede6',
    backgroundColor: '#ffffff',
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
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f7f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#e8e4dc',
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#18181b',
  },
  clearSearch: {
    fontSize: 12,
    color: '#71717a',
    padding: 4,
  },
  categoriesList: {
    gap: 8,
    paddingBottom: 4,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f6f4ee',
    borderWidth: 1,
    borderColor: '#ece7dd',
  },
  categoryBtnActive: {
    backgroundColor: '#18181b',
    borderColor: '#18181b',
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3f3f46',
  },
  categoryBtnTextActive: {
    color: '#ffffff',
  },
  resultsContent: {
    backgroundColor: '#fbfaf8',
    paddingBottom: 20,
  },
  resultsCountRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#18181b',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
    textAlign: 'center',
  },
});
