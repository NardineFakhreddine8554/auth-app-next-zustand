"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { redirect, useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const { register, loading, error, user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password, role);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 shadow-xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="user">user</option>
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {user && <p className="text-green-600">Welcome {user.name}</p>}
          {user&& redirect('/login')}
          <p className="mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 underline">
              Login here
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
