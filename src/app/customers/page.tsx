"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LilyChat from "@/components/LilyChat";
import { customers, transactions } from "@/lib/demo-data";
import {
  Search,
  Filter,
  MapPin,
  ShoppingBag,
  DollarSign,
  ExternalLink,
  X,
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
} from "lucide-react";
import type { Customer } from "@/lib/demo-data";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerTransactions = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return [];
    return transactions.filter((t) => t.buyer === customer.company);
  };

  return (
    <AppShell>
      <div className="p-6 space-y-4 max-w-[1200px]">
        <LilyChat />

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Customers", value: customers.length, color: "text-primary" },
            { label: "Active Customers", value: customers.filter((c) => c.status === "Active").length, color: "text-accent-green" },
            { label: "Total Revenue", value: `$${(customers.reduce((s, c) => s + c.totalSpend, 0) / 1000).toFixed(0)}K`, color: "text-accent-blue" },
            { label: "Avg. Orders/Customer", value: (customers.reduce((s, c) => s + c.totalOrders, 0) / customers.length).toFixed(1), color: "text-accent-orange" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold">Customers</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers..."
                  className="pl-9 pr-3 py-1.5 text-xs border border-border rounded-lg outline-none focus:border-primary/40 w-64"
                />
              </div>
              <button className="flex items-center gap-1 text-xs text-text-secondary border border-border px-3 py-1.5 rounded-lg hover:bg-surface-muted">
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-muted/50">
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">ID</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Name</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Company</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Region</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Orders</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Total Spend</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Approved Markets</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Status</th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold text-text-secondary uppercase text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/30 hover:bg-surface-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{customer.id}</td>
                    <td className="px-3 py-2.5 text-xs font-medium text-text-primary">{customer.name}</td>
                    <td className="px-3 py-2.5 text-xs text-text-secondary">{customer.company}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin size={11} /> {customer.region}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-medium">{customer.totalOrders}</td>
                    <td className="px-3 py-2.5 text-xs font-medium">${customer.totalSpend.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {customer.approvedMarkets.map((m) => (
                          <span key={m} className="text-[9px] bg-green-50 text-accent-green px-1.5 py-0.5 rounded">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        customer.status === "Active" ? "bg-green-50 text-accent-green" : "bg-gray-100 text-text-muted"
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-[10px] px-2 py-1 border border-primary text-primary rounded font-medium hover:bg-primary-50/50 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink size={10} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-sm font-semibold">Customer Profile — {selectedCustomer.company}</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-lighter flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{selectedCustomer.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedCustomer.name}</p>
                      <p className="text-xs text-text-muted">{selectedCustomer.company}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-muted rounded-lg p-2 text-center">
                    <ShoppingBag size={14} className="text-primary mx-auto mb-1" />
                    <p className="text-sm font-bold">{selectedCustomer.totalOrders}</p>
                    <p className="text-[10px] text-text-muted">Total Orders</p>
                  </div>
                  <div className="bg-surface-muted rounded-lg p-2 text-center">
                    <DollarSign size={14} className="text-accent-green mx-auto mb-1" />
                    <p className="text-sm font-bold">${(selectedCustomer.totalSpend / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-text-muted">Total Spend</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
                  <MapPin size={12} /> Approved Resale Markets
                </h4>
                <div className="flex gap-2">
                  {selectedCustomer.approvedMarkets.map((market) => (
                    <span key={market} className="text-xs bg-green-50 text-accent-green px-3 py-1 rounded-lg border border-accent-green/20">
                      {market}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold mb-2">Order History</h4>
                <div className="space-y-2">
                  {customerTransactions(selectedCustomer.id).length > 0 ? (
                    customerTransactions(selectedCustomer.id).map((txn) => (
                      <div key={txn.id} className="border border-border rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            txn.status === "Delivered" ? "bg-green-50" :
                            txn.status === "In Transit" ? "bg-blue-50" :
                            "bg-primary-lighter"
                          }`}>
                            {txn.status === "Delivered" ? <CheckCircle2 size={14} className="text-accent-green" /> :
                             txn.status === "In Transit" ? <Truck size={14} className="text-accent-blue" /> :
                             <Package size={14} className="text-primary" />}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{txn.id} — {txn.product.slice(0, 40)}...</p>
                            <p className="text-[10px] text-text-muted">{txn.date} · {txn.channel} · {txn.quantity} units</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">${(txn.offerPrice * txn.quantity).toLocaleString()}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                            txn.status === "Delivered" ? "bg-green-50 text-accent-green" :
                            txn.status === "In Transit" ? "bg-blue-50 text-accent-blue" :
                            "bg-primary-lighter text-primary"
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted text-center py-4">No transactions found for this customer.</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
