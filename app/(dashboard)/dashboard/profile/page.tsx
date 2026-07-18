'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/components/providers/auth-provider';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, accessToken, status } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      await usersApi.updateProfile({ name, avatar }, accessToken);
      toast.success('Profile updated successfully!');
      // Typically we'd force a re-fetch of the user object here, 
      // but a page reload or relying on the next load is fine for now.
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>;
  }

  if (status === 'guest') {
    return <Card><CardContent className="py-10 text-center text-muted-foreground">Log in to view your profile.</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Avatar URL</Label>
          <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        </div>
        <Button className="w-fit rounded-full" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save profile
        </Button>
      </CardContent>
    </Card>
  )
}
