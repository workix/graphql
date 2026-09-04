'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('plans', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          code: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            unique: true
          },
          name: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          price_cents: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          currency: {
            type: Sequelize.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'BRL'
          },
          interval: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'month'
          },
          active: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('plan_features', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          plan_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          feature_key: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          limit_value: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true
          },
          enabled: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('subscriptions', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          plan_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'trialing'
          },
          gateway_customer_id: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          gateway_subscription_id: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          current_period_start: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          current_period_end: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          trial_ends_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          cancel_at_period_end: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          founder_discount_pct: {
            type: Sequelize.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('subscription_overrides', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          subscription_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          feature_key: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          limit_value: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true
          },
          expires_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          reason: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('usage_counters', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          feature_key: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          period_start: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          period_end: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          used: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('purchases', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          sku: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          amount_cents: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
          },
          gateway_charge_id: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          status: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'pending'
          },
          credits_granted: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          credits_remaining: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          purchased_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('invoices', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          subscription_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          amount_cents: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'open'
          },
          gateway_invoice_id: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          nfse_number: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          nfse_url: {
            type: Sequelize.DataTypes.STRING(500),
            allowNull: true
          },
          due_date: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          paid_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('webhook_events', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          gateway: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false
          },
          gateway_event_id: {
            type: Sequelize.DataTypes.STRING(150),
            allowNull: false,
            unique: true
          },
          type: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          payload_json: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          received_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          processed_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          error: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('billing_audit_log', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          actor: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          action: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          before_json: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          after_json: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('billing_audit_log', { transaction }),
        queryInterface.dropTable('webhook_events', { transaction }),
        queryInterface.dropTable('invoices', { transaction }),
        queryInterface.dropTable('purchases', { transaction }),
        queryInterface.dropTable('usage_counters', { transaction }),
        queryInterface.dropTable('subscription_overrides', { transaction }),
        queryInterface.dropTable('subscriptions', { transaction }),
        queryInterface.dropTable('plan_features', { transaction }),
        queryInterface.dropTable('plans', { transaction })
      ]);
    });
  }
};
