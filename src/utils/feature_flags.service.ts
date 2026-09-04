export class FeatureFlagService {
  private static instance: FeatureFlagService;

  private globalFlags: Map<string, boolean> = new Map([
    ['ENABLE_SEARCH_AI', false],
    ['ENABLE_DIRECT_APPLY', true],
    ['ENABLE_PCD_BADGES', true],
    ['ENABLE_SALARY_INSIGHTS', true],
    ['ENABLE_WHATSAPP_ALERTS', false],
    ['ENABLE_ADVANCED_RELEVANCE', true]
  ]);

  private tenantOverrides: Map<string, Map<string, boolean>> = new Map();

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
      FeatureFlagService.instance.loadFromEnv();
    }
    return FeatureFlagService.instance;
  }

  public isFeatureEnabled(flagKey: string, tenantSlug?: string): boolean {
    const key = flagKey.toUpperCase().trim();

    // 1. Tenta override específico por tenant
    if (tenantSlug) {
      const tenantMap = this.tenantOverrides.get(tenantSlug.toLowerCase());
      if (tenantMap && tenantMap.has(key)) {
        return tenantMap.get(key) === true;
      }
    }

    // 2. Tenta flag global
    if (this.globalFlags.has(key)) {
      return this.globalFlags.get(key) === true;
    }

    // 3. Fallback falso
    return false;
  }

  public getAllFlags(tenantSlug?: string): Array<{ key: string; enabled: boolean; isOverridden: boolean }> {
    const result: Array<{ key: string; enabled: boolean; isOverridden: boolean }> = [];
    const tenantMap = tenantSlug ? this.tenantOverrides.get(tenantSlug.toLowerCase()) : null;

    this.globalFlags.forEach((globalVal, key) => {
      const isOverridden = tenantMap ? tenantMap.has(key) : false;
      const enabled = isOverridden ? tenantMap!.get(key)! : globalVal;

      result.push({
        key,
        enabled,
        isOverridden
      });
    });

    return result;
  }

  public setTenantFlag(tenantSlug: string, flagKey: string, enabled: boolean): void {
    const cleanSlug = tenantSlug.toLowerCase().trim();
    const cleanKey = flagKey.toUpperCase().trim();

    if (!this.tenantOverrides.has(cleanSlug)) {
      this.tenantOverrides.set(cleanSlug, new Map());
    }

    this.tenantOverrides.get(cleanSlug)!.set(cleanKey, enabled);
  }

  public setGlobalFlag(flagKey: string, enabled: boolean): void {
    this.globalFlags.set(flagKey.toUpperCase().trim(), enabled);
  }

  public resetFlags(): void {
    this.tenantOverrides.clear();
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    Object.keys(process.env).forEach(envKey => {
      if (envKey.startsWith('FF_')) {
        const flagName = envKey.substring(3).toUpperCase();
        const value = process.env[envKey]?.toLowerCase() === 'true' || process.env[envKey] === '1';
        this.globalFlags.set(flagName, value);
      }
    });
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
