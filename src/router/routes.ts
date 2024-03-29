import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue')
      },
      {
        path: 'settings',
        component: () => import('pages/Settings.vue')
      },
      {
        path: 'about',
        component: () => import('pages/About.vue')
      },
      {
        path: 'patients',
        component: () => import('pages/Patients.vue')
      },
      {
        path: 'register',
        component: () => import('pages/NewPatient.vue')
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
