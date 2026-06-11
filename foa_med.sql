--
-- PostgreSQL database dump
--

-- Dumped from database version 17.7 (Debian 17.7-3.pgdg12+1)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: foa_med_hp7z_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO foa_med_hp7z_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avaliacao; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.avaliacao (
    id integer NOT NULL,
    situacao character varying(50) NOT NULL,
    tipo character varying(100) NOT NULL,
    data date,
    horario_ini time without time zone,
    horario_fim time without time zone,
    qtd_alunos integer,
    caip boolean NOT NULL,
    modulo_id integer,
    disciplina_id integer,
    professor_id integer,
    qtd_objetiva integer,
    qtd_discursiva integer,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    visivel boolean DEFAULT true,
    delete_logico boolean DEFAULT false
);


ALTER TABLE public.avaliacao OWNER TO foa_med_hp7z_user;

--
-- Name: avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.avaliacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avaliacao_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.avaliacao_id_seq OWNED BY public.avaliacao.id;


--
-- Name: avaliacao_laboratorio; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.avaliacao_laboratorio (
    id integer NOT NULL,
    avaliacao_id integer NOT NULL,
    conjunto_id integer
);


ALTER TABLE public.avaliacao_laboratorio OWNER TO foa_med_hp7z_user;

--
-- Name: avaliacao_laboratorio_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.avaliacao_laboratorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avaliacao_laboratorio_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: avaliacao_laboratorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.avaliacao_laboratorio_id_seq OWNED BY public.avaliacao_laboratorio.id;


