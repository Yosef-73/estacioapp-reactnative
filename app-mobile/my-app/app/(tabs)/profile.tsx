import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { colors, spacing, radius, fontSize } from '../../constants/theme';
import { Assistant } from '../../data/mockData';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}

export default function ProfileScreen() {
  const { assistants, groups, missions, completions, getAssistantPoints } = useApp();
  const [selected, setSelected] = useState<Assistant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getGroupName = (groupId: string) =>
    groups.find(g => g.id === groupId)?.name ?? '';

  const assistantCompletions = selected
    ? completions.filter(c => c.assistantId === selected.id)
    : [];

  const points = selected ? getAssistantPoints(selected.id) : 0;

  const groupRank = selected
    ? assistants
        .filter(a => a.groupId === selected.groupId)
        .map(a => ({ id: a.id, pts: getAssistantPoints(a.id) }))
        .sort((a, b) => b.pts - a.pts)
        .findIndex(a => a.id === selected.id) + 1
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity style={styles.selectorBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.selectorBtnText}>
            {selected ? selected.name : 'Selecionar assistente'}
          </Text>
          <Ionicons name={'chevron-down' as IoniconsName} size={16} color={colors.primaryLight} />
        </TouchableOpacity>
      </View>

      {!selected ? (
        <View style={styles.emptyState}>
          <Ionicons name={'person-circle-outline' as IoniconsName} size={72} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum assistente selecionado</Text>
          <Text style={styles.emptySubtitle}>Selecione um assistente para ver o perfil</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectBtnText}>Selecionar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{getInitials(selected.name)}</Text>
            </View>
            <Text style={styles.profileName}>{selected.name}</Text>
            <Text style={styles.profileGroup}>{getGroupName(selected.groupId)}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{points}</Text>
                <Text style={styles.statLabel}>Pontos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{assistantCompletions.length}</Text>
                <Text style={styles.statLabel}>Missões</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>#{groupRank}</Text>
                <Text style={styles.statLabel}>no Grupo</Text>
              </View>
            </View>
          </View>

          {/* History */}
          <Text style={styles.sectionTitle}>Histórico de Missões</Text>
          {assistantCompletions.length === 0 ? (
            <Text style={styles.emptySubtitle}>Nenhuma missão registrada ainda.</Text>
          ) : (
            [...assistantCompletions].reverse().map(c => {
              const mission = missions.find(m => m.id === c.missionId);
              return (
                <View key={c.id} style={styles.historyCard}>
                  <View style={styles.historyIcon}>
                    <Ionicons name={'checkmark' as IoniconsName} size={16} color={colors.primaryLight} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyMission}>{mission?.name}</Text>
                    <Text style={styles.historyDate}>{c.date}</Text>
                  </View>
                  <Text style={styles.historyPoints}>+{mission?.points} pts</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Assistente</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name={'close' as IoniconsName} size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={assistants}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, selected?.id === item.id && styles.modalItemActive]}
                  onPress={() => { setSelected(item); setModalVisible(false); }}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemSub}>{getGroupName(item.groupId)}</Text>
                  </View>
                  <Text style={styles.modalItemPoints}>{getAssistantPoints(item.id)} pts</Text>
                  {selected?.id === item.id && (
                    <Ionicons name={'checkmark' as IoniconsName} size={18} color={colors.primaryLight} />
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
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800', marginBottom: spacing.sm },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorBtnText: { color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: '600' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center' },
  selectBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  selectBtnText: { color: colors.secondary, fontSize: fontSize.md, fontWeight: '700' },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarLargeText: { color: colors.secondary, fontSize: fontSize.xl, fontWeight: '800' },
  profileName: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800', marginBottom: 4 },
  profileGroup: { color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyMission: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
  historyDate: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 },
  historyPoints: { color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: '700' },
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.secondary, fontSize: fontSize.xs, fontWeight: '700' },
  modalItemName: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  modalItemSub: { color: colors.textMuted, fontSize: fontSize.xs },
  modalItemPoints: { color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: '600' },
});
