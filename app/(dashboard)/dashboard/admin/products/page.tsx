'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { productsApi, categoriesApi } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Simplified dialog and form for the sake of completion. 
// A real app might break this into separate components.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminProductsPage() {
  const { accessToken, status } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    images: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!accessToken) return;
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.list({ limit: 100 }), // Get many for admin
        categoriesApi.list()
      ]);
      setProducts(prodRes?.products || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && accessToken) {
      fetchData();
    } else if (status === 'guest') {
      setLoading(false);
    }
  }, [status, accessToken]);

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: (product.price / 100).toString(),
        stock: product.stock.toString(),
        categoryId: product?.categoryId || '',
        images: product.images.join(', ')
      });
    } else {
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: '', stock: '', categoryId: '', images: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    
    // Basic validation
    if (!formData.title || !formData.price || !formData.stock) {
      toast.error('Please fill in required fields: Title, Price, and Stock');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) * 100, // convert back to cents
        stock: parseInt(formData.stock, 10),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean)
      };
      // Only include categoryId if one is selected
      if (formData.categoryId) {
        payload.categoryId = formData.categoryId;
      }

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload, accessToken);
        toast.success('Product updated');
      } else {
        await productsApi.create(payload, accessToken);
        toast.success('Product created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsApi.delete(id, accessToken);
      toast.success('Product deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  if (loading || status === 'loading') {
    return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>;
  }

  const isDemoMode = accessToken?.startsWith('demo-');

  return (
    <>
      {isDemoMode && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
          ⚠️ <strong>Demo Mode:</strong> You are logged in with a demo account. Product changes require a real account. Please{' '}
          <a href="/login" className="underline font-semibold">log in with your real credentials</a> to manage products.
        </div>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button className="rounded-full" onClick={() => handleOpenModal()} disabled={isDemoMode}>
            <Plus className="w-4 h-4 mr-2" /> Add product
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {products.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="grid gap-2 rounded-xl border border-border p-4 md:grid-cols-5 md:items-center">
                <p className="font-medium md:col-span-2 line-clamp-1" title={product.title}>{product.title}</p>
                <Badge variant="outline" className="w-fit">{product.category?.name || 'No Category'}</Badge>
                <div className="flex gap-2 items-center">
                  <Badge className={product.stock < 10 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'} variant="outline">
                    {product.stock} in stock
                  </Badge>
                  <p className="font-semibold">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(product)}><Edit className="w-4 h-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Select
                value={formData.categoryId || 'none'}
                onValueChange={val => setFormData({ ...formData, categoryId: val === 'none' ? '' : val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Images (comma separated URLs)</Label>
              <Input placeholder="https://images.unsplash.com/..." value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} />
              <p className="text-xs text-muted-foreground">Note: In the future, this can be integrated with Cloudinary for direct image uploads.</p>
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
