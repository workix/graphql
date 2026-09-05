import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.addColumn('visibility_settings', 'share_active_processes_with_recruiters', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    } catch (e) {
      console.warn('Coluna share_active_processes_with_recruiters já existente ou tabela não encontrada');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    try {
      await queryInterface.removeColumn('visibility_settings', 'share_active_processes_with_recruiters');
    } catch (e) {
      console.warn('Erro ao reverter coluna share_active_processes_with_recruiters');
    }
  }
};