--
-- Name: broadcast_history; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.broadcast_history (
    id integer NOT NULL,
    message text NOT NULL,
    groups text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.broadcast_history OWNER TO foa_med_hp7z_user;

--
-- Name: broadcast_history_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.broadcast_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.broadcast_history_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: broadcast_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.broadcast_history_id_seq OWNED BY public.broadcast_history.id;


--
-- Name: chatbot_config; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.chatbot_config (
    setting character varying(50) NOT NULL,
    value character varying(255),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.chatbot_config OWNER TO foa_med_hp7z_user;

--
-- Name: chatbot_users; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.chatbot_users (
    phone_number character varying(20) NOT NULL,
    subscribed boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chatbot_users OWNER TO foa_med_hp7z_user;

--
-- Name: disciplina; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.disciplina (
    id integer NOT NULL,
    descricao character varying(255) NOT NULL,
    modulo_id integer,
    professor_id integer
);


ALTER TABLE public.disciplina OWNER TO foa_med_hp7z_user;

--
-- Name: disciplina_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.disciplina_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.disciplina_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: disciplina_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.disciplina_id_seq OWNED BY public.disciplina.id;


--
-- Name: laboratorio; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.laboratorio (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    predio character varying(50) NOT NULL,
    qtd_com integer NOT NULL,
    qtd_sem integer NOT NULL
);


ALTER TABLE public.laboratorio OWNER TO foa_med_hp7z_user;

--
-- Name: laboratorio_conjuntos; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.laboratorio_conjuntos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    qtd_com_total integer NOT NULL,
    qtd_sem_total integer NOT NULL
);


ALTER TABLE public.laboratorio_conjuntos OWNER TO foa_med_hp7z_user;

--
-- Name: laboratorio_conjuntos_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.laboratorio_conjuntos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.laboratorio_conjuntos_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: laboratorio_conjuntos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.laboratorio_conjuntos_id_seq OWNED BY public.laboratorio_conjuntos.id;


--
-- Name: laboratorio_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.laboratorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.laboratorio_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: laboratorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.laboratorio_id_seq OWNED BY public.laboratorio.id;


--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.login_attempts (
    id integer NOT NULL,
    usuario_id integer,
    ip character varying(45) NOT NULL,
    attempt_count integer DEFAULT 0,
    block_count integer DEFAULT 0,
    block_until timestamp without time zone,
    is_permanently_blocked boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.login_attempts OWNER TO foa_med_hp7z_user;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.login_attempts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_attempts_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: login_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.login_attempts_id_seq OWNED BY public.login_attempts.id;


--
-- Name: login_secreto; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.login_secreto (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.login_secreto OWNER TO foa_med_hp7z_user;

--
-- Name: login_secreto_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.login_secreto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_secreto_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: login_secreto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.login_secreto_id_seq OWNED BY public.login_secreto.id;


--
-- Name: modulo; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.modulo (
    id integer NOT NULL,
    nome character varying(255) NOT NULL
);


ALTER TABLE public.modulo OWNER TO foa_med_hp7z_user;

--
-- Name: modulo_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.modulo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modulo_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: modulo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.modulo_id_seq OWNED BY public.modulo.id;


--
-- Name: notificacoes_avaliacao; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.notificacoes_avaliacao (
    id integer NOT NULL,
    avaliacao_id integer NOT NULL,
    tipo_alteracao character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    enviada boolean DEFAULT false,
    CONSTRAINT notificacoes_avaliacao_tipo_alteracao_check CHECK (((tipo_alteracao)::text = ANY (ARRAY[('CREATE'::character varying)::text, ('UPDATE'::character varying)::text, ('DELETE'::character varying)::text])))
);


ALTER TABLE public.notificacoes_avaliacao OWNER TO foa_med_hp7z_user;

--
-- Name: notificacoes_avaliacao_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.notificacoes_avaliacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificacoes_avaliacao_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: notificacoes_avaliacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.notificacoes_avaliacao_id_seq OWNED BY public.notificacoes_avaliacao.id;


--
-- Name: professor; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.professor (
    id integer NOT NULL,
    nome character varying(255) NOT NULL
);


ALTER TABLE public.professor OWNER TO foa_med_hp7z_user;

--
-- Name: professor_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.professor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professor_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: professor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.professor_id_seq OWNED BY public.professor.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO foa_med_hp7z_user;

--
-- Name: situacao_aval; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.situacao_aval (
    id integer NOT NULL,
    situacao character varying(50) NOT NULL
);


ALTER TABLE public.situacao_aval OWNER TO foa_med_hp7z_user;

--
-- Name: situacao_aval_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.situacao_aval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.situacao_aval_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: situacao_aval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.situacao_aval_id_seq OWNED BY public.situacao_aval.id;


--
-- Name: tipo_aval; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.tipo_aval (
    id integer NOT NULL,
    tipo character varying(100) NOT NULL
);


ALTER TABLE public.tipo_aval OWNER TO foa_med_hp7z_user;

--
-- Name: tipo_aval_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.tipo_aval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_aval_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: tipo_aval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.tipo_aval_id_seq OWNED BY public.tipo_aval.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(50),
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.usuarios OWNER TO foa_med_hp7z_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO foa_med_hp7z_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: foa_med_hp7z_user
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: avaliacao id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao ALTER COLUMN id SET DEFAULT nextval('public.avaliacao_id_seq'::regclass);


--
-- Name: avaliacao_laboratorio id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao_laboratorio ALTER COLUMN id SET DEFAULT nextval('public.avaliacao_laboratorio_id_seq'::regclass);


--
-- Name: broadcast_history id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.broadcast_history ALTER COLUMN id SET DEFAULT nextval('public.broadcast_history_id_seq'::regclass);


--
-- Name: disciplina id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.disciplina ALTER COLUMN id SET DEFAULT nextval('public.disciplina_id_seq'::regclass);


--
-- Name: laboratorio id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.laboratorio ALTER COLUMN id SET DEFAULT nextval('public.laboratorio_id_seq'::regclass);


--
-- Name: laboratorio_conjuntos id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.laboratorio_conjuntos ALTER COLUMN id SET DEFAULT nextval('public.laboratorio_conjuntos_id_seq'::regclass);


--
-- Name: login_attempts id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_attempts ALTER COLUMN id SET DEFAULT nextval('public.login_attempts_id_seq'::regclass);


--
-- Name: login_secreto id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_secreto ALTER COLUMN id SET DEFAULT nextval('public.login_secreto_id_seq'::regclass);


--
-- Name: modulo id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.modulo ALTER COLUMN id SET DEFAULT nextval('public.modulo_id_seq'::regclass);


--
-- Name: notificacoes_avaliacao id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.notificacoes_avaliacao ALTER COLUMN id SET DEFAULT nextval('public.notificacoes_avaliacao_id_seq'::regclass);


--
-- Name: professor id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.professor ALTER COLUMN id SET DEFAULT nextval('public.professor_id_seq'::regclass);


--
-- Name: situacao_aval id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.situacao_aval ALTER COLUMN id SET DEFAULT nextval('public.situacao_aval_id_seq'::regclass);


--
-- Name: tipo_aval id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.tipo_aval ALTER COLUMN id SET DEFAULT nextval('public.tipo_aval_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: avaliacao; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.avaliacao (id, situacao, tipo, data, horario_ini, horario_fim, qtd_alunos, caip, modulo_id, disciplina_id, professor_id, qtd_objetiva, qtd_discursiva, updated_at, visivel, delete_logico) FROM stdin;
4	Finalizada	Avaliação Sequencial 1	2025-03-12	15:40:00	17:40:00	65	f	10	4	4	27	3	2025-05-17 15:56:40	t	f
6	Finalizada	1ª PROVA MULTIDISCIPLINAR	2025-03-12	14:00:00	15:30:00	61	f	4	6	6	30	0	2025-05-17 15:56:40	t	f
8	Finalizada	1ª PROVA MULTIDISCIPLINAR	2025-03-12	14:00:00	15:30:00	53	t	6	8	8	30	0	2025-05-17 15:56:40	t	f
9	Finalizada	1ª PROVA MULTIDISCIPLINAR	2025-03-12	14:00:00	15:30:00	54	f	7	9	9	30	0	2025-05-17 15:56:40	t	f
10	Finalizada	Avaliação Sequencial 1	2025-03-13	08:30:00	10:30:00	68	t	9	10	10	26	4	2025-05-17 15:56:40	t	f
11	Finalizada	Avaliação Escrita 1	2025-03-14	13:30:00	15:45:00	66	t	11	11	1	27	3	2025-05-17 15:56:40	t	f
12	Finalizada	Avaliação Sequencial 1	2025-03-20	13:30:00	15:30:00	60	t	8	12	11	27	3	2025-05-17 15:56:40	t	f
13	Finalizada	Formativa 2	2025-03-21	13:30:00	15:30:00	69	f	1	1	1	27	3	2025-05-17 15:56:40	t	f
14	Finalizada	Formativa 2	2025-03-27	14:00:00	16:00:00	66	t	2	2	2	27	3	2025-05-17 15:56:40	t	f
15	Finalizada	Avaliação Sequencial 1	2025-03-31	08:00:00	10:00:00	68	t	9	13	12	27	3	2025-05-17 15:56:40	t	f
16	Finalizada	1ª AVD	2025-03-31	14:00:00	16:15:00	68	t	12	14	13	13	2	2025-05-17 15:56:40	t	f
17	Finalizada	Somativa 1	2025-04-01	08:30:00	10:30:00	69	f	1	1	1	27	3	2025-05-17 15:56:40	t	f
18	Finalizada	Somativa 1	2025-04-01	08:30:00	11:30:00	65	t	3	5	5	32	3	2025-05-17 15:56:40	t	f
19	Julgamento de Recurso	Avaliação Sequencial 1	2025-04-02	08:00:00	09:40:00	66	t	11	15	14	16	2	2025-05-17 15:56:40	t	f
20	Julgamento de Recurso	Prova 1	2025-04-03	08:00:00	10:00:00	68	t	12	16	15	\N	\N	2025-05-17 15:56:40	t	f
21	Finalizada	Avaliação Sequencial 2	2025-04-07	08:00:00	09:40:00	65	f	10	3	3	27	3	2025-05-17 15:56:40	t	f
22	Finalizada	AVD 1	2025-04-08	08:00:00	09:40:00	68	t	9	17	16	16	2	2025-05-17 15:56:40	t	f
23	Finalizada	Avaliação Sequencial 1	2025-04-09	10:00:00	12:00:00	66	t	11	18	17	27	3	2025-05-17 15:56:40	t	f
24	Julgamento de Recurso	Avaliação Escrita 1	2025-04-09	08:00:00	09:40:00	68	t	12	19	18	27	3	2025-05-17 15:56:40	t	f
25	Julgamento de Recurso	Somativa 1	2025-04-10	13:30:00	15:30:00	66	t	2	2	2	27	3	2025-05-17 15:56:40	t	f
26	Finalizada	Avaliação Escrita 1	2025-04-15	10:00:00	11:40:00	65	f	10	20	19	10	3	2025-05-17 15:56:40	t	f
27	Finalizada	Avaliação Sequencial 1	2025-04-16	09:00:00	11:30:00	60	t	8	21	20	27	3	2025-05-17 15:56:40	t	f
28	Julgamento de Recurso	2ª PROVA MULTIDISCIPLINAR	2025-04-16	14:00:00	15:30:00	61	f	4	6	6	30	0	2025-05-17 15:56:40	t	f
29	Julgamento de Recurso	2ª PROVA MULTIDISCIPLINAR	2025-04-16	13:30:00	15:00:00	63	f	5	7	7	30	0	2025-05-17 15:56:40	t	f
30	Julgamento de Recurso	2ª PROVA MULTIDISCIPLINAR	2025-04-16	13:30:00	15:00:00	53	t	6	8	8	30	0	2025-05-17 15:56:40	t	f
31	Julgamento de Recurso	2ª PROVA MULTIDISCIPLINAR	2025-04-16	13:30:00	15:00:00	54	f	7	9	9	30	0	2025-05-17 15:56:40	t	f
32	Finalizada	Avaliação Sequencial 2	2025-04-16	15:20:00	17:30:00	68	t	9	10	10	26	4	2025-05-17 15:56:40	t	f
33	Julgamento de Recurso	Avaliação Sequencial 2	2025-04-16	15:40:00	17:40:00	65	f	10	4	4	27	3	2025-05-17 15:56:40	t	f
34	Julgamento de Recurso	Avaliação Sequencial 2	2025-04-17	13:30:00	15:30:00	60	t	8	12	11	27	3	2025-05-17 15:56:40	t	f
35	Finalizada	Somativa 1 - Prova Especial	2025-04-17	15:30:00	17:00:00	1	f	3	5	5	27	3	2025-05-17 15:56:40	t	f
36	Julgamento de Recurso	Formativa 2	2025-04-29	08:30:00	10:30:00	65	t	3	5	5	27	3	2025-05-17 15:56:40	t	f
37	Recursos	PROVA MÓDULO	2025-04-30	13:30:00	15:00:00	54	f	7	9	9	10	0	2025-05-17 15:56:40	t	f
38	PARAMETRIZADA	3ª PROVA MULTIDISCIPLINAR	2025-05-07	14:00:00	15:30:00	61	f	4	6	6	30	0	2025-05-17 15:56:40	t	f
39	PARAMETRIZADA	3ª PROVA MULTIDISCIPLINAR	2025-05-07	13:30:00	15:30:00	63	f	5	7	7	30	0	2025-05-17 15:56:40	t	f
40	PARAMETRIZADA	3ª PROVA MULTIDISCIPLINAR	2025-05-07	13:30:00	15:30:00	53	t	6	8	8	30	0	2025-05-17 15:56:40	t	f
41	PARAMETRIZADA	3ª PROVA MULTIDISCIPLINAR	2025-05-07	13:30:00	15:30:00	54	f	7	9	9	30	0	2025-05-17 15:56:40	t	f
42	Gerada	Formativa 3	2025-05-13	08:30:00	10:30:00	69	f	1	1	1	27	3	2025-05-17 15:56:40	t	f
43	Gerada	Avaliação Sequencial 3	2025-05-14	14:00:00	16:30:00	68	t	9	10	10	27	3	2025-05-17 15:56:40	t	f
44	Gerada	Avaliação Sequencial 3	2025-05-14	15:00:00	17:00:00	65	f	10	4	4	27	3	2025-05-17 15:56:40	t	f
45	PARAMETRIZADA	Formativa 3	2025-05-15	14:00:00	16:00:00	66	t	2	2	2	27	3	2025-05-17 15:56:40	t	f
46	PARAMETRIZADA	Formativa 3	2025-05-19	08:30:00	10:30:00	65	t	3	5	5	27	3	2025-05-17 15:56:40	t	f
47	PARAMETRIZADA	Avaliação Sequencial 3	2025-05-23	09:20:00	11:20:00	60	t	8	12	11	27	3	2025-05-17 15:56:40	t	f
48	PARAMETRIZADA	Prova 2	2025-05-26	10:00:00	11:00:00	68	t	12	14	13	13	2	2025-05-17 15:56:40	t	f
49	PARAMETRIZADA	PROVA MÓDULO	2025-05-28	15:00:00	16:30:00	64	f	4	6	6	20	0	2025-05-17 15:56:40	t	f
50	PARAMETRIZADA	PROVA MÓDULO	2025-05-29	14:00:00	15:30:00	63	f	5	7	7	30	0	2025-05-17 15:56:40	t	f
51	CONFIRMAR	Avaliação Teórica 2	2025-06-02	\N	\N	\N	f	10	3	3	\N	\N	2025-05-17 15:56:40	t	f
52		AVD 2	2025-06-03	08:00:00	09:40:00	68	t	9	17	16	16	2	2025-05-17 15:56:40	t	f
53		Avaliação Sequencial 4	2025-06-05	15:00:00	17:00:00	65	f	10	4	4	27	3	2025-05-17 15:56:40	t	f
54		Somativa 2	2025-06-05	14:00:00	16:00:00	66	t	2	2	2	27	3	2025-05-17 15:56:40	t	f
55		2ª CHAMADA (PROVA MÓDULO)	2025-06-05	14:00:00	15:30:00	63	f	5	7	7	30	\N	2025-05-17 15:56:40	t	f
56		Avaliação Escrita 2	2025-06-06	13:30:00	15:30:00	66	t	11	11	1	27	3	2025-05-17 15:56:40	t	f
57		Avaliação Sequencial 2	2025-06-09	09:00:00	11:30:00	68	t	9	13	12	\N	\N	2025-05-17 15:56:40	t	f
58		Avaliação Substitutiva	2025-06-09	\N	\N	68	t	12	14	13	\N	\N	2025-05-17 15:56:40	t	f
59		Somativa 2	2025-06-10	08:30:00	10:30:00	69	f	1	1	1	\N	\N	2025-05-17 15:56:40	t	f
60		Prova 2	2025-06-10	13:00:00	15:00:00	68	t	12	16	15	\N	\N	2025-05-17 15:56:40	t	f
61		Avaliação Sequencial 2	2025-06-11	08:00:00	09:40:00	66	t	11	15	14	16	2	2025-05-17 15:56:40	t	f
62		Avaliação Sequencial 2	2025-06-11	09:00:00	11:30:00	60	t	8	21	20	27	3	2025-05-17 15:56:40	t	f
7	Finalizada	1ª PROVA MULTIDISCIPLINAR	2025-03-12	14:00:00	15:30:00	63	f	5	7	7	30	0	2025-05-17 15:56:40	t	f
5	Finalizada	Formativa 1	2025-03-12	08:30:00	10:30:00	65	t	3	5	5	27	3	2025-05-17 15:56:40	t	f
63		Avaliação Escrita 2	2025-06-11	13:30:00	16:30:00	68	t	12	19	18	\N	\N	2025-05-17 15:56:00	t	f
64		Avaliação Sequencial 4	2025-06-12	08:30:00	11:00:00	68	t	9	10	10	26	4	2025-05-17 15:56:40	t	f
65		Avaliação Sequencial 4	2025-06-12	13:30:00	15:30:00	60	t	8	12	11	27	3	2025-05-17 15:56:40	t	f
66		Segunda Chamada	2025-06-12	\N	\N	66	t	2	2	2	\N	\N	2025-05-17 15:56:40	t	f
67		Avaliação Substitutiva (Sequencial)	2025-06-16	13:30:00	15:30:00	65	f	10	4	4	27	3	2025-05-17 15:56:40	t	f
68	PARAMETRIZADA	Avaliação Sequencial 3	2025-06-16	08:00:00	09:40:00	65	f	10	3	3	27	3	2025-05-17 15:56:40	t	f
69		Segunda Chamada	2025-06-16	13:30:00	15:30:00	69	f	1	1	1	\N	\N	2025-05-17 15:56:40	t	f
70		Prova Final	2025-06-17	\N	\N	66	t	2	2	2	\N	\N	2025-05-17 15:56:40	t	f
71		Somativa 2	2025-06-17	08:30:00	10:30:00	65	t	3	5	5	32	3	2025-05-17 15:56:40	t	f
72		Prova Final	2025-06-17	08:30:00	10:30:00	69	f	1	1	1	\N	\N	2025-05-17 15:56:40	t	f
73	PARAMETRIZADA	Avaliação Sequencial 2	2025-06-18	10:00:00	12:00:00	66	t	11	18	17	30	3	2025-05-17 15:56:40	t	f
74		Avaliação Escrita Substitutiva	2025-06-18	08:00:00	09:40:00	68	t	12	19	18	\N	\N	2025-05-17 15:56:40	t	f
75		Avaliação Substitutiva	2025-06-23	09:00:00	11:30:00	68	t	9	13	12	\N	\N	2025-05-17 15:56:40	t	f
76		Avaliação Escrita Substitutiva	2025-06-23	13:30:00	15:30:00	66	t	11	11	1	27	3	2025-05-17 15:56:40	t	f
77		Avaliação Escrita 2	2025-06-24	10:00:00	11:40:00	65	f	10	20	19	\N	\N	2025-05-17 15:56:40	t	f
78		Avaliação Sequencial Substitutiva	2025-06-25	09:00:00	11:30:00	60	t	8	21	20	27	3	2025-05-17 15:56:40	t	f
79		Avaliação Teórica	2025-06-26	\N	\N	\N	f	8	12	11	\N	\N	2025-05-17 15:56:40	t	f
80		Avaliação Substitutiva	2025-06-26	\N	\N	68	t	12	16	15	\N	\N	2025-05-17 15:56:40	t	f
81		Avaliação Substitutiva	2025-06-26	13:30:00	15:30:00	60	t	8	12	11	27	3	2025-05-17 15:56:40	t	f
82	PARAMETRIZADA	Avaliação Substitutiva (Sequencial)	2025-06-27	13:30:00	15:10:00	65	f	10	3	3	27	3	2025-05-17 15:56:40	t	f
83		Avaliação Substitutiva	2025-07-01	08:00:00	09:40:00	68	t	9	17	16	16	2	2025-05-17 15:56:40	t	f
84		Avaliação Escrita Substitutiva	2025-07-01	10:00:00	11:40:00	65	f	10	20	19	\N	\N	2025-05-17 15:56:40	t	f
85		Avaliação Substitutiva (Sequencial)	2025-07-02	14:00:00	16:30:00	68	t	9	10	10	26	4	2025-05-17 15:56:40	t	f
86		Avaliação Substitutiva (Sequencial)	2025-07-02	08:00:00	09:40:00	66	t	11	15	14	16	2	2025-05-17 15:56:40	t	f
87		Avaliação Substitutiva	2025-07-02	10:00:00	12:00:00	66	t	11	18	17	30	3	2025-05-17 15:56:40	t	f
88		Segunda Chamada	2025-07-02	08:30:00	10:30:00	65	t	3	5	5	27	3	2025-05-17 15:56:40	t	f
89	Parametrizada - Avalia	Prova Final	2025-07-04	08:30:00	10:30:00	65	t	3	5	5	\N	\N	2025-05-17 16:14:17	t	f
90		2ª CHAMADA (PROVA MÓDULO)	\N	\N	\N	64	f	4	6	6	\N	\N	2025-05-17 15:56:40	t	f
91		2ª CHAMADA (MULTIDISCIPLINAR)	\N	\N	\N	64	f	4	6	6	30	0	2025-05-17 15:56:40	t	f
92		2ª CHAMADA (MULTIDISCIPLINAR)	\N	\N	\N	63	f	5	7	7	30	0	2025-05-17 15:56:40	t	f
93		2ª CHAMADA (MULTIDISCIPLINAR)	\N	\N	\N	53	t	6	8	8	30	0	2025-05-17 15:56:40	t	f
94		PROVA MÓDULO	\N	\N	\N	53	t	6	8	8	\N	\N	2025-05-17 15:56:40	t	f
95		2ª CHAMADA (PROVA MÓDULO)	\N	\N	\N	53	t	6	8	8	\N	\N	2025-05-17 15:56:40	t	f
96		2ª CHAMADA (MULTIDISCIPLINAR)	\N	\N	\N	54	f	7	9	9	\N	\N	2025-05-17 15:56:40	t	f
97		2ª CHAMADA (PROVA MÓDULO)	\N	\N	\N	54	f	7	9	9	30	0	2025-05-17 15:56:40	t	f
2	Finalizada	Formativa 1	2025-03-07	08:30:00	10:30:00	66	t	2	2	2	27	3	2025-05-17 15:56:40	t	t
3	Finalizada	Avaliação Sequencial 1	2025-03-10	08:00:00	09:40:00	65	f	10	3	3	27	3	2025-05-17 15:56:40	t	f
1	Finalizada	Formativa 1	2025-02-25	08:30:00	10:30:00	69	f	1	1	1	27	3	2025-05-20 16:49:53	t	f
\.


--
-- Data for Name: avaliacao_laboratorio; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.avaliacao_laboratorio (id, avaliacao_id, conjunto_id) FROM stdin;
6	2	7
11	3	1
15	4	1
20	5	1
24	6	2
28	7	3
35	9	1
40	10	2
44	11	7
49	12	7
54	13	4
59	14	7
64	15	4
69	16	4
74	17	5
79	18	4
84	19	7
89	20	4
94	21	1
98	22	7
103	23	7
108	24	5
113	25	7
118	26	1
122	27	7
127	28	1
131	29	3
135	30	8
138	31	2
142	32	4
147	33	1
151	34	7
156	36	7
161	37	1
165	38	2
169	39	1
173	40	3
178	41	6
180	42	4
185	43	9
191	44	1
195	45	7
200	46	7
205	47	7
210	48	9
216	49	1
220	50	1
224	52	9
230	53	4
235	54	7
240	55	3
244	56	7
249	57	9
255	59	4
260	60	9
266	61	7
271	62	6
276	63	9
282	64	9
288	65	7
293	67	1
297	68	1
305	69	4
306	71	7
311	72	4
316	73	7
321	74	9
327	75	9
333	76	7
338	77	1
342	78	7
347	80	10
352	81	7
356	82	1
362	83	9
366	84	1
372	85	9
377	86	7
382	87	7
388	88	9
398	89	9
400	1	6
\.


--
-- Data for Name: broadcast_history; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.broadcast_history (id, message, groups, sent_at) FROM stdin;
\.


--
-- Data for Name: chatbot_config; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.chatbot_config (setting, value, updated_at) FROM stdin;
notifications_enabled	0	2025-10-14 16:55:48.524891
menu_enabled	0	2025-10-14 16:57:40.912301
auto_replies_enabled	0	2025-10-14 16:58:05.88737
connection_status	0	2025-10-14 16:58:13.668503
messages_sent_today	15	2025-10-14 16:58:13.670181
messages_received_today	20	2025-10-14 16:58:13.670542
\.


--
-- Data for Name: chatbot_users; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.chatbot_users (phone_number, subscribed, created_at) FROM stdin;
5521994656295@c.us	t	2025-05-20 16:04:34
5524988153895@c.us	t	2025-05-19 11:08:33
5524988291234@c.us	t	2025-05-20 16:46:52
5524993017797@c.us	t	2025-05-20 16:15:20
5524998182897@c.us	t	2025-05-20 16:18:27
5524998321147@c.us	t	2025-05-17 19:27:40
5524998484441@c.us	t	2025-05-19 10:37:16
5524998694227@c.us	t	2025-05-17 20:26:46
5524999322452@c.us	t	2025-05-19 10:45:50
5524999393026@c.us	t	2025-05-19 11:31:28
5524999642496@c.us	t	2025-05-19 10:51:51
5524999938235@c.us	t	2025-05-20 17:17:59
553591800057@c.us	t	2025-05-20 16:05:36
5524998837188@c.us	t	2025-05-17 16:07:32
5524981111523@c.us	t	2025-08-08 15:30:43.021431
5524999042169@c.us	t	2025-09-01 11:03:34.048277
\.


--
-- Data for Name: disciplina; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.disciplina (id, descricao, modulo_id, professor_id) FROM stdin;
1	Cuidados Elementares em Saúde e Doenças Prevalentes	1	1
2	Doenças Prevalentes e Queixas Comuns	2	2
3	Sistema Endócrino	10	3
4	Sistema Reprodutivo	10	4
5	Doenças Crônicas	3	5
6	Internato I - Saúde do Adulto e do Idoso	4	6
7	Internato II - Saúde da Criança e do Adolescente	5	7
8	Internato III - Saúde da Mulher	6	8
9	Internato IV - Doente Cirúrgico, Urgência e Emergência	7	9
10	Sistema Respiratório	9	10
11	Sistema Hematopoiético	11	1
12	Sistema Cardiovascular	8	11
13	Sistema Renal	9	12
14	Saúde Mental	12	13
15	Segurança do Paciente	11	14
16	Sentidos Especiais	12	15
17	O Médico Cuidador	9	16
18	Sistema Digestivo	11	17
19	Sistema Nervoso	12	18
20	O Médico Educador	10	19
21	Ser Médico	8	20
\.


--
-- Data for Name: laboratorio; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.laboratorio (id, nome, predio, qtd_com, qtd_sem) FROM stdin;
1	Lab 01	P4	22	33
2	Lab 02	P4	8	16
3	Lab 03	P4	10	20
4	Lab 04	P4	22	33
5	Lab 06	P4	12	20
6	Lab 07	P4	8	16
7	Lab 08	P4	20	20
8	Lab 09	P4	20	20
9	Lab 10	P4	16	24
10	Lab 11	P4	18	32
11	Lab 12	P4	16	28
12	Lab 13	P14	16	29
13	Lab 14	P14	20	30
14	Lab 15	P18	28	42
15	Lab 16	P18	20	40
16	Lab 17	P18	12	24
17	Lab 18	P18	12	24
18	Lab 19	P18	20	40
\.


--
-- Data for Name: laboratorio_conjuntos; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.laboratorio_conjuntos (id, nome, qtd_com_total, qtd_sem_total) FROM stdin;
1	Labs 9, 10, 11, 12	72	66
2	Labs 1, 2, 3, 4	80	62
3	Labs 16, 17 ,18, 19	68	70
4	Labs 1, 2, 3, 4, 6	68	70
5	Labs 15, 16, 17 ,18, 19	68	80
6	Labs 16, 17, 18, 19, 14 (CAIP)	48	70
7	Labs 9, 10, 11, 12, 14 (CAIP)	66	66
8	Labs 13, 14, 6 (CAIP)	72	72
9	Labs 1, 2, 3, 4, 6, 14 (CAIP)	70	70
10	A definir	0	0
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.login_attempts (id, usuario_id, ip, attempt_count, block_count, block_until, is_permanently_blocked, created_at, updated_at) FROM stdin;
2	1	200.9.143.127, 172.70.140.101, 10.214.172.197	0	0	\N	f	2025-05-24 13:30:07.266153	2025-05-24 13:30:07.266153
3	1	200.9.143.127, 172.69.91.15, 10.214.11.1	0	0	\N	f	2025-05-24 16:06:46.774597	2025-05-24 16:06:46.774597
4	1	200.9.143.127, 172.68.175.114, 10.214.11.1	0	0	\N	f	2025-05-24 19:08:08.159571	2025-05-24 19:08:08.159571
5	1	189.84.181.65, 172.68.174.175, 10.214.11.1	0	0	\N	f	2025-05-25 00:54:48.155952	2025-05-25 00:54:48.155952
6	1	189.84.181.65, 172.69.114.58, 10.214.4.110	0	0	\N	f	2025-05-25 10:07:28.346487	2025-05-25 10:07:28.346487
7	1	189.84.181.65, 172.68.175.36, 10.214.177.88	0	0	\N	f	2025-05-25 14:31:09.293592	2025-05-25 14:31:09.293592
8	1	189.84.181.65, 172.68.174.90, 10.214.11.1	0	0	\N	f	2025-05-25 14:32:39.126415	2025-05-25 14:32:39.126415
9	1	200.9.143.127, 172.68.175.45, 10.214.76.119	0	0	\N	f	2025-05-26 16:22:22.040117	2025-05-26 16:22:22.040117
10	1	::ffff:192.168.4.181	0	0	\N	f	2025-08-11 12:36:53.405651	2025-08-11 12:36:53.405651
11	1	::ffff:192.168.12.12	0	0	\N	f	2025-08-15 18:19:51.262528	2025-08-15 18:19:51.262528
12	1	::ffff:192.168.12.39	0	0	\N	f	2025-08-15 18:42:03.318979	2025-08-15 18:42:03.318979
1	1	::1	0	0	\N	f	2025-05-20 19:54:02	2025-05-20 21:44:32
13	1	189.84.176.78, 172.69.90.238, 10.23.193.130	0	0	\N	f	2026-03-13 14:49:32.613858	2026-03-13 14:49:32.613858
14	1	200.9.143.112, 172.71.147.233, 10.23.197.196	0	0	\N	f	2026-03-13 22:14:16.993028	2026-03-13 22:14:16.993028
15	1	189.84.176.78, 172.68.175.42, 10.17.184.136	0	0	\N	f	2026-03-15 15:28:09.22444	2026-03-15 15:28:09.22444
16	1	177.207.168.106, 172.71.146.50, 10.17.6.73	0	0	\N	f	2026-03-20 16:17:21.949299	2026-03-20 16:17:21.949299
17	1	177.207.168.106, 172.68.23.71, 10.19.182.12	1	0	\N	f	2026-03-20 16:22:13.037891	2026-03-20 16:22:13.037891
18	1	177.207.168.106, 172.68.22.81, 10.22.114.194	1	0	\N	f	2026-03-20 16:35:32.116742	2026-03-20 16:35:32.116742
19	1	177.207.168.106, 172.69.90.238, 10.19.182.12	1	0	\N	f	2026-03-20 16:36:28.39197	2026-03-20 16:36:28.39197
20	1	200.9.143.127, 172.71.150.18, 10.22.114.194	0	0	\N	f	2026-03-23 23:05:22.463691	2026-03-23 23:05:22.463691
21	1	200.9.143.127, 172.68.23.109, 10.18.86.95	1	0	\N	f	2026-03-23 23:14:43.740755	2026-03-23 23:14:43.740755
22	1	200.9.143.127, 172.71.151.81, 10.18.86.95	0	0	\N	f	2026-03-23 23:15:07.537724	2026-03-23 23:15:07.537724
23	1	200.9.143.127, 172.69.90.239, 10.18.86.95	0	0	\N	f	2026-03-23 23:15:51.189194	2026-03-23 23:15:51.189194
24	1	200.9.143.119, 172.71.239.67, 10.17.6.73	1	0	\N	f	2026-03-23 23:16:43.278085	2026-03-23 23:16:43.278085
25	1	200.9.143.119, 172.71.239.68, 10.18.86.95	0	0	\N	f	2026-03-23 23:18:12.129155	2026-03-23 23:18:12.129155
26	1	138.94.131.177, 172.71.151.228, 10.22.114.194	1	0	\N	f	2026-03-24 02:38:13.106064	2026-03-24 02:38:13.106064
27	1	138.94.131.177, 172.71.150.73, 10.23.162.66	0	0	\N	f	2026-03-24 02:38:28.577477	2026-03-24 02:38:28.577477
28	1	138.94.131.177, 172.71.151.197, 10.23.162.66	0	0	\N	f	2026-03-24 02:39:44.291377	2026-03-24 02:39:44.291377
29	1	138.94.131.177, 172.71.150.81, 10.23.162.66	0	0	\N	f	2026-03-24 02:56:24.21093	2026-03-24 02:56:24.21093
30	1	138.94.131.177, 172.71.151.33, 10.18.86.95	0	0	\N	f	2026-03-24 02:59:10.658822	2026-03-24 02:59:10.658822
31	1	138.94.131.177, 172.71.150.205, 10.23.162.66	0	0	\N	f	2026-03-24 03:01:38.549052	2026-03-24 03:01:38.549052
\.


--
-- Data for Name: login_secreto; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.login_secreto (id, username, password) FROM stdin;
1	vladimir	$2b$10$taFBFPVKaS0cZ.V785tZq.3cWwztV6bVEVLQCL4HTPe7kSxOme1FS
2	202410456	$2b$10$bW.iRzB1GnBbPWLxap312eo3ivyoubIIZ3AQCPaRt4gTVODMob4yW
\.


--
-- Data for Name: modulo; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.modulo (id, nome) FROM stdin;
1	Módulo 6 (7147)
2	Módulo 7 (7148)
3	Módulo 8 (7149)
4	Módulo 9 (7150)
5	Módulo 10 (7151)
6	Módulo 11 (7152)
7	Módulo 12 (7153)
8	1º Período
9	2º Período
10	3º Período
11	4º Período
12	5º Período
\.


--
-- Data for Name: notificacoes_avaliacao; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.notificacoes_avaliacao (id, avaliacao_id, tipo_alteracao, created_at, enviada) FROM stdin;
1	89	UPDATE	2025-05-17 16:14:17	t
2	89	UPDATE	2025-05-17 21:47:40	t
3	1	UPDATE	2025-05-18 21:05:08	t
4	1	UPDATE	2025-05-20 16:49:53	t
\.


--
-- Data for Name: professor; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.professor (id, nome) FROM stdin;
1	Cristiane Cunha
2	Sérgio Ibanez
3	Tássio Huguenin
4	Arthur Villela
5	José Roberto Barroso
6	Luciana Oliveira
7	Luciano Costa
8	Ana Paula da Cunha
9	Alessandra Rafael
10	Bruno Martini
11	Thaís Ibanez
12	Alessandra Vargas
13	Gustavo Caetano
14	Geraldo Cardoso
15	Élba Ferrão
16	Márcia Dorcelina
17	Rosa Machado
18	Élder Sarmento
19	Bruna Casiraghi
20	Walkíria Soares
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.session (sid, sess, expire) FROM stdin;
RsQj7_WeEbQMYb5DlkJ9Qpr8NRIZEPx9	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:05:22.814Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}	2026-03-24 23:18:17
f_Nlu34P1AAqfxCAK_uJwzvrhHYaxvP3	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:15:07.904Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}	2026-03-24 23:18:45
GZNio-xxJwWiBbO7krd62teW2q7MMFCD	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-25T02:38:28.969Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}	2026-03-25 03:01:58
45t5yA69EhW-0sOlzTQxVxSh9Xbc7gf9	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:18:12.413Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}	2026-03-24 23:21:36
\.


--
-- Data for Name: situacao_aval; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.situacao_aval (id, situacao) FROM stdin;
1	Parametrizada - Avalia
2	Parametrizada - LXP
3	Gerada
4	Recursos
5	Julgamento de Recurso
6	Finalizada
7	Cancelada
8	Confirmar
\.


--
-- Data for Name: tipo_aval; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.tipo_aval (id, tipo) FROM stdin;
1	Formativa 1
2	Avaliação Sequencial 1
3	1ª PROVA MULTIDISCIPLINAR
4	Avaliação Escrita 1
5	Formativa 2
6	1ª AVD
7	Somativa 1
8	Prova 1
9	Avaliação Sequencial 2
10	AVD 1
11	2ª PROVA MULTIDISCIPLINAR
12	Somativa 1 - Prova Especial
13	PROVA MÓDULO
14	3ª PROVA MULTIDISCIPLINAR
15	Formativa 3
16	Avaliação Sequencial 3
17	Prova 2
18	Avaliação Teórica 2
19	AVD 2
20	Avaliação Sequencial 4
21	Somativa 2
22	2ª CHAMADA (PROVA MÓDULO)
23	Avaliação Escrita 2
24	Avaliação Substitutiva
25	Segunda Chamada
26	Avaliação Substitutiva (Sequencial)
27	Prova Final
28	Avaliação Escrita Substitutiva
29	Avaliação Sequencial Substitutiva
30	Avaliação Teórica
31	2ª CHAMADA (MULTIDISCIPLINAR)
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: foa_med_hp7z_user
--

COPY public.usuarios (id, nome, username, password) FROM stdin;
1	Administrador	admin	$2b$10$7r67llYzsk2qUL6Aq5sI2OhJcmu1zMjMnkavCvmQASmtgL/fT7uJm
\.


--
-- Name: avaliacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.avaliacao_id_seq', 97, true);


--
-- Name: avaliacao_laboratorio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.avaliacao_laboratorio_id_seq', 400, true);


--
-- Name: broadcast_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.broadcast_history_id_seq', 1, false);


--
-- Name: disciplina_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.disciplina_id_seq', 21, true);


--
-- Name: laboratorio_conjuntos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.laboratorio_conjuntos_id_seq', 10, true);


--
-- Name: laboratorio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.laboratorio_id_seq', 18, true);


--
-- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.login_attempts_id_seq', 31, true);


--
-- Name: login_secreto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.login_secreto_id_seq', 2, true);


--
-- Name: modulo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.modulo_id_seq', 12, true);


--
-- Name: notificacoes_avaliacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.notificacoes_avaliacao_id_seq', 4, true);


--
-- Name: professor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.professor_id_seq', 20, true);


--
-- Name: situacao_aval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.situacao_aval_id_seq', 8, true);


--
-- Name: tipo_aval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.tipo_aval_id_seq', 31, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: foa_med_hp7z_user
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 27, true);


