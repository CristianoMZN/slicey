import type { CommentTemperature, SuperCommentPayload } from 'src/types/comments';

export interface FeedComment {
  id: number;
  author: string;
  timeAgo: string;
  body: string;
  superComment?: SuperCommentPayload;
}

export const commentTemperatureLabelMap: Record<CommentTemperature, string> = {
  cold: 'Frosty',
  warm: 'Simmering',
  hot: 'Steamy',
  blaze: 'Blazing',
};

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
export type AdProfileBadge =
  | 'verified-account'
  | 'leaving-soon'
  | 'new-profile'
  | 'top-rated-10';

export interface AdProfile {
  id: number;
  name: string;
  city: string;
  state?: string;
  age?: number;
  hasLocal?: boolean;
  leavingInDays?: number;
  badge: string;
  badges?: AdProfileBadge[];
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
const portraitSeven =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80';
const portraitEight =
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80';
const portraitNine =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80';
const portraitTen =
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=80';
const portraitEleven =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80';
const portraitTwelve =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80';

export const portraitGalleryPool = [
  portraitOne,
  portraitTwo,
  portraitThree,
  portraitFour,
  portraitFive,
  portraitSix,
  portraitSeven,
  portraitEight,
  portraitNine,
  portraitTen,
  portraitEleven,
  portraitTwelve,
];

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
      {
        id: 2,
        author: 'Victor',
        timeAgo: '21 min',
        body: 'Quando sai a versao completa?',
        superComment: { amount: 120, temperature: 'cold' },
      },
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
      {
        id: 2,
        author: 'Mateus',
        timeAgo: '47 min',
        body: 'Curti o clima do video, ficou elegante.',
        superComment: { amount: 850, temperature: 'warm' },
      },
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
      {
        id: 1,
        author: 'Henrique',
        timeAgo: '2h',
        body: 'Essa foto ficou muito forte, excelente enquadramento.',
        superComment: { amount: 6500, temperature: 'hot' },
      },
    ],
  },
  {
    id: 4,
    author: 'Helena Rose',
    authorId: 4,
    location: 'Recife',
    timeAgo: '6h',
    title: 'Mensagem especial para quem me acompanha',
    description:
      'Gravei um recado sobre a minha agenda da proxima semana e alguns detalhes dos novos pacotes.',
    likes: 214,
    liked: false,
    media: {
      type: 'audio',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverImage: portraitSeven,
      subtitle: 'Audio exclusivo de 01:30',
    },
    comments: [
      {
        id: 1,
        author: 'Thiago',
        timeAgo: '5h',
        body: 'Que voz mais incrivel, adorei o formato.',
        superComment: { amount: 24000, temperature: 'blaze' },
      },
      { id: 2, author: 'Rodrigo', timeAgo: '3h', body: 'Ja reservei meu horario, muito obrigado!' },
    ],
  },
  {
    id: 5,
    author: 'Isabella Marte',
    authorId: 5,
    location: 'Belo Horizonte',
    timeAgo: '8h',
    title: 'Teaser exclusivo do novo set',
    description:
      'Video gravado hoje no estudio com novos angulos e luz natural. Primeira olhada antes de todo mundo.',
    likes: 398,
    liked: false,
    media: {
      type: 'video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      poster: portraitEight,
    },
    comments: [
      { id: 1, author: 'Gustavo', timeAgo: '7h', body: 'Ficou perfeito, aguardando o restante!' },
      { id: 2, author: 'Carlos', timeAgo: '5h', body: 'Essa iluminacao ficou sensacional.' },
    ],
  },
  {
    id: 6,
    author: 'Camila Voss',
    authorId: 6,
    location: 'Salvador',
    timeAgo: '10h',
    title: 'Podcast de bastidores — Ep. 1',
    description:
      'Iniciei um podcast contando como e minha rotina, meus bastidores e o que rola entre os ensaios.',
    likes: 307,
    liked: false,
    media: {
      type: 'audio',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverImage: portraitNine,
      subtitle: 'Podcast — 03:00',
    },
    comments: [
      { id: 1, author: 'Felipe', timeAgo: '9h', body: 'Amei o formato de podcast, continua!' },
      { id: 2, author: 'Eduardo', timeAgo: '8h', body: 'Muito autentico, me identifiquei bastante.' },
      { id: 3, author: 'Marcelo', timeAgo: '6h', body: 'Quando sai o segundo episodio?' },
    ],
  },
  {
    id: 7,
    author: 'Fernanda Lux',
    authorId: 7,
    location: 'Porto Alegre',
    timeAgo: '12h',
    title: 'Fotos do ensaio de inverno',
    description:
      'Paleta fria, poses novas e um clima totalmente diferente. Esse set ficou acima das expectativas.',
    likes: 172,
    liked: false,
    media: {
      type: 'image',
      src: portraitTen,
      alt: 'Ensaio de inverno da criadora',
    },
    comments: [
      { id: 1, author: 'Anderson', timeAgo: '11h', body: 'Essa paleta de cores ficou perfeita.' },
      { id: 2, author: 'Renato', timeAgo: '9h', body: 'Uma das melhores fotos que ja vi aqui.' },
    ],
  },
];

