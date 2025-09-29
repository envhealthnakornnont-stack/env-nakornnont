import { Handle, Position } from "@xyflow/react";

// Custom Node Component
export  const CustomNode = ({ data }: any) => {
  return (
    <div className="btn btn-outline btn-ghost border-4">
      <Handle id="top" type="target" position={Position.Top} />
      <div className="">{data.label}</div>
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
};

// Custom Node Component
export const CustomLeftNode = ({ data }: any) => {
  return (
    <div className="btn btn-outline btn-ghost border-4">
      <Handle id="top" type="source" position={Position.Top} />
      <div className="">{data.label}</div>
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="target" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
};

// Custom Node Component
export const CustomDubleLeftNode = ({ data }: any) => {
  return (
    <div className="btn btn-outline btn-ghost border-4">
      <Handle id="top" type="source" position={Position.Top} />
      <div className="">{data.label}</div>
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle style={{top : 10}} id="left1" type="target" position={Position.Left} />
      <Handle style={{"top" : "80%"}} id="left2" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />
    </div>
  );
};