--
-- Name: avaliacao_laboratorio avaliacao_laboratorio_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao_laboratorio
    ADD CONSTRAINT avaliacao_laboratorio_pkey PRIMARY KEY (id);


--
-- Name: avaliacao avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT avaliacao_pkey PRIMARY KEY (id);


--
-- Name: broadcast_history broadcast_history_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.broadcast_history
    ADD CONSTRAINT broadcast_history_pkey PRIMARY KEY (id);


--
-- Name: chatbot_config chatbot_config_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.chatbot_config
    ADD CONSTRAINT chatbot_config_pkey PRIMARY KEY (setting);


--
-- Name: chatbot_users chatbot_users_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.chatbot_users
    ADD CONSTRAINT chatbot_users_pkey PRIMARY KEY (phone_number);


--
-- Name: disciplina disciplina_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.disciplina
    ADD CONSTRAINT disciplina_pkey PRIMARY KEY (id);


--
-- Name: laboratorio_conjuntos laboratorio_conjuntos_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.laboratorio_conjuntos
    ADD CONSTRAINT laboratorio_conjuntos_pkey PRIMARY KEY (id);


--
-- Name: laboratorio laboratorio_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.laboratorio
    ADD CONSTRAINT laboratorio_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: login_secreto login_secreto_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_secreto
    ADD CONSTRAINT login_secreto_pkey PRIMARY KEY (id);


