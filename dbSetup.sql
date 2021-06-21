CREATE TABLE participants (
    id SERIAL primary key,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL CHECK (signature != '')
);
