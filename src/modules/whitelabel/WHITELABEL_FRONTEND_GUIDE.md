# Guia de Integração White Label (Frontend Web & Mobile)

Este documento descreve como integrar a arquitetura White Label Multi-Tenant da plataforma Workix nas interfaces de usuário (React Web Cliente, React Web Admin e Aplicativo Android).

---

## 1. Identificação do Tenant

O backend identifica automaticamente o cliente ativo através de:
1. **Domínio / Subdomínio (`Host` header)**: Ex: `vagas.acme.com`, `careers.techcorp.io`
2. **Cabeçalho HTTP explícito**: `x-tenant-slug: acme` ou `x-tenant-id: 2`
3. **Query Parameter (útil em testes e previews)**: `?tenant=acme`
4. **Fallback Padrão**: Se nenhum domínio ou header for reconhecido, a configuração padrão (*Workix Default*) é retornada de forma 100% transparente.

---

## 2. Consulta GraphQL de Branding

Na inicialização da aplicação frontend, execute a query:

```graphql
query GetWhiteLabelConfig($slug: String, $domain: String) {
  whiteLabelConfig(slug: $slug, domain: $domain) {
    id
    slug
    name
    custom_domain
    logo_url
    logo_dark_url
    favicon_url
    primary_color
    secondary_color
    accent_color
    background_color
    text_color
    font_family
    app_title
    meta_description
    institutional_links {
      about_url
      terms_url
      privacy_url
      help_url
    }
    custom_css
    css_variables
  }
}
```

---

## 3. Aplicação Dinâmica de Tema na Web (React / Next.js / Vite)

Utilize o utilitário nativo `@modules/whitelabel/client/theme_injector`:

```typescript
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { applyWhiteLabelTheme } from './modules/whitelabel/client/theme_injector';
import { GET_WHITE_LABEL_CONFIG } from './graphql/queries';

export function WhiteLabelThemeProvider({ children }: { children: React.ReactNode }) {
  const { data, loading } = useQuery(GET_WHITE_LABEL_CONFIG);

  useEffect(() => {
    if (data?.whiteLabelConfig) {
      applyWhiteLabelTheme(data.whiteLabelConfig);
    }
  }, [data]);

  return <>{children}</>;
}
```

### CSS Variables Geradas Automaticamente

A injeção define variáveis no `:root` prontas para consumo em CSS Vanilla ou Styled Components:

```css
:root {
  --brand-primary: #0A66C2;
  --brand-secondary: #004182;
  --brand-accent: #70B5F9;
  --brand-background: #F3F2EF;
  --brand-text: #191919;
  --brand-font: 'Inter', sans-serif;
}

/* Exemplo de uso nos botões e cabeçalhos */
.btn-primary {
  background-color: var(--brand-primary);
  color: #ffffff;
}

.header {
  background-color: var(--brand-secondary);
}
```

---

## 4. Integração no Aplicativo Android (Kotlin / Jetpack Compose)

Para clientes mobile (Android), converta os tokens de tema com `toMobileTheme()` ou consuma diretamente as propriedades do GraphQL:

```kotlin
data class WhiteLabelTheme(
    val colorPrimary: Color,
    val colorPrimaryDark: Color,
    val colorAccent: Color,
    val colorBackground: Color,
    val colorText: Color,
    val appTitle: String,
    val logoUrl: String
)

@Composable
fun AppTheme(
    theme: WhiteLabelTheme,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colors = lightColors(
            primary = theme.colorPrimary,
            primaryVariant = theme.colorPrimaryDark,
            secondary = theme.colorAccent,
            background = theme.colorBackground,
            onPrimary = Color.White,
            onBackground = theme.colorText
        ),
        content = content
    )
}
```

---

## 5. Gerenciamento Administrativo (CRUD)

Administradores globais podem cadastrar novos parceiros ou customizar domínios em tempo real via Mutation:

```graphql
mutation CreateOrUpdateTenant($input: UpsertWhiteLabelConfigInput!) {
  upsertWhiteLabelConfig(input: $input) {
    id
    slug
    name
    custom_domain
    primary_color
    secondary_color
    app_title
    is_active
  }
}
```
