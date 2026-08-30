module.exports = function(sequelize: any, DataTypes: any) {
  const SkillEndorsement = sequelize.define('SkillEndorsement', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    skill_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    endorser_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'skill_endorsements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SkillEndorsement;
};

export {};
