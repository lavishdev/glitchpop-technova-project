"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/services/apiClient";
import { UserAccount } from "@/types/domain";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserAccount["role"]>("Security Officer");

  useEffect(() => {
    apiClient.getUsers().then(setUsers);
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: UserAccount = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role,
      department: "Security Operations",
      status: "active",
      lastActive: "Just now",
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsAddModalOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface tracking-tight">
            User Personnel & Security Clearance Roster
          </h2>
          <p className="text-xs text-on-surface-variant">
            Manage operator accounts, tactical role hierarchy, and field credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon="person_add"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Personnel Member
          </Button>
        </div>
      </div>

      {/* Roster Table */}
      <Card title="Personnel Accounts Roster" icon="group">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold tracking-wider border-b border-outline-variant/60">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Full Name & Email</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{u.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-on-surface">{u.name}</p>
                    <p className="text-[11px] text-on-surface-variant">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        u.role === "Super Admin"
                          ? "danger"
                          : u.role === "Security Officer"
                          ? "info"
                          : "default"
                      }
                      size="sm"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{u.department}</td>
                  <td className="px-4 py-3 font-mono text-on-surface-variant">
                    {u.lastActive}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.status === "active" ? "success" : "outline"} size="sm" dot>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" icon="edit">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Personnel Member"
        subtitle="Grant operational clearance credentials for CrowdShield Command."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUser}>
              Provision Credentials
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Officer John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Enterprise Email"
            type="email"
            placeholder="e.g. j.doe@crowdshield.internal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Security Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserAccount["role"])}
              className="bg-surface-container-lowest border border-outline-variant text-on-surface text-sm rounded-lg px-3.5 py-2 focus:outline-none focus:border-primary"
            >
              <option value="Security Officer">Security Officer</option>
              <option value="Field Dispatcher">Field Dispatcher</option>
              <option value="Data Auditor">Data Auditor</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
