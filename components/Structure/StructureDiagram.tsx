"use client";

import * as React from "react";
import { ReactFlow, Controls, Background } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import { orgFlow } from "./types";
import OrgNode, { CustomLeftNode } from "./CustomNode";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
    org: OrgNode,
    CustomLeftNode: CustomLeftNode
} as any;

export default function StructureDiagram() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    // Always call hooks before any conditional return to keep order stable
    const nodes: Node[] = React.useMemo(() => {
        const base = Array.isArray(orgFlow?.nodes) ? (orgFlow.nodes as Node[]) : [];
        return base.map((n) => ({ ...n, type: (n as any).type ?? "org" }));
    }, []);
    const edges: Edge[] = React.useMemo(() => (Array.isArray(orgFlow?.edges) ? (orgFlow.edges as Edge[]) : []), []);

    return (
        <div className="h-[60vh] rounded-xl border">
            {mounted ? (
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    fitView
                    minZoom={0.2}
                    defaultEdgeOptions={{ type: "step" }}
                    panOnDrag
                    zoomOnScroll
                    proOptions={{ hideAttribution: true }}
                >
                    <Background />
                    <Controls className="text-slate-800"/>
                </ReactFlow>
            ) : (
                <div className="p-4 text-sm text-muted-foreground">Loading diagram…</div>
            )}
        </div>
    );
}