"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Search, Expand, Minimize } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrgUnit = {
  key: string;
  name: string;
  description?: string;
  badge?: string;
  tags?: string[];
  responsibilities?: string[];
  children?: OrgUnit[];
};

// === helpers ===
function countDescendants(node: OrgUnit): number {
  if (!node.children?.length) return 0;
  return node.children.length + node.children.reduce((s, c) => s + countDescendants(c), 0);
}
function getAncestorsMap(nodes: OrgUnit[]) {
  const parent = new Map<string, string | null>();
  const walk = (arr: OrgUnit[], p: string | null) => {
    for (const n of arr) {
      parent.set(n.key, p);
      if (n.children) walk(n.children, n.key);
    }
  };
  walk(nodes, null);
  return parent;
}
function getAllKeys(nodes: OrgUnit[]): string[] {
  const out: string[] = [];
  const walk = (arr: OrgUnit[]) => {
    for (const n of arr) {
      out.push(n.key);
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}
function keysToDepth(nodes: OrgUnit[], depth = 2): Set<string> {
  const open = new Set<string>();
  const walk = (arr: OrgUnit[], d: number) => {
    for (const n of arr) {
      if (d < depth) open.add(n.key);
      if (n.children) walk(n.children, d + 1);
    }
  };
  walk(nodes, 0);
  return open;
}
function searchMatch(n: OrgUnit, q: string) {
  if (!q) return false;
  const hay = [
    n.name,
    n.description ?? "",
    ...(n.tags ?? []),
    ...(n.responsibilities ?? []),
  ].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

type Props = { data: OrgUnit[]; initialDepth?: number };

export default function OrgTree({ data, initialDepth = 2 }: Props) {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<Set<string>>(() => keysToDepth(data, initialDepth));
  const ancestors = React.useMemo(() => getAncestorsMap(data), [data]);

  // auto-expand เส้นทางของโหนดที่แมตช์
  React.useEffect(() => {
    if (!query.trim()) return;
    const open = new Set(expanded);
    const allKeys = getAllKeys(data);
    for (const k of allKeys) {
      const node = findNodeByKey(data, k);
      if (node && searchMatch(node, query)) {
        let cur: string | null | undefined = k;
        while (cur) {
          open.add(cur);
          cur = ancestors.get(cur);
        }
      }
    }
    setExpanded(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const expandAll = () => setExpanded(new Set(getAllKeys(data)));
  const collapseAll = () => setExpanded(new Set()); // root ก็พับ
  const openToDepth = (d: number) => setExpanded(keysToDepth(data, d));

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา (ชื่อหน่วย/คำอธิบาย/แท็ก/หน้าที่)"
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            <Expand className="mr-2 h-4 w-4" /> ขยายทั้งหมด
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <Minimize className="mr-2 h-4 w-4" /> ยุบทั้งหมด
          </Button>
          {/* depth presets */}
          <div className="flex items-center gap-1">
            {[1,2,3,4].map((d)=>(
              <Button key={d} variant="ghost" size="sm" onClick={()=>openToDepth(d)}>
                ชั้น {d}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="[&_ul]:space-y-2">
        <ul>
          {data.map((n) => (
            <li key={n.key} className="rounded-xl border p-3">
              <TreeNode
                node={n}
                level={0}
                expanded={expanded}
                setExpanded={setExpanded}
                query={query}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function findNodeByKey(nodes: OrgUnit[], key: string): OrgUnit | null {
  for (const n of nodes) {
    if (n.key === key) return n;
    if (n.children) {
      const f = findNodeByKey(n.children, key);
      if (f) return f;
    }
  }
  return null;
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="rounded bg-yellow-200/60 px-0.5 dark:bg-yellow-600/40">{p}</mark>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function TreeNode({
  node,
  level,
  expanded,
  setExpanded,
  query,
}: {
  node: OrgUnit;
  level: number;
  expanded: Set<string>;
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>;
  query: string;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded.has(node.key);
  const toggle = () =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (isOpen) next.delete(node.key);
      else next.add(node.key);
      return next;
    });

  const childCount = countDescendants(node);

  return (
    <div className="space-y-1">
      <button
        onClick={hasChildren ? toggle : undefined}
        className={cn(
          "w-full rounded-md px-2 py-1.5 text-left",
          "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          hasChildren ? "cursor-pointer" : "cursor-default"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            {/* caret */}
            {hasChildren ? (
              isOpen ? <ChevronDown className="mt-0.5 h-4 w-4 shrink-0" /> : <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted-foreground/40" />
            )}
            <div>
              <div className="font-medium leading-tight">
                {highlight(node.name, query)}
              </div>
              {node.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {highlight(node.description, query)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {childCount > 0 && (
              <Badge variant="outline" className="hidden sm:inline-flex text-xs">{childCount.toLocaleString()}</Badge>
            )}
            {node.badge && <Badge variant="secondary" className="hidden sm:inline-flex text-xs">{node.badge}</Badge>}
          </div>
        </div>
      </button>

      {/* children */}
      {hasChildren && isOpen && (
        <ul className="space-y-2 border-l pl-4">
          {node.children!.map((c) => (
            <li key={c.key} className="rounded-lg border p-3">
              <TreeNode
                node={c}
                level={level + 1}
                expanded={expanded}
                setExpanded={setExpanded}
                query={query}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}