--
-- Name: login_secreto login_secreto_username_key; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_secreto
    ADD CONSTRAINT login_secreto_username_key UNIQUE (username);


--
-- Name: modulo modulo_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_pkey PRIMARY KEY (id);


--
-- Name: notificacoes_avaliacao notificacoes_avaliacao_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.notificacoes_avaliacao
    ADD CONSTRAINT notificacoes_avaliacao_pkey PRIMARY KEY (id);


--
-- Name: professor professor_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.professor
    ADD CONSTRAINT professor_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: situacao_aval situacao_aval_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.situacao_aval
    ADD CONSTRAINT situacao_aval_pkey PRIMARY KEY (id);


--
-- Name: tipo_aval tipo_aval_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.tipo_aval
    ADD CONSTRAINT tipo_aval_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- Name: avaliacao fk_avaliacao_disciplina; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_disciplina FOREIGN KEY (disciplina_id) REFERENCES public.disciplina(id);


--
-- Name: avaliacao_laboratorio fk_avaliacao_laboratorio_conjunto; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao_laboratorio
    ADD CONSTRAINT fk_avaliacao_laboratorio_conjunto FOREIGN KEY (conjunto_id) REFERENCES public.laboratorio_conjuntos(id);


--
-- Name: avaliacao fk_avaliacao_modulo; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_modulo FOREIGN KEY (modulo_id) REFERENCES public.modulo(id);


