import { FilterQuery, Model } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import {
  demoClasses,
  demoMaterials,
  demoNotifications,
  demoQuestions,
  demoResults,
  demoStudents,
  demoTests,
  demoTickets
} from "@/lib/seed-data";
import { resourceModels } from "@/models";
import type { ResourceName } from "@/types/platform";

type PlainRecord = Record<string, unknown>;

const fallbackData: Record<ResourceName, PlainRecord[]> = {
  classes: demoClasses,
  students: demoStudents,
  questions: demoQuestions,
  tests: demoTests,
  results: demoResults,
  materials: demoMaterials,
  tickets: demoTickets,
  notifications: demoNotifications
};

const searchableFields: Record<ResourceName, string[]> = {
  classes: ["className", "description"],
  students: ["name", "rollNumber", "email", "mobile"],
  questions: ["questionText", "subject", "chapter"],
  tests: ["testName", "subject", "status"],
  results: [],
  materials: ["title", "subject", "description"],
  tickets: ["title", "message", "status"],
  notifications: ["title", "message", "type"]
};

export function isResourceName(value: string): value is ResourceName {
  return value in resourceModels;
}

function modelFor(resource: ResourceName) {
  return resourceModels[resource] as Model<PlainRecord>;
}

function matchesSearch(item: PlainRecord, search: string, fields: string[]) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return fields.some((field) => String(item[field] ?? "").toLowerCase().includes(needle));
}

export async function listResource(resource: ResourceName, searchParams: URLSearchParams) {
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const classId = searchParams.get("classId") || "";
  const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

  if (!isDatabaseConfigured()) {
    const fields = searchableFields[resource];
    const items = fallbackData[resource].filter((item) => {
      const bySearch = matchesSearch(item, search, fields);
      const byStatus = status ? item.status === status || item.published === (status === "published") : true;
      const byClass = classId ? item.classId === classId : true;
      return bySearch && byStatus && byClass;
    });
    return { items: items.slice(0, limit), total: items.length, mode: "demo" };
  }

  await connectToDatabase();
  const query: FilterQuery<PlainRecord> = {};
  if (search) {
    query.$or = searchableFields[resource].map((field) => ({
      [field]: { $regex: search, $options: "i" }
    }));
  }
  if (status) {
    query.status = status;
  }
  if (classId) {
    query.classId = classId;
  }

  const model = modelFor(resource);
  const [items, total] = await Promise.all([
    model.find(query).sort({ createdAt: -1 }).limit(limit).lean(),
    model.countDocuments(query)
  ]);
  return { items, total, mode: "database" };
}

export async function getResource(resource: ResourceName, id: string) {
  if (!isDatabaseConfigured()) {
    return fallbackData[resource].find((item) => String(item._id) === id) || null;
  }
  await connectToDatabase();
  return modelFor(resource).findById(id).lean();
}

export async function createResource(resource: ResourceName, payload: PlainRecord) {
  await connectToDatabase();
  const model = modelFor(resource);
  const item = await model.create(payload);
  return item.toObject();
}

export async function updateResource(resource: ResourceName, id: string, payload: PlainRecord) {
  await connectToDatabase();
  return modelFor(resource).findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
}

export async function deleteResource(resource: ResourceName, id: string) {
  await connectToDatabase();
  await modelFor(resource).findByIdAndDelete(id);
  return { deleted: true };
}
