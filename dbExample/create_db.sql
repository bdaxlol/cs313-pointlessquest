CREATE DATABASE gameData;
\c gameData;

CREATE TABLE user_account
(
	id SERIAL PRIMARY KEY NOT NULL,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100),
	admin BOOLEAN,
	created_at date NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player
(
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INT NOT NULL REFERENCES user_account(id),
	name VARCHAR(30) NOT NULL UNIQUE,
	exp_points INT NOT NULL,
	next_lvl INT NOT NULL,
	max_hp INT NOT NULL,
	hp INT NOT NULL,
	strength SMALLINT NOT NULL,
	defense SMALLINT NOT NULL
);

CREATE TABLE enemy_lookup
(
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(30) NOT NULL,
	max_hp INT NOT NULL,
	exp_points INT NOT NULL,
	strength SMALLINT NOT NULL,
	defense SMALLINT NOT NULL
);

CREATE TABLE enemy
(
	id SERIAL PRIMARY KEY NOT NULL,
	type INT NOT NULL REFERENCES enemy_lookup(id),
	hp INT NOT NULL
);

INSERT INTO user_account(username, password, admin)
VALUES ('admin', 'admin', TRUE);

INSERT INTO enemy_lookup(name, max_hp, exp_points, strength, defense) VALUES
	('Slime', 50, 5, 5, 5),
	('Rabbit', 70, 7, 6, 8),
	('Wolf', 150, 18, 15, 8),
	('Bear', 250, 30, 19, 15),
	('Goblin', 100, 35, 25, 18),
	('Orc', 400, 65, 30, 25);

INSERT INTO enemy(type, hp) VALUES
	(1, 50),
	(2, 70),
	(3, 150),
	(4, 250),
	(5, 100),
	(6, 400);

CREATE USER my_user WITH PASSWORD 'my_pass';
GRANT SELECT, INSERT, UPDATE ON person TO my_user;