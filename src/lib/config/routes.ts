import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    UsersRound,
    ChartLine,
    Settings
} from 'lucide-svelte';

const routes = [
    { path: '/app', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/orders', name: 'Orders', icon: ShoppingCart },
    { path: '/customers', name: 'Customers', icon: UsersRound },
    { path: '/analytics', name: 'Analytics', icon: ChartLine },
    { path: '/settings', name: 'Settings', icon: Settings },
];

export { routes };