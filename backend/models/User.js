// models/User.js
class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = new Date().toISOString();
    }
}

// In-memory database
let users = [];

export const UserModel = {
    // Create a new user
    create: async (userData) => {
        const newUser = new User(
            users.length + 1,
            userData.name,
            userData.email,
            userData.password
        );
        users.push(newUser);
        return newUser;
    },

    // Find user by email
    findByEmail: (email) => {
        return users.find(user => user.email === email);
    },

    // Find user by ID
    findById: (id) => {
        return users.find(user => user.id === id);
    },

    // Get all users (without passwords)
    findAll: () => {
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    },

    // Check if user exists
    exists: (email) => {
        return users.some(user => user.email === email);
    },

    // Delete user (optional)
    deleteById: (id) => {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    },

    // Clear all users (for testing)
    clearAll: () => {
        users = [];
    }
};

export default UserModel;