--
-- Name: avaliacao fk_avaliacao_professor; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.avaliacao
    ADD CONSTRAINT fk_avaliacao_professor FOREIGN KEY (professor_id) REFERENCES public.professor(id);


--
-- Name: disciplina fk_disciplina_modulo; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.disciplina
    ADD CONSTRAINT fk_disciplina_modulo FOREIGN KEY (modulo_id) REFERENCES public.modulo(id);


--
-- Name: disciplina fk_disciplina_professor; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.disciplina
    ADD CONSTRAINT fk_disciplina_professor FOREIGN KEY (professor_id) REFERENCES public.professor(id);


--
-- Name: login_attempts fk_login_attempts_usuario; Type: FK CONSTRAINT; Schema: public; Owner: foa_med_hp7z_user
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT fk_login_attempts_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Objetos gerenciais e estrategicos do projeto FOA Med
--

--
-- Name: alertas_gerenciais; Type: TABLE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE TABLE IF NOT EXISTS public.alertas_gerenciais (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    origem character varying(50) NOT NULL,
    referencia_id integer,
    severidade character varying(20) NOT NULL,
    mensagem text NOT NULL,
    status character varying(20) DEFAULT 'ABERTO'::character varying NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb NOT NULL,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolvido_em timestamp without time zone,
    CONSTRAINT alertas_gerenciais_severidade_check CHECK (((severidade)::text = ANY (ARRAY['BAIXO'::text, 'MEDIO'::text, 'ALTO'::text, 'CRITICO'::text]))),
    CONSTRAINT alertas_gerenciais_status_check CHECK (((status)::text = ANY (ARRAY['ABERTO'::text, 'EM_ANALISE'::text, 'RESOLVIDO'::text, 'IGNORADO'::text])))
);


ALTER TABLE public.alertas_gerenciais OWNER TO foa_med_hp7z_user;

CREATE INDEX IF NOT EXISTS idx_alertas_gerenciais_status
    ON public.alertas_gerenciais USING btree (status, severidade, criado_em);

CREATE INDEX IF NOT EXISTS idx_alertas_gerenciais_origem_referencia
    ON public.alertas_gerenciais USING btree (origem, referencia_id);

COMMENT ON TABLE public.alertas_gerenciais IS 'Tabela alimentada por triggers para consultas gerenciais de risco, prazo, seguranca e mudancas criticas.';


--
-- Name: fn_capacidade_conjunto(integer, boolean); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_capacidade_conjunto(
    p_conjunto_id integer,
    p_caip boolean
) RETURNS integer
    LANGUAGE sql
    STABLE
