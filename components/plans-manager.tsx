'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
  id: number;
  name: string;
  price: number;
  meals: number;
  is_popular: boolean;
}

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    meals: '',
    is_popular: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('meals', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Erreur lors du chargement des plans');
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.meals) {
      toast.error('Tous les champs sont requis');
      return;
    }

    try {
      const { error } = await supabase
        .from('plans')
        .insert([{
          name: newPlan.name,
          price: parseFloat(newPlan.price),
          meals: parseInt(newPlan.meals),
          is_popular: newPlan.is_popular,
        }]);

      if (error) throw error;

      toast.success('Plan ajouté');
      setNewPlan({ name: '', price: '', meals: '', is_popular: false });
      fetchPlans();
    } catch (error) {
      console.error('Error adding plan:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const updatePlan = async (plan: Plan) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({
          name: plan.name,
          price: plan.price,
          meals: plan.meals,
          is_popular: plan.is_popular,
        })
        .eq('id', plan.id);

      if (error) throw error;

      toast.success('Plan mis à jour');
      setEditingId(null);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Plan supprimé');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Plans */}
        <div>
          <h4 className="font-medium text-lg mb-4">Plans existants</h4>
          <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              {editingId === plan.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Nom</Label>
                      <Input
                        value={plan.name}
                        onChange={(e) => setPlans(plans.map(p => 
                          p.id === plan.id ? { ...p, name: e.target.value } : p
                        ))}
                      />
                    </div>
                    <div>
                      <Label>Prix ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={plan.price}
                        onChange={(e) => setPlans(plans.map(p => 
                          p.id === plan.id ? { ...p, price: parseFloat(e.target.value) } : p
                        ))}
                      />
                    </div>
                    <div>
                      <Label>Repas</Label>
                      <Input
                        type="number"
                        value={plan.meals}
                        onChange={(e) => setPlans(plans.map(p => 
                          p.id === plan.id ? { ...p, meals: parseInt(e.target.value) } : p
                        ))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={plan.is_popular}
                      onCheckedChange={(checked) => setPlans(plans.map(p => 
                        p.id === plan.id ? { ...p, is_popular: checked as boolean } : p
                      ))}
                    />
                    <Label>Marquer comme populaire</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => updatePlan(plan)} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {plan.is_popular && (
                        <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                          Populaire
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      ${plan.price}/plat • {plan.meals} repas
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(plan.id)} variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => deletePlan(plan.id)} variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>

        {/* Add New Plan */}
        <div className="border-t-2 mt-10 pt-8 space-y-4">
          <h4 className="font-medium text-xl">Ajouter un nouveau plan</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nom du plan</Label>
              <Input
                id="new-name"
                placeholder="Ex: Plan Familial"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-price">Prix par plat ($)</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                placeholder="Ex: 12.99"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-meals">Nombre de repas</Label>
              <Input
                id="new-meals"
                type="number"
                placeholder="Ex: 10"
                value={newPlan.meals}
                onChange={(e) => setNewPlan({ ...newPlan, meals: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={newPlan.is_popular}
              onCheckedChange={(checked) => setNewPlan({ ...newPlan, is_popular: checked as boolean })}
            />
            <Label>Marquer comme populaire</Label>
          </div>
          <Button onClick={addPlan} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
