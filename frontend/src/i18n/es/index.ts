export default {
  failed: 'Acción fallida',
  success: 'Acción realizada con éxito',
  settings: {
    title: 'Configuración',
    subtitle: 'Administra tu cuenta y preferencias',
    sections: {
      account: 'Cuenta',
      appearance: 'Apariencia',
      language: 'Idioma',
      content: 'Preferencias de contenido',
      session: 'Sesión',
    },
    account: {
      email: 'Correo electrónico',
      accountType: 'Tipo de cuenta',
      creatorStatus: 'Estado del creador',
      types: {
        anonymous: 'Visitante',
        registered: 'Registrado',
        creator: 'Creador',
      },
      creatorStatuses: {
        'not-applicable': 'N/A',
        'pending-review': 'En revisión',
        approved: 'Aprobado',
      },
    },
    appearance: {
      darkMode: 'Modo oscuro',
      darkModeCaption: 'Alternar entre interfaz clara y oscura',
    },
    language: {
      label: 'Idioma de la interfaz',
      caption: 'Guardado en tu navegador para próximas visitas',
    },
    content: {
      interestedIn: 'Interesado en',
      interestedInCaption: 'Filtrar perfiles por género',
      interestedSexuality: 'Tipo de perfil',
      interestedSexualityCaption: 'Filtrar por tipo de perfil',
      options: {
        interestedIn: {
          Mulheres: 'Mujeres',
          Homens: 'Hombres',
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
      logout: 'Cerrar sesión',
      logoutCaption: 'Finalizar la sesión actual',
    },
  },
  notFound: {
    title: '¡Perdido en el Espacio!',
    subtitle: 'La página que buscas se ha perdido en el universo.',
    hint: 'No te preocupes — hasta los mejores exploradores se pierden a veces.',
    goHome: 'Llévame a casa',
  },
};
