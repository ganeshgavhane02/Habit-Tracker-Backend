const { query } = require('../config/database');

class Habit {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.name = data.name;
        this.description = data.description;
        this.frequency = data.frequency; // JSON array of days
        this.start_time = data.start_time;
        this.end_time = data.end_time;
        this.category = data.category;
        this.goal = data.goal;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Create a new habit
    static async create(habitData) {
        const { user_id, name, description, frequency, start_time, end_time, category, goal } = habitData;

        const queryText = `
      INSERT INTO habits (user_id, name, description, frequency, start_time, end_time, category, goal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

        const result = await query(queryText, [user_id, name, description, frequency, start_time, end_time, category, goal]);
        return new Habit(result.rows[0]);
    }

    // Find habits by user ID
    static async findByUserId(userId) {
        const queryText = 'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await query(queryText, [userId]);
        return result.rows.map(row => new Habit(row));
    }

    // Find habit by ID and user ID
    static async findByIdAndUserId(id, userId) {
        const queryText = 'SELECT * FROM habits WHERE id = $1 AND user_id = $2';
        const result = await query(queryText, [id, userId]);

        if (result.rows.length === 0) {
            return null;
        }

        return new Habit(result.rows[0]);
    }

    // Update habit
    async update(updateData) {
        const { name, description, frequency, start_time, end_time, category, goal } = updateData;

        const queryText = `
      UPDATE habits
      SET name = $1, description = $2, frequency = $3, start_time = $4, end_time = $5,
          category = $6, goal = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `;

        const result = await query(queryText, [name, description, frequency, start_time, end_time, category, goal, this.id, this.user_id]);

        if (result.rows.length === 0) {
            throw new Error('Habit not found');
        }

        Object.assign(this, result.rows[0]);
        return this;
    }

    // Delete habit
    async delete() {
        const queryText = 'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await query(queryText, [this.id, this.user_id]);
        return result.rows.length > 0;
    }

    // Log habit completion
    static async logCompletion(habitId, userId, date, status, notes = null) {
        const queryText = `
      INSERT INTO habit_logs (habit_id, date, status, notes)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (habit_id, date)
      DO UPDATE SET status = $3, notes = $4
      RETURNING *
    `;

        const result = await query(queryText, [habitId, date, status, notes]);
        return result.rows[0];
    }

    // Get habit logs for a date range
    static async getLogs(habitId, userId, startDate, endDate) {
        const queryText = `
      SELECT hl.* FROM habit_logs hl
      JOIN habits h ON hl.habit_id = h.id
      WHERE h.id = $1 AND h.user_id = $2 AND hl.date BETWEEN $3 AND $4
      ORDER BY hl.date DESC
    `;

        const result = await query(queryText, [habitId, userId, startDate, endDate]);
        return result.rows;
    }

    // Get habit completion stats
    static async getStats(habitId, userId, days = 30) {
        const queryText = `
      SELECT
        COUNT(*) as total_logs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_count,
        ROUND(
          COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal /
          NULLIF(COUNT(*), 0) * 100, 2
        ) as completion_rate
      FROM habit_logs hl
      JOIN habits h ON hl.habit_id = h.id
      WHERE h.id = $1 AND h.user_id = $2
            AND hl.date >= CURRENT_DATE - ($3::int * INTERVAL '1 day')
    `;

                const result = await query(queryText, [habitId, userId, days]);
        return result.rows[0];
    }
}

module.exports = Habit;