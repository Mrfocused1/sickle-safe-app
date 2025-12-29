import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  Participant,
  Conversation,
  CurrentUser,
  getRoleColor,
  getRoleLabel,
} from '../../types/messaging';
import { messagingStorage } from '../../services/messagingStorage';
import { MOCK_CONTACTS } from '../../data/mockMessagingData';

interface GroupCreatorProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (conversation: Conversation) => void;
  currentUser: CurrentUser;
}

export default function GroupCreator({
  visible,
  onClose,
  onCreate,
  currentUser,
}: GroupCreatorProps) {
  const [step, setStep] = useState<'members' | 'details'>('members');
  const [contacts, setContacts] = useState<Participant[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  useEffect(() => {
    if (visible) {
      loadContacts();
      // Reset state when opening
      setStep('members');
      setSelectedMembers([]);
      setGroupName('');
      setGroupDescription('');
      setSearchQuery('');
    }
  }, [visible]);

  const loadContacts = async () => {
    try {
      let loadedContacts = await messagingStorage.getContacts();
      if (loadedContacts.length === 0) {
        loadedContacts = MOCK_CONTACTS;
        await messagingStorage.saveContacts(loadedContacts);
      }
      setContacts(loadedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'details') {
      setStep('members');
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('details');
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const conversation = await messagingStorage.createGroupConversation(
        currentUser,
        selectedMembers,
        groupName.trim(),
        undefined,
        groupDescription.trim() || undefined
      );
      onCreate(conversation);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const toggleMember = (contact: Participant) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isSelected = selectedMembers.some(m => m.id === contact.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== contact.id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const filteredContacts = searchQuery.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const renderContact = ({ item }: { item: Participant }) => {
    const isSelected = selectedMembers.some(m => m.id === item.id);
    const roleColor = getRoleColor(item.role);

    return (
      <TouchableOpacity
        onPress={() => toggleMember(item)}
        style={[styles.contactItem, isSelected && styles.contactItemSelected]}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: `${roleColor}20` }]}>
          <Text style={[styles.avatarText, { color: roleColor }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={[styles.roleText, { color: roleColor }]}>
            {getRoleLabel(item.role)}
          </Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <MaterialIcons name="check" size={18} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSelectedMember = (member: Participant) => {
    const roleColor = getRoleColor(member.role);

    return (
      <View key={member.id} style={styles.selectedMember}>
        <View style={[styles.selectedAvatar, { backgroundColor: `${roleColor}20` }]}>
          <Text style={[styles.selectedAvatarText, { color: roleColor }]}>
            {member.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.selectedName} numberOfLines={1}>
          {member.name.split(' ')[0]}
        </Text>
        <TouchableOpacity
          onPress={() => toggleMember(member)}
          style={styles.removeButton}
        >
          <MaterialIcons name="close" size={12} color="#6b7280" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <MaterialIcons
                name={step === 'members' ? 'close' : 'arrow-back'}
                size={24}
                color="#6b7280"
              />
            </TouchableOpacity>

            <Text style={styles.title}>
              {step === 'members' ? 'New Group' : 'Group Details'}
            </Text>

            {step === 'members' ? (
              <TouchableOpacity
                onPress={handleNext}
                disabled={selectedMembers.length === 0}
                style={[
                  styles.nextButton,
                  selectedMembers.length === 0 && styles.nextButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.nextButtonText,
                    selectedMembers.length === 0 && styles.nextButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleCreate}
                disabled={!groupName.trim()}
                style={[
                  styles.createButton,
                  !groupName.trim() && styles.createButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.createButtonText,
                    !groupName.trim() && styles.createButtonTextDisabled,
                  ]}
                >
                  Create
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {step === 'members' ? (
            <>
              {/* Selected Members Preview */}
              {selectedMembers.length > 0 && (
                <View style={styles.selectedContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.selectedScroll}
                  >
                    {selectedMembers.map(renderSelectedMember)}
                  </ScrollView>
                  <Text style={styles.selectedCount}>
                    {selectedMembers.length} selected
                  </Text>
                </View>
              )}

              {/* Search */}
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#9ca3af" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <MaterialIcons name="close" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Contacts List */}
              <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <ScrollView
              style={styles.detailsContainer}
              contentContainerStyle={styles.detailsContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Group Icon */}
              <View style={styles.groupIconContainer}>
                <View style={styles.groupIcon}>
                  <MaterialIcons name="groups" size={48} color="#8b5cf6" />
                </View>
                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.7}>
                  <MaterialIcons name="camera-alt" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Group Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Group Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Enter group name"
                  placeholderTextColor="#9ca3af"
                  maxLength={50}
                  autoFocus
                />
                <Text style={styles.charCount}>{groupName.length}/50</Text>
              </View>

              {/* Group Description */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  placeholder="What's this group about?"
                  placeholderTextColor="#9ca3af"
                  multiline
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{groupDescription.length}/200</Text>
              </View>

              {/* Members Preview */}
              <View style={styles.membersPreview}>
                <Text style={styles.membersLabel}>
                  Members ({selectedMembers.length + 1})
                </Text>
                <View style={styles.membersList}>
                  <View style={[styles.memberChip, styles.adminChip]}>
                    <MaterialIcons name="star" size={12} color="#f59e0b" />
                    <Text style={styles.memberChipText}>You (Admin)</Text>
                  </View>
                  {selectedMembers.map(member => (
                    <View key={member.id} style={styles.memberChip}>
                      <Text style={styles.memberChipText}>{member.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  nextButtonTextDisabled: {
    color: '#9ca3af',
  },
  createButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  createButtonTextDisabled: {
    color: '#9ca3af',
  },
  selectedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  selectedScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  selectedMember: {
    alignItems: 'center',
    width: 60,
  },
  selectedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectedName: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCount: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 10,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  contactItemSelected: {
    backgroundColor: '#f5f3ff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  roleText: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  detailsContainer: {
    flex: 1,
  },
  detailsContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  groupIconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  groupIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '32%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 6,
  },
  membersPreview: {
    marginTop: 8,
  },
  membersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  adminChip: {
    backgroundColor: '#fef3c7',
  },
  memberChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});
