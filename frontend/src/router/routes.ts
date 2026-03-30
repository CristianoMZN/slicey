import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'frames' },
      },
      {
        path: 'feed',
        name: 'feed',
        component: () => import('pages/FeedPage.vue'),
      },
      {
        path: 'frames',
        name: 'frames',
        component: () => import('pages/FramesPage.vue'),
      },
      {
        path: 'anuncios',
        name: 'anuncios',
        component: () => import('pages/AdsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'anuncios/:id',
        name: 'anuncio-detalhe',
        component: () => import('pages/AdProfileDetailPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'anuncios/:id/galeria',
        name: 'anuncio-galeria',
        component: () => import('pages/AdProfileGalleryPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'perfil',
        name: 'perfil',
        component: () => import('pages/ProfilePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'mensagens',
        name: 'mensagens',
        component: () => import('pages/MessagesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'loja',
        name: 'loja',
        component: () => import('pages/StorePage.vue'),
      },
      {
        path: 'registro',
        name: 'registro',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'configuracoes',
        name: 'configuracoes',
        component: () => import('pages/SettingsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
