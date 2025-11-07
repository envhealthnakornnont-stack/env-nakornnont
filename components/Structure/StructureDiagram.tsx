"use client";

import { ReactFlow, Controls, Background, type Node, type Edge, type NodeTypes } from "@xyflow/react";
import { orgFlow } from "./types";
import OrgNode, { CustomLeftNode } from "./CustomNode";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, useState } from "react";

const nodeTypes: NodeTypes = {
    org: OrgNode,
    CustomLeftNode,
};

export default function StructureDiagram(): React.JSX.Element {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);;

    const nodes = useMemo<Node[]>(() => {
        const base = Array.isArray(orgFlow?.nodes)
            ? (orgFlow.nodes as unknown as Node[])
            : [];
        // บังคับ type ของ node เป็น "org" ถ้ายังไม่กำหนดมา
        return base.map((n) => ({ ...n, type: n.type ?? "org" }));
    }, []);

    const edges = useMemo<Edge[]>(
        () => (Array.isArray(orgFlow?.edges) ? (orgFlow.edges as unknown as Edge[]) : []),
        []
    );

    const defaultEdgeOptions = useMemo(() => ({ type: "step" as const }), []);

    return (
        <div className="h-[60vh] rounded-xl border">
            {mounted ? (
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    fitView
                    minZoom={0.2}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitViewOptions={{ padding: 0.2 }}
                    panOnDrag
                    zoomOnScroll
                    proOptions={{ hideAttribution: true }}
                >
                    <Background />
                    <Controls position="bottom-right" className="text-slate-800" />
                </ReactFlow>
            ) : (
                <div className="p-4 text-sm text-muted-foreground">Loading diagram…</div>
            )}
        </div>
    );
}