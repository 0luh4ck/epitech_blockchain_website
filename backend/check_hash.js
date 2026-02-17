import bcrypt from 'bcryptjs';

const password = 'Admin123!';
const hash = '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ7rS3tU5vW8xY1zA4bC6dE';

async function check() {
    const match = await bcrypt.compare(password, hash);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log(`Match: ${match}`);

    const newHash = await bcrypt.hash(password, 10);
    console.log(`New Hash for Admin123!: ${newHash}`);
}

check();
