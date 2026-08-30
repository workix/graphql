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
      min_payment: 12000.00,
      max_payment: 16000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job4 = await db.Job.create({
      title: 'Tech Lead / Arquiteto de Software Fullstack',
      description: 'Responsável técnico por guiar times de engenharia, arquitetar soluções escaláveis e boas práticas.',
      requirement: 'Experiência prévia como Lead Engineer ou Arquiteto em sistemas distribuídos.',
      benefits: 'Salário Competitivo, Stock Options, Plano de Saúde Internacional.',
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      min_payment: 18000.00,
      max_payment: 25000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    const job5 = await db.Job.create({
      title: 'Product Designer (UI/UX) - Mobile & Web',
      description: 'Criação de fluxos de experiência do usuário, wireframes de alta fidelidade e testes de usabilidade.',
      requirement: 'Figma, Design Systems, Protótipos interativos e pesquisa com usuários.',
      benefits: 'Horário Flexível, Vale Alimentação, TotalPass.',
      job_category: 'OPERATOR',
      job_type: 'FULLTIME',
      min_payment: 8000.00,
      max_payment: 12000.00,
      activated: true,
      featured: true,
      company_id: company.id
    });

    if (db.JobPosting) {
      await db.JobPosting.create({ company_id: company.id, title: 'Desenvolvedor Frontend Vue.js / TypeScript', description: 'Oportunidade para frontend em Vue.js', location: 'São Paulo', work_type: 'REMOTE' });
    }
    if (db.JobApplication) {
      await db.JobApplication.create({ job_id: job1.id, candidate_id: candidate.id, status: 'SUBMITTED' });
    }
    if (db.JobCandidate) {
      await db.JobCandidate.create({ job_id: job1.id, candidate_id: candidate.id });
    }

    const sp = await db.SelectiveProcess.create({
      activated: true,
      max_candidates: 20,
      job_id: job1.id
    });

    if (db.SelectiveProcessCandidate) {
      await db.SelectiveProcessCandidate.create({ sp_id: sp.id, candidate_id: candidate.id });
    }

    console.log('💼 Vagas de Emprego, Candidaturas e Processo Seletivo criados.');

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
      if (db.PostComment) {
        await db.PostComment.create({ post_id: post1.id, author_id: userComp.id, content: 'Parabéns pela grande conquista!' });
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
    if (db.DirectMessage) {
      await db.DirectMessage.create({ sender_id: userComp.id, recipient_id: userCand.id, content: 'Olá Carlos, vimos seu currículo e gostamos muito do seu perfil!' });
    }
    if (db.Notification) {
      await db.Notification.create({ user_id: userCand.id, type: 'MESSAGE', title: 'Nova mensagem recebida', body: 'A empresa Tech Corp enviou uma mensagem.' });
    }
    if (db.ProfileView) {
      await db.ProfileView.create({ viewer_id: userComp.id, viewed_id: userCand.id });
    }
    if (db.SocialSellingScore) {
      await db.SocialSellingScore.create({ user_id: userCand.id, score: 78.5, brand_score: 20, network_score: 25, insight_score: 18, relationship_score: 15.5 });
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

    // 10. Cursos, Eventos, Membros e Formulários
    if (db.Course) {
      const course = await db.Course.create({ title: 'Arquitetura de Software Nativa para Android', description: 'Aprenda Kotlin Coroutines, Retrofit, ViewModel e MVVM.', instructor_id: userAdmin.id });
      if (db.CourseLesson) {
        await db.CourseLesson.create({ course_id: course.id, title: 'Introdução às Coroutines', video_url: 'https://youtube.com/watch?v=example' });
      }
      let enrollment: any;
      if (db.CourseEnrollment) {
        enrollment = await db.CourseEnrollment.create({ course_id: course.id, user_id: userCand.id });
      }
      if (db.CourseCompletion && enrollment) {
        await db.CourseCompletion.create({ enrollment_id: enrollment.id, certificate_url: 'https://certificados.exemplo.com/12345' });
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

    // 11. Planos de Assinatura e Inscrições
    if (db.SubscriptionPlan) {
      const plan = await db.SubscriptionPlan.create({ name: 'Plano Premium Recrutador', price: 199.90, billing_period: 'MONTHLY', inmail_credits_per_month: 30 });
      if (db.UserSubscription) {
        await db.UserSubscription.create({ user_id: userComp.id, plan_id: plan.id, status: 'ACTIVE', expires_at: new Date(Date.now() + 30*24*60*60*1000) });
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
