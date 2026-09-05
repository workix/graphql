import bcrypt from 'bcrypt';
import db from '../models';

async function seedAll() {
  console.log('🌱 Iniciando o povoamento completo de TODAS as tabelas do banco de dados...');

  try {
    // Sincroniza e recria todas as tabelas do banco
    await db.sequelize.sync({ force: true });
    console.log('✅ 100% da estrutura de tabelas criada no banco SQLite.');

    const defaultHash = await bcrypt.hash('123456', 10);

    // 1. JAAS Roles e Usuários de Autenticação
    const rolesList = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_CANDIDATE', 'ROLE_COMPANY'];
    for (const r of rolesList) {
      if (db.JAASRole) {
        await db.JAASRole.findOrCreate({ where: { name: r }, defaults: { name: r } });
      }
    }

    const jaasCand = await db.JAASUser.create({ login: 'candidato@workix.com', password: '123456' });
    const jaasComp = await db.JAASUser.create({ login: 'empresa@workix.com', password: '123456' });
    const jaasAdmin = await db.JAASUser.create({ login: 'admin@workix.com', password: '123456' });

    if (db.JAASRoles) {
      await db.JAASRoles.create({ id: jaasCand.id, role_name: 'ROLE_CANDIDATE' });
      await db.JAASRoles.create({ id: jaasComp.id, role_name: 'ROLE_COMPANY' });
      await db.JAASRoles.create({ id: jaasAdmin.id, role_name: 'ROLE_ADMIN' });
    }

    // 2. Usuários Principais e Perfis
    const userCand = await db.User.create({
      email: 'candidato@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-candidate-001',
      verified: true,
      verification_method: 'WORK_EMAIL'
    });

    const userComp = await db.User.create({
      email: 'empresa@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-company-001',
      verified: true,
      verification_method: 'GOV_ID'
    });

    const userAdmin = await db.User.create({
      email: 'admin@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-admin-001',
      verified: true,
      verification_method: 'PHONE'
    });

    // Usuários de teste adicionais para desenvolvimento local
    const extraEmails = ['admin@admin.com', 'teste@teste.com', 'user@workix.com', 'candidato@test.com', 'empresa@test.com', 'frmichetti@gmail.com'];
    for (let i = 0; i < extraEmails.length; i++) {
      const e = extraEmails[i];
      await db.User.create({
        email: e,
        activated: true,
        firebase_uuid: `fb-uuid-extra-${i + 1}`,
        verified: true,
        verification_method: 'WORK_EMAIL'
      });
    }

    if (db.UserProfile) {
      await db.UserProfile.create({
        user_id: userCand.id,
        headline: 'Desenvolvedor Full Stack | Vue.js & Kotlin',
        about: 'Profissional com vasta experiência em engenharia de software.',
        location: 'São Paulo, SP',
        industry: 'Tecnologia da Informação',
        open_to_work: true
      });
      await db.UserProfile.create({
        user_id: userComp.id,
        headline: 'Plataforma Corporativa de Tecnologia',
        about: 'Líder em recrutamento e soluções corporativas de TI.',
        location: 'São Paulo, SP',
        industry: 'Recrutamento & Seleção',
        open_to_work: false
      });
    }

    console.log('👤 Usuários, Autenticação JAAS e Perfis criados.');

    // 3. Candidato e Empresa
    const candidate = await db.Candidate.create({
      name: 'Carlos Candidato Silva',
      cpf: 12345678901,
      birth_date: '1995-05-15',
      mobile_phone: 11999998888,
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Pinheiros',
      number: '100',
      street: 'Av. Rebouças',
      zip_code: 5401000,
      user_id: userCand.id
    });

    const company = await db.Company.create({
      name: 'Tech Corp Brasil',
      cnpj: 12345678000199,
      description: 'Empresa de tecnologia líder em desenvolvimento de software e IA.',
      logo: 'https://via.placeholder.com/150',
      segment: 'Tecnologia da Informação',
      mobile_phone: 1133334444,
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Bela Vista',
      number: '1000',
      street: 'Av. Paulista',
      zip_code: 1310100,
      user_id: userComp.id
    });

    if (db.CompanyAdmin) {
      await db.CompanyAdmin.create({ company_id: company.id, user_id: userComp.id, role: 'OWNER' });
    }
    if (db.CompanyPage) {
      await db.CompanyPage.create({ name: 'Tech Corp Brasil', industry: 'Tecnologia', size: '50-200', description: 'Sobre a Tech Corp: Inovação constante.' });
    }
    if (db.CompanyMedia) {
      await db.CompanyMedia.create({ id: company.id, media: 'logo.jpg', url: 'https://via.placeholder.com/600x400' });
    }
    if (db.CompanyFollower) {
      await db.CompanyFollower.create({ company_id: company.id, user_id: userCand.id });
    }

    console.log('🏢 Empresa e Perfil do Candidato criados.');

    // 4. Vagas de Emprego, Inscrições e Processo Seletivo
    const job1 = await db.Job.create({
      title: 'Desenvolvedor Frontend Vue.js / TypeScript',
      description: 'Buscamos desenvolvedor Frontend experiente em Vue.js 3, Pinia e APIs GraphQL/REST.',
      requirement: 'Experiência prévia em Vue.js, TypeScript e consumo de GraphQL.',
      benefits: 'Vale Refeição, Vale Transporte, Plano de Saúde, Seguro de Vida.',
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      employment_type: 'CLT',
      categories: JSON.stringify(['FREELANCE', 'PRIMEIRA_OPORTUNIDADE']),
      min_payment: 8500.00,
      max_payment: 11000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job2 = await db.Job.create({
      title: 'Engenheiro de Software Android (Kotlin)',
      description: 'Vaga para desenvolvimento mobile nativo com Kotlin, Retrofit, ViewModel e MVVM.',
      requirement: 'Domínio de Kotlin nativo, Coroutines e consumo de APIs REST.',
      benefits: 'Horário Flexível, Home Office, Gympass, Plano de Saúde.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'PJ',
      categories: JSON.stringify(['MEIO_PERIODO']),
      min_payment: 10000.00,
      max_payment: 14000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job3 = await db.Job.create({
      title: 'Arquiteto de Backend Node.js / GraphQL',
      description: 'Atuação na modelagem de microsserviços, cache Redis e mensageria RabbitMQ.',
      requirement: 'Experiência com Node.js, Sequelize, TypeScript e GraphQL.',
      benefits: 'PLR, Auxílio Creche, Plano Odontológico, Plano de Saúde.',
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      employment_type: 'PJ',
      categories: JSON.stringify(['FREELANCE']),
      min_payment: 12000.00,
      max_payment: 16000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job4 = await db.Job.create({
      title: 'Estágio em Desenvolvimento de Software & Web',
      description: 'Programa de estágio para estudantes de Tecnologia. Oportunidade prática com mentoria em JavaScript, Vue.js e Node.js.',
      requirement: 'Estar cursando Ciência da Computação, Análise de Sistemas ou áreas correlatas.',
      benefits: 'Bolsa Auxílio, Vale Transporte, Vale Refeição, Seguro de Vida, Recesso Remunerado.',
      job_category: 'OPERATOR',
      job_type: 'INTERNSHIP',
      employment_type: 'CLT',
      categories: JSON.stringify(['ESTAGIO', 'PRIMEIRA_OPORTUNIDADE']),
      min_payment: 2000.00,
      max_payment: 2800.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job5 = await db.Job.create({
      title: 'Engenheiro de Confiabilidade & Suporte DevOps Noturno',
      description: 'Monitoramento de servidores, alertas e resposta a incidentes críticos em período noturno com adicional assegurado.',
      requirement: 'Conhecimentos em Linux, Docker, Kubernetes e observabilidade (Prometheus/Grafana).',
      benefits: 'Adicional Noturno, Plano de Saúde, Vale Alimentação, Auxílio Internet.',
      job_category: 'OPERATOR',
      job_type: 'PARTTIME',
      employment_type: 'CLT',
      categories: JSON.stringify(['NOTURNO', 'MEIO_PERIODO']),
      min_payment: 6500.00,
      max_payment: 9000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job6 = await db.Job.create({
      title: 'Técnico de Infraestrutura de Redes em Alta Tensão',
      description: 'Atividades presenciais em subestações elétricas e data centers com adicional de periculosidade de 30% garantido por lei.',
      requirement: 'Curso técnico em Eletrotécnica ou Telecomunicações, NR-10 e NR-35 em dia.',
      benefits: 'Adicional de Periculosidade 30%, Vale Refeição, Seguro de Vida, Cesta Básica.',
      job_category: 'OPERATOR',
      job_type: 'TEMPORARY',
      employment_type: 'CONTRATO_TEMPORARIO',
      categories: JSON.stringify(['PERICULOSIDADE', 'TEMPORARIO']),
      min_payment: 5500.00,
      max_payment: 8000.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    const job7 = await db.Job.create({
      title: 'Desenvolvedor Fullstack Vue & Node.js Freelancer',
      description: 'Desenvolvimento sob demanda para novos módulos de plataforma web, com atuação 100% remota e flexibilidade total de horários.',
      requirement: 'Portfólio com projetos Vue.js e backend Node.js, disponibilidade para entregas por sprint.',
      benefits: 'Flexibilidade de horário, 100% Remoto, Pagamento quinzenal por demanda.',
      job_category: 'OPERATOR',
      job_type: 'FREELANCE',
      employment_type: 'PJ',
      categories: JSON.stringify(['FREELANCE']),
      min_payment: 8000.00,
      max_payment: 13000.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    const job8 = await db.Job.create({
      title: 'Analista de Suporte Técnico Júnior (Primeiro Emprego)',
      description: 'Oportunidade de entrada na área de TI para candidatos sem experiência prévia. Treinamento completo oferecido pela empresa.',
      requirement: 'Ensino Médio completo, boa comunicação e facilidade com informática.',
      benefits: 'Vale Transporte, Vale Refeição, Convênio Médico, Plano de Carreira.',
      job_category: 'OPERATOR',
      job_type: 'PARTTIME',
      employment_type: 'CLT',
      categories: JSON.stringify(['PRIMEIRA_OPORTUNIDADE', 'MEIO_PERIODO']),
      min_payment: 3200.00,
      max_payment: 4500.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    const job9 = await db.Job.create({
      title: 'Operador de Datacenter e Instalações Críticas Noturno',
      description: 'Manutenção e operação de geradores e nobreaks de grande porte no turno da noite. Adicionais noturno e de periculosidade inclusos.',
      requirement: 'Experiência com manutenção predial e elétrica em data centers.',
      benefits: 'Adicional Noturno, Adicional de Periculosidade, Plano de Saúde, Vale Alimentação.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'CLT',
      categories: JSON.stringify(['NOTURNO', 'PERICULOSIDADE']),
      min_payment: 7200.00,
      max_payment: 9800.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    const job10 = await db.Job.create({
      title: 'Desenvolvedor Frontend Temporário (Projeto 6 Meses)',
      description: 'Contrato temporário para refatoração e lançamento de novo portal de e-commerce de grande porte.',
      requirement: 'Sólida experiência com Vue.js, Pinia, TypeScript e CSS responsivo.',
      benefits: 'Salário compatível com mercado, Equipamento fornecido pela empresa, Atuação Híbrida/Remota.',
      job_category: 'OPERATOR',
      job_type: 'TEMPORARY',
      employment_type: 'CONTRATO_TEMPORARIO',
      categories: JSON.stringify(['TEMPORARIO', 'FREELANCE']),
      min_payment: 9000.00,
      max_payment: 12500.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    const job11 = await db.Job.create({
      title: 'Engenheiro de Software Backend Golang / Cloud (100% Remoto)',
      description: 'Buscamos desenvolvedor Backend para atuar em microsserviços distribuídos de alta escala. Trabalho 100% home office com flexibilidade geográfica total.',
      requirement: 'Experiência sólida com Go (Golang), microsserviços, gRPC, Docker, Kubernetes e mensageria RabbitMQ/Kafka.',
      benefits: '100% Remoto, Auxílio Home Office R$ 500/mês, Plano de Saúde Nacional Bradesco Top, Acesso a Cursos e Certificações Cloud, Gympass.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'CLT',
      workplace_type: 'REMOTE',
      is_remote: true,
      categories: JSON.stringify(['REMOTO', 'FREELANCE']),
      min_payment: 13000.00,
      max_payment: 18000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job12 = await db.Job.create({
      title: 'Analista de Dados & Business Intelligence (Vaga Afirmativa para PCD)',
      description: 'Oportunidade afirmativa e inclusiva para profissionais com deficiência. Atuação na modelagem de dashboards gerenciais, pipelines de dados e suporte à tomada de decisão.',
      requirement: 'Conhecimento em SQL, Power BI, Python para análise de dados e estatística básica. Apresentação de laudo médico comprobatório na fase final.',
      benefits: 'Ambiente 100% acessível, Flexibilidade de horários para consultas e terapias, Vale Refeição R$ 1.200, Plano de Saúde e Odontológico sem coparticipação, Previdência Privada.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'CLT',
      workplace_type: 'HYBRID',
      is_pcd: true,
      pcd_details: 'Vaga exclusiva para pessoas com deficiência física, auditiva, visual ou neurodivergência com equipe dedicada de suporte e inclusão.',
      accessibility_features: JSON.stringify([
        'Leitor de tela e softwares de acessibilidade homologados',
        'Ambiente adaptado com rampas e elevadores acessíveis',
        'Horário flexível para acompanhamento de saúde',
        'Equipe capacitada em Libras e diversidade'
      ]),
      categories: JSON.stringify(['PCD', 'PRIMEIRA_OPORTUNIDADE']),
      min_payment: 7500.00,
      max_payment: 9800.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job13 = await db.Job.create({
      title: 'Especialista em QA & Testes de Acessibilidade Digital (PCD - 100% Remoto)',
      description: 'Vaga afirmativa para pessoa com deficiência com atuação 100% remota em todo o Brasil. Foco em garantir padrões WCAG, usabilidade e testes em nossas aplicações Web e Mobile.',
      requirement: 'Experiência com testes manuais e automatizados (Cypress, Jest), conhecimento das diretrizes WCAG 2.1 e leitores de tela (NVDA, TalkBack, VoiceOver).',
      benefits: '100% Remoto, Equipamentos ergonômicos e tecnologias assistivas custeadas pela empresa, Auxílio Internet, TotalPass, Horário Flexível.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'CLT',
      workplace_type: 'REMOTE',
      is_pcd: true,
      is_remote: true,
      pcd_details: 'Vaga 100% remota aberta para todo o Brasil destinada exclusivamente a candidatos com deficiência.',
      accessibility_features: JSON.stringify([
        'Trabalho 100% em home office sem deslocamento',
        'Tecnologias assistivas fornecidas pela empresa',
        'Comunicação assíncrona acessível'
      ]),
      categories: JSON.stringify(['PCD', 'REMOTO']),
      min_payment: 8000.00,
      max_payment: 11500.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job14 = await db.Job.create({
      title: 'Product Designer Sênior UI/UX (Trabalho Remoto)',
      description: 'Design de interfaces limpas, acessíveis e intuitivas para o ecossistema Workix. Atuação com squads multidisciplinares e pesquisa com usuários.',
      requirement: 'Domínio de Figma, Design Systems, Design Tokens e prototipação de alta fidelidade.',
      benefits: '100% Home Office, Bônus anual, Gympass, Convênio médico nacional.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      employment_type: 'PJ',
      workplace_type: 'REMOTE',
      is_remote: true,
      categories: JSON.stringify(['REMOTO', 'FREELANCE']),
      min_payment: 11000.00,
      max_payment: 15000.00,
      activated: true,
      featured: false,
      company_id: company.id
    });

    if (db.JobPosting) {
      await db.JobPosting.create({ company_id: company.id, title: 'Desenvolvedor Frontend Vue.js / TypeScript', description: 'Oportunidade para frontend em Vue.js', location: 'São Paulo', work_type: 'REMOTE' });
    }

    const sp = await db.SelectiveProcess.create({
      activated: true,
      max_candidates: 20,
      job_id: job1.id
    });

    console.log('💼 Vagas de Emprego e Processo Seletivo criados.');

    // 5. Currículo, Experiências, Educação, Habilidades e Recomendações
    const resume1 = await db.Resume.create({
      carrer_level: 'SENIOR',
      content: 'Desenvolvedor com mais de 6 anos de experiência em TypeScript, Vue.js, Kotlin e Node.js.',
      objective: 'Engenheiro de Software Sênior & Arquiteto Frontend',
      presence: 'REMOTE',
      candidate_id: candidate.id
    });

    if (db.ResumeEducation) {
      await db.ResumeEducation.create({
        id: resume1.id,
        school_name: 'Universidade de São Paulo (USP)',
        qualification: 'Bacharelado em Ciência da Computação',
        start_date: '2014-02-01',
        end_date: '2018-12-15'
      });
    }

    if (db.ResumeExperience) {
      await db.ResumeExperience.create({
        id: resume1.id,
        employer_name: 'Tech Innovators',
        job_title: 'Desenvolvedor Full Stack Sênior',
        start_date: '2021-01-01',
        description: 'Liderança de projetos de alta escala com Kotlin e Node.js.'
      });
    }

    if (db.ResumeSkill) {
      await db.ResumeSkill.create({ id: resume1.id, skill_name: 'Kotlin', months: 48 });
    }

    // Candidata 2
    const userCand2 = await db.User.create({
      email: 'mariana.dev@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-candidate-002',
      verified: true
    });

    const candidate2 = await db.Candidate.create({
      name: 'Mariana Souza Lima',
      cpf: 98765432100,
      birth_date: '1998-08-20',
      mobile_phone: 11988887777,
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Moema',
      number: '450',
      street: 'Av. Ibirapuera',
      zip_code: 4524000,
      user_id: userCand2.id
    });

    const resume2 = await db.Resume.create({
      carrer_level: 'MIDDLE',
      content: 'Desenvolvedora Frontend apaixonada por UI/UX, Vue 3, React e Design Systems.',
      objective: 'Desenvolvedora Frontend Pleno',
      presence: 'REMOTE',
      candidate_id: candidate2.id
    });

    // Candidato 3
    const userCand3 = await db.User.create({
      email: 'lucas.mendes@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-candidate-003',
      verified: true
    });

    const candidate3 = await db.Candidate.create({
      name: 'Lucas Mendes Silva',
      cpf: 45678912300,
      birth_date: '2001-03-10',
      mobile_phone: 11977776666,
      city: 'Campinas',
      state: 'SP',
      neighborhood: 'Cambuí',
      number: '210',
      street: 'Rua Coronel Silva',
      zip_code: 1302400,
      user_id: userCand3.id
    });

    const resume3 = await db.Resume.create({
      carrer_level: 'JUNIOR',
      content: 'Desenvolvedor Backend com sólida base em Node.js, SQL, Express e APIs REST/GraphQL.',
      objective: 'Desenvolvedor Backend Júnior',
      presence: 'OFFICE',
      candidate_id: candidate3.id
    });

    if (db.SkillEndorsement) {
      await db.SkillEndorsement.create({ skill_id: resume1.id, endorser_id: userComp.id });
    }

    if (db.Recommendation) {
      await db.Recommendation.create({
        recommender_id: userComp.id,
        recipient_id: userCand.id,
        content: 'Carlos é um profissional excepcional e altamente técnico.'
      });
    }

    console.log('📄 Currículos, Habilidades e Recomendações populados.');

    // 6. Blog, Autores, Categorias, Mídias e Comentários
    const author = await db.Author.create({
      name: 'Redação Workix',
      about_text: 'Canal oficial de notícias, artigos técnicos e tendências do mercado de trabalho.',
      picture: 'https://via.placeholder.com/100'
    });

    if (db.AuthorMedia) {
      await db.AuthorMedia.create({ id: author.id, media: 'avatar.jpg', url: 'https://via.placeholder.com/100' });
    }

    const blog1 = await db.Blog.create({
      title: 'Dicas para se Destacar em Entrevistas de Desenvolvimento Mobile',
      content: 'O mercado de desenvolvimento mobile nativo em Kotlin continua em expansão constante...',
      citation: 'Desenvolvimento mobile em Kotlin',
      resume: 'Confira as principais dicas técnicas para entrevistas de Kotlin e Android.',
      date: '2026-08-30',
      author_id: author.id
    });

    if (db.BlogCategory) {
      await db.BlogCategory.create({ id: blog1.id, category: 'Tecnologia' });
    }
    if (db.BlogTag) {
      await db.BlogTag.create({ id: blog1.id, name: 'Kotlin' });
    }
    if (db.BlogPicture) {
      await db.BlogPicture.create({ id: blog1.id, picture: 'https://via.placeholder.com/800x400' });
    }

    const comment1 = await db.Comment.create({
      name: 'Carlos Candidato Silva',
      email: 'candidato@workix.com',
      text: 'Excelente artigo! Muito esclarecedor sobre arquitetura Android Kotlin.'
    });

    if (db.BlogComment) {
      await db.BlogComment.create({ blog_id: blog1.id, comment_id: comment1.id });
    }

    console.log('📝 Blog, Artigos, Mídias e Comentários populados.');

    // 7. Posts da Rede Social, Hashtags, Reações, Mencionados e Analytics
    if (db.Post) {
      const post1 = await db.Post.create({
        author_id: userCand.id,
        content: 'Muito feliz em compartilhar o lançamento da nossa nova suíte em Kotlin e GraphQL! 🚀'
      });

      if (db.PostAnalytics) {
        await db.PostAnalytics.create({ post_id: post1.id, views_count: 142, impressions_count: 320 });
      }
      let comment1: any;
      if (db.PostComment) {
        comment1 = await db.PostComment.create({ post_id: post1.id, author_id: userComp.id, content: 'Parabéns pela grande conquista!' });
        if (comment1) {
          await db.PostComment.create({ post_id: post1.id, author_id: userCand.id, content: 'Muito obrigado, Tech Corp! Vamos juntos! 🚀', parent_id: comment1.id });
        }
      }
      if (db.PostReaction) {
        await db.PostReaction.create({ post_id: post1.id, user_id: userComp.id, type: 'LIKE' });
      }
      if (db.Hashtag) {
        const tag = await db.Hashtag.create({ tag: 'Kotlin' });
        if (db.PostHashtag) {
          await db.PostHashtag.create({ post_id: post1.id, hashtag_id: tag.id });
        }
      }
      if (db.Mention) {
        await db.Mention.create({ post_id: post1.id, mentioned_user_id: userComp.id });
      }
    }

    // 8. Rede de Conexões, Mensagens e Notificações
    if (db.Follow) {
      await db.Follow.create({ follower_id: userCand.id, following_id: userComp.id });
    }
    if (db.Connection) {
      await db.Connection.create({ user_id_1: userCand.id, user_id_2: userComp.id });
    }
    if (db.ConnectionRequest) {
      await db.ConnectionRequest.create({ requester_id: userCand.id, recipient_id: userAdmin.id, status: 'PENDING' });
    }

    // 9. Grupos e Atividades de Comunidade
    if (db.Group) {
      const group = await db.Group.create({ name: 'Comunidade Android & Kotlin Brasil', description: 'Grupo de discussão sobre desenvolvimento nativo Android.', owner_id: userCand.id });
      if (db.GroupMembership) {
        await db.GroupMembership.create({ group_id: group.id, user_id: userComp.id, role: 'MEMBER' });
      }
      if (db.GroupPost) {
        await db.GroupPost.create({ group_id: group.id, author_id: userCand.id, content: 'Bem-vindos a todos os desenvolvedores Android!' });
      }
    }

    // 10. Cursos LMS, Eventos, Membros e Formulários
    if (db.Course) {
      const course1 = await db.Course.create({
        title: 'Arquitetura de Software Nativa para Android & Kotlin',
        description: 'Domine Clean Architecture, Coroutines, Flow, Jetpack e GraphQL no ecossistema Android moderno.',
        instructor_id: userAdmin.id,
        level: 'INTERMEDIATE',
        category: 'Mobile',
        provider_type: 'PLATFORM',
        duration_hours: 18,
        requirements: 'Conhecimentos básicos de orientação a objetos e sintaxe Kotlin.',
        what_you_will_learn: 'Arquitetura MVVM limpa; Consumo GraphQL e REST; Testes automatizados Espresso; Boas práticas de UI/UX.'
      });

      const course2 = await db.Course.create({
        title: 'Formação Frontend Vue 3, Pinia e TypeScript para Empresas',
        description: 'Capacitação completa corporativa fornecida pela Tech Corp Brasil para desenvolvimento web escalável.',
        instructor_id: userComp.id,
        company_id: company.id,
        level: 'ADVANCED',
        category: 'Frontend',
        provider_type: 'COMPANY',
        duration_hours: 24,
        requirements: 'Experiência com JavaScript moderno ou TypeScript.',
        what_you_will_learn: 'Composition API avançada; Gerenciamento de estado reativo com Pinia; Componentização e Design Systems corporativos.'
      });

      if (db.CourseLesson) {
        await db.CourseLesson.create({
          course_id: course1.id,
          title: 'Introdução e Visão Geral da Arquitetura',
          section_name: 'Módulo 1: Fundamentos e Setup',
          content_type: 'VIDEO',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration_minutes: 15,
          order_index: 1,
          attachment_name: 'slides_modulo1.pdf',
          attachment_url: 'https://example.com/materials/slides_modulo1.pdf',
          description: 'Apresentação detalhada da estrutura e objetivos do curso.'
        });

        await db.CourseLesson.create({
          course_id: course1.id,
          title: 'Kotlin Coroutines e Flow na Prática',
          section_name: 'Módulo 2: Programação Reativa',
          content_type: 'VIDEO',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration_minutes: 25,
          order_index: 2,
          attachment_name: 'exemplos_coroutines.zip',
          attachment_url: 'https://example.com/materials/exemplos_coroutines.zip',
          description: 'Conceitos de concorrência assíncrona, builders e tratamento de erros com Flow.'
        });

        await db.CourseLesson.create({
          course_id: course2.id,
          title: 'Setup do Projeto Vue 3 com Vite e Pinia',
          section_name: 'Seção 1: Arquitetura Frontend',
          content_type: 'VIDEO',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration_minutes: 20,
          order_index: 1,
          attachment_name: 'guia_boas_praticas.pdf',
          attachment_url: 'https://example.com/materials/guia_boas_praticas.pdf',
          description: 'Configuração do ambiente corporativo e estrutura de pastas modular.'
        });
      }

      let enrollment: any;
      if (db.CourseEnrollment) {
        enrollment = await db.CourseEnrollment.create({ course_id: course1.id, user_id: userCand.id });
      }
      if (db.CourseCompletion && enrollment) {
        await db.CourseCompletion.create({ enrollment_id: enrollment.id, certificate_url: 'https://certificados.workix.com/cert/12345' });
      }
    }

    if (db.Event) {
      const evt = await db.Event.create({ title: 'Workix Tech Summit 2026', description: 'O maior evento de carreiras e engenharia de software.', event_type: 'ONLINE', start_time: new Date(), organizer_id: userAdmin.id });
      if (db.EventAttendee) {
        await db.EventAttendee.create({ event_id: evt.id, user_id: userCand.id, status: 'CONFIRMED' });
      }
    }

    if (db.Member) {
      const member = await db.Member.create({ name: 'Ana Oliveira', occupation: 'Engenheira de Dados', picture: 'https://via.placeholder.com/150', short_text: 'Especialista em Big Data' });
      if (db.MemberMedia) {
        await db.MemberMedia.create({ id: member.id, media: 'photo.jpg', url: 'https://via.placeholder.com/150' });
      }
    }

    if (db.Form) {
      await db.Form.create({ name: 'Visitante Fictício', email: 'contato@cliente.com', subject: 'Dúvida sobre planos corporativos', message: 'Gostaria de agendar uma reunião comercial.' });
    }

    if (db.Testimonial) {
      await db.Testimonial.create({ author_id: author.id, picture: 'https://via.placeholder.com/100', signature: 'Carlos Silva', text: 'A plataforma Workix transformou a minha busca de vagas!' });
    }

    if (db.Subscriber) {
      await db.Subscriber.create({ email: 'newsletter@workix.com' });
    }

    if (db.FeaturedItem) {
      await db.FeaturedItem.create({ user_id: userCand.id, type: 'LINK', title: 'Portfólio de Projetos Android', url: 'https://github.com/carlos/portfolio' });
    }

    if (db.MediaAsset) {
      await db.MediaAsset.create({ user_id: userCand.id, file_name: 'banner_tech.jpg', file_type: 'image/jpeg', context: 'BANNER', url: 'https://via.placeholder.com/800x400' });
    }

    // 11. Planos (plans), Capacidades (plan_features), Vitrine (subscription_plans) e Assinaturas
    if (db.Plan && db.PlanFeature) {
      const now = new Date();

      // 11.1 Planos no catálogo geral (db.Plan)
      const planFree = await db.Plan.create({
        id: 1,
        code: 'free_v1',
        name: 'Plano Gratuito Empresa',
        price_cents: 0,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planStarter = await db.Plan.create({
        id: 2,
        code: 'starter_v1',
        name: 'Workix Starter (Empresas)',
        price_cents: 7900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planPro = await db.Plan.create({
        id: 3,
        code: 'pro_v1',
        name: 'Workix Pro (Empresas)',
        price_cents: 24900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planBusiness = await db.Plan.create({
        id: 4,
        code: 'business_v1',
        name: 'Workix Business (Empresas)',
        price_cents: 69900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planCandFree = await db.Plan.create({
        id: 5,
        code: 'candidate_free_v1',
        name: 'Workix Free (Candidato)',
        price_cents: 0,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planCandPremium = await db.Plan.create({
        id: 6,
        code: 'candidate_premium_v1',
        name: 'Workix Premium Mensal (Candidato)',
        price_cents: 1990,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      });

      const planCandPremiumAnnual = await db.Plan.create({
        id: 7,
        code: 'candidate_premium_annual_v1',
        name: 'Workix Premium Anual (Candidato)',
        price_cents: 19900,
        currency: 'BRL',
        interval: 'year',
        active: true,
        created_at: now,
        updated_at: now
      });

      // 11.2 Capacidades e Entitlements por Plano (db.PlanFeature)
      const featuresToInsert = [
        // Free Empresa (Plan 1)
        { plan_id: planFree.id, feature_key: 'max_active_jobs', limit_value: 1, enabled: true },
        { plan_id: planFree.id, feature_key: 'max_users', limit_value: 1, enabled: true },
        { plan_id: planFree.id, feature_key: 'contact_credits', limit_value: 0, enabled: true },
        { plan_id: planFree.id, feature_key: 'boost_credits_monthly', limit_value: 0, enabled: true },
        { plan_id: planFree.id, feature_key: 'has_api', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'retention_days', limit_value: 60, enabled: true },
        { plan_id: planFree.id, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'recruitment_kanban', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'confidential_jobs', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'interview_scheduler', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'candidate_active_processes', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'CREATE_LMS_COURSES', limit_value: 0, enabled: false },
        { plan_id: planFree.id, feature_key: 'MANAGE_GROUPS', limit_value: 0, enabled: false },

        // Starter Empresa (Plan 2)
        { plan_id: planStarter.id, feature_key: 'max_active_jobs', limit_value: 3, enabled: true },
        { plan_id: planStarter.id, feature_key: 'max_users', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'contact_credits', limit_value: 10, enabled: true },
        { plan_id: planStarter.id, feature_key: 'boost_credits_monthly', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'has_api', limit_value: 0, enabled: false },
        { plan_id: planStarter.id, feature_key: 'retention_days', limit_value: 365, enabled: true },
        { plan_id: planStarter.id, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'confidential_jobs', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'interview_scheduler', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true },
        { plan_id: planStarter.id, feature_key: 'CREATE_LMS_COURSES', limit_value: 0, enabled: false },
        { plan_id: planStarter.id, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true },

        // Pro Empresa (Plan 3)
        { plan_id: planPro.id, feature_key: 'max_active_jobs', limit_value: 10, enabled: true },
        { plan_id: planPro.id, feature_key: 'max_users', limit_value: 3, enabled: true },
        { plan_id: planPro.id, feature_key: 'contact_credits', limit_value: 60, enabled: true },
        { plan_id: planPro.id, feature_key: 'boost_credits_monthly', limit_value: 5, enabled: true },
        { plan_id: planPro.id, feature_key: 'has_api', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'retention_days', limit_value: 730, enabled: true },
        { plan_id: planPro.id, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'confidential_jobs', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'interview_scheduler', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'CREATE_LMS_COURSES', limit_value: 1, enabled: true },
        { plan_id: planPro.id, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true },

        // Business Empresa (Plan 4)
        { plan_id: planBusiness.id, feature_key: 'max_active_jobs', limit_value: 30, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'max_users', limit_value: 10, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'contact_credits', limit_value: 250, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'boost_credits_monthly', limit_value: 20, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'has_api', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'retention_days', limit_value: null, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'confidential_jobs', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'interview_scheduler', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'CREATE_LMS_COURSES', limit_value: 1, enabled: true },
        { plan_id: planBusiness.id, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true },

        // Free Candidato (Plan 5)
        { plan_id: planCandFree.id, feature_key: 'contact_credits', limit_value: 0, enabled: true },
        { plan_id: planCandFree.id, feature_key: 'profile_boost_enabled', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'retention_days', limit_value: 7, enabled: true },
        { plan_id: planCandFree.id, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'view_detailed_profile_analytics', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'search_appearances_tracking', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'access_all_lms_courses', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'ssi_diagnostic_report', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true },
        { plan_id: planCandFree.id, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true },
        { plan_id: planCandFree.id, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 0, enabled: false },
        { plan_id: planCandFree.id, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 0, enabled: false },

        // Premium Candidato Mensal (Plan 6)
        { plan_id: planCandPremium.id, feature_key: 'contact_credits', limit_value: 5, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'profile_boost_enabled', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'retention_days', limit_value: 365, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'view_detailed_profile_analytics', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'search_appearances_tracking', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'access_all_lms_courses', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'ssi_diagnostic_report', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 1, enabled: true },
        { plan_id: planCandPremium.id, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 1, enabled: true },

        // Premium Candidato Anual (Plan 7)
        { plan_id: planCandPremiumAnnual.id, feature_key: 'contact_credits', limit_value: 5, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'profile_boost_enabled', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'retention_days', limit_value: 365, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'view_detailed_profile_analytics', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'search_appearances_tracking', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'access_all_lms_courses', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'ssi_diagnostic_report', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 1, enabled: true },
        { plan_id: planCandPremiumAnnual.id, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 1, enabled: true }
      ];

      for (const feat of featuresToInsert) {
        await db.PlanFeature.create({
          ...feat,
          created_at: now,
          updated_at: now
        });
      }

      // 11.3 Assinatura Ativa de Demonstração para a Empresa Tech Corp Brasil (Plano Pro)
      if (db.Subscription) {
        await db.Subscription.create({
          organization_id: company.id,
          plan_id: planPro.id,
          status: 'active',
          current_period_start: now,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          founder_discount_pct: 0.0,
          created_at: now,
          updated_at: now
        });
      }
    }

    // 11.4 Catálogo de Planos de Assinatura para Venda (db.SubscriptionPlan)
    if (db.SubscriptionPlan) {
      const subPlanCandFree = await db.SubscriptionPlan.create({
        name: 'Workix Free (Candidato)',
        price: 0.00,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 0
      });

      const subPlanCandMonthly = await db.SubscriptionPlan.create({
        name: 'Workix Premium Mensal (Candidato)',
        price: 19.90,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 5
      });

      const subPlanCandYearly = await db.SubscriptionPlan.create({
        name: 'Workix Premium Anual (Candidato)',
        price: 199.00,
        billing_period: 'YEARLY',
        inmail_credits_per_month: 5
      });

      const subPlanStarter = await db.SubscriptionPlan.create({
        name: 'Workix Starter (Empresas)',
        price: 79.00,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 10
      });

      const subPlanPro = await db.SubscriptionPlan.create({
        name: 'Workix Pro (Empresas)',
        price: 249.00,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 60
      });

      const subPlanBusiness = await db.SubscriptionPlan.create({
        name: 'Workix Business (Empresas)',
        price: 699.00,
        billing_period: 'MONTHLY',
        inmail_credits_per_month: 250
      });

      // 11.5 Assinatura Ativa de Demonstração para o Candidato Carlos Silva
      if (db.UserSubscription) {
        await db.UserSubscription.create({
          user_id: userCand.id,
          plan_id: subPlanCandMonthly.id,
          status: 'ACTIVE',
          inmail_credits_remaining: 5,
          started_at: new Date(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        await db.UserSubscription.create({
          user_id: userComp.id,
          plan_id: subPlanPro.id,
          status: 'ACTIVE',
          inmail_credits_remaining: 60,
          started_at: new Date(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    }

    console.log('🎉 SUCESSO ABSOLUTO! 100% de TODAS as tabelas do banco de dados foram populadas com dados fictícios!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o povoamento completo:', error);
    process.exit(1);
  }
}

seedAll();
