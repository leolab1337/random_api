CREATE DATABASE random_api;
USE random_api;

CREATE TABLE User(
    username VARCHAR(30) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE JWT(
    token VARCHAR(255) NOT NULL PRIMARY KEY,
    requestCount INT NOT NULL DEFAULT 0,
    username VARCHAR(30) NOT NULL,
    FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE UserDatabase(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES User(username),
    UNIQUE (name)
);

CREATE TABLE UserAllowed(
    username VARCHAR(30) NOT NULL,
    id INT NOT NULL,
    PRIMARY KEY (username, id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (id) REFERENCES UserDatabase(id)
);

CREATE TABLE Firstname(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(100) NOT NULL
);

CREATE TABLE Lastname(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(100) NOT NULL
);

CREATE TABLE Phone(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value SMALLINT NOT NULL
);

CREATE TABLE Email(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(20) NOT NULL
);

INSERT INTO Firstname (value) VALUES ('John'), ('George'), ('Olivia'), ('Emma');
INSERT INTO Lastname (value) VALUES ('Smith'), ('Brown'), ('Williams'), ('Johnson');
INSERT INTO Phone (value) VALUES (358), (43), (1), (46);
INSERT INTO Email (value) VALUES ('gmail.com'), ('outlook.com'), ('yahoo.com'), ('metropolia.fi');