CREATE DATABASE IF NOT EXISTS criadornarrativa DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE criadornarrativa;

-- DROP TABLE IF EXISTS perfil;
CREATE TABLE perfil (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

-- Manter sincronizado com enums/perfil.ts e models/perfil.ts
INSERT INTO perfil (nome) VALUES ('Administrador'), ('Comum');

-- DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  nome varchar(100) NOT NULL,
  idperfil int NOT NULL,
  senha varchar(100) NOT NULL,
  token char(32) DEFAULT NULL,
  exclusao datetime NULL,
  criacao datetime NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY usuario_email_UN (email),
  KEY usuario_exclusao_IX (exclusao),
  KEY usuario_idperfil_FK_IX (idperfil),
  CONSTRAINT usuario_idperfil_FK FOREIGN KEY (idperfil) REFERENCES perfil (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

INSERT INTO usuario (email, nome, idperfil, senha, token, criacao) VALUES ('admin@espm.br', 'Administrador', 1, 'peTcC99vkvvLqGQL7mdhGuJZIvL2iMEqvCNvZw3475PJ:JVyo1Pg2HyDyw9aSOd3gNPT30KdEyiUYCjs7RUzSoYGN', NULL, NOW());

-- DROP TABLE IF EXISTS narrativa;
CREATE TABLE narrativa (
  id int NOT NULL AUTO_INCREMENT,
  idusuario int NOT NULL,
  nome varchar(100) NOT NULL,
  descricao mediumtext NOT NULL,
  criacao datetime NOT NULL,
  PRIMARY KEY (id),
  KEY narrativa_idusuario_FK_IX (idusuario),
  CONSTRAINT narrativa_idusuario_FK FOREIGN KEY (idusuario) REFERENCES usuario (id) ON DELETE CASCADE ON UPDATE RESTRICT
);

-- DROP TABLE IF EXISTS estado;
CREATE TABLE estado (
  id int NOT NULL AUTO_INCREMENT,
  idnarrativa int NOT NULL,
  inicial tinyint NOT NULL,
  versao int NOT NULL,
  titulo varchar(100) NOT NULL,
  descricao mediumtext NULL,
  idestado1 int NOT NULL,
  texto1 varchar(100) NULL,
  idestado2 int NOT NULL,
  texto2 varchar(100) NULL,
  idestado3 int NOT NULL,
  texto3 varchar(100) NULL,
  idestado4 int NOT NULL,
  texto4 varchar(100) NULL,
  idestado5 int NOT NULL,
  texto5 varchar(100) NULL,
  PRIMARY KEY (id),
  KEY estado_idnarrativa_inicial_FK_IX (idnarrativa, inicial),
  UNIQUE KEY estado_idnarrativa_inicial_UN (idnarrativa, titulo),
  CONSTRAINT estado_idnarrativa_FK FOREIGN KEY (idnarrativa) REFERENCES narrativa (id) ON DELETE CASCADE ON UPDATE RESTRICT
);