AS $$
    SELECT CASE
        WHEN COALESCE(p_caip, false) THEN lc.qtd_com_total
        ELSE lc.qtd_sem_total
    END
    FROM public.laboratorio_conjuntos lc
    WHERE lc.id = p_conjunto_id;
$$;


ALTER FUNCTION public.fn_capacidade_conjunto(integer, boolean) OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_capacidade_conjunto(integer, boolean) IS 'UDF gerencial: retorna a capacidade operacional do conjunto de laboratorios conforme uso de CAIP.';


--
-- Name: fn_calcular_taxa_ocupacao(integer, integer); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_calcular_taxa_ocupacao(
    p_qtd_alunos integer,
    p_capacidade integer
) RETURNS numeric(7,2)
    LANGUAGE sql
    IMMUTABLE
AS $$
    SELECT CASE
        WHEN COALESCE(p_capacidade, 0) <= 0 THEN NULL::numeric(7,2)
        ELSE ROUND(((COALESCE(p_qtd_alunos, 0)::numeric / p_capacidade::numeric) * 100), 2)::numeric(7,2)
    END;
$$;


ALTER FUNCTION public.fn_calcular_taxa_ocupacao(integer, integer) OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_calcular_taxa_ocupacao(integer, integer) IS 'UDF gerencial: calcula percentual de ocupacao para apoiar decisoes de alocacao de laboratorio.';


--
-- Name: fn_classificar_risco_avaliacao(date, time without time zone, time without time zone, integer, integer, integer, character varying, boolean); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_classificar_risco_avaliacao(
    p_data date,
    p_horario_ini time without time zone,
    p_horario_fim time without time zone,
    p_qtd_alunos integer,
    p_qtd_objetiva integer,
    p_qtd_discursiva integer,
    p_situacao character varying,
    p_delete_logico boolean
) RETURNS character varying
    LANGUAGE plpgsql
    STABLE
AS $$
DECLARE
    v_dias_ate_avaliacao integer;
    v_situacao text;
BEGIN
    v_situacao := UPPER(BTRIM(COALESCE(p_situacao, '')));

    IF COALESCE(p_delete_logico, false) THEN
        RETURN 'INATIVA';
    END IF;

    IF p_data IS NULL THEN
        RETURN 'CRITICO';
    END IF;

    v_dias_ate_avaliacao := p_data - CURRENT_DATE;

    IF v_dias_ate_avaliacao BETWEEN 0 AND 7
       AND (
           p_horario_ini IS NULL
           OR p_horario_fim IS NULL
           OR p_qtd_alunos IS NULL
           OR (COALESCE(p_qtd_objetiva, 0) + COALESCE(p_qtd_discursiva, 0)) = 0
       ) THEN
        RETURN 'CRITICO';
    END IF;

    IF p_horario_ini IS NULL OR p_horario_fim IS NULL OR p_qtd_alunos IS NULL THEN
        RETURN 'ALTO';
    END IF;

    IF v_situacao IN ('', 'CONFIRMAR') THEN
        RETURN 'MEDIO';
    END IF;

    IF p_data >= CURRENT_DATE
       AND (COALESCE(p_qtd_objetiva, 0) + COALESCE(p_qtd_discursiva, 0)) = 0 THEN
        RETURN 'MEDIO';
    END IF;

    RETURN 'BAIXO';
END;
$$;


ALTER FUNCTION public.fn_classificar_risco_avaliacao(date, time without time zone, time without time zone, integer, integer, integer, character varying, boolean) OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_classificar_risco_avaliacao(date, time without time zone, time without time zone, integer, integer, integer, character varying, boolean) IS 'UDF estrategica: classifica risco de parametrizacao e execucao da avaliacao.';


--
-- Name: fn_indice_demanda_docente(integer, date, date); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_indice_demanda_docente(
    p_professor_id integer,
    p_data_inicio date,
    p_data_fim date
) RETURNS numeric(10,2)
    LANGUAGE sql
    STABLE
AS $$
    SELECT COALESCE(
        ROUND(SUM(
            1
            + CASE WHEN a.caip THEN 0.25 ELSE 0 END
            + (COALESCE(a.qtd_alunos, 0)::numeric / 100)
            + (COALESCE(EXTRACT(EPOCH FROM (a.horario_fim - a.horario_ini)) / 3600, 0)::numeric / 4)
        ), 2),
        0
    )::numeric(10,2)
    FROM public.avaliacao a
    WHERE a.professor_id = p_professor_id
      AND COALESCE(a.delete_logico, false) = false
      AND COALESCE(a.visivel, true) = true
      AND (p_data_inicio IS NULL OR a.data >= p_data_inicio)
      AND (p_data_fim IS NULL OR a.data <= p_data_fim);
$$;


ALTER FUNCTION public.fn_indice_demanda_docente(integer, date, date) OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_indice_demanda_docente(integer, date, date) IS 'UDF estrategica: calcula indice ponderado de demanda por professor no periodo informado.';


--
-- Name: vw_gerencial_avaliacoes_base; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_gerencial_avaliacoes_base AS
SELECT
    a.id AS avaliacao_id,
    a.data,
    a.horario_ini,
    a.horario_fim,
    CASE
        WHEN a.horario_ini IS NULL OR a.horario_fim IS NULL THEN NULL::integer
        ELSE ROUND((EXTRACT(EPOCH FROM (a.horario_fim - a.horario_ini)) / 60))::integer
    END AS duracao_minutos,
    NULLIF(BTRIM(COALESCE(a.situacao, '')), '') AS situacao,
    a.tipo,
    a.qtd_alunos,
    a.caip,
    a.qtd_objetiva,
    a.qtd_discursiva,
    COALESCE(a.qtd_objetiva, 0) + COALESCE(a.qtd_discursiva, 0) AS total_questoes,
    a.modulo_id,
    m.nome AS modulo,
    a.disciplina_id,
    d.descricao AS disciplina,
    a.professor_id,
    p.nome AS professor,
    al.conjunto_id,
    lc.nome AS conjunto_laboratorios,
    public.fn_capacidade_conjunto(al.conjunto_id, a.caip) AS capacidade_operacional,
    public.fn_calcular_taxa_ocupacao(a.qtd_alunos, public.fn_capacidade_conjunto(al.conjunto_id, a.caip)) AS taxa_ocupacao_pct,
    public.fn_classificar_risco_avaliacao(
        a.data,
        a.horario_ini,
        a.horario_fim,
        a.qtd_alunos,
        a.qtd_objetiva,
        a.qtd_discursiva,
        a.situacao,
        a.delete_logico
    ) AS risco_gerencial,
    a.updated_at
FROM public.avaliacao a
LEFT JOIN public.modulo m ON m.id = a.modulo_id
LEFT JOIN public.disciplina d ON d.id = a.disciplina_id
LEFT JOIN public.professor p ON p.id = a.professor_id
LEFT JOIN public.avaliacao_laboratorio al ON al.avaliacao_id = a.id
LEFT JOIN public.laboratorio_conjuntos lc ON lc.id = al.conjunto_id
WHERE COALESCE(a.delete_logico, false) = false
  AND COALESCE(a.visivel, true) = true;


ALTER VIEW public.vw_gerencial_avaliacoes_base OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_gerencial_avaliacoes_base IS 'View gerencial: base unica para consultas de agenda, carga, capacidade, docente e risco por avaliacao.';


--
-- Name: vw_estrategica_carga_modulo; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_estrategica_carga_modulo AS
SELECT
    b.modulo_id,
    b.modulo,
    COUNT(*) AS total_avaliacoes,
    COUNT(*) FILTER (WHERE b.caip) AS avaliacoes_caip,
    SUM(COALESCE(b.qtd_alunos, 0)) AS total_alunos_impactados,
    ROUND(AVG(b.taxa_ocupacao_pct), 2) AS ocupacao_media_pct,
    SUM(b.total_questoes) AS total_questoes_planejadas,
    COUNT(*) FILTER (WHERE b.risco_gerencial IN ('CRITICO', 'ALTO')) AS avaliacoes_em_risco,
    COUNT(*) FILTER (WHERE UPPER(COALESCE(b.situacao, '')) <> 'FINALIZADA') AS avaliacoes_nao_finalizadas,
    MIN(b.data) AS primeira_avaliacao,
    MAX(b.data) AS ultima_avaliacao
FROM public.vw_gerencial_avaliacoes_base b
GROUP BY b.modulo_id, b.modulo;


ALTER VIEW public.vw_estrategica_carga_modulo OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_estrategica_carga_modulo IS 'View estrategica: consulta carga academica, demanda discente e risco consolidado por modulo.';


--
-- Name: vw_gerencial_ocupacao_laboratorios; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_gerencial_ocupacao_laboratorios AS
SELECT
    b.conjunto_id,
    COALESCE(b.conjunto_laboratorios, 'Sem conjunto definido') AS conjunto_laboratorios,
    COUNT(*) AS total_agendamentos,
    SUM(COALESCE(b.qtd_alunos, 0)) AS total_alunos_previstos,
    ROUND(AVG(b.capacidade_operacional), 2) AS capacidade_media,
    ROUND(AVG(b.taxa_ocupacao_pct), 2) AS ocupacao_media_pct,
    MAX(b.taxa_ocupacao_pct) AS maior_ocupacao_pct,
    COUNT(*) FILTER (WHERE b.taxa_ocupacao_pct >= 90) AS agendamentos_acima_90_pct,
    COUNT(*) FILTER (WHERE b.risco_gerencial IN ('CRITICO', 'ALTO')) AS agendamentos_em_risco
