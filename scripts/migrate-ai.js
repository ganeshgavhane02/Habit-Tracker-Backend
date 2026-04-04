/**
 * Migration script for AI Chat feature
 * Creates chat_messages table for storing chat history
 * 
 * Usage: npm run migrate (in backend folder)
 */

const db = require('../config/database');

async function migrateAIChat() {
    try {
        console.log('🤖 Starting AI Chat migration...');

        // Create chat_messages table
        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                user_message TEXT NOT NULL,
                ai_response TEXT NOT NULL,
                context JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created chat_messages table');

        // Create indexes for common queries
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id 
            ON chat_messages(user_id);
        `);
        console.log('✅ Created index on user_id');

        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at 
            ON chat_messages(created_at DESC);
        `);
        console.log('✅ Created index on created_at');

        // Create a function to auto-update updated_at
        await db.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);
        console.log('✅ Created update_updated_at_column function');

        // Create trigger for auto-update
        await db.query(`
            CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE
            ON chat_messages FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Created trigger for auto-update');

        console.log('\n✅ AI Chat migration completed successfully!');
        console.log('\nTable schema:');
        console.log(`
            chat_messages (
                id          SERIAL PRIMARY KEY,
                user_id     INTEGER (FK to users),
                user_message    TEXT,
                ai_response     TEXT,
                context     JSONB,
                created_at  TIMESTAMP,
                updated_at  TIMESTAMP
            )
        `);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    migrateAIChat()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = migrateAIChat;
