const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.name = data.name;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Create a new user
    static async create(userData) {
        const { email, password, name } = userData;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const queryText = `
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

        try {
            const result = await query(queryText, [email, password_hash, name]);
            return new User(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const queryText = 'SELECT * FROM users WHERE email = $1';
        const result = await query(queryText, [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return new User(result.rows[0]);
    }

    // Find user by ID
    static async findById(id) {
        const queryText = 'SELECT * FROM users WHERE id = $1';
        const result = await query(queryText, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return new User(result.rows[0]);
    }

    // Update user
    async update(updateData) {
        const { name } = updateData;
        const queryText = `
      UPDATE users
      SET name = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

        const result = await query(queryText, [name, this.id]);
        Object.assign(this, result.rows[0]);
        return this;
    }

    // Verify password
    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password_hash);
    }

    // Generate JWT token
    generateToken() {
        return jwt.sign(
            { id: this.id, email: this.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    // Get user without password hash
    toJSON() {
        const { password_hash, ...user } = this;
        return user;
    }
}

module.exports = User;