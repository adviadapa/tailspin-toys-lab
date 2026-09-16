/**
 * Publisher lookup helpers for the local SQLite-backed catalog.
 *
 * These wrappers keep the data access layer focused on app-facing
 * `Publisher` objects while leaving the raw Drizzle schema in `db/schema.ts`.
 */

import { asc, eq } from 'drizzle-orm';
import type { Database } from './db';
import { publishers } from '../../db/schema';
import type { Publisher } from '../types/game';

type PublisherSelectionRow = {
    id: number;
    name: string;
};

function mapPublisher(row: PublisherSelectionRow): Publisher {
    return {
        id: row.id,
        name: row.name,
    };
}

/**
 * Return all publishers ordered alphabetically by name.
 *
 * @param db - Database client used to query the `publishers` table.
 * @returns A list of publishers in stable name order.
 */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select({
            id: publishers.id,
            name: publishers.name,
        })
        .from(publishers)
        .orderBy(asc(publishers.name));

    return rows.map(mapPublisher);
}

/**
 * Fetch a single publisher by id.
 *
 * @param db - Database client used to query the `publishers` table.
 * @param id - Publisher primary key to look up.
 * @returns The matching publisher or `null` when no row exists.
 */
export async function getPublisherById(db: Database, id: number): Promise<Publisher | null> {
    const row = await db
        .select({
            id: publishers.id,
            name: publishers.name,
        })
        .from(publishers)
        .where(eq(publishers.id, id))
        .get();

    return row ? mapPublisher(row) : null;
}
