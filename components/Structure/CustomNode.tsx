"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

type OrgNodeData = { label: string };

export default function OrgNode({ data }: NodeProps<Node<OrgNodeData, string>>) {
    return (
        <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
            <div className="font-medium leading-tight text-card-foreground">{data?.label}</div>

            {/* target handles */}
            <Handle type="target" position={Position.Top} id="t" className="!h-2 !w-2 !bg-primary" />
            <Handle type="target" position={Position.Bottom} id="b" className="!h-2 !w-2 !bg-primary" />
            <Handle type="target" position={Position.Left} id="l" className="!h-2 !w-2 !bg-primary" />
            <Handle type="target" position={Position.Right} id="r" className="!h-2 !w-2 !bg-primary" />

            {/* source handles */}
            <Handle type="source" position={Position.Top} id="top" className="!h-2 !w-2 !bg-muted-foreground" />
            <Handle type="source" position={Position.Bottom} id="bottom" className="!h-2 !w-2 !bg-muted-foreground" />
            <Handle type="source" position={Position.Left} id="left" className="!h-2 !w-2 !bg-muted-foreground" />
            <Handle type="source" position={Position.Right} id="right" className="!h-2 !w-2 !bg-muted-foreground" />
        </div>
    );
}

export const CustomLeftNode = ({ data }: NodeProps<Node<OrgNodeData, string>>) => {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm">
      <div className="font-medium leading-tight text-card-foreground">{data.label}</div>
      {/* <Handle id="top" type="source" position={Position.Top} className="!h-2 !w-2 !bg-muted-foreground"/> */}
      {/* <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-muted-foreground"/> */}
      <Handle id="left" type="target" position={Position.Left} className="!h-2 !w-2 !bg-primary"/>
      {/* <Handle id="right" type="source" position={Position.Right} className="!h-2 !w-2 !bg-muted-foreground"/> */}
    </div>
  );
};
