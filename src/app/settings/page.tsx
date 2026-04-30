"use client";

import AppShell from "@/components/AppShell";
import {
  User,
  Building,
  Users,
  Shield,
  Bell,
  Key,
  Globe,
  Palette,
} from "lucide-react";

const settingSections = [
  { label: "Profile", icon: User, description: "Manage your personal information and preferences" },
  { label: "Organization", icon: Building, description: "Company details, branding, and subscription plan" },
  { label: "Team Members", icon: Users, description: "Invite team members and manage roles" },
  { label: "Permissions", icon: Shield, description: "Configure role-based access controls" },
  { label: "Notifications", icon: Bell, description: "Email, in-app, and mobile notification preferences" },
  { label: "API Keys", icon: Key, description: "Manage API keys for integrations" },
  { label: "Channels & Markets", icon: Globe, description: "Configure sales channel connections and approved markets" },
  { label: "Appearance", icon: Palette, description: "Customize your dashboard theme and layout" },
];

export default function Settings() {
  return (
    <AppShell>
      <div className="p-6 max-w-[1200px]">
        <h1 className="text-lg font-semibold mb-1">Account & Team Settings</h1>
        <p className="text-sm text-text-muted mb-6">Manage your account, team, and platform preferences.</p>

        <div className="grid grid-cols-2 gap-3">
          {settingSections.map((section) => (
            <div
              key={section.label}
              className="bg-white rounded-xl border border-border p-4 flex items-start gap-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-lighter flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <section.icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-0.5 group-hover:text-primary transition-colors">{section.label}</h3>
                <p className="text-xs text-text-muted">{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold mb-3">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Enterprise Plan</span>
                <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
              </div>
              <p className="text-xs text-text-muted">Unlimited channels, users, and API access. Includes Lily AI Orchestrator.</p>
            </div>
            <button className="text-xs text-primary font-medium hover:underline">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
