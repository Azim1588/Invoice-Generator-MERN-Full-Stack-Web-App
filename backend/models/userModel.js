const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

class UserModel {
  async getAllUsers() {
    try {
      const data = await fs.readFile(usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getUserById(id) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }

  async getUserByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(user => user.email === email);
  }

  async getUserByUsername(username) {
    const users = await this.getAllUsers();
    return users.find(user => user.username === username);
  }

  async createUser(userData) {
    const users = await this.getAllUsers();
    
    // Check if email or username already exists
    const existingEmail = users.find(user => user.email === userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = users.find(user => user.username === userData.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = {
      id: uuidv4(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id, userData) {
    const users = await this.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return null;
    }

    // If password is being updated, hash it
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    users[index] = {
      ...users[index],
      ...userData,
      id // Ensure ID doesn't change
    };

    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    
    // Return user without password
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  async deleteUser(id) {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false;
    }

    await fs.writeFile(usersFile, JSON.stringify(filteredUsers, null, 2));
    return true;
  }

  async validatePassword(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserModel(); 