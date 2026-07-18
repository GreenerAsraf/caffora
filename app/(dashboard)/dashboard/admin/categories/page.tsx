'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { categoriesApi } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminCategoriesPage() {
  const { accessToken, status } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.list();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    if (!formData.name || !formData.slug) {
      toast.error('Name and slug are required');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData, accessToken);
        toast.success('Category updated');
      } else {
        await categoriesApi.create(formData, accessToken);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesApi.delete(id, accessToken);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  if (loading || status === 'loading') {
    return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Button className="rounded-full" onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add category</Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category.id} className="rounded-xl border border-border p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">{category._count?.products || 0} active products</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name} 
                onChange={e => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                }} 
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