export const adProfiles: AdProfile[] = [
  {
    id: 1,
    name: 'Valentina Noir',
    city: 'Sao Paulo',
    state: 'SP',
    age: 27,
    hasLocal: true,
    badge: 'Verificada',
    badges: ['verified-account', 'top-rated-10'],
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
    state: 'RJ',
    age: 25,
    hasLocal: false,
    leavingInDays: 3,
    badge: 'Top da semana',
    badges: ['leaving-soon', 'top-rated-10'],
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
    state: 'PR',
    age: 29,
    hasLocal: true,
    badge: 'Disponivel hoje',
    badges: ['verified-account'],
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
    state: 'PE',
    age: 26,
    hasLocal: true,
    badge: 'Em alta',
    badges: ['top-rated-10'],
    bio: 'Presenca marcante, visual refinado e galeria renovada com frequencia.',
    hourlyRate: 'A partir de R$ 980',
    images: [portraitFive, portraitThree, portraitFour],
    gender: 'Feminino',
    sexuality: 'Trans',
  },
  {
    id: 5,
    name: 'Isabella Marte',
    city: 'Belo Horizonte',
    state: 'MG',
    age: 24,
    hasLocal: false,
    leavingInDays: 6,
    badge: 'Nova',
    badges: ['new-profile', 'leaving-soon'],
    bio: 'Estreante com carisma natural, fotos profissionais e agenda flexivel.',
    hourlyRate: 'A partir de R$ 800',
    images: [portraitEight, portraitSeven, portraitNine],
    gender: 'Feminino',
    sexuality: 'Cis',
  },
  {
    id: 6,
    name: 'Camila Voss',
    city: 'Salvador',
    state: 'BA',
    age: 28,
    hasLocal: true,
    badge: 'Verificada',
    badges: ['verified-account', 'top-rated-10'],
    bio: 'Alegria contagiante, estilo baiano unico e sempre com fotos atualizadas.',
    hourlyRate: 'A partir de R$ 920',
    images: [portraitNine, portraitEleven, portraitTen],
    gender: 'Feminino',
    sexuality: 'Cis',
  },
  {
    id: 7,
    name: 'Fernanda Lux',
    city: 'Porto Alegre',
    state: 'RS',
    age: 30,
    hasLocal: true,
    badge: 'Top da semana',
    badges: ['verified-account', 'top-rated-10'],
    bio: 'Sofisticacao gaucha, discrição total e fotos recentes do atelier.',
    hourlyRate: 'A partir de R$ 1.050',
    images: [portraitTen, portraitSix, portraitSeven],
    gender: 'Feminino',
    sexuality: 'Trans',
  },
  {
    id: 8,
    name: 'Marcus Steele',
    city: 'Brasilia',
    state: 'DF',
    age: 32,
    hasLocal: false,
    badge: 'Disponivel hoje',
    badges: ['new-profile'],
    bio: 'Atendimento masculino premium, presença marcante e agenda aberta.',
    hourlyRate: 'A partir de R$ 1.200',
    images: [portraitTwelve, portraitThree, portraitFive],
    gender: 'Masculino',
    sexuality: 'Cis',
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
  {
    id: 5,
    name: 'Isabella Marte',
    city: 'Belo Horizonte',
    badge: 'Nova',
    bio: 'Estreante com carisma natural, fotos profissionais e agenda flexivel.',
    hourlyRate: 'A partir de R$ 800',
    images: [portraitEight, portraitSeven, portraitNine],
    coverImage: portraitEight,
    profileImage: portraitSeven,
    age: 24,
    neighborhood: 'Savassi',
    availability: 'Agenda aberta esta semana',
    languages: ['Portugues'],
    gender: 'Feminino',
    sexuality: 'Cis',
    publicData: {
      height: '1.67m',
      weight: '55 kg',
      bodyType: 'Slim',
      hairColor: 'Castanho claro',
      eyeColor: 'Castanho',
      ethnicity: 'Morena',
      style: 'Natural',
      personalityTraits: ['Simpatica', 'Acolhedora', 'Descontraida', 'Criativa'],
    },
    services: ['Atendimento carinhoso', 'Passeios na cidade', 'Jantar companhia'],
    gallery: [portraitEight, portraitSeven, portraitNine, portraitTen],
  },
  {
    id: 6,
    name: 'Camila Voss',
    city: 'Salvador',
    badge: 'Verificada',
    bio: 'Alegria contagiante, estilo baiano unico e sempre com fotos atualizadas.',
    hourlyRate: 'A partir de R$ 920',
    images: [portraitNine, portraitEleven, portraitTen],
    coverImage: portraitEleven,
    profileImage: portraitNine,
    age: 28,
    neighborhood: 'Barra',
    availability: 'Disponivel fins de semana',
    languages: ['Portugues', 'Ingles'],
    gender: 'Feminino',
    sexuality: 'Cis',
    publicData: {
      height: '1.65m',
      weight: '57 kg',
      bodyType: 'Atletico',
      hairColor: 'Preto',
      eyeColor: 'Preto',
      ethnicity: 'Negra',
      style: 'Tropical',
      personalityTraits: ['Alegre', 'Espontanea', 'Comunicativa', 'Energetica'],
    },
    services: ['Encontros animados', 'Praias e passeios', 'Eventos sociais'],
    gallery: [portraitNine, portraitEleven, portraitTen, portraitSeven],
  },
  {
    id: 7,
    name: 'Fernanda Lux',
    city: 'Porto Alegre',
    badge: 'Top da semana',
    bio: 'Sofisticacao gaucha, discricao total e fotos recentes do atelier.',
    hourlyRate: 'A partir de R$ 1.050',
    images: [portraitTen, portraitSix, portraitSeven],
    coverImage: portraitTen,
    profileImage: portraitSix,
    age: 30,
    neighborhood: 'Moinhos de Vento',
    availability: 'Proximas vagas: esta semana',
    languages: ['Portugues', 'Espanhol', 'Frances'],
    gender: 'Feminino',
    sexuality: 'Trans',
    publicData: {
      height: '1.72m',
      weight: '62 kg',
      bodyType: 'Curvilineo',
      hairColor: 'Loiro escuro',
      eyeColor: 'Verde',
      ethnicity: 'Branca',
      style: 'Classico europeu',
      personalityTraits: ['Refinada', 'Inteligente', 'Articulada', 'Reservada'],
    },
    services: ['Jantares finos', 'Viagens nacionais', 'Eventos de gala'],
    gallery: [portraitTen, portraitSix, portraitSeven, portraitEleven],
  },
  {
    id: 8,
    name: 'Marcus Steele',
    city: 'Brasilia',
    badge: 'Disponivel hoje',
    bio: 'Atendimento masculino premium, presenca marcante e agenda aberta.',
    hourlyRate: 'A partir de R$ 1.200',
    images: [portraitTwelve, portraitThree, portraitFive],
    coverImage: portraitTwelve,
    profileImage: portraitTwelve,
    age: 32,
    neighborhood: 'Asa Norte',
    availability: 'Disponivel hoje',
    languages: ['Portugues', 'Ingles'],
    gender: 'Masculino',
    sexuality: 'Cis',
    publicData: {
      height: '1.85m',
      weight: '85 kg',
      bodyType: 'Atletico',
      hairColor: 'Preto',
      eyeColor: 'Castanho escuro',
      ethnicity: 'Pardo',
      style: 'Executivo',
      personalityTraits: ['Confiante', 'Discreto', 'Educado', 'Pontual'],
    },
    services: ['Acompanhamento executivo', 'Eventos corporativos', 'Viagens a trabalho'],
    gallery: [portraitTwelve, portraitThree, portraitFive, portraitFour],
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
  {
    id: 4,
    contactName: 'Isabella Marte',
    contactAvatar: portraitEight,
    online: true,
    city: 'Belo Horizonte',
    lastPreview: '🎙️ Mensagem de voz',
    unreadCount: 3,
    messages: [
      {
        id: 1,
        sender: 'contact',
        type: 'audio',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        createdAt: '20:05',
      },
      {
        id: 2,
        sender: 'me',
        type: 'text',
        content: 'Ouvi sua mensagem! Muito obrigado pelo contato.',
        createdAt: '20:10',
      },
      {
        id: 3,
        sender: 'contact',
        type: 'audio',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        createdAt: '20:13',
      },
    ],
  },
  {
    id: 5,
    contactName: 'Camila Voss',
    contactAvatar: portraitNine,
    online: false,
    city: 'Salvador',
    lastPreview: 'Te mando o video do look de amanha!',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: 'contact',
        type: 'text',
        content: 'Oi! Vi que voce curtiu meu perfil. Posso te mandar um audio?',
        createdAt: '15:30',
      },
      {
        id: 2,
        sender: 'me',
        type: 'text',
        content: 'Claro, pode mandar!',
        createdAt: '15:32',
      },
      {
        id: 3,
        sender: 'contact',
        type: 'audio',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        createdAt: '15:34',
      },
      {
        id: 4,
        sender: 'contact',
        type: 'text',
        content: 'Te mando o video do look de amanha!',
        createdAt: '15:35',
      },
    ],
  },
  {
    id: 6,
    contactName: 'Fernanda Lux',
    contactAvatar: portraitTen,
    online: true,
    city: 'Porto Alegre',
    lastPreview: '🎙️ Mensagem de voz',
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: 'me',
        type: 'text',
        content: 'Boa noite! Gostaria de saber sua disponibilidade para esta semana.',
        createdAt: '21:00',
      },
      {
        id: 2,
        sender: 'contact',
        type: 'audio',
        content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        createdAt: '21:07',
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
        {
          id: 1,
          author: 'Rafael',
          timeAgo: '1h',
          body: 'Simplesmente incrivel, mais conteudo assim!',
          superComment: { amount: 180, temperature: 'cold' },
        },
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
        {
          id: 1,
          author: 'Diego',
          timeAgo: '2h',
          body: 'Voce e simplesmente incrivel!',
          superComment: { amount: 1200, temperature: 'warm' },
        },
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
        {
          id: 2,
          author: 'Marcos',
          timeAgo: '1h',
          body: 'Quando agenda abre?',
          superComment: { amount: 7600, temperature: 'hot' },
        },
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
        {
          id: 1,
          author: 'Andre',
          timeAgo: '30 min',
          body: 'Mandei mensagem, espero sua resposta!',
          superComment: { amount: 26000, temperature: 'blaze' },
        },
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
    {
      id: 7,
      author: 'Giovanna Hart',
      authorId: 3,
      location: 'Curitiba',
      title: 'Sessao noturna no estudio',
      description: 'Luzes baixas, clima tenso e muita energia. Esse set vai surpreender.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: portraitSix,
      likes: 1405,
      liked: false,
      comments: [
        { id: 1, author: 'Joao', timeAgo: '5h', body: 'Ansioso para o set completo!' },
        { id: 2, author: 'Paulo', timeAgo: '2h', body: 'Esse clima noturno ficou perfeito.' },
      ],
    },
    {
      id: 8,
      author: 'Isabella Marte',
      authorId: 5,
      location: 'Belo Horizonte',
      title: 'Primeiro video do canal',
      description: 'Estreia! Filmei esse video para marcar minha chegada. Muito feliz com o resultado.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: portraitEight,
      likes: 2890,
      liked: false,
      comments: [
        { id: 1, author: 'Sergio', timeAgo: '6h', body: 'Que estreia poderosa, acompanharei sempre!' },
        { id: 2, author: 'Alan', timeAgo: '4h', body: 'Bem vinda! Ja seguindo.' },
        { id: 3, author: 'Nilson', timeAgo: '1h', body: 'Aguardando o proximo.' },
      ],
    },
    {
      id: 9,
      author: 'Camila Voss',
      authorId: 6,
      location: 'Salvador',
      title: 'Praia ao entardecer',
      description: 'Ultimo mergulho antes do sol se por. Salvador nunca decepciona nessa hora.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      poster: portraitNine,
      likes: 4210,
      liked: false,
      comments: [
        { id: 1, author: 'Caio', timeAgo: '3h', body: 'Que cena linda, Salvador e incrivel.' },
        { id: 2, author: 'Davi', timeAgo: '2h', body: 'Esse entardecer ficou magico.' },
      ],
    },
    {
      id: 10,
      author: 'Fernanda Lux',
      authorId: 7,
      location: 'Porto Alegre',
      title: 'Ensaio no atelier — bastidores',
      description: 'Mostrei os bastidores do meu espaco de trabalho. Muita coisa boa vem por ai.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      poster: portraitTen,
      likes: 1780,
      liked: false,
      comments: [
        { id: 1, author: 'Fabio', timeAgo: '8h', body: 'Que atelier incrivel, amo o estilo!' },
        { id: 2, author: 'Marcos', timeAgo: '5h', body: 'Elegancia em cada detalhe.' },
        { id: 3, author: 'Leandro', timeAgo: '2h', body: 'Sempre referencia de qualidade.' },
      ],
    },
    {
      id: 11,
      author: 'Helena Rose',
      authorId: 4,
      location: 'Recife',
      title: 'Passeio de fim de tarde',
      description: 'Filmei meu passeio pela orla enquanto aproveitava a brisa da tarde.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      poster: portraitThree,
      likes: 2100,
      liked: false,
      comments: [
        { id: 1, author: 'Renatto', timeAgo: '7h', body: 'Que cenario incrivel!' },
      ],
    },
    {
      id: 12,
      author: 'Valentina Noir',
      authorId: 1,
      location: 'Sao Paulo',
      title: 'Nos bastidores do editorial',
      description: 'Tudo o que acontece antes das fotos principais. O processo criativo aqui eh fascinante.',
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      poster: portraitSeven,
      likes: 3654,
      liked: false,
      comments: [
        { id: 1, author: 'Rafael', timeAgo: '9h', body: 'Adoro ver os bastidores, muito obrigado!' },
        { id: 2, author: 'Lucas', timeAgo: '6h', body: 'O processo criativo aqui e outro nivel.' },
        { id: 3, author: 'Gabriel', timeAgo: '3h', body: 'Simplesmente incrivel.' },
        { id: 4, author: 'Igor', timeAgo: '1h', body: 'Fico impressionado a cada video novo.' },
      ],
    },
  ];
