import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

// styles

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";

// mouting point for the whole app

import App from "@/App.vue";

// layouts

import Admin from "@/layouts/Admin.vue";
import Auth from "@/layouts/Auth.vue";

// views for Admin layout

import Dashboard from "@/views/admin/Dashboard.vue";
import Settings from "@/views/admin/Settings.vue";
import AdminProfile from "@/views/admin/Profile.vue";
import AllUsers from "@/views/admin/AllUsers.vue";
import Tables from "@/views/admin/Tables.vue";
import Maps from "@/views/admin/Maps.vue";
import Information from "@/views/admin/Information.vue";
import History from "@/views/admin/History.vue";
import Contact from "@/views/admin/Contact.vue";
import Board from "@/views/admin/Board.vue";
import BoardMemberForm from "@/views/admin/BoardMemberForm.vue";
import Executives from "@/views/admin/Executives.vue";
import ExecutiveForm from "@/views/admin/ExecutiveForm.vue";

import News from "@/views/admin/pr/News.vue";
import NewsForm from "@/views/admin/pr/NewsForm.vue";
import Journals from "@/views/admin/pr/Journals.vue";
import JournalForm from "@/views/admin/pr/JournalForm.vue";
import Announcements from "@/views/admin/pr/Announcements.vue";
import AnnouncementForm from "@/views/admin/pr/AnnouncementForm.vue";
import Achievements from "@/views/admin/pr/Achievements.vue";
import AchievementForm from "@/views/admin/pr/AchievementForm.vue";

import Banners from "@/views/admin/Banners.vue";
import BannerForm from "@/views/admin/BannerForm.vue";

// views for Auth layout

import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

// views without layouts

import Landing from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
// import Index from "@/views/Index.vue";

// routes

const routes = [
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: Admin,
    children: [
      {
        path: "/admin/dashboard",
        component: Dashboard,
      },
      {
        path: "/admin/settings",
        component: Settings,
      },
      {
        path: "/admin/profile",
        component: AdminProfile,
      },
      {
        path: "/admin/profile/:id",
        component: AdminProfile,
      },
      {
        path: "/admin/tables",
        component: Tables,
      },
      {
        path: "/admin/all-users",
        component: AllUsers,
      },
      {
        path: "/admin/maps",
        component: Maps,
      },
      {
        path: "/admin/information",
        component: Information,
      },
      {
        path: "/admin/banners",
        component: Banners,
      },
      {
        path: "/admin/banners/add",
        component: BannerForm,
      },
      {
        path: "/admin/banners/edit/:id",
        component: BannerForm,
      },
      {
        path: "/admin/history",
        component: History,
      },
      {
        path: "/admin/contact",
        component: Contact,
      },
      {
        path: "/admin/board",
        component: Board,
      },
      {
        path: "/admin/board/add",
        component: BoardMemberForm,
      },
      {
        path: "/admin/board/edit/:id",
        component: BoardMemberForm,
      },
      {
        path: "/admin/executives",
        component: Executives,
      },
      {
        path: "/admin/executives/add",
        component: ExecutiveForm,
      },
      {
        path: "/admin/executives/edit/:id",
        component: ExecutiveForm,
      },
      {
        path: "/admin/pr/news",
        component: News,
      },
      {
        path: "/admin/pr/news/add",
        component: NewsForm,
      },
      {
        path: "/admin/pr/news/edit/:id",
        component: NewsForm,
      },
      {
        path: "/admin/pr/journals",
        component: Journals,
      },
      {
        path: "/admin/pr/journals/add",
        component: JournalForm,
      },
      {
        path: "/admin/pr/journals/edit/:id",
        component: JournalForm,
      },
      {
        path: "/admin/pr/announcements",
        component: Announcements,
      },
      {
        path: "/admin/pr/announcements/add",
        component: AnnouncementForm,
      },
      {
        path: "/admin/pr/announcements/edit/:id",
        component: AnnouncementForm,
      },
      {
        path: "/admin/pr/achievements",
        component: Achievements,
      },
      {
        path: "/admin/pr/achievements/add",
        component: AchievementForm,
      },
      {
        path: "/admin/pr/achievements/edit/:id",
        component: AchievementForm,
      },
    ],
  },
  {
    path: "/auth",
    redirect: "/auth/login",
    component: Auth,
    children: [
      {
        path: "/auth/login",
        component: Login,
      },
      {
        path: "/auth/register",
        component: Register,
      },
    ],
  },
  {
    path: "/landing",
    component: Landing,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/",
    redirect: "/auth/login",
  },
  { path: "/:pathMatch(.*)*", redirect: "/auth/login" },
];

import { VueFire, VueFireAuth } from 'vuefire';
import { firebaseApp } from './firebase';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
  .use(router)
  .use(VueFire, {
    firebaseApp,
    modules: [
      VueFireAuth(),
    ],
  })
  .mount("#app");
