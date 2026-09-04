const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const WhiteLabelConfig = sequelize.define('WhiteLabelConfig', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    custom_domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    logo_url: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    logo_dark_url: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    favicon_url: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    primary_color: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '#0A66C2'
    },
    secondary_color: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '#004182'
    },
    accent_color: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '#70B5F9'
    },
    background_color: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '#F3F2EF'
    },
    text_color: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: '#191919'
    },
    font_family: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Inter, -apple-system, system-ui, sans-serif'
    },
    app_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Workix - Portal de Vagas e Carreiras'
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    institutional_links: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('institutional_links');
        if (!raw) return null;
        if (typeof raw === 'object') return raw;
        try {
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      },
      set(val: any) {
        if (val === null || val === undefined) {
          this.setDataValue('institutional_links', null);
        } else if (typeof val === 'string') {
          this.setDataValue('institutional_links', val);
        } else {
          this.setDataValue('institutional_links', JSON.stringify(val));
        }
      }
    },
    custom_css: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'white_label_configs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return WhiteLabelConfig;
};

export {};
