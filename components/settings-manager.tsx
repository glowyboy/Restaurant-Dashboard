'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryZone {
  id: number;
  name: string;
  display_order: number;
}

interface Settings {
  free_delivery_threshold: string;
  contact_email: string;
  restaurant_type: string;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Settings>({
    free_delivery_threshold: '75',
    contact_email: 'lemtnacanada@gmail.com',
    restaurant_type: 'Canadienne',
  });
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [newZone, setNewZone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*');

      if (!settingsError && settingsData) {
        const settingsObj: any = {};
        settingsData.forEach(item => {
          settingsObj[item.key] = item.value;
        });
        setSettings(settingsObj);
      }

      // Fetch delivery zones
      const { data: zonesData, error: zonesError } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('display_order', { ascending: true });

      if (!zonesError && zonesData) {
        setZones(zonesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('settings')
          .upsert({ key, value }, { onConflict: 'key' });
      }

      toast.success('Paramètres enregistrés');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const addZone = async () => {
    if (!newZone) {
      toast.error('Le nom de la zone est requis');
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_zones')
        .insert([{
          name: newZone,
          display_order: zones.length + 1,
        }]);

      if (error) throw error;

      toast.success('Zone ajoutée');
      setNewZone('');
      fetchData();
    } catch (error) {
      console.error('Error adding zone:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const deleteZone = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) return;

    try {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Zone supprimée');
      fetchData();
    } catch (error) {
      console.error('Error deleting zone:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Généraux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="threshold">Seuil de livraison gratuite ($)</Label>
            <Input
              id="threshold"
              type="number"
              value={settings.free_delivery_threshold}
              onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
              placeholder="75"
              className="text-lg"
            />
            <p className="text-xs text-gray-500">
              Livraison GRATUITE sur toutes les commandes de ${settings.free_delivery_threshold}+
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de contact</Label>
            <Input
              id="email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="contact@restaurant.com"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de cuisine</Label>
            <Input
              id="type"
              value={settings.restaurant_type}
              onChange={(e) => setSettings({ ...settings, restaurant_type: e.target.value })}
              placeholder="Marocaine, Canadienne, etc."
              className="text-lg"
            />
          </div>

          <Button onClick={saveSettings} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Zones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Zones de Livraison</CardTitle>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Zones */}
          <div className="space-y-2">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-lg">{zone.name}</p>
                </div>
                <Button
                  onClick={() => deleteZone(zone.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Zone */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium">Ajouter une zone</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la zone (ex: Montréal)"
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                className="text-lg"
              />
              <Button onClick={addZone}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
