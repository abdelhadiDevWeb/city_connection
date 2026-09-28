import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostComment, SocialPost } from '../types/social';
import { useAuth } from '../context/AuthContext';

interface CommentModalProps {
  visible: boolean;
  post: SocialPost | null;
  comments: PostComment[];
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export function CommentModal({
  visible,
  post,
  comments,
  onClose,
  onAddComment,
}: CommentModalProps) {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');

  if (!post) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    onAddComment(post.id, inputText.trim());
    setInputText('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragPill} />
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>Commentaires entre Voisins</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.postSnippet} numberOfLines={1}>
              {post.authorName} : "{post.content}"
            </Text>
          </View>

          {/* Comments list */}
          <ScrollView
            style={styles.commentList}
            contentContainerStyle={styles.commentListContent}
          >
            {comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>💬</Text>
                <Text style={styles.emptyText}>
                  Aucun commentaire pour le moment.
                </Text>
                <Text style={styles.emptySubtext}>
                  Soyez le premier voisin à répondre !
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarLetter}>
                      {comment.authorName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.commentBubble}>
                    <View style={styles.commentAuthorRow}>
                      <Text style={styles.commentAuthorName}>
                        {comment.authorName}
                      </Text>
                      <View style={styles.commentAptBadge}>
                        <Text style={styles.commentAptText}>
                          {comment.authorBuilding} • {comment.authorApartment}
                        </Text>
                      </View>
                      <Text style={styles.commentTime}>{comment.createdAt}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Comment input row */}
          <View style={styles.inputContainer}>
            <View style={styles.userBadgeRow}>
              <Text style={styles.commentingAsText}>
                Commenter en tant que : <Text style={styles.commentingAsBold}>{user?.name}</Text> ({user?.buildingName} • {user?.apartmentNumber})
              </Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Écrivez une réponse à vos voisins..."
                placeholderTextColor="#a1a1aa"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                <Text style={styles.sendButtonText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    alignItems: 'center',
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e4e4e7',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#18181b',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f4f4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#71717a',
  },
  postSnippet: {
    fontSize: 11,
    color: '#71717a',
    marginTop: 4,
    alignSelf: 'flex-start',
    fontStyle: 'italic',
  },
  commentList: {
    flex: 1,
  },
  commentListContent: {
    padding: 16,
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3f3f46',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 4,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarLetter: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#f8f7f4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ece8e0',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  commentAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181b',
  },
  commentAptBadge: {
    backgroundColor: '#e5e2da',
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  commentAptText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3f3f46',
  },
  commentTime: {
    fontSize: 10,
    color: '#a1a1aa',
    marginLeft: 'auto',
  },
  commentContent: {
    fontSize: 13,
    lineHeight: 18,
    color: '#27272a',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0ede6',
    backgroundColor: '#ffffff',
  },
  userBadgeRow: {
    marginBottom: 6,
  },
  commentingAsText: {
    fontSize: 10,
    color: '#71717a',
  },
  commentingAsBold: {
    fontWeight: '700',
    color: '#18181b',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f7f4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#18181b',
    maxHeight: 80,
    borderWidth: 1,
    borderColor: '#e4e1d9',
  },
  sendButton: {
    backgroundColor: '#18181b',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#d4d4d8',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
