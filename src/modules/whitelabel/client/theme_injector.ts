/**
 * Utilitário de injeção dinâmica de identidade visual White Label para aplicações Frontend (Web e Mobile).
 * Suporta execução em navegadores, SSR e mapeamento para temas mobile (Android/React Native).
 */

export interface WhiteLabelConfigDTO {
  id: string | number;
  slug: string;
  name: string;
  custom_domain?: string | null;
  logo_url?: string | null;
  logo_dark_url?: string | null;
  favicon_url?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  app_title: string;
  meta_description?: string | null;
  institutional_links?: {
    about_url?: string;
    terms_url?: string;
    privacy_url?: string;
    help_url?: string;
  } | null;
  custom_css?: string | null;
  css_variables?: string | null;
  is_active: boolean;
}

export interface MobileThemeTokens {
  colorPrimary: string;
  colorPrimaryDark: string;
  colorAccent: string;
  colorBackground: string;
  colorText: string;
  fontFamily: string;
  appName: string;
  logoUrl: string;
  links: Record<string, string>;
}

/**
 * Aplica o tema White Label no DOM dinamicamente no navegador (Client-Side).
 */
export function applyWhiteLabelTheme(config: WhiteLabelConfigDTO): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;

  // 1. Injeta CSS Custom Properties (Design Tokens)
  if (config.primary_color) root.style.setProperty('--brand-primary', config.primary_color);
  if (config.secondary_color) root.style.setProperty('--brand-secondary', config.secondary_color);
  if (config.accent_color) root.style.setProperty('--brand-accent', config.accent_color);
  if (config.background_color) root.style.setProperty('--brand-background', config.background_color);
  if (config.text_color) root.style.setProperty('--brand-text', config.text_color);
  if (config.font_family) root.style.setProperty('--brand-font', config.font_family);

  // 2. Atualiza o título da página
  if (config.app_title) {
    document.title = config.app_title;
  }

  // 3. Atualiza ou cria a meta tag de descrição
  if (config.meta_description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', config.meta_description);
  }

  // 4. Atualiza ou cria o Favicon
  if (config.favicon_url) {
    let faviconLink: HTMLLinkElement | null = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute('href', config.favicon_url);
  }

  // 5. Injeta CSS Customizado seguro
  const STYLE_TAG_ID = 'workix-whitelabel-custom-styles';
  let customStyleEl = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement;
  if (config.custom_css) {
    if (!customStyleEl) {
      customStyleEl = document.createElement('style');
      customStyleEl.id = STYLE_TAG_ID;
      document.head.appendChild(customStyleEl);
    }
    customStyleEl.textContent = config.custom_css;
  } else if (customStyleEl) {
    customStyleEl.remove();
  }
}

/**
 * Converte a configuração White Label em tokens compatíveis com aplicações Mobile Android/React Native.
 */
export function toMobileTheme(config: WhiteLabelConfigDTO): MobileThemeTokens {
  return {
    colorPrimary: config.primary_color,
    colorPrimaryDark: config.secondary_color,
    colorAccent: config.accent_color,
    colorBackground: config.background_color,
    colorText: config.text_color,
    fontFamily: config.font_family,
    appName: config.app_title,
    logoUrl: config.logo_url || '',
    links: (config.institutional_links as Record<string, string>) || {}
  };
}
