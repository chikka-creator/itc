import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, categories, assignments, asc, count } from '@itc/db';
import { CategoriesClient } from './CategoriesClient';

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder), asc(categories.name))
    .all();

  const catCounts = await db
    .select({
      categoryId: assignments.categoryId,
      count: count(assignments.id),
    })
    .from(assignments)
    .groupBy(assignments.categoryId)
    .all();

  const countMap: Record<string, number> = {};
  for (const c of catCounts) {
    countMap[c.categoryId] = c.count;
  }

  const categoriesWithCount = allCategories.map((cat) => ({
    ...cat,
    assignmentCount: countMap[cat.id] || 0,
  }));

  return <CategoriesClient initialCategories={categoriesWithCount} />;
}
