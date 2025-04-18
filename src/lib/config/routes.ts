import {
    LayoutDashboard,
    Ruler,
    Factory,
    FlaskConical,
    ChartLine,
    Settings
} from 'lucide-svelte';

const routes = [
    { path: '/app/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/brands-and-filmstocks', name: 'Brands & Film Stocks', icon: Factory },
    { path: '/app/types-and-formats', name: 'Film Types & Formats', icon: Ruler },
    { path: '/app/labs-and-scanners', name: 'Labs & Scanners', icon: FlaskConical },
    { path: '/app/settings', name: 'Settings', icon: Settings },
];

export { routes };