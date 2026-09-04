import db, { WhiteLabelConfig } from '../../../models';

export interface WhiteLabelConfigAttributes {
  id?: number | string;
  slug: string;
  name: string;
  custom_domain?: string | null;
  logo_url?: string | null;
  logo_dark_url?: string | null;
  favicon_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_color?: string;
  text_color?: string;
  font_family?: string;
  app_title?: string;
  meta_description?: string | null;
  institutional_links?: Record<string, string> | string | null;
  custom_css?: string | null;
  is_active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface TenantResolutionCriteria {
  host?: string | null;
  tenantSlug?: string | null;
  tenantId?: string | number | null;
  domain?: string | null;
}

export const DEFAULT_WHITE_LABEL_CONFIG: WhiteLabelConfigAttributes = {
  id: 1,
  slug: 'default',
  name: 'Workix Default',
  custom_domain: null,
  logo_url: '/assets/branding/workix-logo.svg',
  logo_dark_url: '/assets/branding/workix-logo-dark.svg',
  favicon_url: '/favicon.ico',
  primary_color: '#0A66C2',
  secondary_color: '#004182',
  accent_color: '#70B5F9',
  background_color: '#F3F2EF',
  text_color: '#191919',
  font_family: 'Inter, -apple-system, system-ui, sans-serif',
  app_title: 'Workix - Portal de Vagas e Carreiras',
  meta_description: 'A maior plataforma profissional e rede de empregos e talentos da América Latina.',
  institutional_links: {
    about_url: 'https://workix.com/about',
    terms_url: 'https://workix.com/terms',
    privacy_url: 'https://workix.com/privacy',
    help_url: 'https://workix.com/help'
  },
  custom_css: null,
  is_active: true
};

export class TenantResolverService {
  private static instance: TenantResolverService;
  private cache: Map<string, { data: any; expiresAt: number }> = new Map();
  private cacheTTLMs: number = 60000; // 1 minuto de cache

  public static getInstance(): TenantResolverService {
    if (!TenantResolverService.instance) {
      TenantResolverService.instance = new TenantResolverService();
    }
    return TenantResolverService.instance;
  }

  /**
   * Resolução inteligente de tenant por ID, Slug, Host ou Domínio com fallback seguro.
   */
  public async resolveTenant(criteria: TenantResolutionCriteria): Promise<any> {
    const cacheKey = `resolve:${criteria.tenantId || ''}:${criteria.tenantSlug || ''}:${criteria.domain || ''}:${criteria.host || ''}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    let config: any = null;

    // 1. Tentar por tenantId explícito
    if (criteria.tenantId) {
      config = await this.getConfigById(criteria.tenantId);
    }

    // 2. Tentar por tenantSlug explícito
    if (!config && criteria.tenantSlug) {
      config = await this.getConfigBySlug(criteria.tenantSlug);
    }

    // 3. Tentar por custom_domain ou host
    const domainToLookup = criteria.domain || this.sanitizeHost(criteria.host);
    if (!config && domainToLookup) {
      config = await this.getConfigByDomain(domainToLookup);
    }

    // 4. Fallback para default
    if (!config) {
      config = await this.getDefaultConfig();
    }

    // Merge com os defaults caso campos opcionais estejam vazios
    const merged = this.applyDefaults(config);
    this.setCache(cacheKey, merged);
    return merged;
  }

  public async getConfigBySlug(slug: string): Promise<any> {
    if (!slug) return null;
    const cacheKey = `slug:${slug.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
      if (model) {
        const found = await model.findOne({ where: { slug: slug.toLowerCase(), is_active: true } });
        if (found) {
          const plain = found.toJSON ? found.toJSON() : found;
          const merged = this.applyDefaults(plain);
          this.setCache(cacheKey, merged);
          return merged;
        }
      }
    } catch (e) {
      // Caso ocorra erro de banco ou tabela ainda não migrada
    }

    if (slug.toLowerCase() === 'default') {
      return DEFAULT_WHITE_LABEL_CONFIG;
    }
    return null;
  }

  public async getConfigByDomain(domain: string): Promise<any> {
    if (!domain) return null;
    const cleanDomain = domain.toLowerCase().trim();
    const cacheKey = `domain:${cleanDomain}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
      if (model) {
        const found = await model.findOne({ where: { custom_domain: cleanDomain, is_active: true } });
        if (found) {
          const plain = found.toJSON ? found.toJSON() : found;
          const merged = this.applyDefaults(plain);
          this.setCache(cacheKey, merged);
          return merged;
        }
      }
    } catch (e) {
      // Ignora erro e recorre a fallback
    }

    return null;
  }

  public async getConfigById(id: string | number): Promise<any> {
    if (!id) return null;
    const cacheKey = `id:${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
      if (model) {
        const found = await model.findByPk(id);
        if (found && found.is_active) {
          const plain = found.toJSON ? found.toJSON() : found;
          const merged = this.applyDefaults(plain);
          this.setCache(cacheKey, merged);
          return merged;
        }
      }
    } catch (e) {
      // Ignora erro
    }
    return null;
  }

  public async getDefaultConfig(): Promise<any> {
    const fromDb = await this.getConfigBySlug('default');
    if (fromDb) return fromDb;
    return DEFAULT_WHITE_LABEL_CONFIG;
  }

