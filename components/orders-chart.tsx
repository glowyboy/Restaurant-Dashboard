'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { Order } from '@/lib/supabase';
import { format, subDays, startOfDay } from 'date-fns';

interface OrdersChartProps {
  orders: Order[];
}

export function OrdersChart({ orders }: OrdersChartProps) {
  // Last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const dayOrders = orders.filter(order => {
      const orderDate = startOfDay(new Date(order.created_at));
      return orderDate.getTime() === date.getTime();
    });
    
    return {
      date: format(date, 'EEE'),
      commandes: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.total), 0),
    };
  });

  // Status distribution with direct colors
  const statusData = [
    {
      name: 'Payées',
      value: orders.filter(o => o.status === 'paid').length,
      color: '#E8745E', // Red/coral color
    },
    {
      name: 'En attente',
      value: orders.filter(o => o.status === 'pending').length,
      color: '#8FAA7E', // Green color
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Commandes - 7 Derniers Jours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={last7Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#E8745E"
              tick={{ fill: '#E8745E' }}
            />
            <YAxis 
              stroke="#E8745E"
              tick={{ fill: '#E8745E' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                color: '#374151',
              }}
            />
            <Bar dataKey="commandes" fill="#E8745E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">Statut des Commandes</h4>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#374151',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="h-4 w-4 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.value} commandes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
