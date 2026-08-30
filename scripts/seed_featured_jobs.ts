import db from '../src/models';

async function seedFeaturedJobs() {
  console.log('🌟 Cadastrando Vagas em Destaque no Banco de Dados...');

  try {
    // Garante que existe pelo menos uma empresa
    let company = await db.Company.findOne();
    if (!company) {
      const userComp = await db.User.findOne() || await db.User.create({
        email: 'empresa@workix.com',
        activated: true,
        firebase_uuid: 'fb-uuid-empresa-001',
        verified: true
      });

      company = await db.Company.create({
        name: 'Tech Corp Brasil',
        cnpj: 12345678000199,
        description: 'Líder em desenvolvimento de software e soluções em Nuvem.',
        logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
        segment: 'Tecnologia',
        user_id: userComp.id
      });
    }

    const featuredJobsData = [
      {
        title: 'Desenvolvedor Frontend Vue.js 3 / TypeScript Sênior',
        description: 'Venha liderar a construção das novas interfaces web e design systems no Workix.',
        requirement: 'Sólida experiência com Vue.js 3, Composition API, Pinia, TypeScript e Vite.',
        benefits: 'Vale Refeição R$ 1.200, Plano de Saúde Bradesco Top, Auxílio Home Office R$ 300, Gympass.',
        job_category: 'MANAGEMENT',
        job_type: 'FULLTIME',
        min_payment: 12000.00,
        max_payment: 16000.00,
        activated: true,
        featured: true,
        company_id: company.id
      },
      {
        title: 'Engenheiro de Software Android (Kotlin / Jetpack)',
        description: 'Desenvolvimento e manutenção do aplicativo Android Workix com foco em performance e arquitetura limpa.',
        requirement: 'Domínio de Kotlin, Coroutines, StateFlow, Retrofit/GraphQL e Arquitetura MVVM/MVI.',
        benefits: '100% Remoto, PLR Semestral, Horário Flexível, Equipamento Fornecido pela Empresa.',
        job_category: 'OPERATOR',
        job_type: 'FULLTIME',
        min_payment: 10500.00,
        max_payment: 15000.00,
        activated: true,
        featured: true,
        company_id: company.id
      },
      {
        title: 'Especialista Backend Node.js & GraphQL / Apollo',
        description: 'Desenvolvimento de APIs de alto desempenho, barramento de mensageria com RabbitMQ e cache Redis.',
        requirement: 'Conhecimentos avançados em GraphQL, Apollo Server, Node.js, Sequelize/TypeORM e MySQL/SQLite.',
        benefits: 'Assistência Médica e Odontológica, Seguro de Vida, Auxílio Creche, Bônus Anual por Metas.',
        job_category: 'MANAGEMENT',
        job_type: 'FULLTIME',
        min_payment: 13000.00,
        max_payment: 18000.00,
        activated: true,
        featured: true,
        company_id: company.id
      },
      {
        title: 'Tech Lead / Arquiteto de Software Fullstack',
        description: 'Responsável técnico por guiar times de engenharia, arquitetar soluções escaláveis e boas práticas.',
        requirement: 'Experiência prévia como Lead Engineer ou Arquiteto em sistemas distribuídos.',
        benefits: 'Salário Competitivo, Stock Options, Plano de Saúde Internacional, Orçamento para Educação/Cursos.',
        job_category: 'MANAGEMENT',
        job_type: 'FULLTIME',
        min_payment: 18000.00,
        max_payment: 25000.00,
        activated: true,
        featured: true,
        company_id: company.id
      },
      {
        title: 'Product Designer (UI/UX) - Mobile & Web',
        description: 'Criação de fluxos de experiência do usuário, wireframes de alta fidelidade e testes de usabilidade.',
        requirement: 'Figma, Design Systems, Protótipos interativos e pesquisa com usuários.',
        benefits: 'Horário Flexível, Vale Alimentação R$ 900, Vale Refeição R$ 800, TotalPass.',
        job_category: 'OPERATOR',
        job_type: 'FULLTIME',
        min_payment: 8000.00,
        max_payment: 12000.00,
        activated: true,
        featured: true,
        company_id: company.id
      }
    ];

    for (const jobData of featuredJobsData) {
      const existing = await db.Job.findOne({ where: { title: jobData.title } });
      if (existing) {
        await existing.update({ featured: true, activated: true });
        console.log(`✅ Vaga atualizada como destaque: ${jobData.title}`);
      } else {
        await db.Job.create(jobData);
        console.log(`✨ Nova vaga em destaque criada: ${jobData.title}`);
      }
    }

    console.log('🎉 Povoamento de Vagas em Destaque concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao povoar vagas em destaque:', err);
  } finally {
    process.exit(0);
  }
}

seedFeaturedJobs();
