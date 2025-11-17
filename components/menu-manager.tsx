'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { supabase, type Dish } from '@/lib/supabase';
import { Plus, Pencil, Trash2, RefreshCw, Star } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface MenuManagerProps {
  dishes: Dish[];
  onRefresh: () => void;
}

export function MenuManager({ dishes, onRefresh }: MenuManagerProps) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [useUrl, setUseUrl] = useState(true);

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      price: dish.price.toString(),
      image: dish.image,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', price: '', image: '' });
    setImageFile(null);
    setUseUrl(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('dish-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setSaving(true);

    try {
      let imageUrl = formData.image;

      // Upload image if file is selected
      if (imageFile && !useUrl) {
        imageUrl = await handleImageUpload(imageFile);
      }

      if (editingDish) {
        // Update existing dish
        const { error } = await supabase
          .from('dishes')
          .update({
            name: formData.name,
            price: parseFloat(formData.price),
            image: imageUrl,
          })
          .eq('id', editingDish.id);

        if (error) throw error;
        
        toast.success('Plat mis à jour');
        setEditingDish(null);
        onRefresh();
      } else {
        // Add new dish
        const { error } = await supabase
          .from('dishes')
          .insert([{
            name: formData.name,
            price: parseFloat(formData.price),
            image: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
          }]);

        if (error) throw error;
        
        toast.success('Plat ajouté');
        setIsAdding(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error saving dish:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Plat supprimé');
      onRefresh();
    }
  };

  const toggleFeatured = async (dish: Dish) => {
    const { error } = await supabase
      .from('dishes')
      .update({ is_featured: !dish.is_featured })
      .eq('id', dish.id);

    if (error) {
      toast.error('Erreur lors de la mise à jour');
    } else {
      toast.success(dish.is_featured ? 'Retiré des favoris' : 'Ajouté aux favoris');
      onRefresh();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion du Menu</CardTitle>
          <div className="flex gap-2">
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un plat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden relative">
                <button
                  onClick={() => toggleFeatured(dish)}
                  className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
                    dish.is_featured 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-white/80 text-gray-400'
                  } hover:scale-110 transition-transform`}
                  title={dish.is_featured ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Star className={`h-5 w-5 ${dish.is_featured ? 'fill-current' : ''}`} />
                </button>
                <div className="relative h-48 w-full">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{dish.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">${dish.price}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(dish)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDelete(dish.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={!!editingDish || isAdding} onOpenChange={() => {
        setEditingDish(null);
        setIsAdding(false);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDish ? 'Modifier le plat' : 'Ajouter un plat'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du plat</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Couscous Royal"
              />
            </div>
            <div>
              <Label htmlFor="price">Prix ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex: 18.00"
              />
            </div>
            <div>
              <Label>Image du plat</Label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setUseUrl(true)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                    useUrl ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
                  }`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrl(false)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                    !useUrl ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200'
                  }`}
                >
                  Télécharger
                </button>
              </div>

              {useUrl ? (
                <>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL d'image externe (Unsplash, etc.)
                  </p>
                </>
              ) : (
                <>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Télécharger une image (max 5 MB)
                  </p>
                  {imageFile && (
                    <p className="text-xs text-primary mt-1">
                      ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingDish(null);
                setIsAdding(false);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {uploading ? 'Téléchargement...' : saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
