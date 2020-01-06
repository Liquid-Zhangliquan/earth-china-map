import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let base = `${process.env.BASE_URL}` // 动态获取二级目录
const router =  new Router({
    mode: "history",
    base: base,
    routes: [
        {
            path: '/',
            name: 'cesium-earth-rotate',
            component: () => import('../views/cesium-earth-rotate')
        },
        {
            path: '/cesium',
            name: 'cesium-earth',
            component: () => import('../views/cesium-earth')
        },
        {
            path: '/maptalks',
            name: 'maptalks-china',
            component: () => import('../views/maptalks-china')
        }
    ]
})

router.beforeEach((to, from, next) => {
    next();
});

export default router