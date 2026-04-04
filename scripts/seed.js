const { query } = require('../config/database');
const User = require('../models/User');
const Habit = require('../models/Habit');
const SleepLog = require('../models/SleepLog');

const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database with sample data...');

        // Create sample user
        const user = await User.create({
            email: 'demo@example.com',
            password: 'password123',
            name: 'Demo User'
        });
        console.log('✅ Sample user created');

        // Create sample habits
        const habits = [
            {
                user_id: user.id,
                name: 'Morning Exercise',
                description: '30 minutes of cardio or strength training',
                frequency: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                start_time: '06:00',
                end_time: '06:30',
                category: 'Health',
                goal: 30
            },
            {
                user_id: user.id,
                name: 'Read for 30 minutes',
                description: 'Read books, articles, or educational content',
                frequency: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                start_time: '20:00',
                end_time: '20:30',
                category: 'Learning',
                goal: 30
            },
            {
                user_id: user.id,
                name: 'Meditate',
                description: '10 minutes of mindfulness meditation',
                frequency: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                start_time: '07:00',
                end_time: '07:10',
                category: 'Wellness',
                goal: 30
            }
        ];

        for (const habitData of habits) {
            await Habit.create(habitData);
        }
        console.log('✅ Sample habits created');

        // Create sample habit logs (last 30 days)
        const habitIds = [1, 2, 3]; // Assuming auto-increment starts at 1
        const statuses = ['completed', 'missed', 'skipped'];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            for (const habitId of habitIds) {
                // 70% chance of completion
                const status = Math.random() < 0.7 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];

                await Habit.logCompletion(habitId, user.id, date.toISOString().split('T')[0], status);
            }
        }
        console.log('✅ Sample habit logs created');

        // Create sample sleep logs
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const bedTime = new Date(date);
            bedTime.setHours(22, Math.floor(Math.random() * 60)); // 10-11 PM

            const wakeTime = new Date(date);
            wakeTime.setDate(wakeTime.getDate() + 1);
            wakeTime.setHours(6 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)); // 6-8 AM

            const duration = wakeTime.getTime() - bedTime.getTime();
            const quality = Math.floor(Math.random() * 5) + 1; // 1-5

            await SleepLog.create({
                user_id: user.id,
                date: date.toISOString().split('T')[0],
                bed_time: bedTime.toTimeString().split(' ')[0],
                wake_time: wakeTime.toTimeString().split(' ')[0],
                duration: `${Math.floor(duration / (1000 * 60 * 60))}:${Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))}`,
                quality,
                notes: quality >= 4 ? 'Good night\'s sleep' : quality >= 2 ? 'Average sleep' : 'Poor sleep quality'
            });
        }
        console.log('✅ Sample sleep logs created');

        console.log('🎉 Database seeding completed successfully!');
        console.log('📧 Demo user credentials:');
        console.log('   Email: demo@example.com');
        console.log('   Password: password123');

    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
};

// Run seeder if this script is executed directly
if (require.main === module) {
    require('dotenv').config();

    seedDatabase()
        .then(() => {
            console.log('Seeding script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Seeding script failed:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };