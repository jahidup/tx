"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { formatDate } from "@/lib/utils";
import { resourceConfigs } from "@/features/admin/resource-config";

type Row = Record<string, unknown> & { _id?: string };

function valueFor(row: Row, key: string) {
  const value = row[key];
  if (key.toLowerCase().includes("created") || key.toLowerCase().includes("updated")) return formatDate(String(value || ""));
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return String(value.length);
  if (typeof value === "object" && value !== null && "_id" in value) return String((value as { _id?: string })._id);
  return String(value ?? "Not set");
}

export function ResourceList({ name }: { name: keyof typeof resourceConfigs }) {
  const config = resourceConfigs[name];
  const endpoint = config.resource === "tests" ? "tests" : config.resource;
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);

  const createHref = name === "support" ? "/admin/support/create" : `/admin/${name}/create`;
  const baseHref = `/admin/${name}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/admin/${endpoint}?search=${encodeURIComponent(search)}`)
        .then((response) => response.json())
        .then((body: { items?: Row[]; mode?: string }) => {
          setRows(body.items || []);
          setMode(body.mode || "");
        })
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [endpoint, search]);

  const filteredColumns = useMemo(() => config.columns, [config.columns]);

  async function deleteRow(id?: string) {
    if (!id) return;
    const confirmed = window.confirm("Delete this record? This action cannot be undone.");
    if (!confirmed) return;
    const response = await fetch(`/api/admin/${endpoint}/${id}`, { method: "DELETE" });
    if (response.ok) {
      setRows((current) => current.filter((row) => String(row._id) !== id));
    }
  }

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        icon={config.icon}
        action={{ label: config.createLabel, href: createHref, icon: "Plus" }}
      />
      {mode === "demo" ? (
        <div className="mb-4 rounded-lg border bg-secondary/15 px-4 py-3 text-sm">
          Demo data is shown. Configure MongoDB Atlas to persist new records.
        </div>
      ) : null}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${config.title.toLowerCase()}`}
                className="pl-9"
              />
            </div>
            <Badge variant="outline">{loading ? "Loading" : `${rows.length} records`}</Badge>
          </div>
          {rows.length === 0 && !loading ? (
            <EmptyState
              icon={config.icon}
              title={`No ${config.title.toLowerCase()} found`}
              description="Use the dedicated create page to add the first record."
              action={{ label: config.createLabel, href: createHref }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-muted-foreground">
                    {filteredColumns.map((column) => (
                      <th key={column.key} className="px-3 py-3 font-semibold">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const id = String(row._id || "");
                    return (
                      <tr key={id} className="border-b last:border-0">
                        {filteredColumns.map((column) => (
                          <td key={column.key} className="max-w-[280px] truncate px-3 py-3">
                            {valueFor(row, column.key)}
                          </td>
                        ))}
                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="icon" title="View">
                              <Link href={name === "results" ? `/admin/results/${id}` : `${baseHref}/edit/${id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                            {name !== "results" ? (
                              <Button asChild variant="ghost" size="icon" title="Edit">
                                <Link href={`${baseHref}/edit/${id}`}>
                                  <Edit className="size-4" />
                                </Link>
                              </Button>
                            ) : null}
                            <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteRow(id)}>
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
