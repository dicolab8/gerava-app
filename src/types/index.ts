export interface Evaluation {
  id: string | number;
  disciplina_nome: string;
  modulo_nome: string;
  modulo_id: string | number;
  professor_nome: string;
  data: string;
  horario_ini: string;
  horario_fim: string;
  laboratorios: { id: number | string; nome: string }[];
  observacoes?: string;
  isFavorite?: boolean; // Campo local do app
  situacao_nome?: string;
  tipo_nome?: string;
}

export interface Message {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: 'warning' | 'success' | 'info' | 'normal';
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface UserModule {
  id: string | number;
  nome: string;
  periodo?: string;
  descricao?: string;
}