FROM public.vw_gerencial_avaliacoes_base b
GROUP BY b.conjunto_id, COALESCE(b.conjunto_laboratorios, 'Sem conjunto definido');


ALTER VIEW public.vw_gerencial_ocupacao_laboratorios OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_gerencial_ocupacao_laboratorios IS 'View gerencial: consulta uso e pressao de capacidade por conjunto de laboratorios.';


--
-- Name: vw_estrategica_risco_parametrizacao; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_estrategica_risco_parametrizacao AS
SELECT
    b.avaliacao_id,
    b.data,
    b.modulo,
    b.disciplina,
    b.professor,
    b.tipo,
    b.situacao,
    b.qtd_alunos,
    b.horario_ini,
    b.horario_fim,
    b.total_questoes,
    b.conjunto_laboratorios,
    b.risco_gerencial,
    CASE b.risco_gerencial
        WHEN 'CRITICO' THEN 1
        WHEN 'ALTO' THEN 2
        WHEN 'MEDIO' THEN 3
        ELSE 4
    END AS prioridade
FROM public.vw_gerencial_avaliacoes_base b
WHERE b.risco_gerencial IN ('CRITICO', 'ALTO', 'MEDIO');


ALTER VIEW public.vw_estrategica_risco_parametrizacao OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_estrategica_risco_parametrizacao IS 'View estrategica: consulta avaliacoes que exigem decisao por risco de parametrizacao, prazo ou dados incompletos.';


--
-- Name: vw_gerencial_produtividade_docente; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_gerencial_produtividade_docente AS
SELECT
    b.professor_id,
    b.professor,
    COUNT(*) AS total_avaliacoes,
    COUNT(DISTINCT b.disciplina_id) AS disciplinas_atendidas,
    COUNT(DISTINCT b.modulo_id) AS modulos_atendidos,
    SUM(COALESCE(b.qtd_alunos, 0)) AS total_alunos_impactados,
    SUM(b.total_questoes) AS total_questoes_planejadas,
    ROUND(AVG(b.duracao_minutos), 2) AS duracao_media_minutos,
    public.fn_indice_demanda_docente(b.professor_id, NULL, NULL) AS indice_demanda_docente,
    COUNT(*) FILTER (WHERE b.risco_gerencial IN ('CRITICO', 'ALTO')) AS avaliacoes_em_risco
FROM public.vw_gerencial_avaliacoes_base b
GROUP BY b.professor_id, b.professor;


ALTER VIEW public.vw_gerencial_produtividade_docente OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_gerencial_produtividade_docente IS 'View gerencial: consulta demanda, produtividade e risco operacional por professor.';


--
-- Name: vw_gerencial_seguranca_acessos; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_gerencial_seguranca_acessos AS
SELECT
    la.usuario_id,
    u.username,
    u.nome AS usuario,
    date_trunc('month'::text, la.created_at)::date AS mes_referencia,
    COUNT(*) AS total_tentativas_registradas,
    SUM(COALESCE(la.attempt_count, 0)) AS total_falhas,
    SUM(COALESCE(la.block_count, 0)) AS total_bloqueios,
    COUNT(*) FILTER (WHERE COALESCE(la.is_permanently_blocked, false)) AS bloqueios_permanentes,
    MAX(la.updated_at) AS ultima_ocorrencia,
    CASE
        WHEN COUNT(*) FILTER (WHERE COALESCE(la.is_permanently_blocked, false)) > 0 THEN 'CRITICO'
        WHEN SUM(COALESCE(la.block_count, 0)) > 0 THEN 'ALTO'
        WHEN SUM(COALESCE(la.attempt_count, 0)) >= 3 THEN 'MEDIO'
        ELSE 'BAIXO'
    END AS risco_seguranca
FROM public.login_attempts la
LEFT JOIN public.usuarios u ON u.id = la.usuario_id
GROUP BY la.usuario_id, u.username, u.nome, date_trunc('month'::text, la.created_at)::date;


ALTER VIEW public.vw_gerencial_seguranca_acessos OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_gerencial_seguranca_acessos IS 'View gerencial: consulta exposicao de seguranca por usuario e mes.';


--
-- Name: vw_gerencial_alertas_ativos; Type: VIEW; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE VIEW public.vw_gerencial_alertas_ativos AS
SELECT
    ag.id,
    ag.origem,
    ag.referencia_id,
    ag.severidade,
    ag.mensagem,
    ag.status,
    ag.criado_em,
    ag.payload,
    b.data AS data_avaliacao,
    b.modulo,
    b.disciplina,
    b.professor,
    b.tipo AS tipo_avaliacao
FROM public.alertas_gerenciais ag
LEFT JOIN public.vw_gerencial_avaliacoes_base b ON b.avaliacao_id = ag.referencia_id
WHERE ag.status IN ('ABERTO', 'EM_ANALISE');


ALTER VIEW public.vw_gerencial_alertas_ativos OWNER TO foa_med_hp7z_user;

COMMENT ON VIEW public.vw_gerencial_alertas_ativos IS 'View gerencial: consulta alertas ativos gerados automaticamente por triggers.';


--
-- Name: sp_consultar_painel_modulo(date, date, refcursor); Type: PROCEDURE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE PROCEDURE public.sp_consultar_painel_modulo(
    IN p_data_inicio date DEFAULT NULL,
    IN p_data_fim date DEFAULT NULL,
    INOUT p_resultado refcursor DEFAULT 'painel_modulo'
)
    LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_resultado FOR
        SELECT
            b.modulo_id,
            b.modulo,
            COUNT(*) AS total_avaliacoes,
            SUM(COALESCE(b.qtd_alunos, 0)) AS total_alunos_impactados,
            ROUND(AVG(b.taxa_ocupacao_pct), 2) AS ocupacao_media_pct,
            COUNT(*) FILTER (WHERE b.risco_gerencial IN ('CRITICO', 'ALTO')) AS avaliacoes_em_risco,
            COUNT(*) FILTER (WHERE UPPER(COALESCE(b.situacao, '')) <> 'FINALIZADA') AS pendencias_de_fechamento
        FROM public.vw_gerencial_avaliacoes_base b
        WHERE (p_data_inicio IS NULL OR b.data >= p_data_inicio)
          AND (p_data_fim IS NULL OR b.data <= p_data_fim)
        GROUP BY b.modulo_id, b.modulo
        ORDER BY avaliacoes_em_risco DESC, total_alunos_impactados DESC, b.modulo;
END;
$$;


ALTER PROCEDURE public.sp_consultar_painel_modulo(date, date, refcursor) OWNER TO foa_med_hp7z_user;

COMMENT ON PROCEDURE public.sp_consultar_painel_modulo(date, date, refcursor) IS 'Stored Procedure estrategica: retorna painel executivo de modulo por periodo via refcursor.';


--
-- Name: sp_consultar_ocupacao_laboratorios(date, date, refcursor); Type: PROCEDURE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE PROCEDURE public.sp_consultar_ocupacao_laboratorios(
    IN p_data_inicio date DEFAULT NULL,
    IN p_data_fim date DEFAULT NULL,
    INOUT p_resultado refcursor DEFAULT 'ocupacao_laboratorios'
)
    LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_resultado FOR
        SELECT
            b.conjunto_id,
            COALESCE(b.conjunto_laboratorios, 'Sem conjunto definido') AS conjunto_laboratorios,
            COUNT(*) AS total_agendamentos,
            SUM(COALESCE(b.qtd_alunos, 0)) AS total_alunos_previstos,
            ROUND(AVG(b.capacidade_operacional), 2) AS capacidade_media,
            ROUND(AVG(b.taxa_ocupacao_pct), 2) AS ocupacao_media_pct,
            COUNT(*) FILTER (WHERE b.taxa_ocupacao_pct >= 90) AS agendamentos_acima_90_pct,
            COUNT(*) FILTER (WHERE b.capacidade_operacional IS NULL OR b.capacidade_operacional = 0) AS agendamentos_sem_capacidade
        FROM public.vw_gerencial_avaliacoes_base b
        WHERE (p_data_inicio IS NULL OR b.data >= p_data_inicio)
          AND (p_data_fim IS NULL OR b.data <= p_data_fim)
        GROUP BY b.conjunto_id, COALESCE(b.conjunto_laboratorios, 'Sem conjunto definido')
        ORDER BY agendamentos_acima_90_pct DESC, ocupacao_media_pct DESC NULLS LAST;
END;
$$;


ALTER PROCEDURE public.sp_consultar_ocupacao_laboratorios(date, date, refcursor) OWNER TO foa_med_hp7z_user;

COMMENT ON PROCEDURE public.sp_consultar_ocupacao_laboratorios(date, date, refcursor) IS 'Stored Procedure gerencial: retorna consulta de capacidade e ocupacao de laboratorios por periodo.';


--
-- Name: sp_consultar_riscos_avaliacoes(integer, refcursor); Type: PROCEDURE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE PROCEDURE public.sp_consultar_riscos_avaliacoes(
    IN p_dias_a_frente integer DEFAULT 30,
    INOUT p_resultado refcursor DEFAULT 'riscos_avaliacoes'
)
    LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_resultado FOR
        SELECT
            r.avaliacao_id,
            r.data,
            r.modulo,
            r.disciplina,
            r.professor,
            r.tipo,
            r.situacao,
            r.qtd_alunos,
            r.horario_ini,
            r.horario_fim,
            r.total_questoes,
            r.conjunto_laboratorios,
            r.risco_gerencial,
            r.prioridade
        FROM public.vw_estrategica_risco_parametrizacao r
        WHERE r.data IS NULL
           OR r.data BETWEEN CURRENT_DATE AND (CURRENT_DATE + COALESCE(p_dias_a_frente, 30))
        ORDER BY r.prioridade, r.data NULLS FIRST, r.modulo, r.disciplina;
