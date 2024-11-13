const __pages_import_0__ = () => import("/src/admin/pages/index.vue");
const __pages_import_1__ = () => import("/src/features/dashboard/pages/welcome.vue");
const __pages_import_2__ = () => import("/src/features/dashboard/pages/dashboard.vue");
const __pages_import_3__ = () => import("/src/features/admin/pages/admin.vue");
const __pages_import_4__ = () => import("/src/pages/markdown.md");
const __pages_import_5__ = () => import("/src/pages/index.vue");
const __pages_import_6__ = () => import("/src/pages/components.vue");
const __pages_import_7__ = () => import("/src/pages/about.vue");
const __pages_import_8__ = () => import("/src/pages/about/who/me.vue");
const __pages_import_9__ = () => import("/src/pages/about/index.vue");
const __pages_import_10__ = () => import("/src/pages/about/_id.vue");
const __pages_import_11__ = () => import("/src/pages/_.vue");
const __pages_import_12__ = () => import("/src/pages/optional/_id.vue");
const __pages_import_13__ = () => import("/src/pages/_sensor/current.vue");

const routes = [{"name":"admin","path":"/admin","component":__pages_import_0__,"props":true,"meta":{"requiresAuth":false}},{"name":"features-welcome","path":"/features/welcome","component":__pages_import_1__,"props":true,"meta":{"requiresAuth":true}},{"name":"features-dashboard","path":"/features/dashboard","component":__pages_import_2__,"props":true,"meta":{"requiresAuth":true}},{"name":"features-admin","path":"/features/admin","component":__pages_import_3__,"props":true,"meta":{"requiresAuth":false}},{"name":"markdown","path":"/markdown","component":__pages_import_4__,"props":true},{"name":"index","path":"/","component":__pages_import_5__,"props":true},{"name":"components","path":"/components","component":__pages_import_6__,"props":true},{"path":"/about","component":__pages_import_7__,"children":[{"name":"who-me-override","path":"who/me","component":__pages_import_8__,"props":true,"meta":{"requiresAuth":false}},{"name":"about","path":"","component":__pages_import_9__,"props":true},{"name":"about-id","path":":id","component":__pages_import_10__,"props":true}],"props":true},{"name":"all","path":"/:all(.*)*","component":__pages_import_11__,"props":true},{"name":"optional-id","path":"/optional/:id?","component":__pages_import_12__,"props":true},{"name":"sensor-current","path":"/:sensor/current","component":__pages_import_13__,"props":true}];

export default routes;