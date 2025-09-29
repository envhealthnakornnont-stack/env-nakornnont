"use client";

import Breadcrumbs from "@/components/Breadcrumbs"
import { nodes, edges } from "@/config/nodesData";
import { CustomNode, CustomLeftNode, CustomDubleLeftNode } from "./CustomNodes";
import {
    ReactFlow,
    Controls,
    Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Divider from "@/components/Divider";

const nodeTypes = {
    customNode: CustomNode,
    customLeftNode: CustomLeftNode,
    customDubleLeftNode: CustomDubleLeftNode,
};

const FlowChart = () => {

    const breadcrumbs = [
        { label: "หน้าแรก", href: "/" },
        { label: "ข้อมูลหน่วยงาน", },
        { label: "โครงสร้างหน่วยงาน", isCurrent: true },
    ];

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-3">
                <h1 className="sm:text-3xl text-2xl font-bold">โครงสร้างหน่วยงาน</h1>
                <Divider/>
            </div>
            <div className="self-center mb-3 w-full h-[60vh] md:h-[80vh]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    minZoom={0.1}
                    fitView
                    className="rounded-box shadow-lg border border-base-content"
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
        </>
    )
}

export default FlowChart