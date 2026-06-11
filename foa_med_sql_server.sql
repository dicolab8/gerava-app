-- SQL Server version of foa_med.sql
-- Converted from PostgreSQL dump and adapted to T-SQL.

IF DB_ID(N'foa_med') IS NULL
BEGIN
    CREATE DATABASE [foa_med];
END;
GO

USE [foa_med];
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

-- Drop dependent objects for repeatable execution.
DROP TRIGGER IF EXISTS dbo.trg_alerta_avaliacao_gerencial;
DROP TRIGGER IF EXISTS dbo.trg_alerta_login_gerencial;
GO
DROP VIEW IF EXISTS dbo.vw_gerencial_alertas_ativos;
DROP VIEW IF EXISTS dbo.vw_gerencial_seguranca_acessos;
DROP VIEW IF EXISTS dbo.vw_gerencial_produtividade_docente;
DROP VIEW IF EXISTS dbo.vw_estrategica_risco_parametrizacao;
DROP VIEW IF EXISTS dbo.vw_gerencial_ocupacao_laboratorios;
DROP VIEW IF EXISTS dbo.vw_estrategica_carga_modulo;
DROP VIEW IF EXISTS dbo.vw_gerencial_avaliacoes_base;
GO
DROP PROCEDURE IF EXISTS dbo.sp_consultar_painel_modulo;
DROP PROCEDURE IF EXISTS dbo.sp_consultar_ocupacao_laboratorios;
DROP PROCEDURE IF EXISTS dbo.sp_consultar_riscos_avaliacoes;
DROP PROCEDURE IF EXISTS dbo.sp_consultar_seguranca_acessos;
GO
DROP FUNCTION IF EXISTS dbo.fn_indice_demanda_docente;
DROP FUNCTION IF EXISTS dbo.fn_classificar_risco_avaliacao;
DROP FUNCTION IF EXISTS dbo.fn_calcular_taxa_ocupacao;
DROP FUNCTION IF EXISTS dbo.fn_capacidade_conjunto;
GO
DROP TABLE IF EXISTS dbo.alertas_gerenciais;
DROP TABLE IF EXISTS dbo.notificacoes_avaliacao;
DROP TABLE IF EXISTS dbo.avaliacao_laboratorio;
DROP TABLE IF EXISTS dbo.avaliacao;
DROP TABLE IF EXISTS dbo.login_attempts;
DROP TABLE IF EXISTS dbo.disciplina;
DROP TABLE IF EXISTS dbo.laboratorio_conjuntos;
DROP TABLE IF EXISTS dbo.laboratorio;
DROP TABLE IF EXISTS dbo.broadcast_history;
DROP TABLE IF EXISTS dbo.chatbot_config;
DROP TABLE IF EXISTS dbo.chatbot_users;
DROP TABLE IF EXISTS dbo.login_secreto;
DROP TABLE IF EXISTS dbo.modulo;
DROP TABLE IF EXISTS dbo.professor;
DROP TABLE IF EXISTS dbo.[session];
DROP TABLE IF EXISTS dbo.situacao_aval;
DROP TABLE IF EXISTS dbo.tipo_aval;
DROP TABLE IF EXISTS dbo.usuarios;
GO

CREATE TABLE dbo.modulo (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT modulo_pkey PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL
);

CREATE TABLE dbo.professor (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT professor_pkey PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL
);

CREATE TABLE dbo.disciplina (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT disciplina_pkey PRIMARY KEY,
    descricao NVARCHAR(255) NOT NULL,
    modulo_id INT NULL,
    professor_id INT NULL
);

CREATE TABLE dbo.laboratorio (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT laboratorio_pkey PRIMARY KEY,
    nome NVARCHAR(50) NOT NULL,
    predio NVARCHAR(50) NOT NULL,
    qtd_com INT NOT NULL,
    qtd_sem INT NOT NULL
);

CREATE TABLE dbo.laboratorio_conjuntos (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT laboratorio_conjuntos_pkey PRIMARY KEY,
    nome NVARCHAR(255) NOT NULL,
    qtd_com_total INT NOT NULL,
    qtd_sem_total INT NOT NULL
);

CREATE TABLE dbo.usuarios (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT usuarios_pkey PRIMARY KEY,
    nome NVARCHAR(50) NULL,
    username NVARCHAR(50) NOT NULL CONSTRAINT usuarios_username_key UNIQUE,
    [password] NVARCHAR(255) NOT NULL
);

CREATE TABLE dbo.avaliacao (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT avaliacao_pkey PRIMARY KEY,
    situacao NVARCHAR(50) NOT NULL,
    tipo NVARCHAR(100) NOT NULL,
    [data] DATE NULL,
    horario_ini TIME(0) NULL,
    horario_fim TIME(0) NULL,
    qtd_alunos INT NULL,
    caip BIT NOT NULL,
    modulo_id INT NULL,
    disciplina_id INT NULL,
    professor_id INT NULL,
    qtd_objetiva INT NULL,
    qtd_discursiva INT NULL,
    updated_at DATETIME2(6) NOT NULL CONSTRAINT DF_avaliacao_updated_at DEFAULT SYSDATETIME(),
    visivel BIT NULL CONSTRAINT DF_avaliacao_visivel DEFAULT 1,
    delete_logico BIT NULL CONSTRAINT DF_avaliacao_delete_logico DEFAULT 0
);

CREATE TABLE dbo.avaliacao_laboratorio (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT avaliacao_laboratorio_pkey PRIMARY KEY,
    avaliacao_id INT NOT NULL,
    conjunto_id INT NULL
);

