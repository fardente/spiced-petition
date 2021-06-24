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

-- INSERT INTO users (firstName, lastName, email, passwordHash) VALUES ('bob', 'odenkirk', 'bobby@gmail.com', '$2a$10$IMZ/mDorZreUHcUb3q5nYuEuujLcdsWJVCAIOWa/v0wO1EUeq70yG');