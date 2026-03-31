export interface Group {
  id: string;
  name: string;
}

export interface Assistant {
  id: string;
  name: string;
  groupId: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  points: number;
}

export interface Completion {
  id: string;
  assistantId: string;
  missionId: string;
  date: string;
}

export const groups: Group[] = [
  { id: 'g1', name: 'Grupo Águias' },
  { id: 'g2', name: 'Grupo Leões' },
  { id: 'g3', name: 'Grupo Corvos' },
  { id: 'g4', name: 'Grupo Fênix' },
];

export const assistants: Assistant[] = [
  { id: 'a1', name: 'Carlos Mendes', groupId: 'g1' },
  { id: 'a2', name: 'Mariana Souza', groupId: 'g1' },
  { id: 'a3', name: 'Pedro Alves', groupId: 'g1' },
  { id: 'a4', name: 'Ana Lima', groupId: 'g2' },
  { id: 'a5', name: 'Felipe Castro', groupId: 'g2' },
  { id: 'a6', name: 'Julia Ferreira', groupId: 'g2' },
  { id: 'a7', name: 'Roberto Silva', groupId: 'g3' },
  { id: 'a8', name: 'Camila Pereira', groupId: 'g3' },
  { id: 'a9', name: 'Lucas Oliveira', groupId: 'g3' },
  { id: 'a10', name: 'Beatriz Rocha', groupId: 'g4' },
  { id: 'a11', name: 'Diego Santos', groupId: 'g4' },
  { id: 'a12', name: 'Larissa Costa', groupId: 'g4' },
];

export const missions: Mission[] = [
  { id: 'm1', name: 'Receber Visitante', description: 'Recepcionar e acompanhar um visitante durante o evento', points: 10 },
  { id: 'm2', name: 'Apresentar o Rally', description: 'Fazer uma apresentação completa do Rally FJU para alguém', points: 20 },
  { id: 'm3', name: 'Convidar para Grupo', description: 'Convidar alguém para participar de um grupo de jovens', points: 15 },
  { id: 'm4', name: 'Oração com Visitante', description: 'Realizar um momento de oração com um visitante', points: 25 },
  { id: 'm5', name: 'Registro de Decisão', description: 'Registrar uma decisão de fé de um visitante', points: 30 },
  { id: 'm6', name: 'Compartilhar nas Redes', description: 'Compartilhar conteúdo do evento nas redes sociais', points: 8 },
  { id: 'm7', name: 'Apoio na Organização', description: 'Auxiliar na organização e infraestrutura do espaço', points: 12 },
  { id: 'm8', name: 'Ensinar Cântico', description: 'Ensinar um cântico novo para um visitante', points: 18 },
];

// Distribuição inicial para ranking dinâmico:
// Águias (g1): Carlos 33 + Mariana 32 + Pedro 35 = 100 pts
// Leões  (g2): Ana 38 + Felipe 45 + Julia 10 = 93 pts
// Corvos (g3): Roberto 47 + Camila 33 + Lucas 30 = 110 pts
// Fênix  (g4): Beatriz 42 + Diego 43 + Larissa 45 = 130 pts
export const initialCompletions: Completion[] = [
  { id: 'c1',  assistantId: 'a1',  missionId: 'm1', date: '2026-03-28' },
  { id: 'c2',  assistantId: 'a1',  missionId: 'm3', date: '2026-03-29' },
  { id: 'c3',  assistantId: 'a1',  missionId: 'm6', date: '2026-03-29' },
  { id: 'c4',  assistantId: 'a2',  missionId: 'm2', date: '2026-03-28' },
  { id: 'c5',  assistantId: 'a2',  missionId: 'm7', date: '2026-03-29' },
  { id: 'c6',  assistantId: 'a3',  missionId: 'm1', date: '2026-03-28' },
  { id: 'c7',  assistantId: 'a3',  missionId: 'm4', date: '2026-03-29' },
  { id: 'c8',  assistantId: 'a4',  missionId: 'm1', date: '2026-03-28' },
  { id: 'c9',  assistantId: 'a4',  missionId: 'm2', date: '2026-03-28' },
  { id: 'c10', assistantId: 'a4',  missionId: 'm6', date: '2026-03-29' },
  { id: 'c11', assistantId: 'a5',  missionId: 'm3', date: '2026-03-28' },
  { id: 'c12', assistantId: 'a5',  missionId: 'm5', date: '2026-03-29' },
  { id: 'c13', assistantId: 'a6',  missionId: 'm1', date: '2026-03-30' },
  { id: 'c14', assistantId: 'a7',  missionId: 'm2', date: '2026-03-28' },
  { id: 'c15', assistantId: 'a7',  missionId: 'm3', date: '2026-03-28' },
  { id: 'c16', assistantId: 'a7',  missionId: 'm7', date: '2026-03-29' },
  { id: 'c17', assistantId: 'a8',  missionId: 'm4', date: '2026-03-29' },
  { id: 'c18', assistantId: 'a8',  missionId: 'm6', date: '2026-03-30' },
  { id: 'c19', assistantId: 'a9',  missionId: 'm1', date: '2026-03-29' },
  { id: 'c20', assistantId: 'a9',  missionId: 'm2', date: '2026-03-30' },
  { id: 'c21', assistantId: 'a10', missionId: 'm5', date: '2026-03-28' },
  { id: 'c22', assistantId: 'a10', missionId: 'm7', date: '2026-03-29' },
  { id: 'c23', assistantId: 'a11', missionId: 'm1', date: '2026-03-28' },
  { id: 'c24', assistantId: 'a11', missionId: 'm3', date: '2026-03-29' },
  { id: 'c25', assistantId: 'a11', missionId: 'm8', date: '2026-03-30' },
  { id: 'c26', assistantId: 'a12', missionId: 'm2', date: '2026-03-28' },
  { id: 'c27', assistantId: 'a12', missionId: 'm4', date: '2026-03-29' },
];