CREATE TABLE dbo.broadcast_history (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT broadcast_history_pkey PRIMARY KEY,
    [message] NVARCHAR(MAX) NOT NULL,
    [groups] NVARCHAR(MAX) NOT NULL,
    sent_at DATETIME2(6) NULL CONSTRAINT DF_broadcast_history_sent_at DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.chatbot_config (
    setting NVARCHAR(50) NOT NULL CONSTRAINT chatbot_config_pkey PRIMARY KEY,
    [value] NVARCHAR(255) NULL,
    updated_at DATETIME2(6) NULL CONSTRAINT DF_chatbot_config_updated_at DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.chatbot_users (
    phone_number NVARCHAR(20) NOT NULL CONSTRAINT chatbot_users_pkey PRIMARY KEY,
    subscribed BIT NULL CONSTRAINT DF_chatbot_users_subscribed DEFAULT 1,
    created_at DATETIME2(6) NOT NULL CONSTRAINT DF_chatbot_users_created_at DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.login_secreto (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT login_secreto_pkey PRIMARY KEY,
    username NVARCHAR(255) NOT NULL CONSTRAINT login_secreto_username_key UNIQUE,
    [password] NVARCHAR(255) NOT NULL
);

CREATE TABLE dbo.login_attempts (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT login_attempts_pkey PRIMARY KEY,
    usuario_id INT NULL,
    ip NVARCHAR(255) NOT NULL,
    attempt_count INT NULL CONSTRAINT DF_login_attempts_attempt_count DEFAULT 0,
    block_count INT NULL CONSTRAINT DF_login_attempts_block_count DEFAULT 0,
    block_until DATETIME2(6) NULL,
    is_permanently_blocked BIT NULL CONSTRAINT DF_login_attempts_is_permanently_blocked DEFAULT 0,
    created_at DATETIME2(6) NOT NULL CONSTRAINT DF_login_attempts_created_at DEFAULT SYSDATETIME(),
    updated_at DATETIME2(6) NOT NULL CONSTRAINT DF_login_attempts_updated_at DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.[session] (
    sid NVARCHAR(255) NOT NULL CONSTRAINT session_pkey PRIMARY KEY,
    sess NVARCHAR(MAX) NOT NULL,
    expire DATETIME2(6) NOT NULL
);

CREATE TABLE dbo.situacao_aval (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT situacao_aval_pkey PRIMARY KEY,
    situacao NVARCHAR(50) NOT NULL
);

CREATE TABLE dbo.tipo_aval (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT tipo_aval_pkey PRIMARY KEY,
    tipo NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.notificacoes_avaliacao (
    id INT IDENTITY(1,1) NOT NULL CONSTRAINT notificacoes_avaliacao_pkey PRIMARY KEY,
    avaliacao_id INT NOT NULL,
    tipo_alteracao NVARCHAR(10) NULL,
    created_at DATETIME2(6) NOT NULL CONSTRAINT DF_notificacoes_avaliacao_created_at DEFAULT SYSDATETIME(),
    enviada BIT NULL CONSTRAINT DF_notificacoes_avaliacao_enviada DEFAULT 0,
    CONSTRAINT notificacoes_avaliacao_tipo_alteracao_check CHECK (tipo_alteracao IN (N'CREATE', N'UPDATE', N'DELETE'))
);

CREATE TABLE dbo.alertas_gerenciais (
    id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT alertas_gerenciais_pkey PRIMARY KEY,
    origem NVARCHAR(50) NOT NULL,
    referencia_id INT NULL,
    severidade NVARCHAR(20) NOT NULL,
    mensagem NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT DF_alertas_gerenciais_status DEFAULT N'ABERTO',
    payload NVARCHAR(MAX) NOT NULL CONSTRAINT DF_alertas_gerenciais_payload DEFAULT N'{}',
    criado_em DATETIME2(6) NOT NULL CONSTRAINT DF_alertas_gerenciais_criado_em DEFAULT SYSDATETIME(),
    resolvido_em DATETIME2(6) NULL,
    CONSTRAINT alertas_gerenciais_severidade_check CHECK (severidade IN (N'BAIXO', N'MEDIO', N'ALTO', N'CRITICO')),
    CONSTRAINT alertas_gerenciais_status_check CHECK ([status] IN (N'ABERTO', N'EM_ANALISE', N'RESOLVIDO', N'IGNORADO'))
);
GO

-- Data load converted from PostgreSQL COPY blocks.

-- Data for dbo.modulo
SET IDENTITY_INSERT dbo.[modulo] ON;
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (1, N'Módulo 6 (7147)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (2, N'Módulo 7 (7148)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (3, N'Módulo 8 (7149)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (4, N'Módulo 9 (7150)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (5, N'Módulo 10 (7151)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (6, N'Módulo 11 (7152)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (7, N'Módulo 12 (7153)');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (8, N'1º Período');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (9, N'2º Período');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (10, N'3º Período');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (11, N'4º Período');
INSERT INTO dbo.[modulo] ([id], [nome]) VALUES (12, N'5º Período');
SET IDENTITY_INSERT dbo.[modulo] OFF;

-- Data for dbo.professor
SET IDENTITY_INSERT dbo.[professor] ON;
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (1, N'Cristiane Cunha');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (2, N'Sérgio Ibanez');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (3, N'Tássio Huguenin');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (4, N'Arthur Villela');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (5, N'José Roberto Barroso');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (6, N'Luciana Oliveira');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (7, N'Luciano Costa');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (8, N'Ana Paula da Cunha');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (9, N'Alessandra Rafael');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (10, N'Bruno Martini');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (11, N'Thaís Ibanez');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (12, N'Alessandra Vargas');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (13, N'Gustavo Caetano');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (14, N'Geraldo Cardoso');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (15, N'Élba Ferrão');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (16, N'Márcia Dorcelina');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (17, N'Rosa Machado');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (18, N'Élder Sarmento');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (19, N'Bruna Casiraghi');
INSERT INTO dbo.[professor] ([id], [nome]) VALUES (20, N'Walkíria Soares');
SET IDENTITY_INSERT dbo.[professor] OFF;

-- Data for dbo.disciplina
SET IDENTITY_INSERT dbo.[disciplina] ON;
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (1, N'Cuidados Elementares em Saúde e Doenças Prevalentes', 1, 1);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (2, N'Doenças Prevalentes e Queixas Comuns', 2, 2);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (3, N'Sistema Endócrino', 10, 3);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (4, N'Sistema Reprodutivo', 10, 4);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (5, N'Doenças Crônicas', 3, 5);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (6, N'Internato I - Saúde do Adulto e do Idoso', 4, 6);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (7, N'Internato II - Saúde da Criança e do Adolescente', 5, 7);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (8, N'Internato III - Saúde da Mulher', 6, 8);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (9, N'Internato IV - Doente Cirúrgico, Urgência e Emergência', 7, 9);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (10, N'Sistema Respiratório', 9, 10);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (11, N'Sistema Hematopoiético', 11, 1);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (12, N'Sistema Cardiovascular', 8, 11);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (13, N'Sistema Renal', 9, 12);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (14, N'Saúde Mental', 12, 13);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (15, N'Segurança do Paciente', 11, 14);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (16, N'Sentidos Especiais', 12, 15);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (17, N'O Médico Cuidador', 9, 16);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (18, N'Sistema Digestivo', 11, 17);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (19, N'Sistema Nervoso', 12, 18);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (20, N'O Médico Educador', 10, 19);
INSERT INTO dbo.[disciplina] ([id], [descricao], [modulo_id], [professor_id]) VALUES (21, N'Ser Médico', 8, 20);
SET IDENTITY_INSERT dbo.[disciplina] OFF;

-- Data for dbo.laboratorio
SET IDENTITY_INSERT dbo.[laboratorio] ON;
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (1, N'Lab 01', N'P4', 22, 33);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (2, N'Lab 02', N'P4', 8, 16);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (3, N'Lab 03', N'P4', 10, 20);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (4, N'Lab 04', N'P4', 22, 33);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (5, N'Lab 06', N'P4', 12, 20);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (6, N'Lab 07', N'P4', 8, 16);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (7, N'Lab 08', N'P4', 20, 20);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (8, N'Lab 09', N'P4', 20, 20);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (9, N'Lab 10', N'P4', 16, 24);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (10, N'Lab 11', N'P4', 18, 32);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (11, N'Lab 12', N'P4', 16, 28);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (12, N'Lab 13', N'P14', 16, 29);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (13, N'Lab 14', N'P14', 20, 30);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (14, N'Lab 15', N'P18', 28, 42);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (15, N'Lab 16', N'P18', 20, 40);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (16, N'Lab 17', N'P18', 12, 24);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (17, N'Lab 18', N'P18', 12, 24);
INSERT INTO dbo.[laboratorio] ([id], [nome], [predio], [qtd_com], [qtd_sem]) VALUES (18, N'Lab 19', N'P18', 20, 40);
SET IDENTITY_INSERT dbo.[laboratorio] OFF;

-- Data for dbo.laboratorio_conjuntos
SET IDENTITY_INSERT dbo.[laboratorio_conjuntos] ON;
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (1, N'Labs 9, 10, 11, 12', 72, 66);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (2, N'Labs 1, 2, 3, 4', 80, 62);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (3, N'Labs 16, 17 ,18, 19', 68, 70);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (4, N'Labs 1, 2, 3, 4, 6', 68, 70);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (5, N'Labs 15, 16, 17 ,18, 19', 68, 80);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (6, N'Labs 16, 17, 18, 19, 14 (CAIP)', 48, 70);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (7, N'Labs 9, 10, 11, 12, 14 (CAIP)', 66, 66);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (8, N'Labs 13, 14, 6 (CAIP)', 72, 72);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (9, N'Labs 1, 2, 3, 4, 6, 14 (CAIP)', 70, 70);
INSERT INTO dbo.[laboratorio_conjuntos] ([id], [nome], [qtd_com_total], [qtd_sem_total]) VALUES (10, N'A definir', 0, 0);
SET IDENTITY_INSERT dbo.[laboratorio_conjuntos] OFF;

-- Data for dbo.usuarios
SET IDENTITY_INSERT dbo.[usuarios] ON;
INSERT INTO dbo.[usuarios] ([id], [nome], [username], [password]) VALUES (1, N'Administrador', N'admin', N'$2b$10$7r67llYzsk2qUL6Aq5sI2OhJcmu1zMjMnkavCvmQASmtgL/fT7uJm');
SET IDENTITY_INSERT dbo.[usuarios] OFF;

-- Data for dbo.avaliacao
SET IDENTITY_INSERT dbo.[avaliacao] ON;
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (4, N'Finalizada', N'Avaliação Sequencial 1', N'2025-03-12', N'15:40:00', N'17:40:00', 65, 0, 10, 4, 4, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (6, N'Finalizada', N'1ª PROVA MULTIDISCIPLINAR', N'2025-03-12', N'14:00:00', N'15:30:00', 61, 0, 4, 6, 6, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (8, N'Finalizada', N'1ª PROVA MULTIDISCIPLINAR', N'2025-03-12', N'14:00:00', N'15:30:00', 53, 1, 6, 8, 8, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (9, N'Finalizada', N'1ª PROVA MULTIDISCIPLINAR', N'2025-03-12', N'14:00:00', N'15:30:00', 54, 0, 7, 9, 9, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (10, N'Finalizada', N'Avaliação Sequencial 1', N'2025-03-13', N'08:30:00', N'10:30:00', 68, 1, 9, 10, 10, 26, 4, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (11, N'Finalizada', N'Avaliação Escrita 1', N'2025-03-14', N'13:30:00', N'15:45:00', 66, 1, 11, 11, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (12, N'Finalizada', N'Avaliação Sequencial 1', N'2025-03-20', N'13:30:00', N'15:30:00', 60, 1, 8, 12, 11, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (13, N'Finalizada', N'Formativa 2', N'2025-03-21', N'13:30:00', N'15:30:00', 69, 0, 1, 1, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (14, N'Finalizada', N'Formativa 2', N'2025-03-27', N'14:00:00', N'16:00:00', 66, 1, 2, 2, 2, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (15, N'Finalizada', N'Avaliação Sequencial 1', N'2025-03-31', N'08:00:00', N'10:00:00', 68, 1, 9, 13, 12, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (16, N'Finalizada', N'1ª AVD', N'2025-03-31', N'14:00:00', N'16:15:00', 68, 1, 12, 14, 13, 13, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (17, N'Finalizada', N'Somativa 1', N'2025-04-01', N'08:30:00', N'10:30:00', 69, 0, 1, 1, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (18, N'Finalizada', N'Somativa 1', N'2025-04-01', N'08:30:00', N'11:30:00', 65, 1, 3, 5, 5, 32, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (19, N'Julgamento de Recurso', N'Avaliação Sequencial 1', N'2025-04-02', N'08:00:00', N'09:40:00', 66, 1, 11, 15, 14, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (20, N'Julgamento de Recurso', N'Prova 1', N'2025-04-03', N'08:00:00', N'10:00:00', 68, 1, 12, 16, 15, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (21, N'Finalizada', N'Avaliação Sequencial 2', N'2025-04-07', N'08:00:00', N'09:40:00', 65, 0, 10, 3, 3, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (22, N'Finalizada', N'AVD 1', N'2025-04-08', N'08:00:00', N'09:40:00', 68, 1, 9, 17, 16, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (23, N'Finalizada', N'Avaliação Sequencial 1', N'2025-04-09', N'10:00:00', N'12:00:00', 66, 1, 11, 18, 17, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (24, N'Julgamento de Recurso', N'Avaliação Escrita 1', N'2025-04-09', N'08:00:00', N'09:40:00', 68, 1, 12, 19, 18, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (25, N'Julgamento de Recurso', N'Somativa 1', N'2025-04-10', N'13:30:00', N'15:30:00', 66, 1, 2, 2, 2, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (26, N'Finalizada', N'Avaliação Escrita 1', N'2025-04-15', N'10:00:00', N'11:40:00', 65, 0, 10, 20, 19, 10, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (27, N'Finalizada', N'Avaliação Sequencial 1', N'2025-04-16', N'09:00:00', N'11:30:00', 60, 1, 8, 21, 20, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (28, N'Julgamento de Recurso', N'2ª PROVA MULTIDISCIPLINAR', N'2025-04-16', N'14:00:00', N'15:30:00', 61, 0, 4, 6, 6, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (29, N'Julgamento de Recurso', N'2ª PROVA MULTIDISCIPLINAR', N'2025-04-16', N'13:30:00', N'15:00:00', 63, 0, 5, 7, 7, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (30, N'Julgamento de Recurso', N'2ª PROVA MULTIDISCIPLINAR', N'2025-04-16', N'13:30:00', N'15:00:00', 53, 1, 6, 8, 8, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (31, N'Julgamento de Recurso', N'2ª PROVA MULTIDISCIPLINAR', N'2025-04-16', N'13:30:00', N'15:00:00', 54, 0, 7, 9, 9, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (32, N'Finalizada', N'Avaliação Sequencial 2', N'2025-04-16', N'15:20:00', N'17:30:00', 68, 1, 9, 10, 10, 26, 4, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (33, N'Julgamento de Recurso', N'Avaliação Sequencial 2', N'2025-04-16', N'15:40:00', N'17:40:00', 65, 0, 10, 4, 4, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (34, N'Julgamento de Recurso', N'Avaliação Sequencial 2', N'2025-04-17', N'13:30:00', N'15:30:00', 60, 1, 8, 12, 11, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (35, N'Finalizada', N'Somativa 1 - Prova Especial', N'2025-04-17', N'15:30:00', N'17:00:00', 1, 0, 3, 5, 5, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (36, N'Julgamento de Recurso', N'Formativa 2', N'2025-04-29', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (37, N'Recursos', N'PROVA MÓDULO', N'2025-04-30', N'13:30:00', N'15:00:00', 54, 0, 7, 9, 9, 10, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (38, N'PARAMETRIZADA', N'3ª PROVA MULTIDISCIPLINAR', N'2025-05-07', N'14:00:00', N'15:30:00', 61, 0, 4, 6, 6, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (39, N'PARAMETRIZADA', N'3ª PROVA MULTIDISCIPLINAR', N'2025-05-07', N'13:30:00', N'15:30:00', 63, 0, 5, 7, 7, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (40, N'PARAMETRIZADA', N'3ª PROVA MULTIDISCIPLINAR', N'2025-05-07', N'13:30:00', N'15:30:00', 53, 1, 6, 8, 8, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (41, N'PARAMETRIZADA', N'3ª PROVA MULTIDISCIPLINAR', N'2025-05-07', N'13:30:00', N'15:30:00', 54, 0, 7, 9, 9, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (42, N'Gerada', N'Formativa 3', N'2025-05-13', N'08:30:00', N'10:30:00', 69, 0, 1, 1, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (43, N'Gerada', N'Avaliação Sequencial 3', N'2025-05-14', N'14:00:00', N'16:30:00', 68, 1, 9, 10, 10, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (44, N'Gerada', N'Avaliação Sequencial 3', N'2025-05-14', N'15:00:00', N'17:00:00', 65, 0, 10, 4, 4, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (45, N'PARAMETRIZADA', N'Formativa 3', N'2025-05-15', N'14:00:00', N'16:00:00', 66, 1, 2, 2, 2, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (46, N'PARAMETRIZADA', N'Formativa 3', N'2025-05-19', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (47, N'PARAMETRIZADA', N'Avaliação Sequencial 3', N'2025-05-23', N'09:20:00', N'11:20:00', 60, 1, 8, 12, 11, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (48, N'PARAMETRIZADA', N'Prova 2', N'2025-05-26', N'10:00:00', N'11:00:00', 68, 1, 12, 14, 13, 13, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (49, N'PARAMETRIZADA', N'PROVA MÓDULO', N'2025-05-28', N'15:00:00', N'16:30:00', 64, 0, 4, 6, 6, 20, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (50, N'PARAMETRIZADA', N'PROVA MÓDULO', N'2025-05-29', N'14:00:00', N'15:30:00', 63, 0, 5, 7, 7, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (51, N'CONFIRMAR', N'Avaliação Teórica 2', N'2025-06-02', NULL, NULL, NULL, 0, 10, 3, 3, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (52, N'', N'AVD 2', N'2025-06-03', N'08:00:00', N'09:40:00', 68, 1, 9, 17, 16, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (53, N'', N'Avaliação Sequencial 4', N'2025-06-05', N'15:00:00', N'17:00:00', 65, 0, 10, 4, 4, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (54, N'', N'Somativa 2', N'2025-06-05', N'14:00:00', N'16:00:00', 66, 1, 2, 2, 2, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (55, N'', N'2ª CHAMADA (PROVA MÓDULO)', N'2025-06-05', N'14:00:00', N'15:30:00', 63, 0, 5, 7, 7, 30, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (56, N'', N'Avaliação Escrita 2', N'2025-06-06', N'13:30:00', N'15:30:00', 66, 1, 11, 11, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (57, N'', N'Avaliação Sequencial 2', N'2025-06-09', N'09:00:00', N'11:30:00', 68, 1, 9, 13, 12, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (58, N'', N'Avaliação Substitutiva', N'2025-06-09', NULL, NULL, 68, 1, 12, 14, 13, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (59, N'', N'Somativa 2', N'2025-06-10', N'08:30:00', N'10:30:00', 69, 0, 1, 1, 1, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (60, N'', N'Prova 2', N'2025-06-10', N'13:00:00', N'15:00:00', 68, 1, 12, 16, 15, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (61, N'', N'Avaliação Sequencial 2', N'2025-06-11', N'08:00:00', N'09:40:00', 66, 1, 11, 15, 14, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (62, N'', N'Avaliação Sequencial 2', N'2025-06-11', N'09:00:00', N'11:30:00', 60, 1, 8, 21, 20, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (7, N'Finalizada', N'1ª PROVA MULTIDISCIPLINAR', N'2025-03-12', N'14:00:00', N'15:30:00', 63, 0, 5, 7, 7, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (5, N'Finalizada', N'Formativa 1', N'2025-03-12', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (63, N'', N'Avaliação Escrita 2', N'2025-06-11', N'13:30:00', N'16:30:00', 68, 1, 12, 19, 18, NULL, NULL, N'2025-05-17 15:56:00', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (64, N'', N'Avaliação Sequencial 4', N'2025-06-12', N'08:30:00', N'11:00:00', 68, 1, 9, 10, 10, 26, 4, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (65, N'', N'Avaliação Sequencial 4', N'2025-06-12', N'13:30:00', N'15:30:00', 60, 1, 8, 12, 11, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (66, N'', N'Segunda Chamada', N'2025-06-12', NULL, NULL, 66, 1, 2, 2, 2, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (67, N'', N'Avaliação Substitutiva (Sequencial)', N'2025-06-16', N'13:30:00', N'15:30:00', 65, 0, 10, 4, 4, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (68, N'PARAMETRIZADA', N'Avaliação Sequencial 3', N'2025-06-16', N'08:00:00', N'09:40:00', 65, 0, 10, 3, 3, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (69, N'', N'Segunda Chamada', N'2025-06-16', N'13:30:00', N'15:30:00', 69, 0, 1, 1, 1, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (70, N'', N'Prova Final', N'2025-06-17', NULL, NULL, 66, 1, 2, 2, 2, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (71, N'', N'Somativa 2', N'2025-06-17', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, 32, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (72, N'', N'Prova Final', N'2025-06-17', N'08:30:00', N'10:30:00', 69, 0, 1, 1, 1, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (73, N'PARAMETRIZADA', N'Avaliação Sequencial 2', N'2025-06-18', N'10:00:00', N'12:00:00', 66, 1, 11, 18, 17, 30, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (74, N'', N'Avaliação Escrita Substitutiva', N'2025-06-18', N'08:00:00', N'09:40:00', 68, 1, 12, 19, 18, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (75, N'', N'Avaliação Substitutiva', N'2025-06-23', N'09:00:00', N'11:30:00', 68, 1, 9, 13, 12, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (76, N'', N'Avaliação Escrita Substitutiva', N'2025-06-23', N'13:30:00', N'15:30:00', 66, 1, 11, 11, 1, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (77, N'', N'Avaliação Escrita 2', N'2025-06-24', N'10:00:00', N'11:40:00', 65, 0, 10, 20, 19, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (78, N'', N'Avaliação Sequencial Substitutiva', N'2025-06-25', N'09:00:00', N'11:30:00', 60, 1, 8, 21, 20, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (79, N'', N'Avaliação Teórica', N'2025-06-26', NULL, NULL, NULL, 0, 8, 12, 11, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (80, N'', N'Avaliação Substitutiva', N'2025-06-26', NULL, NULL, 68, 1, 12, 16, 15, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (81, N'', N'Avaliação Substitutiva', N'2025-06-26', N'13:30:00', N'15:30:00', 60, 1, 8, 12, 11, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (82, N'PARAMETRIZADA', N'Avaliação Substitutiva (Sequencial)', N'2025-06-27', N'13:30:00', N'15:10:00', 65, 0, 10, 3, 3, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (83, N'', N'Avaliação Substitutiva', N'2025-07-01', N'08:00:00', N'09:40:00', 68, 1, 9, 17, 16, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (84, N'', N'Avaliação Escrita Substitutiva', N'2025-07-01', N'10:00:00', N'11:40:00', 65, 0, 10, 20, 19, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (85, N'', N'Avaliação Substitutiva (Sequencial)', N'2025-07-02', N'14:00:00', N'16:30:00', 68, 1, 9, 10, 10, 26, 4, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (86, N'', N'Avaliação Substitutiva (Sequencial)', N'2025-07-02', N'08:00:00', N'09:40:00', 66, 1, 11, 15, 14, 16, 2, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (87, N'', N'Avaliação Substitutiva', N'2025-07-02', N'10:00:00', N'12:00:00', 66, 1, 11, 18, 17, 30, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (88, N'', N'Segunda Chamada', N'2025-07-02', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (89, N'Parametrizada - Avalia', N'Prova Final', N'2025-07-04', N'08:30:00', N'10:30:00', 65, 1, 3, 5, 5, NULL, NULL, N'2025-05-17 16:14:17', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (90, N'', N'2ª CHAMADA (PROVA MÓDULO)', NULL, NULL, NULL, 64, 0, 4, 6, 6, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (91, N'', N'2ª CHAMADA (MULTIDISCIPLINAR)', NULL, NULL, NULL, 64, 0, 4, 6, 6, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (92, N'', N'2ª CHAMADA (MULTIDISCIPLINAR)', NULL, NULL, NULL, 63, 0, 5, 7, 7, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (93, N'', N'2ª CHAMADA (MULTIDISCIPLINAR)', NULL, NULL, NULL, 53, 1, 6, 8, 8, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (94, N'', N'PROVA MÓDULO', NULL, NULL, NULL, 53, 1, 6, 8, 8, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (95, N'', N'2ª CHAMADA (PROVA MÓDULO)', NULL, NULL, NULL, 53, 1, 6, 8, 8, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (96, N'', N'2ª CHAMADA (MULTIDISCIPLINAR)', NULL, NULL, NULL, 54, 0, 7, 9, 9, NULL, NULL, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (97, N'', N'2ª CHAMADA (PROVA MÓDULO)', NULL, NULL, NULL, 54, 0, 7, 9, 9, 30, 0, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (2, N'Finalizada', N'Formativa 1', N'2025-03-07', N'08:30:00', N'10:30:00', 66, 1, 2, 2, 2, 27, 3, N'2025-05-17 15:56:40', 1, 1);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (3, N'Finalizada', N'Avaliação Sequencial 1', N'2025-03-10', N'08:00:00', N'09:40:00', 65, 0, 10, 3, 3, 27, 3, N'2025-05-17 15:56:40', 1, 0);
INSERT INTO dbo.[avaliacao] ([id], [situacao], [tipo], [data], [horario_ini], [horario_fim], [qtd_alunos], [caip], [modulo_id], [disciplina_id], [professor_id], [qtd_objetiva], [qtd_discursiva], [updated_at], [visivel], [delete_logico]) VALUES (1, N'Finalizada', N'Formativa 1', N'2025-02-25', N'08:30:00', N'10:30:00', 69, 0, 1, 1, 1, 27, 3, N'2025-05-20 16:49:53', 1, 0);
SET IDENTITY_INSERT dbo.[avaliacao] OFF;

-- Data for dbo.avaliacao_laboratorio
SET IDENTITY_INSERT dbo.[avaliacao_laboratorio] ON;
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (6, 2, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (11, 3, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (15, 4, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (20, 5, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (24, 6, 2);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (28, 7, 3);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (35, 9, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (40, 10, 2);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (44, 11, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (49, 12, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (54, 13, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (59, 14, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (64, 15, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (69, 16, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (74, 17, 5);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (79, 18, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (84, 19, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (89, 20, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (94, 21, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (98, 22, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (103, 23, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (108, 24, 5);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (113, 25, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (118, 26, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (122, 27, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (127, 28, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (131, 29, 3);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (135, 30, 8);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (138, 31, 2);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (142, 32, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (147, 33, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (151, 34, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (156, 36, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (161, 37, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (165, 38, 2);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (169, 39, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (173, 40, 3);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (178, 41, 6);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (180, 42, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (185, 43, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (191, 44, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (195, 45, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (200, 46, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (205, 47, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (210, 48, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (216, 49, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (220, 50, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (224, 52, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (230, 53, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (235, 54, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (240, 55, 3);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (244, 56, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (249, 57, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (255, 59, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (260, 60, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (266, 61, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (271, 62, 6);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (276, 63, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (282, 64, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (288, 65, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (293, 67, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (297, 68, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (305, 69, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (306, 71, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (311, 72, 4);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (316, 73, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (321, 74, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (327, 75, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (333, 76, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (338, 77, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (342, 78, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (347, 80, 10);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (352, 81, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (356, 82, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (362, 83, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (366, 84, 1);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (372, 85, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (377, 86, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (382, 87, 7);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (388, 88, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (398, 89, 9);
INSERT INTO dbo.[avaliacao_laboratorio] ([id], [avaliacao_id], [conjunto_id]) VALUES (400, 1, 6);
SET IDENTITY_INSERT dbo.[avaliacao_laboratorio] OFF;

-- Data for dbo.broadcast_history
-- Sem dados para dbo.broadcast_history.

-- Data for dbo.chatbot_config
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'notifications_enabled', N'0', N'2025-10-14 16:55:48.524891');
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'menu_enabled', N'0', N'2025-10-14 16:57:40.912301');
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'auto_replies_enabled', N'0', N'2025-10-14 16:58:05.88737');
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'connection_status', N'0', N'2025-10-14 16:58:13.668503');
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'messages_sent_today', N'15', N'2025-10-14 16:58:13.670181');
INSERT INTO dbo.[chatbot_config] ([setting], [value], [updated_at]) VALUES (N'messages_received_today', N'20', N'2025-10-14 16:58:13.670542');

-- Data for dbo.chatbot_users
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5521994656295@c.us', 1, N'2025-05-20 16:04:34');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524988153895@c.us', 1, N'2025-05-19 11:08:33');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524988291234@c.us', 1, N'2025-05-20 16:46:52');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524993017797@c.us', 1, N'2025-05-20 16:15:20');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524998182897@c.us', 1, N'2025-05-20 16:18:27');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524998321147@c.us', 1, N'2025-05-17 19:27:40');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524998484441@c.us', 1, N'2025-05-19 10:37:16');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524998694227@c.us', 1, N'2025-05-17 20:26:46');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524999322452@c.us', 1, N'2025-05-19 10:45:50');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524999393026@c.us', 1, N'2025-05-19 11:31:28');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524999642496@c.us', 1, N'2025-05-19 10:51:51');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524999938235@c.us', 1, N'2025-05-20 17:17:59');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'553591800057@c.us', 1, N'2025-05-20 16:05:36');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524998837188@c.us', 1, N'2025-05-17 16:07:32');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524981111523@c.us', 1, N'2025-08-08 15:30:43.021431');
INSERT INTO dbo.[chatbot_users] ([phone_number], [subscribed], [created_at]) VALUES (N'5524999042169@c.us', 1, N'2025-09-01 11:03:34.048277');

-- Data for dbo.login_secreto
SET IDENTITY_INSERT dbo.[login_secreto] ON;
INSERT INTO dbo.[login_secreto] ([id], [username], [password]) VALUES (1, N'vladimir', N'$2b$10$taFBFPVKaS0cZ.V785tZq.3cWwztV6bVEVLQCL4HTPe7kSxOme1FS');
INSERT INTO dbo.[login_secreto] ([id], [username], [password]) VALUES (2, N'202410456', N'$2b$10$bW.iRzB1GnBbPWLxap312eo3ivyoubIIZ3AQCPaRt4gTVODMob4yW');
SET IDENTITY_INSERT dbo.[login_secreto] OFF;

-- Data for dbo.login_attempts
SET IDENTITY_INSERT dbo.[login_attempts] ON;
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (2, 1, N'200.9.143.127, 172.70.140.101, 10.214.172.197', 0, 0, NULL, 0, N'2025-05-24 13:30:07.266153', N'2025-05-24 13:30:07.266153');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (3, 1, N'200.9.143.127, 172.69.91.15, 10.214.11.1', 0, 0, NULL, 0, N'2025-05-24 16:06:46.774597', N'2025-05-24 16:06:46.774597');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (4, 1, N'200.9.143.127, 172.68.175.114, 10.214.11.1', 0, 0, NULL, 0, N'2025-05-24 19:08:08.159571', N'2025-05-24 19:08:08.159571');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (5, 1, N'189.84.181.65, 172.68.174.175, 10.214.11.1', 0, 0, NULL, 0, N'2025-05-25 00:54:48.155952', N'2025-05-25 00:54:48.155952');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (6, 1, N'189.84.181.65, 172.69.114.58, 10.214.4.110', 0, 0, NULL, 0, N'2025-05-25 10:07:28.346487', N'2025-05-25 10:07:28.346487');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (7, 1, N'189.84.181.65, 172.68.175.36, 10.214.177.88', 0, 0, NULL, 0, N'2025-05-25 14:31:09.293592', N'2025-05-25 14:31:09.293592');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (8, 1, N'189.84.181.65, 172.68.174.90, 10.214.11.1', 0, 0, NULL, 0, N'2025-05-25 14:32:39.126415', N'2025-05-25 14:32:39.126415');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (9, 1, N'200.9.143.127, 172.68.175.45, 10.214.76.119', 0, 0, NULL, 0, N'2025-05-26 16:22:22.040117', N'2025-05-26 16:22:22.040117');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (10, 1, N'::ffff:192.168.4.181', 0, 0, NULL, 0, N'2025-08-11 12:36:53.405651', N'2025-08-11 12:36:53.405651');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (11, 1, N'::ffff:192.168.12.12', 0, 0, NULL, 0, N'2025-08-15 18:19:51.262528', N'2025-08-15 18:19:51.262528');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (12, 1, N'::ffff:192.168.12.39', 0, 0, NULL, 0, N'2025-08-15 18:42:03.318979', N'2025-08-15 18:42:03.318979');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (1, 1, N'::1', 0, 0, NULL, 0, N'2025-05-20 19:54:02', N'2025-05-20 21:44:32');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (13, 1, N'189.84.176.78, 172.69.90.238, 10.23.193.130', 0, 0, NULL, 0, N'2026-03-13 14:49:32.613858', N'2026-03-13 14:49:32.613858');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (14, 1, N'200.9.143.112, 172.71.147.233, 10.23.197.196', 0, 0, NULL, 0, N'2026-03-13 22:14:16.993028', N'2026-03-13 22:14:16.993028');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (15, 1, N'189.84.176.78, 172.68.175.42, 10.17.184.136', 0, 0, NULL, 0, N'2026-03-15 15:28:09.22444', N'2026-03-15 15:28:09.22444');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (16, 1, N'177.207.168.106, 172.71.146.50, 10.17.6.73', 0, 0, NULL, 0, N'2026-03-20 16:17:21.949299', N'2026-03-20 16:17:21.949299');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (17, 1, N'177.207.168.106, 172.68.23.71, 10.19.182.12', 1, 0, NULL, 0, N'2026-03-20 16:22:13.037891', N'2026-03-20 16:22:13.037891');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (18, 1, N'177.207.168.106, 172.68.22.81, 10.22.114.194', 1, 0, NULL, 0, N'2026-03-20 16:35:32.116742', N'2026-03-20 16:35:32.116742');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (19, 1, N'177.207.168.106, 172.69.90.238, 10.19.182.12', 1, 0, NULL, 0, N'2026-03-20 16:36:28.39197', N'2026-03-20 16:36:28.39197');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (20, 1, N'200.9.143.127, 172.71.150.18, 10.22.114.194', 0, 0, NULL, 0, N'2026-03-23 23:05:22.463691', N'2026-03-23 23:05:22.463691');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (21, 1, N'200.9.143.127, 172.68.23.109, 10.18.86.95', 1, 0, NULL, 0, N'2026-03-23 23:14:43.740755', N'2026-03-23 23:14:43.740755');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (22, 1, N'200.9.143.127, 172.71.151.81, 10.18.86.95', 0, 0, NULL, 0, N'2026-03-23 23:15:07.537724', N'2026-03-23 23:15:07.537724');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (23, 1, N'200.9.143.127, 172.69.90.239, 10.18.86.95', 0, 0, NULL, 0, N'2026-03-23 23:15:51.189194', N'2026-03-23 23:15:51.189194');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (24, 1, N'200.9.143.119, 172.71.239.67, 10.17.6.73', 1, 0, NULL, 0, N'2026-03-23 23:16:43.278085', N'2026-03-23 23:16:43.278085');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (25, 1, N'200.9.143.119, 172.71.239.68, 10.18.86.95', 0, 0, NULL, 0, N'2026-03-23 23:18:12.129155', N'2026-03-23 23:18:12.129155');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (26, 1, N'138.94.131.177, 172.71.151.228, 10.22.114.194', 1, 0, NULL, 0, N'2026-03-24 02:38:13.106064', N'2026-03-24 02:38:13.106064');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (27, 1, N'138.94.131.177, 172.71.150.73, 10.23.162.66', 0, 0, NULL, 0, N'2026-03-24 02:38:28.577477', N'2026-03-24 02:38:28.577477');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (28, 1, N'138.94.131.177, 172.71.151.197, 10.23.162.66', 0, 0, NULL, 0, N'2026-03-24 02:39:44.291377', N'2026-03-24 02:39:44.291377');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (29, 1, N'138.94.131.177, 172.71.150.81, 10.23.162.66', 0, 0, NULL, 0, N'2026-03-24 02:56:24.21093', N'2026-03-24 02:56:24.21093');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (30, 1, N'138.94.131.177, 172.71.151.33, 10.18.86.95', 0, 0, NULL, 0, N'2026-03-24 02:59:10.658822', N'2026-03-24 02:59:10.658822');
INSERT INTO dbo.[login_attempts] ([id], [usuario_id], [ip], [attempt_count], [block_count], [block_until], [is_permanently_blocked], [created_at], [updated_at]) VALUES (31, 1, N'138.94.131.177, 172.71.150.205, 10.23.162.66', 0, 0, NULL, 0, N'2026-03-24 03:01:38.549052', N'2026-03-24 03:01:38.549052');
SET IDENTITY_INSERT dbo.[login_attempts] OFF;

-- Data for dbo.session
INSERT INTO dbo.[session] ([sid], [sess], [expire]) VALUES (N'RsQj7_WeEbQMYb5DlkJ9Qpr8NRIZEPx9', N'{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:05:22.814Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}', N'2026-03-24 23:18:17');
INSERT INTO dbo.[session] ([sid], [sess], [expire]) VALUES (N'f_Nlu34P1AAqfxCAK_uJwzvrhHYaxvP3', N'{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:15:07.904Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}', N'2026-03-24 23:18:45');
INSERT INTO dbo.[session] ([sid], [sess], [expire]) VALUES (N'GZNio-xxJwWiBbO7krd62teW2q7MMFCD', N'{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-25T02:38:28.969Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}', N'2026-03-25 03:01:58');
INSERT INTO dbo.[session] ([sid], [sess], [expire]) VALUES (N'45t5yA69EhW-0sOlzTQxVxSh9Xbc7gf9', N'{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-24T23:18:12.413Z","secure":true,"httpOnly":true,"path":"/","sameSite":"lax"},"userId":1,"userName":"Administrador"}', N'2026-03-24 23:21:36');

-- Data for dbo.situacao_aval
SET IDENTITY_INSERT dbo.[situacao_aval] ON;
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (1, N'Parametrizada - Avalia');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (2, N'Parametrizada - LXP');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (3, N'Gerada');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (4, N'Recursos');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (5, N'Julgamento de Recurso');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (6, N'Finalizada');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (7, N'Cancelada');
INSERT INTO dbo.[situacao_aval] ([id], [situacao]) VALUES (8, N'Confirmar');
SET IDENTITY_INSERT dbo.[situacao_aval] OFF;

-- Data for dbo.tipo_aval
SET IDENTITY_INSERT dbo.[tipo_aval] ON;
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (1, N'Formativa 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (2, N'Avaliação Sequencial 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (3, N'1ª PROVA MULTIDISCIPLINAR');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (4, N'Avaliação Escrita 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (5, N'Formativa 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (6, N'1ª AVD');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (7, N'Somativa 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (8, N'Prova 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (9, N'Avaliação Sequencial 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (10, N'AVD 1');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (11, N'2ª PROVA MULTIDISCIPLINAR');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (12, N'Somativa 1 - Prova Especial');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (13, N'PROVA MÓDULO');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (14, N'3ª PROVA MULTIDISCIPLINAR');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (15, N'Formativa 3');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (16, N'Avaliação Sequencial 3');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (17, N'Prova 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (18, N'Avaliação Teórica 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (19, N'AVD 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (20, N'Avaliação Sequencial 4');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (21, N'Somativa 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (22, N'2ª CHAMADA (PROVA MÓDULO)');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (23, N'Avaliação Escrita 2');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (24, N'Avaliação Substitutiva');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (25, N'Segunda Chamada');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (26, N'Avaliação Substitutiva (Sequencial)');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (27, N'Prova Final');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (28, N'Avaliação Escrita Substitutiva');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (29, N'Avaliação Sequencial Substitutiva');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (30, N'Avaliação Teórica');
INSERT INTO dbo.[tipo_aval] ([id], [tipo]) VALUES (31, N'2ª CHAMADA (MULTIDISCIPLINAR)');
SET IDENTITY_INSERT dbo.[tipo_aval] OFF;

-- Data for dbo.notificacoes_avaliacao
SET IDENTITY_INSERT dbo.[notificacoes_avaliacao] ON;
INSERT INTO dbo.[notificacoes_avaliacao] ([id], [avaliacao_id], [tipo_alteracao], [created_at], [enviada]) VALUES (1, 89, N'UPDATE', N'2025-05-17 16:14:17', 1);
INSERT INTO dbo.[notificacoes_avaliacao] ([id], [avaliacao_id], [tipo_alteracao], [created_at], [enviada]) VALUES (2, 89, N'UPDATE', N'2025-05-17 21:47:40', 1);
INSERT INTO dbo.[notificacoes_avaliacao] ([id], [avaliacao_id], [tipo_alteracao], [created_at], [enviada]) VALUES (3, 1, N'UPDATE', N'2025-05-18 21:05:08', 1);
INSERT INTO dbo.[notificacoes_avaliacao] ([id], [avaliacao_id], [tipo_alteracao], [created_at], [enviada]) VALUES (4, 1, N'UPDATE', N'2025-05-20 16:49:53', 1);
SET IDENTITY_INSERT dbo.[notificacoes_avaliacao] OFF;

ALTER TABLE dbo.avaliacao
    ADD CONSTRAINT fk_avaliacao_disciplina FOREIGN KEY (disciplina_id) REFERENCES dbo.disciplina(id);
ALTER TABLE dbo.avaliacao_laboratorio
    ADD CONSTRAINT fk_avaliacao_laboratorio_conjunto FOREIGN KEY (conjunto_id) REFERENCES dbo.laboratorio_conjuntos(id);
ALTER TABLE dbo.avaliacao_laboratorio
    ADD CONSTRAINT fk_avaliacao_laboratorio_avaliacao FOREIGN KEY (avaliacao_id) REFERENCES dbo.avaliacao(id);
ALTER TABLE dbo.avaliacao
    ADD CONSTRAINT fk_avaliacao_modulo FOREIGN KEY (modulo_id) REFERENCES dbo.modulo(id);
ALTER TABLE dbo.avaliacao
    ADD CONSTRAINT fk_avaliacao_professor FOREIGN KEY (professor_id) REFERENCES dbo.professor(id);
ALTER TABLE dbo.disciplina
    ADD CONSTRAINT fk_disciplina_modulo FOREIGN KEY (modulo_id) REFERENCES dbo.modulo(id);
ALTER TABLE dbo.disciplina
    ADD CONSTRAINT fk_disciplina_professor FOREIGN KEY (professor_id) REFERENCES dbo.professor(id);
ALTER TABLE dbo.login_attempts
    ADD CONSTRAINT fk_login_attempts_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE SET NULL;
GO

CREATE INDEX idx_alertas_gerenciais_status ON dbo.alertas_gerenciais ([status], severidade, criado_em);
CREATE INDEX idx_alertas_gerenciais_origem_referencia ON dbo.alertas_gerenciais (origem, referencia_id);
GO

-- UDFs gerenciais e estrategicas.
CREATE FUNCTION dbo.fn_capacidade_conjunto (
    @p_conjunto_id INT,
    @p_caip BIT
)
RETURNS INT
AS
BEGIN
    DECLARE @capacidade INT;

    SELECT @capacidade = CASE WHEN ISNULL(@p_caip, 0) = 1 THEN qtd_com_total ELSE qtd_sem_total END
    FROM dbo.laboratorio_conjuntos
    WHERE id = @p_conjunto_id;

    RETURN @capacidade;
END;
GO

CREATE FUNCTION dbo.fn_calcular_taxa_ocupacao (
    @p_qtd_alunos INT,
    @p_capacidade INT
)
RETURNS DECIMAL(7,2)
AS
BEGIN
    IF ISNULL(@p_capacidade, 0) <= 0
        RETURN NULL;

    RETURN CAST(ROUND((CAST(ISNULL(@p_qtd_alunos, 0) AS DECIMAL(18,4)) / CAST(@p_capacidade AS DECIMAL(18,4))) * 100, 2) AS DECIMAL(7,2));
END;
GO

CREATE FUNCTION dbo.fn_classificar_risco_avaliacao (
    @p_data DATE,
    @p_horario_ini TIME(0),
    @p_horario_fim TIME(0),
    @p_qtd_alunos INT,
    @p_qtd_objetiva INT,
    @p_qtd_discursiva INT,
    @p_situacao NVARCHAR(50),
    @p_delete_logico BIT
)
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @dias_ate_avaliacao INT;
    DECLARE @situacao NVARCHAR(50) = UPPER(LTRIM(RTRIM(ISNULL(@p_situacao, N''))));

    IF ISNULL(@p_delete_logico, 0) = 1
        RETURN N'INATIVA';

    IF @p_data IS NULL
        RETURN N'CRITICO';

    SET @dias_ate_avaliacao = DATEDIFF(DAY, CAST(GETDATE() AS DATE), @p_data);

    IF @dias_ate_avaliacao BETWEEN 0 AND 7
       AND (
           @p_horario_ini IS NULL
           OR @p_horario_fim IS NULL
           OR @p_qtd_alunos IS NULL
           OR (ISNULL(@p_qtd_objetiva, 0) + ISNULL(@p_qtd_discursiva, 0)) = 0
       )
        RETURN N'CRITICO';

    IF @p_horario_ini IS NULL OR @p_horario_fim IS NULL OR @p_qtd_alunos IS NULL
        RETURN N'ALTO';

    IF @situacao IN (N'', N'CONFIRMAR')
        RETURN N'MEDIO';

    IF @p_data >= CAST(GETDATE() AS DATE)
       AND (ISNULL(@p_qtd_objetiva, 0) + ISNULL(@p_qtd_discursiva, 0)) = 0
        RETURN N'MEDIO';

    RETURN N'BAIXO';
END;
GO

CREATE FUNCTION dbo.fn_indice_demanda_docente (
    @p_professor_id INT,
    @p_data_inicio DATE,
    @p_data_fim DATE
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @indice DECIMAL(10,2);

    SELECT @indice = CAST(ROUND(ISNULL(SUM(
        1.0
        + CASE WHEN caip = 1 THEN 0.25 ELSE 0 END
        + (CAST(ISNULL(qtd_alunos, 0) AS DECIMAL(18,4)) / 100.0)
        + (CASE WHEN horario_ini IS NULL OR horario_fim IS NULL THEN 0 ELSE DATEDIFF(SECOND, horario_ini, horario_fim) / 3600.0 END / 4.0)
    ), 0), 2) AS DECIMAL(10,2))
    FROM dbo.avaliacao
    WHERE professor_id = @p_professor_id
      AND ISNULL(delete_logico, 0) = 0
      AND ISNULL(visivel, 1) = 1
      AND (@p_data_inicio IS NULL OR [data] >= @p_data_inicio)
      AND (@p_data_fim IS NULL OR [data] <= @p_data_fim);

    RETURN ISNULL(@indice, 0);
END;
GO

CREATE VIEW dbo.vw_gerencial_avaliacoes_base AS
SELECT
    a.id AS avaliacao_id,
    a.[data],
    a.horario_ini,
    a.horario_fim,
    CASE WHEN a.horario_ini IS NULL OR a.horario_fim IS NULL THEN NULL ELSE DATEDIFF(MINUTE, a.horario_ini, a.horario_fim) END AS duracao_minutos,
    NULLIF(LTRIM(RTRIM(ISNULL(a.situacao, N''))), N'') AS situacao,
    a.tipo,
    a.qtd_alunos,
    a.caip,
    a.qtd_objetiva,
    a.qtd_discursiva,
    ISNULL(a.qtd_objetiva, 0) + ISNULL(a.qtd_discursiva, 0) AS total_questoes,
    a.modulo_id,
    m.nome AS modulo,
    a.disciplina_id,
    d.descricao AS disciplina,
    a.professor_id,
    p.nome AS professor,
    al.conjunto_id,
    lc.nome AS conjunto_laboratorios,
    dbo.fn_capacidade_conjunto(al.conjunto_id, a.caip) AS capacidade_operacional,
    dbo.fn_calcular_taxa_ocupacao(a.qtd_alunos, dbo.fn_capacidade_conjunto(al.conjunto_id, a.caip)) AS taxa_ocupacao_pct,
    dbo.fn_classificar_risco_avaliacao(a.[data], a.horario_ini, a.horario_fim, a.qtd_alunos, a.qtd_objetiva, a.qtd_discursiva, a.situacao, a.delete_logico) AS risco_gerencial,
    a.updated_at
FROM dbo.avaliacao a
LEFT JOIN dbo.modulo m ON m.id = a.modulo_id
LEFT JOIN dbo.disciplina d ON d.id = a.disciplina_id
LEFT JOIN dbo.professor p ON p.id = a.professor_id
LEFT JOIN dbo.avaliacao_laboratorio al ON al.avaliacao_id = a.id
LEFT JOIN dbo.laboratorio_conjuntos lc ON lc.id = al.conjunto_id
WHERE ISNULL(a.delete_logico, 0) = 0
  AND ISNULL(a.visivel, 1) = 1;
GO

CREATE VIEW dbo.vw_estrategica_carga_modulo AS
SELECT
    b.modulo_id,
    b.modulo,
    COUNT(*) AS total_avaliacoes,
    SUM(CASE WHEN b.caip = 1 THEN 1 ELSE 0 END) AS avaliacoes_caip,
    SUM(ISNULL(b.qtd_alunos, 0)) AS total_alunos_impactados,
    CAST(ROUND(AVG(CAST(b.taxa_ocupacao_pct AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS ocupacao_media_pct,
    SUM(b.total_questoes) AS total_questoes_planejadas,
    SUM(CASE WHEN b.risco_gerencial IN (N'CRITICO', N'ALTO') THEN 1 ELSE 0 END) AS avaliacoes_em_risco,
    SUM(CASE WHEN UPPER(ISNULL(b.situacao, N'')) <> N'FINALIZADA' THEN 1 ELSE 0 END) AS avaliacoes_nao_finalizadas,
    MIN(b.[data]) AS primeira_avaliacao,
    MAX(b.[data]) AS ultima_avaliacao
FROM dbo.vw_gerencial_avaliacoes_base b
GROUP BY b.modulo_id, b.modulo;
GO

CREATE VIEW dbo.vw_gerencial_ocupacao_laboratorios AS
SELECT
    b.conjunto_id,
    ISNULL(b.conjunto_laboratorios, N'Sem conjunto definido') AS conjunto_laboratorios,
    COUNT(*) AS total_agendamentos,
    SUM(ISNULL(b.qtd_alunos, 0)) AS total_alunos_previstos,
    CAST(ROUND(AVG(CAST(b.capacidade_operacional AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS capacidade_media,
    CAST(ROUND(AVG(CAST(b.taxa_ocupacao_pct AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS ocupacao_media_pct,
    MAX(b.taxa_ocupacao_pct) AS maior_ocupacao_pct,
    SUM(CASE WHEN b.taxa_ocupacao_pct >= 90 THEN 1 ELSE 0 END) AS agendamentos_acima_90_pct,
    SUM(CASE WHEN b.risco_gerencial IN (N'CRITICO', N'ALTO') THEN 1 ELSE 0 END) AS agendamentos_em_risco
FROM dbo.vw_gerencial_avaliacoes_base b
GROUP BY b.conjunto_id, ISNULL(b.conjunto_laboratorios, N'Sem conjunto definido');
GO

CREATE VIEW dbo.vw_estrategica_risco_parametrizacao AS
SELECT
    b.avaliacao_id,
    b.[data],
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
        WHEN N'CRITICO' THEN 1
        WHEN N'ALTO' THEN 2
        WHEN N'MEDIO' THEN 3
        ELSE 4
    END AS prioridade
FROM dbo.vw_gerencial_avaliacoes_base b
WHERE b.risco_gerencial IN (N'CRITICO', N'ALTO', N'MEDIO');
GO

CREATE VIEW dbo.vw_gerencial_produtividade_docente AS
SELECT
    b.professor_id,
    b.professor,
    COUNT(*) AS total_avaliacoes,
    COUNT(DISTINCT b.disciplina_id) AS disciplinas_atendidas,
    COUNT(DISTINCT b.modulo_id) AS modulos_atendidos,
    SUM(ISNULL(b.qtd_alunos, 0)) AS total_alunos_impactados,
    SUM(b.total_questoes) AS total_questoes_planejadas,
    CAST(ROUND(AVG(CAST(b.duracao_minutos AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS duracao_media_minutos,
    dbo.fn_indice_demanda_docente(b.professor_id, NULL, NULL) AS indice_demanda_docente,
    SUM(CASE WHEN b.risco_gerencial IN (N'CRITICO', N'ALTO') THEN 1 ELSE 0 END) AS avaliacoes_em_risco
FROM dbo.vw_gerencial_avaliacoes_base b
GROUP BY b.professor_id, b.professor;
GO

CREATE VIEW dbo.vw_gerencial_seguranca_acessos AS
SELECT
    la.usuario_id,
    u.username,
    u.nome AS usuario,
    DATEFROMPARTS(YEAR(la.created_at), MONTH(la.created_at), 1) AS mes_referencia,
    COUNT(*) AS total_tentativas_registradas,
    SUM(ISNULL(la.attempt_count, 0)) AS total_falhas,
    SUM(ISNULL(la.block_count, 0)) AS total_bloqueios,
    SUM(CASE WHEN ISNULL(la.is_permanently_blocked, 0) = 1 THEN 1 ELSE 0 END) AS bloqueios_permanentes,
    MAX(la.updated_at) AS ultima_ocorrencia,
    CASE
        WHEN SUM(CASE WHEN ISNULL(la.is_permanently_blocked, 0) = 1 THEN 1 ELSE 0 END) > 0 THEN N'CRITICO'
        WHEN SUM(ISNULL(la.block_count, 0)) > 0 THEN N'ALTO'
        WHEN SUM(ISNULL(la.attempt_count, 0)) >= 3 THEN N'MEDIO'
        ELSE N'BAIXO'
    END AS risco_seguranca
FROM dbo.login_attempts la
LEFT JOIN dbo.usuarios u ON u.id = la.usuario_id
GROUP BY la.usuario_id, u.username, u.nome, DATEFROMPARTS(YEAR(la.created_at), MONTH(la.created_at), 1);
GO

CREATE VIEW dbo.vw_gerencial_alertas_ativos AS
SELECT
    ag.id,
    ag.origem,
    ag.referencia_id,
    ag.severidade,
    ag.mensagem,
    ag.[status],
    ag.criado_em,
    ag.payload,
    b.[data] AS data_avaliacao,
    b.modulo,
    b.disciplina,
    b.professor,
    b.tipo AS tipo_avaliacao
FROM dbo.alertas_gerenciais ag
LEFT JOIN dbo.vw_gerencial_avaliacoes_base b ON b.avaliacao_id = ag.referencia_id
WHERE ag.[status] IN (N'ABERTO', N'EM_ANALISE');
GO

CREATE PROCEDURE dbo.sp_consultar_painel_modulo
    @p_data_inicio DATE = NULL,
    @p_data_fim DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.modulo_id,
        b.modulo,
        COUNT(*) AS total_avaliacoes,
        SUM(ISNULL(b.qtd_alunos, 0)) AS total_alunos_impactados,
        CAST(ROUND(AVG(CAST(b.taxa_ocupacao_pct AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS ocupacao_media_pct,
        SUM(CASE WHEN b.risco_gerencial IN (N'CRITICO', N'ALTO') THEN 1 ELSE 0 END) AS avaliacoes_em_risco,
        SUM(CASE WHEN UPPER(ISNULL(b.situacao, N'')) <> N'FINALIZADA' THEN 1 ELSE 0 END) AS pendencias_de_fechamento
    FROM dbo.vw_gerencial_avaliacoes_base b
    WHERE (@p_data_inicio IS NULL OR b.[data] >= @p_data_inicio)
      AND (@p_data_fim IS NULL OR b.[data] <= @p_data_fim)
    GROUP BY b.modulo_id, b.modulo
    ORDER BY avaliacoes_em_risco DESC, total_alunos_impactados DESC, b.modulo;
END;
GO

CREATE PROCEDURE dbo.sp_consultar_ocupacao_laboratorios
    @p_data_inicio DATE = NULL,
    @p_data_fim DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        b.conjunto_id,
        ISNULL(b.conjunto_laboratorios, N'Sem conjunto definido') AS conjunto_laboratorios,
        COUNT(*) AS total_agendamentos,
        SUM(ISNULL(b.qtd_alunos, 0)) AS total_alunos_previstos,
        CAST(ROUND(AVG(CAST(b.capacidade_operacional AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS capacidade_media,
        CAST(ROUND(AVG(CAST(b.taxa_ocupacao_pct AS DECIMAL(18,4))), 2) AS DECIMAL(18,2)) AS ocupacao_media_pct,
        SUM(CASE WHEN b.taxa_ocupacao_pct >= 90 THEN 1 ELSE 0 END) AS agendamentos_acima_90_pct,
        SUM(CASE WHEN b.capacidade_operacional IS NULL OR b.capacidade_operacional = 0 THEN 1 ELSE 0 END) AS agendamentos_sem_capacidade
    FROM dbo.vw_gerencial_avaliacoes_base b
    WHERE (@p_data_inicio IS NULL OR b.[data] >= @p_data_inicio)
      AND (@p_data_fim IS NULL OR b.[data] <= @p_data_fim)
    GROUP BY b.conjunto_id, ISNULL(b.conjunto_laboratorios, N'Sem conjunto definido')
    ORDER BY agendamentos_acima_90_pct DESC, ocupacao_media_pct DESC;
END;
GO

CREATE PROCEDURE dbo.sp_consultar_riscos_avaliacoes
    @p_dias_a_frente INT = 30
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        r.avaliacao_id,
        r.[data],
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
    FROM dbo.vw_estrategica_risco_parametrizacao r
    WHERE r.[data] IS NULL
       OR r.[data] BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, ISNULL(@p_dias_a_frente, 30), CAST(GETDATE() AS DATE))
    ORDER BY r.prioridade, r.[data], r.modulo, r.disciplina;
END;
GO

CREATE PROCEDURE dbo.sp_consultar_seguranca_acessos
    @p_data_inicio DATE = NULL,
    @p_data_fim DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        la.usuario_id,
        u.username,
        u.nome AS usuario,
        la.ip,
        COUNT(*) AS total_registros,
        SUM(ISNULL(la.attempt_count, 0)) AS total_falhas,
        SUM(ISNULL(la.block_count, 0)) AS total_bloqueios,
        CAST(MAX(CASE WHEN ISNULL(la.is_permanently_blocked, 0) = 1 THEN 1 ELSE 0 END) AS BIT) AS possui_bloqueio_permanente,
        MAX(la.updated_at) AS ultima_ocorrencia,
        CASE
            WHEN MAX(CASE WHEN ISNULL(la.is_permanently_blocked, 0) = 1 THEN 1 ELSE 0 END) = 1 THEN N'CRITICO'
            WHEN SUM(ISNULL(la.block_count, 0)) > 0 THEN N'ALTO'
            WHEN SUM(ISNULL(la.attempt_count, 0)) >= 3 THEN N'MEDIO'
            ELSE N'BAIXO'
        END AS risco_seguranca
    FROM dbo.login_attempts la
    LEFT JOIN dbo.usuarios u ON u.id = la.usuario_id
    WHERE (@p_data_inicio IS NULL OR CAST(la.created_at AS DATE) >= @p_data_inicio)
      AND (@p_data_fim IS NULL OR CAST(la.created_at AS DATE) <= @p_data_fim)
    GROUP BY la.usuario_id, u.username, u.nome, la.ip
    ORDER BY
        CASE
            WHEN MAX(CASE WHEN ISNULL(la.is_permanently_blocked, 0) = 1 THEN 1 ELSE 0 END) = 1 THEN 1
            WHEN SUM(ISNULL(la.block_count, 0)) > 0 THEN 2
            WHEN SUM(ISNULL(la.attempt_count, 0)) >= 3 THEN 3
            ELSE 4
        END,
        total_falhas DESC,
        ultima_ocorrencia DESC;
END;
GO

CREATE TRIGGER dbo.trg_alerta_avaliacao_gerencial
ON dbo.avaliacao
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.notificacoes_avaliacao (avaliacao_id, tipo_alteracao)
    SELECT
        ISNULL(i.id, d.id),
        CASE
            WHEN i.id IS NULL THEN N'DELETE'
            WHEN d.id IS NULL THEN N'CREATE'
            WHEN ISNULL(i.delete_logico, 0) = 1 AND ISNULL(d.delete_logico, 0) = 0 THEN N'DELETE'
            ELSE N'UPDATE'
        END
    FROM inserted i
    FULL JOIN deleted d ON d.id = i.id;

    INSERT INTO dbo.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
    SELECT
        N'AVALIACAO',
        d.id,
        N'ALTO',
        N'Avaliacao removida fisicamente. Validar impacto na agenda academica e nos laboratorios.',
        CONCAT(N'{"operacao":"DELETE","avaliacao_id":', d.id, N'}')
    FROM deleted d
    LEFT JOIN inserted i ON i.id = d.id
    WHERE i.id IS NULL;

    INSERT INTO dbo.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
    SELECT
        N'AVALIACAO',
        i.id,
        r.risco,
        N'Avaliacao com risco gerencial de parametrizacao ou execucao.',
        CONCAT(N'{"operacao":"', CASE WHEN d.id IS NULL THEN N'INSERT' ELSE N'UPDATE' END, N'","avaliacao_id":', i.id, N'}')
    FROM inserted i
    LEFT JOIN deleted d ON d.id = i.id
    CROSS APPLY (SELECT dbo.fn_classificar_risco_avaliacao(i.[data], i.horario_ini, i.horario_fim, i.qtd_alunos, i.qtd_objetiva, i.qtd_discursiva, i.situacao, i.delete_logico) AS risco) r
    WHERE r.risco IN (N'CRITICO', N'ALTO');

    INSERT INTO dbo.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
    SELECT
        N'AVALIACAO',
        i.id,
        N'MEDIO',
        N'Mudanca relevante em agenda, demanda ou responsavel da avaliacao.',
        CONCAT(N'{"operacao":"UPDATE","avaliacao_id":', i.id, N'}')
    FROM inserted i
    INNER JOIN deleted d ON d.id = i.id
    WHERE ISNULL(CONVERT(NVARCHAR(30), d.[data], 126), N'') <> ISNULL(CONVERT(NVARCHAR(30), i.[data], 126), N'')
       OR ISNULL(CONVERT(NVARCHAR(30), d.horario_ini, 126), N'') <> ISNULL(CONVERT(NVARCHAR(30), i.horario_ini, 126), N'')
       OR ISNULL(CONVERT(NVARCHAR(30), d.horario_fim, 126), N'') <> ISNULL(CONVERT(NVARCHAR(30), i.horario_fim, 126), N'')
       OR ISNULL(d.qtd_alunos, -1) <> ISNULL(i.qtd_alunos, -1)
       OR ISNULL(d.modulo_id, -1) <> ISNULL(i.modulo_id, -1)
       OR ISNULL(d.disciplina_id, -1) <> ISNULL(i.disciplina_id, -1)
       OR ISNULL(d.professor_id, -1) <> ISNULL(i.professor_id, -1);
END;
GO

CREATE TRIGGER dbo.trg_alerta_login_gerencial
ON dbo.login_attempts
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.alertas_gerenciais (origem, referencia_id, severidade, mensagem, payload)
    SELECT
        N'SEGURANCA_ACESSO',
        i.usuario_id,
        CASE
            WHEN ISNULL(i.is_permanently_blocked, 0) = 1 THEN N'CRITICO'
            WHEN ISNULL(i.block_count, 0) > 0 THEN N'ALTO'
            ELSE N'MEDIO'
        END,
        N'Padrao de acesso exige acompanhamento gerencial de seguranca.',
        CONCAT(N'{"login_attempt_id":', i.id, N',"usuario_id":', ISNULL(CONVERT(NVARCHAR(20), i.usuario_id), N'null'), N'}')
    FROM inserted i
    WHERE ISNULL(i.is_permanently_blocked, 0) = 1
       OR ISNULL(i.block_count, 0) > 0
       OR ISNULL(i.attempt_count, 0) >= 3;
END;
GO

-- Exemplos de uso:
-- EXEC dbo.sp_consultar_painel_modulo @p_data_inicio = '2025-01-01', @p_data_fim = '2025-12-31';
-- EXEC dbo.sp_consultar_ocupacao_laboratorios @p_data_inicio = '2025-01-01', @p_data_fim = '2025-12-31';
-- EXEC dbo.sp_consultar_riscos_avaliacoes @p_dias_a_frente = 30;
-- EXEC dbo.sp_consultar_seguranca_acessos;
