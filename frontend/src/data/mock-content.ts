export interface FeedComment {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
}

export interface FeedPost {
  id: number;
  author: string;
  authorId?: number;
  location: string;
  timeAgo: string;
  title: string;
  description: string;
  likes: number;
  liked: boolean;
  media:
    | {
        type: 'text';
      }
    | {
        type: 'audio';
        src: string;
        coverImage: string;
        subtitle: string;
      }
    | {
        type: 'video';
        src: string;
        poster: string;
      }
    | {
        type: 'image';
        src: string;
        alt: string;
      };
  comments: FeedComment[];
}

export type AdGender = 'Feminino' | 'Masculino' | 'Nao-binario';
export type AdSexuality = 'Cis' | 'Trans';

export interface AdProfile {
  id: number;
  name: string;
  city: string;
  badge: string;
  bio: string;
  hourlyRate: string;
  images: string[];
  gender: AdGender;
  sexuality: AdSexuality;
}

export interface AdProfileDetails extends AdProfile {
  coverImage: string;
  profileImage: string;
  age: number;
  neighborhood: string;
  availability: string;
  languages: string[];
  publicData: {
    height: string;
    weight: string;
    bodyType: string;
    hairColor: string;
    eyeColor: string;
    ethnicity: string;
    style: string;
    personalityTraits: string[];
  };
  services: string[];
  gallery: string[];
}