END;
$$;


ALTER PROCEDURE public.sp_consultar_riscos_avaliacoes(integer, refcursor) OWNER TO foa_med_hp7z_user;

COMMENT ON PROCEDURE public.sp_consultar_riscos_avaliacoes(integer, refcursor) IS 'Stored Procedure estrategica: retorna fila priorizada de riscos de avaliacao para decisao gerencial.';


--
-- Name: sp_consultar_seguranca_acessos(date, date, refcursor); Type: PROCEDURE; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE PROCEDURE public.sp_consultar_seguranca_acessos(
    IN p_data_inicio date DEFAULT NULL,
    IN p_data_fim date DEFAULT NULL,
    INOUT p_resultado refcursor DEFAULT 'seguranca_acessos'
)
    LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_resultado FOR
        SELECT
            la.usuario_id,
            u.username,
            u.nome AS usuario,
            la.ip,
            COUNT(*) AS total_registros,
            SUM(COALESCE(la.attempt_count, 0)) AS total_falhas,
            SUM(COALESCE(la.block_count, 0)) AS total_bloqueios,
            BOOL_OR(COALESCE(la.is_permanently_blocked, false)) AS possui_bloqueio_permanente,
            MAX(la.updated_at) AS ultima_ocorrencia,
            CASE
                WHEN BOOL_OR(COALESCE(la.is_permanently_blocked, false)) THEN 'CRITICO'
                WHEN SUM(COALESCE(la.block_count, 0)) > 0 THEN 'ALTO'
                WHEN SUM(COALESCE(la.attempt_count, 0)) >= 3 THEN 'MEDIO'
                ELSE 'BAIXO'
            END AS risco_seguranca
        FROM public.login_attempts la
        LEFT JOIN public.usuarios u ON u.id = la.usuario_id
        WHERE (p_data_inicio IS NULL OR la.created_at::date >= p_data_inicio)
          AND (p_data_fim IS NULL OR la.created_at::date <= p_data_fim)
        GROUP BY la.usuario_id, u.username, u.nome, la.ip
        ORDER BY
            CASE
                WHEN BOOL_OR(COALESCE(la.is_permanently_blocked, false)) THEN 1
                WHEN SUM(COALESCE(la.block_count, 0)) > 0 THEN 2
                WHEN SUM(COALESCE(la.attempt_count, 0)) >= 3 THEN 3
                ELSE 4
            END,
            total_falhas DESC,
            ultima_ocorrencia DESC;
END;
$$;


ALTER PROCEDURE public.sp_consultar_seguranca_acessos(date, date, refcursor) OWNER TO foa_med_hp7z_user;

COMMENT ON PROCEDURE public.sp_consultar_seguranca_acessos(date, date, refcursor) IS 'Stored Procedure gerencial: retorna consulta de risco de acesso por usuario e IP.';


--
-- Name: fn_trg_alerta_avaliacao_gerencial(); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_trg_alerta_avaliacao_gerencial()
RETURNS trigger
    LANGUAGE plpgsql
AS $$
DECLARE
    v_avaliacao_id integer;
    v_tipo_alteracao character varying(10);
    v_risco character varying;
BEGIN
    v_avaliacao_id := COALESCE(NEW.id, OLD.id);

    IF TG_OP = 'INSERT' THEN
        v_tipo_alteracao := 'CREATE';
    ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND COALESCE(NEW.delete_logico, false) = true AND COALESCE(OLD.delete_logico, false) = false) THEN
        v_tipo_alteracao := 'DELETE';
    ELSE
        v_tipo_alteracao := 'UPDATE';
    END IF;

    INSERT INTO public.notificacoes_avaliacao (avaliacao_id, tipo_alteracao)
    VALUES (v_avaliacao_id, v_tipo_alteracao);

    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
        VALUES (
            'AVALIACAO',
            v_avaliacao_id,
            'ALTO',
            'Avaliacao removida fisicamente. Validar impacto na agenda academica e nos laboratorios.',
            jsonb_build_object('operacao', TG_OP, 'avaliacao_id', v_avaliacao_id)
        );

        RETURN OLD;
    END IF;

    v_risco := public.fn_classificar_risco_avaliacao(
        NEW.data,
        NEW.horario_ini,
        NEW.horario_fim,
        NEW.qtd_alunos,
        NEW.qtd_objetiva,
        NEW.qtd_discursiva,
        NEW.situacao,
        NEW.delete_logico
    );

    IF v_risco IN ('CRITICO', 'ALTO') THEN
        INSERT INTO public.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
        VALUES (
            'AVALIACAO',
            NEW.id,
            v_risco,
            'Avaliacao com risco gerencial de parametrizacao ou execucao.',
            jsonb_build_object(
                'operacao', TG_OP,
                'avaliacao_id', NEW.id,
                'data', NEW.data,
                'situacao', NEW.situacao,
                'qtd_alunos', NEW.qtd_alunos,
                'horario_ini', NEW.horario_ini,
                'horario_fim', NEW.horario_fim
            )
        );
    END IF;

    IF TG_OP = 'UPDATE'
       AND (
           OLD.data,
           OLD.horario_ini,
           OLD.horario_fim,
           OLD.qtd_alunos,
           OLD.modulo_id,
           OLD.disciplina_id,
           OLD.professor_id
       ) IS DISTINCT FROM (
           NEW.data,
           NEW.horario_ini,
           NEW.horario_fim,
           NEW.qtd_alunos,
           NEW.modulo_id,
           NEW.disciplina_id,
           NEW.professor_id
       ) THEN
        INSERT INTO public.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
        VALUES (
            'AVALIACAO',
            NEW.id,
            'MEDIO',
            'Mudanca relevante em agenda, demanda ou responsavel da avaliacao.',
            jsonb_build_object(
                'operacao', TG_OP,
                'avaliacao_id', NEW.id,
                'data_anterior', OLD.data,
                'data_nova', NEW.data,
                'qtd_alunos_anterior', OLD.qtd_alunos,
                'qtd_alunos_nova', NEW.qtd_alunos
            )
        );
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_trg_alerta_avaliacao_gerencial() OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_trg_alerta_avaliacao_gerencial() IS 'Trigger function gerencial: registra notificacoes e alertas para consultas de impacto sobre avaliacoes.';


--
-- Name: fn_trg_alerta_login_gerencial(); Type: FUNCTION; Schema: public; Owner: foa_med_hp7z_user
--

CREATE OR REPLACE FUNCTION public.fn_trg_alerta_login_gerencial()
RETURNS trigger
    LANGUAGE plpgsql
AS $$
DECLARE
    v_severidade character varying(20);
BEGIN
    IF COALESCE(NEW.is_permanently_blocked, false) THEN
        v_severidade := 'CRITICO';
    ELSIF COALESCE(NEW.block_count, 0) > 0 THEN
        v_severidade := 'ALTO';
    ELSIF COALESCE(NEW.attempt_count, 0) >= 3 THEN
        v_severidade := 'MEDIO';
    ELSE
        RETURN NEW;
    END IF;

    INSERT INTO public.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
    VALUES (
        'SEGURANCA_ACESSO',
        NEW.usuario_id,
        v_severidade,
        'Padrao de acesso exige acompanhamento gerencial de seguranca.',
        jsonb_build_object(
            'login_attempt_id', NEW.id,
            'usuario_id', NEW.usuario_id,
            'ip', NEW.ip,
            'attempt_count', NEW.attempt_count,
            'block_count', NEW.block_count,
            'block_until', NEW.block_until,
            'is_permanently_blocked', NEW.is_permanently_blocked
        )
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_trg_alerta_login_gerencial() OWNER TO foa_med_hp7z_user;

COMMENT ON FUNCTION public.fn_trg_alerta_login_gerencial() IS 'Trigger function gerencial: transforma eventos de login em alertas consultaveis de seguranca.';


--
-- Name: trg_alerta_avaliacao_gerencial; Type: TRIGGER; Schema: public; Owner: foa_med_hp7z_user
--

DROP TRIGGER IF EXISTS trg_alerta_avaliacao_gerencial ON public.avaliacao;

CREATE TRIGGER trg_alerta_avaliacao_gerencial
    AFTER INSERT OR UPDATE OR DELETE ON public.avaliacao
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_trg_alerta_avaliacao_gerencial();

COMMENT ON TRIGGER trg_alerta_avaliacao_gerencial ON public.avaliacao IS 'Trigger gerencial: alimenta notificacoes e alertas estrategicos de avaliacao.';


--
-- Name: trg_alerta_login_gerencial; Type: TRIGGER; Schema: public; Owner: foa_med_hp7z_user
--

DROP TRIGGER IF EXISTS trg_alerta_login_gerencial ON public.login_attempts;

CREATE TRIGGER trg_alerta_login_gerencial
    AFTER INSERT OR UPDATE OF attempt_count, block_count, block_until, is_permanently_blocked ON public.login_attempts
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_trg_alerta_login_gerencial();

COMMENT ON TRIGGER trg_alerta_login_gerencial ON public.login_attempts IS 'Trigger gerencial: gera alertas de seguranca para tentativas de acesso suspeitas.';


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO foa_med_hp7z_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO foa_med_hp7z_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO foa_med_hp7z_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO foa_med_hp7z_user;


--
-- PostgreSQL database dump complete
--

