'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase, type Order } from '@/lib/supabase';
import { format } from 'date-fns';
import { Eye, RefreshCw, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrdersTableProps {
  orders: Order[];
  onRefresh: () => void;
}

export function OrdersTable({ orders, onRefresh }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success('Statut mis à jour');
      onRefresh();
    }
    setUpdating(null);
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    
    setDeleting(orderId);
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Commande supprimée');
      onRefresh();
    }
    setDeleting(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Toutes les Commandes</CardTitle>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Plan</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Personnes</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-mono text-sm">#{order.id}</td>
                    <td className="p-4">
                      {order.plan_name ? (
                        <div>
                          <div className="font-medium">{order.plan_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.meals_per_day} repas/jour
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.number_of_people || '-'}
                    </td>
                    <td className="p-4 font-bold text-primary">${Number(order.total).toFixed(2)}</td>
                    <td className="p-4">
                      <Badge
                        variant={order.status === 'paid' ? 'default' : 'secondary'}
                        className={order.status === 'paid' ? 'bg-primary' : ''}
                      >
                        {order.status === 'paid' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Payée</>
                        ) : (
                          <><Clock className="h-3 w-3 mr-1" /> En attente</>
                        )}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                            variant="default"
                            size="sm"
                            disabled={updating === order.id}
                          >
                            {updating === order.id ? '...' : 'Marquer payée'}
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteOrder(order.id)}
                          variant="destructive"
                          size="sm"
                          disabled={deleting === order.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commande #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{selectedOrder.plan_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Personnes</p>
                  <p className="font-medium">{selectedOrder.number_of_people || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Repas/jour</p>
                  <p className="font-medium">{selectedOrder.meals_per_day || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge variant={selectedOrder.status === 'paid' ? 'default' : 'secondary'}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-3">Articles</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.dish_name}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <p className="text-lg font-medium">Total</p>
                <p className="text-2xl font-bold text-primary">${Number(selectedOrder.total).toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
