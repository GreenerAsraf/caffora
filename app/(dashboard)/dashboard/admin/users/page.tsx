'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/providers/auth-provider';
import { usersApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { accessToken, status, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.list({ limit: 50 }, accessToken!);
      setUsers(res?.users || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && accessToken) {
      fetchUsers();
    } else if (status === 'guest') {
      setLoading(false);
    }
  }, [status, accessToken]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!accessToken) return;
    try {
      await usersApi.updateRole(userId, newRole, accessToken);
      toast.success('User role updated');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  if (loading || status === 'loading') {
    return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="grid gap-2 rounded-xl border border-border p-4 sm:grid-cols-4 sm:items-center">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            
            <div className="flex gap-2 text-sm text-muted-foreground">
              <span>{user._count?.orders || 0} orders</span>
            </div>

            <div className="flex justify-end">
              {user.id === currentUser?.id ? (
                <Badge className="w-fit">ADMIN (You)</Badge>
              ) : (
                <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
