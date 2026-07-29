import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FolderNode } from '../types';
import { Folder, FileText, ZoomIn, ZoomOut, RefreshCw, Layers, Sparkles, Network } from 'lucide-react';

interface FolderNodeGraphProps {
  tree: FolderNode;
  onSelectNode?: (node: FolderNode) => void;
}

interface D3NodeData {
  id: string;
  name: string;
  type: 'file' | 'folder';
  purpose?: string;
  allowedFormats?: string[];
  children?: D3NodeData[];
}

export const FolderNodeGraph: React.FC<FolderNodeGraphProps> = ({ tree, onSelectNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{
    name: string;
    type: string;
    purpose?: string;
    path: string;
    formats?: string[];
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !tree) return;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 800;
    const height = 500;

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom as any);

    // Format tree data for d3.hierarchy
    const convertToD3Hierarchy = (node: FolderNode): D3NodeData => {
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        purpose: node.purpose,
        allowedFormats: node.allowedFormats,
        children: node.children?.map(convertToD3Hierarchy),
      };
    };

    const data = convertToD3Hierarchy(tree);

    // Compute tree layout
    const root = d3.hierarchy<D3NodeData>(data);
    const treeLayout = d3.tree<D3NodeData>().size([height - 80, width - 260]);
    treeLayout(root);

    // Add links (curved bezier path)
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', (d) => (d.target.data.type === 'folder' ? '#f59e0b' : '#38bdf8'))
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => (d.target.data.type === 'folder' ? 2 : 1.5))
      .attr('stroke-dasharray', (d) => (d.target.data.type === 'file' ? '4 2' : 'none'))
      .attr('d', (d: any) => {
        return `M${d.source.y + 120},${d.source.x + 40}
                C${(d.source.y + d.target.y) / 2 + 120},${d.source.x + 40}
                 ${(d.source.y + d.target.y) / 2 + 120},${d.target.x + 40}
                 ${d.target.y + 120},${d.target.x + 40}`;
      });

    // Create node group
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y + 120},${d.x + 40})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        // Compute path string
        const pathArray = d.ancestors().map((a: any) => a.data.name).reverse();
        const fullPath = pathArray.join('/');
        
        setSelectedNodeInfo({
          name: d.data.name,
          type: d.data.type,
          purpose: d.data.purpose,
          path: fullPath,
          formats: d.data.allowedFormats,
        });

        if (onSelectNode) {
          onSelectNode(d.data);
        }
      });

    // Draw node background circles/rectangles
    nodes
      .append('rect')
      .attr('x', (d: any) => (d.data.type === 'folder' ? -12 : -10))
      .attr('y', (d: any) => (d.data.type === 'folder' ? -12 : -10))
      .attr('width', (d: any) => (d.data.type === 'folder' ? 24 : 20))
      .attr('height', (d: any) => (d.data.type === 'folder' ? 24 : 20))
      .attr('rx', (d: any) => (d.data.type === 'folder' ? 6 : 4))
      .attr('fill', (d: any) => {
        if (d.data.id === 'root') return '#f59e0b';
        return d.data.type === 'folder' ? '#1e293b' : '#0f172a';
      })
      .attr('stroke', (d: any) => {
        if (d.data.id === 'root') return '#fbbf24';
        return d.data.type === 'folder' ? '#f59e0b' : '#38bdf8';
      })
      .attr('stroke-width', 2);

    // Draw node icons / dots
    nodes
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (d: any) => (d.data.type === 'folder' ? 4 : 3))
      .attr('fill', (d: any) => (d.data.type === 'folder' ? '#fbbf24' : '#38bdf8'));

    // Draw Node text labels
    nodes
      .append('text')
      .attr('dy', '0.35em')
      .attr('x', (d: any) => (d.children ? -16 : 16))
      .attr('text-anchor', (d: any) => (d.children ? 'end' : 'start'))
      .text((d: any) => d.data.name)
      .attr('fill', (d: any) => (d.data.type === 'folder' ? '#fef08a' : '#e0f2fe'))
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', (d: any) => (d.data.type === 'folder' ? 'bold' : 'normal'));

    // Initial positioning center offset
    svg.call((zoom as any).transform, d3.zoomIdentity.translate(20, 20).scale(0.95));

  }, [tree, onSelectNode]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    svg.transition().duration(500).call((zoom as any).transform, d3.zoomIdentity.translate(20, 20).scale(0.95));
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Network className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Repository Node Graph</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                d3 Visualizer
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Interactive structural map of directories and files. Drag to pan, scroll to zoom, click nodes to inspect details.
            </p>
          </div>
        </div>

        {/* Legend & Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-xs font-mono px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span>Folder Node</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              <span>File Node</span>
            </span>
          </div>

          <button
            onClick={handleResetZoom}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View ({zoomLevel}x)</span>
          </button>
        </div>
      </div>

      {/* Node Graph Container */}
      <div
        ref={containerRef}
        className="w-full h-[500px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Selected Node Drawer Card */}
        {selectedNodeInfo && (
          <div className="absolute bottom-4 left-4 max-w-sm bg-slate-900/90 border border-cyan-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono animate-fadeIn space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-gray-800 pb-1">
              <span className="flex items-center gap-1.5 truncate">
                {selectedNodeInfo.type === 'folder' ? (
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{selectedNodeInfo.name}</span>
              </span>
              <button
                onClick={() => setSelectedNodeInfo(null)}
                className="text-gray-500 hover:text-white px-1"
              >
                ✕
              </button>
            </div>
            <div className="text-[11px] text-gray-400 truncate">
              Path: <span className="text-gray-200">{selectedNodeInfo.path}</span>
            </div>
            {selectedNodeInfo.purpose && (
              <div className="text-[11px] text-amber-200/90 italic">
                "{selectedNodeInfo.purpose}"
              </div>
            )}
            {selectedNodeInfo.formats && selectedNodeInfo.formats.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedNodeInfo.formats.map((f, i) => (
                  <span key={i} className="px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 border border-cyan-800 text-[10px]">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