  public async getAllConfigs(): Promise<any[]> {
    try {
      const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
      if (model) {
        const list = await model.findAll({ order: [['id', 'ASC']] });
        return list.map((item: any) => this.applyDefaults(item.toJSON ? item.toJSON() : item));
      }
    } catch (e) {
      // Fallback
    }
    return [DEFAULT_WHITE_LABEL_CONFIG];
  }

  public async upsertConfig(input: WhiteLabelConfigAttributes): Promise<any> {
    const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
    if (!model) {
      throw new Error('Modelo WhiteLabelConfig não disponível.');
    }

    const payload: any = {
      ...input,
      slug: input.slug.toLowerCase().trim(),
      custom_domain: input.custom_domain ? input.custom_domain.toLowerCase().trim() : null
    };

    let record: any = null;
    if (payload.id) {
      record = await model.findByPk(payload.id);
    } else {
      record = await model.findOne({ where: { slug: payload.slug } });
    }

    if (record) {
      await record.update(payload);
    } else {
      record = await model.create(payload);
    }

    this.clearCache();
    const plain = record.toJSON ? record.toJSON() : record;
    return this.applyDefaults(plain);
  }

  public async deleteConfig(id: string | number): Promise<boolean> {
    const model = WhiteLabelConfig || (db && db.WhiteLabelConfig);
    if (!model) return false;

    const target = await model.findByPk(id);
    if (!target) return false;

    if (target.slug === 'default') {
      throw new Error('Não é permitido remover a configuração padrão (default).');
    }

    await target.destroy();
    this.clearCache();
    return true;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public buildCssVariables(config: WhiteLabelConfigAttributes): string {
    const primary = config.primary_color || DEFAULT_WHITE_LABEL_CONFIG.primary_color;
    const secondary = config.secondary_color || DEFAULT_WHITE_LABEL_CONFIG.secondary_color;
    const accent = config.accent_color || DEFAULT_WHITE_LABEL_CONFIG.accent_color;
    const bg = config.background_color || DEFAULT_WHITE_LABEL_CONFIG.background_color;
    const text = config.text_color || DEFAULT_WHITE_LABEL_CONFIG.text_color;
    const font = config.font_family || DEFAULT_WHITE_LABEL_CONFIG.font_family;

    return `:root {
  --brand-primary: ${primary};
  --brand-secondary: ${secondary};
  --brand-accent: ${accent};
  --brand-background: ${bg};
  --brand-text: ${text};
  --brand-font: ${font};
}`;
  }

  private sanitizeHost(host?: string | null): string | null {
    if (!host) return null;
    // Remove porta se presente (ex: "vagas.cliente.com:4000" -> "vagas.cliente.com")
    const clean = host.split(':')[0].trim().toLowerCase();
    if (clean === 'localhost' || clean === '127.0.0.1') {
      return null;
    }
    return clean;
  }

  private applyDefaults(config: any): any {
    if (!config) return { ...DEFAULT_WHITE_LABEL_CONFIG };
    let links = config.institutional_links;
    if (typeof links === 'string') {
      try {
        links = JSON.parse(links);
      } catch (e) {
        links = DEFAULT_WHITE_LABEL_CONFIG.institutional_links;
      }
    }

    return {
      id: config.id ?? 1,
      slug: config.slug || DEFAULT_WHITE_LABEL_CONFIG.slug,
      name: config.name || DEFAULT_WHITE_LABEL_CONFIG.name,
      custom_domain: config.custom_domain ?? null,
      logo_url: config.logo_url || DEFAULT_WHITE_LABEL_CONFIG.logo_url,
      logo_dark_url: config.logo_dark_url || DEFAULT_WHITE_LABEL_CONFIG.logo_dark_url,
      favicon_url: config.favicon_url || DEFAULT_WHITE_LABEL_CONFIG.favicon_url,
      primary_color: config.primary_color || DEFAULT_WHITE_LABEL_CONFIG.primary_color,
      secondary_color: config.secondary_color || DEFAULT_WHITE_LABEL_CONFIG.secondary_color,
      accent_color: config.accent_color || DEFAULT_WHITE_LABEL_CONFIG.accent_color,
      background_color: config.background_color || DEFAULT_WHITE_LABEL_CONFIG.background_color,
      text_color: config.text_color || DEFAULT_WHITE_LABEL_CONFIG.text_color,
      font_family: config.font_family || DEFAULT_WHITE_LABEL_CONFIG.font_family,
      app_title: config.app_title || DEFAULT_WHITE_LABEL_CONFIG.app_title,
      meta_description: config.meta_description || DEFAULT_WHITE_LABEL_CONFIG.meta_description,
      institutional_links: links || DEFAULT_WHITE_LABEL_CONFIG.institutional_links,
      custom_css: config.custom_css || null,
      is_active: config.is_active !== undefined ? config.is_active : true,
      created_at: config.created_at || new Date().toISOString(),
      updated_at: config.updated_at || new Date().toISOString()
    };
  }

  private getFromCache(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTTLMs
    });
  }
}

export const tenantResolverService = TenantResolverService.getInstance();
