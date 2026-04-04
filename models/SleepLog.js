const { query } = require('../config/database');

class SleepLog {
    constructor(data) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.date = data.date;
        this.bed_time = data.bed_time;
        this.wake_time = data.wake_time;
        this.duration = data.duration;
        this.quality = data.quality;
        this.notes = data.notes;
    }

    // Create a new sleep log
    static async create(sleepData) {
        const { user_id, date, bed_time, wake_time, duration, quality, notes } = sleepData;

        const queryText = `
      INSERT INTO sleep_logs (user_id, date, bed_time, wake_time, duration, quality, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const result = await query(queryText, [user_id, date, bed_time, wake_time, duration, quality, notes]);
        return new SleepLog(result.rows[0]);
    }

    // Find sleep logs by user ID and date range
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        const queryText = `
      SELECT * FROM sleep_logs
      WHERE user_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC
    `;

        const result = await query(queryText, [userId, startDate, endDate]);
        return result.rows.map(row => new SleepLog(row));
    }

    // Find sleep log by date and user ID
    static async findByDateAndUserId(date, userId) {
        const queryText = 'SELECT * FROM sleep_logs WHERE date = $1 AND user_id = $2';
        const result = await query(queryText, [date, userId]);

        if (result.rows.length === 0) {
            return null;
        }

        return new SleepLog(result.rows[0]);
    }

    // Update sleep log
    async update(updateData) {
        const { bed_time, wake_time, duration, quality, notes } = updateData;

        const queryText = `
      UPDATE sleep_logs
      SET bed_time = $1, wake_time = $2, duration = $3, quality = $4, notes = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;

        const result = await query(queryText, [bed_time, wake_time, duration, quality, notes, this.id, this.user_id]);

        if (result.rows.length === 0) {
            throw new Error('Sleep log not found');
        }

        Object.assign(this, result.rows[0]);
        return this;
    }

    // Delete sleep log
    async delete() {
        const queryText = 'DELETE FROM sleep_logs WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await query(queryText, [this.id, this.user_id]);
        return result.rows.length > 0;
    }

    // Get sleep statistics
    static async getStats(userId, days = 30) {
        const queryText = `
      SELECT
        COUNT(*) as total_nights,
        ROUND(AVG(EXTRACT(EPOCH FROM duration)/3600), 2) as avg_duration_hours,
        ROUND(AVG(quality), 2) as avg_quality,
        MIN(EXTRACT(EPOCH FROM duration)/3600) as min_duration_hours,
        MAX(EXTRACT(EPOCH FROM duration)/3600) as max_duration_hours
      FROM sleep_logs
      WHERE user_id = $1
      AND date >= CURRENT_DATE - INTERVAL '${days} days'
    `;

        const result = await query(queryText, [userId]);
        return result.rows[0];
    }

    // Get sleep quality distribution
    static async getQualityDistribution(userId, days = 30) {
        const queryText = `
      SELECT quality, COUNT(*) as count
      FROM sleep_logs
      WHERE user_id = $1
      AND date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY quality
      ORDER BY quality
    `;

        const result = await query(queryText, [userId]);
        return result.rows;
    }
}

module.exports = SleepLog;