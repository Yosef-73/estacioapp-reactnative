import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { colors, spacing, radius, fontSize } from '../../constants/theme';
import { Assistant, Mission } from '../../data/mockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}

export default function RegisterScreen() {
  const { assistants, missions, completions, addCompletion, groups } = useApp();
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [assistantModal, setAssistantModal] = useState(false);
  const [missionModal, setMissionModal] = useState(false);

  const getGroupName = (groupId: string) =>
    groups.find(g => g.id === groupId)?.name ?? '';

  const getAssistantName = (id: string) =>
    assistants.find(a => a.id === id)?.name ?? '';

  const getMissionName = (id: string) =>
    missions.find(m => m.id === id)?.name ?? '';

  const recentCompletions = [...completions].slice(-5).reverse();

  const handleRegister = () => {
    if (!selectedAssistant || !selectedMission) {
      Alert.alert('Atenção', 'Selecione um assistente e uma missão para continuar.');
      return;
    }
    addCompletion(selectedAssistant.id, selectedMission.id);
    Alert.alert(
      'Missão Registrada!',
      `${selectedAssistant.name} completou "${selectedMission.name}" e ganhou ${selectedMission.points} pontos!`,
      [{ text: 'OK', onPress: () => setSelectedMission(null) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registrar</Text>
        <Text style={styles.subtitle}>Registre o cumprimento de uma missão</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Assistant selector */}
        <Text style={styles.label}>Assistente</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setAssistantModal(true)}>
          {selectedAssistant ? (
            <View style={styles.selectorValue}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(selectedAssistant.name)}</Text>
              </View>
              <View>
                <Text style={styles.selectorName}>{selectedAssistant.name}</Text>
                <Text style={styles.selectorGroup}>{getGroupName(selectedAssistant.groupId)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>Selecionar assistente...</Text>
          )}
          <Ionicons name={'chevron-down' as IoniconsName} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Mission selector */}
        <Text style={[styles.label, { marginTop: spacing.md }]}>Missão</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setMissionModal(true)}>
          {selectedMission ? (
            <View style={styles.selectorValue}>
              <View style={styles.ptsBadge}>
                <Text style={styles.ptsBadgeValue}>{selectedMission.points}</Text>
                <Text style={styles.ptsBadgeLabel}>pts</Text>
              </View>
              <Text style={styles.selectorName}>{selectedMission.name}</Text>
            </View>
          ) : (
            <Text style={styles.placeholder}>Selecionar missão...</Text>
          )}
          <Ionicons name={'chevron-down' as IoniconsName} size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Register button */}
        <TouchableOpacity
          style={[styles.button, (!selectedAssistant || !selectedMission) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!selectedAssistant || !selectedMission}
        >
          <Ionicons name={'checkmark-circle' as IoniconsName} size={20} color={colors.secondary} />
          <Text style={styles.buttonText}>Registrar Cumprimento</Text>
        </TouchableOpacity>

        {/* Recent completions */}
        <Text style={[styles.label, { marginTop: spacing.xl }]}>Registros Recentes</Text>
        {recentCompletions.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum registro ainda.</Text>
        ) : (
          recentCompletions.map(c => (
            <View key={c.id} style={styles.completionCard}>
              <View style={styles.completionLeft}>
                <Ionicons name={'checkmark-circle' as IoniconsName} size={18} color={colors.primaryLight} />
                <View>
                  <Text style={styles.completionAssistant}>{getAssistantName(c.assistantId)}</Text>
                  <Text style={styles.completionMission}>{getMissionName(c.missionId)}</Text>
                </View>
              </View>
              <Text style={styles.completionDate}>{c.date}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Assistant modal */}
      <Modal visible={assistantModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Assistente</Text>
              <TouchableOpacity onPress={() => setAssistantModal(false)}>
                <Ionicons name={'close' as IoniconsName} size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={assistants}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedAssistant?.id === item.id && styles.modalItemActive,
                  ]}
                  onPress={() => { setSelectedAssistant(item); setAssistantModal(false); }}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemSub}>{getGroupName(item.groupId)}</Text>
                  </View>
                  {selectedAssistant?.id === item.id && (
                    <Ionicons name={'checkmark' as IoniconsName} size={20} color={colors.primaryLight} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Mission modal */}
      <Modal visible={missionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Missão</Text>
              <TouchableOpacity onPress={() => setMissionModal(false)}>
                <Ionicons name={'close' as IoniconsName} size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[...missions].sort((a, b) => b.points - a.points)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedMission?.id === item.id && styles.modalItemActive,
                  ]}
                  onPress={() => { setSelectedMission(item); setMissionModal(false); }}
                >
                  <View style={styles.ptsBadge}>
                    <Text style={styles.ptsBadgeValue}>{item.points}</Text>
                    <Text style={styles.ptsBadgeLabel}>pts</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemSub} numberOfLines={1}>{item.description}</Text>
                  </View>
                  {selectedMission?.id === item.id && (
                    <Ionicons name={'checkmark' as IoniconsName} size={20} color={colors.primaryLight} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  selectorValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  selectorName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  selectorGroup: { color: colors.textMuted, fontSize: fontSize.xs },
  placeholder: { color: colors.textMuted, fontSize: fontSize.md },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.secondary, fontSize: fontSize.xs, fontWeight: '700' },
  ptsBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 44,
  },
  ptsBadgeValue: { color: colors.secondary, fontSize: fontSize.md, fontWeight: '800' },
  ptsBadgeLabel: { color: colors.primaryLight, fontSize: 9, fontWeight: '600' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: colors.secondary, fontSize: fontSize.md, fontWeight: '700' },
  emptyText: { color: colors.textMuted, fontSize: fontSize.sm, paddingVertical: spacing.md },
  completionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  completionAssistant: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  completionMission: { color: colors.textMuted, fontSize: fontSize.xs },
  completionDate: { color: colors.textMuted, fontSize: fontSize.xs },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '72%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '700' },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemActive: { backgroundColor: colors.surfaceElevated },
  modalItemName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  modalItemSub: { color: colors.textMuted, fontSize: fontSize.xs },
});
