import db from '../models';

async function seed() {
  console.log('🌱 Iniciando povoamento de dados fictícios para testes...');

  try {
    // Sincroniza tabelas do banco de dados recriando se necessário
    await db.sequelize.sync({ force: true });
    console.log('✅ Estrutura de tabelas verificada.');

    // 1. Criar Usuários no JAASUser (Autenticação JAAS)
    const [jaasCandidate] = await db.JAASUser.findOrCreate({
      where: { login: 'candidato@workix.com' },
      defaults: {
        login: 'candidato@workix.com',
        password: '123456'
      }
    });

    const [jaasCompany] = await db.JAASUser.findOrCreate({
      where: { login: 'empresa@workix.com' },
      defaults: {
        login: 'empresa@workix.com',
        password: '123456'
      }
    });

    // 2. Criar Usuários no User
    const [userCandidate] = await db.User.findOrCreate({
      where: { email: 'candidato@workix.com' },
      defaults: {
        email: 'candidato@workix.com',
        activated: true,
        firebase_uuid: 'fb-uuid-candidate-001',
        verified: true
      }
    });

    const [userCompany] = await db.User.findOrCreate({
      where: { email: 'empresa@workix.com' },
      defaults: {
        email: 'empresa@workix.com',
        activated: true,
        firebase_uuid: 'fb-uuid-company-001',
        verified: true
      }
    });

    console.log('👤 Usuários de teste criados: candidato@workix.com e empresa@workix.com');

    // 3. Criar Candidato Fictício
    const [candidate] = await db.Candidate.findOrCreate({
      where: { user_id: userCandidate.id },
      defaults: {
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
        user_id: userCandidate.id
      }
    });

    console.log('👷 Perfil de Candidato criado.');

    // 4. Criar Empresas Fictícias
    const [company1] = await db.Company.findOrCreate({
      where: { user_id: userCompany.id },
      defaults: {
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
        user_id: userCompany.id
      }
    });

    console.log('🏢 Empresa criada.');

    // 5. Criar Vagas de Emprego Fictícias
    const jobsData = [
      {
        title: 'Desenvolvedor Frontend Vue.js / TypeScript',
        description: 'Buscamos desenvolvedor Frontend experiente em Vue.js 3, Pinia e APIs GraphQL/REST.',
        requirement: 'Experiência prévia em Vue.js, TypeScript e consumo de GraphQL.',
        benefits: 'Vale Refeição, Vale Transporte, Plano de Saúde, Seguro de Vida.',
        job_category: 'Desenvolvimento Web',
        job_type: 'CLT',
        min_payment: 8500.00,
        max_payment: 11000.00,
        activated: true,
        featured: true,
        company_id: company1.id
      },
      {
        title: 'Engenheiro de Software Android (Kotlin)',
        description: 'Vaga para desenvolvimento mobile nativo com Kotlin, Retrofit, ViewModel e MVVM.',
        requirement: 'Domínio de Kotlin nativo, Coroutines e consumo de APIs REST.',
        benefits: 'Horário Flexível, Home Office, Gympass, Plano de Saúde.',
        job_category: 'Desenvolvimento Mobile',
        job_type: 'PJ',
        min_payment: 10000.00,
        max_payment: 14000.00,
        activated: true,
        featured: true,
        company_id: company1.id
      },
      {
        title: 'Arquiteto de Backend Node.js / GraphQL',
        description: 'Atuação na modelagem de microsserviços, cache Redis e mensageria RabbitMQ.',
        requirement: 'Experiência com Node.js, Sequelize, TypeScript e GraphQL.',
        benefits: 'PLR, Auxílio Creche, Plano Odontológico, Plano de Saúde.',
        job_category: 'Backend',
        job_type: 'CLT',
        min_payment: 12000.00,
        max_payment: 16000.00,
        activated: true,
        featured: false,
        company_id: company1.id
      }
    ];

    for (const job of jobsData) {
      await db.Job.findOrCreate({
        where: { title: job.title },
        defaults: job
      });
    }

    console.log('💼 Vagas de emprego criadas.');

    // 6. Criar Currículo Fictício
    await db.Resume.findOrCreate({
      where: { candidate_id: candidate.id },
      defaults: {
        carrer_level: 'Sênior',
        content: 'Desenvolvedor com mais de 6 anos de experiência em TypeScript, Vue.js, Kotlin e Node.js.',
        objective: 'Atuar como Engenheiro de Software Sênior ou Arquiteto Frontend/Mobile.',
        presence: 'Híbrido / Remoto',
        candidate_id: candidate.id
      }
    });

    console.log('📄 Currículo de teste criado.');

    // 7. Criar Autor de Blog
    const [author] = await db.Author.findOrCreate({
      where: { name: 'Redação Workix' },
      defaults: {
        name: 'Redação Workix',
        about_text: 'Canal oficial de notícias, artigos técnicos e tendências do mercado de trabalho.',
        picture: 'https://via.placeholder.com/100'
      }
    });

    // 8. Criar Posts de Blog Fictícios
    const [blog1] = await db.Blog.findOrCreate({
      where: { title: 'Dicas para se Destacar em Entrevistas de Desenvolvimento Mobile' },
      defaults: {
        title: 'Dicas para se Destacar em Entrevistas de Desenvolvimento Mobile',
        content: 'O mercado de desenvolvimento mobile nativo em Kotlin continua em expansão constante...',
        citation: 'Desenvolvimento mobile em Kotlin',
        resume: 'Confira as principais dicas técnicas para entrevistas de Kotlin e Android.',
        date: '2026-08-30',
        author_id: author.id
      }
    });

    console.log('📝 Artigos de blog criados.');

    // 9. Criar Comentários de Teste
    const [comment1] = await db.Comment.findOrCreate({
      where: { text: 'Excelente artigo! Muito esclarecedor sobre arquitetura Android Kotlin.' },
      defaults: {
        name: 'Carlos Candidato Silva',
        email: 'candidato@workix.com',
        text: 'Excelente artigo! Muito esclarecedor sobre arquitetura Android Kotlin.'
      }
    });

    await db.BlogComment.findOrCreate({
      where: { blog_id: blog1.id, comment_id: comment1.id },
      defaults: {
        blog_id: blog1.id,
        comment_id: comment1.id
      }
    });

    console.log('💬 Comentários criados.');
    console.log('🎉 Povoamento de dados concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a execução do seeder:', error);
    process.exit(1);
  }
}

seed();
