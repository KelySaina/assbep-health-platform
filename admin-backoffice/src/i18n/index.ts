import { createI18n } from 'vue-i18n'

const en = {
  admin: {
    dashboard: 'Dashboard',
    pages: 'Pages',
    programs: 'Programs',
    blog: 'Blog / Articles',
    translations: 'Translations',
    media: 'Media Manager',
    partners: 'Partners',
    users: 'Users',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    title: 'Admin Dashboard',
    welcome: 'Welcome back',
    total_programs: 'Total Programs',
    total_articles: 'Total Articles',
    total_users: 'Total Users',
    contact_requests: 'Contact Requests',
    recent_articles: 'Recent Articles',
    quick_actions: 'Quick Actions',
  },
  actions: {
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    publish: 'Publish',
    unpublish: 'Unpublish',
    upload: 'Upload',
    search: 'Search...',
    filter: 'Filter',
    confirm_delete: 'Are you sure you want to delete this item?',
  },
  auth: {
    login: 'Sign In',
    email: 'Email Address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    subtitle: 'Sign in to manage the ASSBEP Health Platform',
  },
}

const fr = {
  admin: {
    dashboard: 'Tableau de Bord',
    pages: 'Pages',
    programs: 'Programmes',
    blog: 'Blog / Articles',
    translations: 'Traductions',
    media: 'Gestionnaire Média',
    partners: 'Partenaires',
    users: 'Utilisateurs',
    settings: 'Paramètres',
    logout: 'Déconnexion',
  },
  dashboard: {
    title: 'Tableau de Bord Admin',
    welcome: 'Bienvenue',
    total_programs: 'Total Programmes',
    total_articles: 'Total Articles',
    total_users: 'Total Utilisateurs',
    contact_requests: 'Demandes de Contact',
    recent_articles: 'Articles Récents',
    quick_actions: 'Actions Rapides',
  },
  actions: {
    create: 'Créer',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    publish: 'Publier',
    unpublish: 'Dépublier',
    upload: 'Télécharger',
    search: 'Rechercher...',
    filter: 'Filtrer',
    confirm_delete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  },
  auth: {
    login: 'Connexion',
    email: 'Adresse Email',
    password: 'Mot de Passe',
    remember: 'Se souvenir de moi',
    forgot: 'Mot de passe oublié ?',
    subtitle: 'Connectez-vous pour gérer la Plateforme ASSBEP',
  },
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('admin_locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, fr },
})

export default i18n
