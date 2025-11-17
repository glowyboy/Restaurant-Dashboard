'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, DollarSign, UtensilsCrossed, TrendingUp } from 'lucide-react';
import type { Order, Dish } from '@/lib/supabase';

interface DashboardStatsProps {
  orders: Order[];
  dishes: Dish[];
}

export function DashboardStats({ orders, dishes }: DashboardStatsProps) {
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0);
  
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    {
      title: 'Revenu Total',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: `${paidOrders} commandes payées`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Commandes',
      value: totalOrders.toString(),
      icon: ShoppingBag,
      description: `${pendingOrders} en attente`,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Plats au Menu',
      value: dishes.length.toString(),
      icon: UtensilsCrossed,
      description: 'Plats disponibles',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      title: 'Panier Moyen',
      value: paidOrders > 0 ? `$${(totalRevenue / paidOrders).toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      description: 'Par commande',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
