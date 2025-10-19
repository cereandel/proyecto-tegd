'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "../../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
    Hotel,
    Home,
    Search,
    Calendar,
    Heart,
    Settings,
    CreditCard,
    Bell,
    User,
    LogOut,
    ChevronUp,
} from "lucide-react";

interface AppSidebarProps {
    onLogout: () => void;
}

interface User {
    id?: string;
    username?: string;
    email?: string;
}

export default function AppSidebar({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null);
    const menuItems = [
        { icon: Home, label: "Home", href: "/inicio" },
        { icon: Calendar, label: "My Bookings", href: "/bookings", badge: "3" },
    ];

    const accountItems = [
        { icon: User, label: "Profile", href: "/perfil" },
    ];

    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
        }
    }, []);

    return (
        <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="p-2 bg-primary rounded-lg">
                        <Hotel className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-sidebar-foreground">HotelBooker</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                          {item.badge}
                        </span>
                                            )}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <div className="flex items-center gap-3 w-full">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="https://gcdn.thunderstore.io/live/repository/icons/poop_club-p_diddy_pack_part_1-1.0.2.png.256x256_q95.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm">{user?.username ?? 'Guest'}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email ?? 'guest@example.com'}</p>
                                        </div>
                                        <ChevronUp className="w-4 h-4 ml-auto" />
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={()=> {
                                    if (typeof window !== 'undefined') {
                                        localStorage.removeItem('user');
                                    }
                                    router.push('/');
                                }} >
                                    <LogOut className="w-4 h-4 mr-2"/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <main>
            {children}
        </main>
        </SidebarProvider>
    );
}