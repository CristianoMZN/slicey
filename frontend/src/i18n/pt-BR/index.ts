export default {
  failed: 'Ação falhou',
  success: 'Ação realizada com sucesso',
  settings: {
    title: 'Configurações',
    subtitle: 'Gerencie sua conta e preferências',
    sections: {
      account: 'Conta',
      appearance: 'Aparência',
      language: 'Idioma',
      content: 'Preferências de conteúdo',
      session: 'Sessão',
    },
    account: {
      email: 'E-mail',
      accountType: 'Tipo de conta',
      creatorStatus: 'Status do criador',
      types: {
        anonymous: 'Visitante',
        registered: 'Registrado',
        creator: 'Criador',
      },
      creatorStatuses: {
        'not-applicable': 'N/A',
        'pending-review': 'Em análise',
        approved: 'Aprovado',
      },
    },
    appearance: {
      darkMode: 'Modo escuro',
      darkModeCaption: 'Alternar entre interface clara e escura',
    },
    language: {
      label: 'Idioma da interface',
      caption: 'Salvo no seu navegador para próximas visitas',
    },
    content: {
      interestedIn: 'Interesse em',
      interestedInCaption: 'Filtrar perfis por gênero',
      interestedSexuality: 'Tipo de perfil',
      interestedSexualityCaption: 'Filtrar por tipo de perfil',
      options: {
        interestedIn: {
          Mulheres: 'Mulheres',
          Homens: 'Homens',
          Ambos: 'Ambos',
        },
        interestedSexuality: {
          Cis: 'Cis',
          Trans: 'Trans',
          Ambos: 'Ambos',
        },
      },
    },
    session: {
      logout: 'Sair da conta',
      logoutCaption: 'Encerrar a sessão atual',
    },
  },
  notFound: {
    title: 'Perdido no Espaço!',
    subtitle: 'A página que você procura se perdeu pelo universo.',
    hint: 'Não se preocupe — até os melhores exploradores se perdem às vezes.',
    goHome: 'Me leve para casa',
  },
};
