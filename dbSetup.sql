DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id),
    age INTEGER,
    city VARCHAR(255),
    homepage VARCHAR(255)
);

CREATE TABLE signatures (
    id SERIAL primary key,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id),
    signature TEXT NOT NULL CHECK (signature != '')
);

INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Bob', 'Odenkirk', 'bobby@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Karen', 'Baker', 'karen@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('James', 'Joyce', 'joyce@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Karl', 'Lagerfeld', 'karl@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Miles', 'Davis', 'miles@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Pippi', 'Langstrumpf', 'pippi@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Walter', 'White', 'walter@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Donald', 'Duck', 'donald@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Scrooge', 'McDuck', 'scrooge@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Angus', 'MacGyver', 'angie@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Peter', 'Smith', 'smith@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Leonardo', 'daVinci', 'leo@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Nack', 'Jichelson', 'jack@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Donny', 'Jepp', 'donny@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('The', 'Dude', 'dude@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('Celine', 'Dion', 'celine@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');