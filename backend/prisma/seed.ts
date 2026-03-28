import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed initial data for the database
    // Example: Create default users or places
    const user = await prisma.user.create({
        data: {
            username: 'admin',
            password: 'securepassword', // In a real application, ensure to hash passwords
            email: 'admin@example.com',
        },
    });

    console.log({ user });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });