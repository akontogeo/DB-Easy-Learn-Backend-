import { DataTypes } from 'sequelize';
import { getSequelize } from '../config/database.js';

/**
 * Teacher model definition for MariaDB using Sequelize.
 * Extends User table with teacher-specific information.
 */

// ✅ Αυτό είναι το "model factory" που έψαχνες να κάνεις import ως getTeacherModel
export const getTeacherModel = (sequelize = getSequelize()) => {
  if (!sequelize) return null;

  // Αν έχει ήδη οριστεί, γύρνα το έτοιμο
  if (sequelize.models.Teacher) return sequelize.models.Teacher;

  // Αλλιώς όρισέ το
  return sequelize.define(
    'Teacher',
    {
      teacher_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'user_id',
        },
      },
      bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      iban: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'teacher',
    }
  );
};

// ✅ Κρατάμε και το proxy pattern που είχες, αλλά τώρα βασίζεται στο getTeacherModel
const TeacherProxy = new Proxy(
  {},
  {
    get(target, prop) {
      const Teacher = getTeacherModel(); // uses current sequelize
      if (!Teacher) return undefined;
      return Teacher[prop];
    },
  }
);

// ✅ Default export όπως πριν (ώστε να μη σπάσεις άλλα imports)
export default TeacherProxy;