export interface ChatMessage {
  id: number;
  sender: 'me' | 'contact';
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: number;
  contactName: string;
  contactAvatar: string;
  online: boolean;
  city: string;
  lastPreview: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const portraitOne =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80';
const portraitTwo =
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80';
const portraitThree =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';
const portraitFour =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80';
const portraitFive =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80';
const portraitSix =
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80';

export const baseFeedPosts: FeedPost[] = [
  {
    id: 1,
    author: 'Valentina Noir',
    authorId: 1,
    location: 'Sao Paulo',
    timeAgo: '2h',
    title: 'Mensagem de voz exclusiva para os seguidores mais ativos',
    description:
      'Hoje gravei um audio curto contando os bastidores da minha rotina e avisando quando entra o novo ensaio no feed.',
    likes: 186,
    liked: false,
    media: {
      type: 'audio',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverImage: portraitOne,
      subtitle: 'Audio teaser de 01:00',
    },
    comments: [
      { id: 1, author: 'Rafael', timeAgo: '38 min', body: 'Curti muito esse formato de audio, ficou mais proximo.' },
      { id: 2, author: 'Victor', timeAgo: '21 min', body: 'Quando sai a versao completa?' },
    ],
  },
  {
    id: 2,
    author: 'Luna Bellini',
    authorId: 2,
    location: 'Rio de Janeiro',
    timeAgo: '3h',
    title: 'Preview em video do set desta noite',
    description:
      'Video curto para sentir a atmosfera do ensaio. Toque no player para pausar ou continuar assistindo.',
    likes: 243,
    liked: false,
    media: {
      type: 'video',
      src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: portraitFour,
    },
    comments: [
      { id: 1, author: 'Caio', timeAgo: '1h', body: 'Visual muito bonito, combinou com a paleta do app.' },
      { id: 2, author: 'Mateus', timeAgo: '47 min', body: 'Curti o clima do video, ficou elegante.' },
      { id: 3, author: 'Leo', timeAgo: '15 min', body: 'Posta mais conteudo nesse formato.' },
    ],
  },
  {
    id: 3,
    author: 'Giovanna Hart',
    authorId: 3,
    location: 'Curitiba',
    timeAgo: '5h',
    title: 'Novo editorial urbano no feed',
    description:
      'Selecao de fotos em clima noturno, com foco em composicoes mais editoriais e elegantes.',
    likes: 129,
    liked: false,
    media: {
      type: 'image',
      src: portraitThree,
      alt: 'Editorial urbano da criadora',
    },
    comments: [
      { id: 1, author: 'Henrique', timeAgo: '2h', body: 'Essa foto ficou muito forte, excelente enquadramento.' },
    ],
  },
];

export const adProfiles: AdProfile[] = [
  {
    id: 1,
    name: 'Valentina Noir',
    city: 'Sao Paulo',
    badge: 'Verificada',
    bio: 'Atendimento premium, perfil discreto e agenda atualizada em tempo real.',
    hourlyRate: 'A partir de R$ 900',
    images: [portraitOne, portraitFour, portraitSix],
    gender: 'Feminino',
    sexuality: 'Cis',
  },
  {
    id: 2,
    name: 'Luna Bellini',
    city: 'Rio de Janeiro',
    badge: 'Top da semana',
    bio: 'Estilo sofisticado, fotos recentes e atendimento em areas nobres da cidade.',
    hourlyRate: 'A partir de R$ 1.100',
    images: [portraitTwo, portraitFive, portraitThree],
    gender: 'Feminino',
    sexuality: 'Trans',
  },
  {
    id: 3,
    name: 'Giovanna Hart',
    city: 'Curitiba',
    badge: 'Disponivel hoje',
    bio: 'Perfil caloroso, foco em experiencias personalizadas e resposta rapida.',
    hourlyRate: 'A partir de R$ 850',
    images: [portraitSix, portraitOne, portraitTwo],
    gender: 'Feminino',
    sexuality: 'Cis',
  },
  {
    id: 4,
    name: 'Helena Rose',
    city: 'Recife',
    badge: 'Em alta',
    bio: 'Presenca marcante, visual refinado e galeria renovada com frequencia.',
    hourlyRate: 'A partir de R$ 980',
    images: [portraitFive, portraitThree, portraitFour],
    gender: 'Feminino',
    sexuality: 'Trans',
  },
];

export const adProfilesDetails: AdProfileDetails[] = [
  {
    id: 1,
    name: 'Valentina Noir',
    city: 'Sao Paulo',
    badge: 'Verificada',
    bio: 'Atendimento premium, perfil discreto e agenda atualizada em tempo real.',
    hourlyRate: 'A partir de R$ 900',
    images: [portraitOne, portraitFour, portraitSix],
    coverImage: portraitFour,
    profileImage: portraitOne,
    age: 27,
    neighborhood: 'Jardins',
    availability: 'Hoje ate 23h',
    languages: ['Portugues', 'Ingles'],
    gender: 'Feminino',
    sexuality: 'Cis',
    publicData: {
      height: '1.68m',
      weight: '56 kg',
      bodyType: 'Atletico',
      hairColor: 'Castanho escuro',
      eyeColor: 'Castanho',
      ethnicity: 'Branca',
      style: 'Sofisticado',
      personalityTraits: ['Discreta', 'Sofisticada', 'Comunicativa', 'Perfeccionista'],
    },
    services: ['Atendimento discreto', 'Jantar companhia', 'Eventos privados'],
    gallery: [portraitOne, portraitFour, portraitSix, portraitFive],
  },
  {
    id: 2,
    name: 'Luna Bellini',
    city: 'Rio de Janeiro',
    badge: 'Top da semana',
    bio: 'Estilo sofisticado, fotos recentes e atendimento em areas nobres da cidade.',
    hourlyRate: 'A partir de R$ 1.100',
    images: [portraitTwo, portraitFive, portraitThree],
    coverImage: portraitTwo,
    profileImage: portraitFive,
    age: 25,
    neighborhood: 'Leblon',
    availability: 'Agenda aberta para o fim de semana',
    languages: ['Portugues', 'Espanhol'],
    gender: 'Feminino',
    sexuality: 'Trans',
    publicData: {
      height: '1.70m',
      weight: '60 kg',
      bodyType: 'Curvilineo',
      hairColor: 'Loiro',
      eyeColor: 'Azul',
      ethnicity: 'Branca',
      style: 'Fashion',
      personalityTraits: ['Extrovertida', 'Criativa', 'Apaixonada', 'Bem-humorada'],
    },
    services: ['Acompanhamento social', 'Passeios premium', 'Atendimento em hotel'],
    gallery: [portraitTwo, portraitFive, portraitThree, portraitOne],
  },
  {
    id: 3,
    name: 'Giovanna Hart',
    city: 'Curitiba',
    badge: 'Disponivel hoje',
    bio: 'Perfil caloroso, foco em experiencias personalizadas e resposta rapida.',
    hourlyRate: 'A partir de R$ 850',
    images: [portraitSix, portraitOne, portraitTwo],
    coverImage: portraitSix,
    profileImage: portraitSix,
    age: 29,
    neighborhood: 'Batel',
    availability: 'Disponivel hoje',
    languages: ['Portugues'],
    gender: 'Feminino',
    sexuality: 'Cis',
    publicData: {
      height: '1.66m',
      weight: '54 kg',
      bodyType: 'Slim',
      hairColor: 'Preto',
      eyeColor: 'Verde',
      ethnicity: 'Morena',
      style: 'Classico',
      personalityTraits: ['Calorosa', 'Empatica', 'Espontanea', 'Aventureira'],
    },
    services: ['Experiencias personalizadas', 'Encontros exclusivos', 'Viagens curtas'],
    gallery: [portraitSix, portraitOne, portraitTwo, portraitFour],
  },
  {
    id: 4,
    name: 'Helena Rose',
    city: 'Recife',
    badge: 'Em alta',
    bio: 'Presenca marcante, visual refinado e galeria renovada com frequencia.',
    hourlyRate: 'A partir de R$ 980',
    images: [portraitFive, portraitThree, portraitFour],
    coverImage: portraitThree,
    profileImage: portraitThree,
    age: 26,
    neighborhood: 'Boa Viagem',
    availability: 'Proximas vagas: amanha',
    languages: ['Portugues', 'Ingles'],
    gender: 'Feminino',
    sexuality: 'Trans',
    publicData: {
      height: '1.69m',
      weight: '58 kg',
      bodyType: 'Fit',
      hairColor: 'Ruivo',
      eyeColor: 'Mel',
      ethnicity: 'Parda',
      style: 'Elegante',
      personalityTraits: ['Elegante', 'Confiante', 'Refinada', 'Marcante'],
    },
    services: ['Atendimento premium', 'Eventos corporativos', 'Dinner date'],
    gallery: [portraitFive, portraitThree, portraitFour, portraitSix],
  },
];

export const chatThreadsSeed: ChatThread[] = [
  {
    id: 1,
    contactName: 'Valentina Noir',
    contactAvatar: portraitOne,
    online: true,
    city: 'Sao Paulo',
    lastPreview: 'Perfeito, te envio o local em instantes.',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        sender: 'contact',
        type: 'text',
        content: 'Oi, vi seu interesse no meu anuncio. Qual horario voce prefere?',
        createdAt: '19:42',
      },
      {
        id: 2,
        sender: 'me',
        type: 'text',
        content: 'Consigo hoje as 21h. Pode ser?',
        createdAt: '19:44',
      },
      {
        id: 3,
        sender: 'contact',
        type: 'text',
        content: 'Perfeito, te envio o local em instantes.',
        createdAt: '19:45',
      },
    ],
  },
  {
    id: 2,
    contactName: 'Luna Bellini',
    contactAvatar: portraitFive,
    online: false,
    city: 'Rio de Janeiro',
    lastPreview: 'Recebi sua mensagem de voz, ficou claro.',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: 'contact',
        type: 'audio',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        createdAt: '18:12',
      },
      {
        id: 2,
        sender: 'me',
        type: 'text',
        content: 'Recebi sua mensagem de voz, ficou claro.',
        createdAt: '18:18',
      },
    ],
  },
  {
    id: 3,
    contactName: 'Giovanna Hart',
    contactAvatar: portraitSix,
    online: true,
    city: 'Curitiba',
    lastPreview: 'Estou enviando uma foto atual agora.',
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: 'contact',
        type: 'text',
        content: 'Estou enviando uma foto atual agora.',
        createdAt: '17:55',
      },
      {
        id: 2,
        sender: 'contact',
        type: 'image',
        content: portraitFour,
        createdAt: '17:56',
      },
    ],
  },
];

  export interface FrameVideo {
    id: number;
    author: string;
    authorId?: number;
    location: string;
    title: string;
    description: string;
    videoSrc: string;
    poster: string;
    likes: number;
    liked: boolean;
    comments: FeedComment[];
  }

  export const frameVideos: FrameVideo[] = [
    {
      id: 1,
      author: 'Valentina Noir',
      authorId: 1,
      location: 'Sao Paulo',
      title: 'Bastidores do ensaio de hoje',
      description: 'Um pouco do que rolou no estudio essa tarde. Ficou incrivel, nao ia querer perder.',
      videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: portraitOne,
      likes: 1248,
      liked: false,
      comments: [
        { id: 1, author: 'Rafael', timeAgo: '1h', body: 'Simplesmente incrivel, mais conteudo assim!' },
        { id: 2, author: 'Lucas', timeAgo: '45 min', body: 'Que visual perfeito.' },
      ],
    },
    {
      id: 2,
      author: 'Luna Bellini',
      authorId: 2,
      location: 'Rio de Janeiro',
      title: 'Noite especial no Leblon',
      description: 'Video exclusivo do meu look de hoje. Aproveita esse registrinho antes da agenda fechar.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: portraitFive,
      likes: 2340,
      liked: false,
      comments: [
        { id: 1, author: 'Diego', timeAgo: '2h', body: 'Voce e simplesmente incrivel!' },
      ],
    },
    {
      id: 3,
      author: 'Giovanna Hart',
      authorId: 3,
      location: 'Curitiba',
      title: 'Por do sol no Batel',
      description: 'Fiz um video rapido enquanto esperava o anoitecer. Batel tem algo magico a noite.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: portraitSix,
      likes: 876,
      liked: false,
      comments: [
        { id: 1, author: 'Pedro', timeAgo: '3h', body: 'Lugar lindo, combina com voce.' },
        { id: 2, author: 'Marcos', timeAgo: '1h', body: 'Quando agenda abre?' },
      ],
    },
    {
      id: 4,
      author: 'Helena Rose',
      authorId: 4,
      location: 'Recife',
      title: 'Tarde na Boa Viagem',
      description: 'Aproveitei a tarde livre para filmar um pouco na orla. Encontros marcados por aqui.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: portraitThree,
      likes: 1567,
      liked: false,
      comments: [
        { id: 1, author: 'Andre', timeAgo: '30 min', body: 'Mandei mensagem, espero sua resposta!' },
      ],
    },
    {
      id: 5,
      author: 'Valentina Noir',
      authorId: 1,
      location: 'Sao Paulo',
      title: 'Novo ensaio chegando',
      description: 'Preview do que vem por ai. Galeria atualizada essa semana, nao perca.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      poster: portraitFour,
      likes: 992,
      liked: false,
      comments: [],
    },
    {
      id: 6,
      author: 'Luna Bellini',
      authorId: 2,
      location: 'Rio de Janeiro',
      title: 'Morning vibes',
      description: 'Manha diferente hoje, resolvi filmar antes do cafe. Vem ver.',
      videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: portraitTwo,
      likes: 3102,
      liked: false,
      comments: [
        { id: 1, author: 'Felipe', timeAgo: '4h', body: 'Que inicio de manha eh esse!' },
        { id: 2, author: 'Vitor', timeAgo: '3h', body: 'Top demais.' },
        { id: 3, author: 'Bruno', timeAgo: '1h', body: 'Sempre impecavel.' },
      ],
    },
  ];
