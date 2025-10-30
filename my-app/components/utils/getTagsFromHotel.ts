export type Tag = { label: string; color: string };

// mapeo de colores para las opciones que aparecen en el seed
const COLOR_MAP: Record<string, string> = {
    Resort: "#007AFF",
    Playa: "#5AC8FA",
    Beach: "#5AC8FA",
    Family: "#34C759",
    Couple: "#FF2D55",
    Business: "#AF52DE",
    Modern: "#34C759",
    Boutique: "#FF9500",
    Luxury: "#AF52DE",
};

function normalizeLabel(s: any) {
    if (!s && s !== 0) return "";
    return String(s)
        .trim()
        .split(/[-_\s]+/)
        .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

export function getTagsFromHotel(hotel: any): Tag[] {
    const raw = [hotel?.hotelType, hotel?.groupSize].filter((x) => x || x === 0);
    const flatCandidates: string[] = [];

    for (const entry of raw) {
        if (!entry && entry !== 0) continue;
        if (typeof entry === "string") {

            const parts = entry.split(/[;,\\/]+/).map((p) => p.trim()).filter(Boolean);
            flatCandidates.push(...parts);
        } else if (Array.isArray(entry)) {
            for (const e of entry) if (e) flatCandidates.push(String(e));
        } else {
            flatCandidates.push(String(entry));
        }
    }

    const candidates = flatCandidates.map((x) => normalizeLabel(x));

    const seen = new Set<string>();
    const tags: Tag[] = [];

    for (const c of candidates) {
        if (!c) continue;
        if (seen.has(c)) continue;
        seen.add(c);
        tags.push({ label: c, color: "" });
        if (tags.length >= 3) break;
    }

    const n = tags.length;
    if (n === 0) return tags;

    // Asigna colores basados en el mapeo del seed; usar color por defecto si no hay match
    for (let i = 0; i < n; i++) {
        const label = tags[i].label;
        tags[i].color = COLOR_MAP[label] ?? "#6B7280";
    }

    return tags;
}
