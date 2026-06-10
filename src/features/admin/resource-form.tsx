"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { resourceConfigs } from "@/features/admin/resource-config";

type FormRecord = Record<string, unknown>;

function serializeForm(form: HTMLFormElement, fieldNames: string[]) {
  const data = new FormData(form);
  const payload: FormRecord = {};

  for (const field of fieldNames) {
    const value = data.get(field);
    if (field === "options") {
      payload[field] = String(value || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((text) => ({ text }));
    } else if (["marks", "duration", "totalMarks", "totalQuestions"].includes(field)) {
      payload[field] = Number(value || 0);
    } else {
      payload[field] = value;
    }
  }

  return payload;
}

function fieldValue(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "object" && item !== null && "text" in item ? String(item.text) : String(item)))
      .join("\n");
  }
  if (typeof value === "object" && value !== null && "_id" in value) return String((value as { _id?: string })._id || "");
  return String(value ?? "");
}

export function ResourceForm({ name, id }: { name: keyof typeof resourceConfigs; id?: string }) {
  const config = resourceConfigs[name];
  const router = useRouter();
  const [record, setRecord] = useState<FormRecord>({});
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const endpoint = config.resource;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/${endpoint}/${id}`)
      .then((response) => response.json())
      .then((body: { item?: FormRecord }) => setRecord(body.item || {}))
      .finally(() => setLoading(false));
  }, [endpoint, id]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const payload = serializeForm(
      event.currentTarget,
      config.fields.map((field) => field.name)
    );
    const response = await fetch(id ? `/api/admin/${endpoint}/${id}` : `/api/admin/${endpoint}`, {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(body?.message || "Could not save. Check configuration and try again.");
      return;
    }
    router.push(name === "support" ? "/admin/support" : `/admin/${name}`);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title={`${id ? "Edit" : "Create"} ${config.title}`}
        description="This workflow uses a dedicated page, not a popup form."
        icon={config.icon}
      />
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Update record" : config.createLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading record
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                {config.fields.map((field) => {
                  const defaultValue = fieldValue(record[field.name]);
                  return (
                    <div
                      key={field.name}
                      className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
                    >
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          defaultValue={defaultValue}
                        />
                      ) : field.type === "select" ? (
                        <Select
                          id={field.name}
                          name={field.name}
                          defaultValue={defaultValue || field.options?.[0]?.value}
                          options={field.options || []}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type || "text"}
                          required={field.required}
                          placeholder={field.placeholder}
                          defaultValue={defaultValue}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {message ? <div className="rounded-md border bg-secondary/15 px-3 py-2 text-sm">{message}</div> : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button disabled={saving}>
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save
                </Button>
                <Button asChild variant="outline">
                  <Link href={name === "support" ? "/admin/support" : `/admin/${name}`}>
                    <ArrowLeft className="size-4" />
                    Back
                  </Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
