create database abogados;

use abogados;

CREATE TABLE Abogado (
    id VARCHAR(255) PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Cliente (
    id VARCHAR(255) PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Caso (
    id VARCHAR(255) PRIMARY KEY, 
    nombre VARCHAR(150) NOT NULL,
    resumen TEXT,
    abogado_id VARCHAR(255),
    cliente_id VARCHAR(255) NOT NULL,
    creado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (abogado_id) REFERENCES Abogado(id),
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

CREATE TABLE Documento (
    id VARCHAR(255) PRIMARY KEY, 
    hash_nombre VARCHAR(255) NOT NULL,
    original_nombre VARCHAR(255) NOT NULL,
    caso_id VARCHAR(255) NOT NULL,
    evidencia TEXT,
    creado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caso_id) REFERENCES Caso(id)
);

CREATE TABLE Pago (
	id VARCHAR(255) PRIMARY KEY,
    metodo_pago VARCHAR(255),
    caso_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (caso_id) REFERENCES Caso(id)
);