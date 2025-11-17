'use client';

import { useEffect, useState } from 'react';
import { supabase, type Order, type Dish } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdersTable } from '@/components/orders-table';
import { MenuManager } from '@/components/menu-manager';
import { DashboardStats } from '@/components/dashboard-stats';
import { OrdersChart } from '@/components/orders-chart';
import { SettingsManager } from '@/components/settings-manager';
import Image from 'next/image';
import { ShoppingBag, UtensilsCrossed, TrendingUp, Menu, Settings } from 'lucide-react';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'orders' | 'menu' | 'settings'>('dashboard');
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    fetchData();
    
    // Subscribe to real-time updates with proper error handling
    const ordersChannel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('✅ Order change detected:', payload);
          fetchOrders();
        }
      )
      .subscribe((status) => {
        console.log('📡 Orders subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setRealtimeStatus('error');
        }
      });

    const dishesChannel = supabase
      .channel('public:dishes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dishes'
        },
        (payload) => {
          console.log('✅ Dish change detected:', payload);
          fetchDishes();
        }
      )
      .subscribe((status) => {
        console.log('📡 Dishes subscription status:', status);
      });

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(dishesChannel);
    };
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchOrders(), fetchDishes()]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
  };

  const fetchDishes = async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('id', { ascending: true });
    
    if (!error && data) {
      setDishes(data);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Fixed Position */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Logo - Fixed at top */}
          <div className="flex h-32 shrink-0 items-center justify-center border-b border-gray-200 px-6 bg-white">
            <Image src="/logo.png" alt="Lamsalna" width={1080} height={360} className="h-auto w-full max-w-[240px]" priority />
          </div>
          
          {/* Navigation - Scrollable if needed */}
          <nav className="flex-1 overflow-y-auto space-y-2 p-4">
            <button
              onClick={() => {
                setActiveView('dashboard');
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Tableau de bord</span>
            </button>
            
            <button
              onClick={() => {
                setActiveView('orders');
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeView === 'orders'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">Commandes</span>
            </button>
            
            <button
              onClick={() => {
                setActiveView('menu');
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeView === 'menu'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span className="font-medium">Menu</span>
            </button>
            
            <button
              onClick={() => {
                setActiveView('settings');
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeView === 'settings'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Paramètres</span>
            </button>
          </nav>

          {/* Live Indicator - Fixed at bottom */}
          <div className="shrink-0 border-t border-gray-200 p-4 bg-white">
            <div className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              realtimeStatus === 'connected' ? 'bg-green-50' :
              realtimeStatus === 'error' ? 'bg-red-50' : 'bg-gray-100'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                realtimeStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                realtimeStatus === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'
              }`} />
              <span className={`text-sm font-medium ${
                realtimeStatus === 'connected' ? 'text-green-700' :
                realtimeStatus === 'error' ? 'text-red-700' : 'text-gray-700'
              }`}>
                {realtimeStatus === 'connected' ? 'En direct ✓' :
                 realtimeStatus === 'error' ? 'Déconnecté' : 'Connexion...'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Image src="/logo.png" alt="Lamsalna" width={180} height={60} className="h-12 w-auto" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Tableau de bord</h1>
              <DashboardStats orders={orders} dishes={dishes} />
              
              <div className="grid gap-6 lg:grid-cols-2">
                <OrdersChart orders={orders} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Plats Populaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dishes.slice(0, 5).map((dish, index) => (
                        <div key={dish.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <span className="font-medium">{dish.name}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">${dish.price}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'orders' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Commandes</h1>
              <OrdersTable orders={orders} onRefresh={fetchOrders} />
            </div>
          )}

          {activeView === 'menu' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Gestion du Menu</h1>
              <MenuManager dishes={dishes} onRefresh={fetchDishes} />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Paramètres</h1>
              <SettingsManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
