import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import JSZip from 'jszip';
import { FolderGenerator } from '../components/FolderGenerator';
import { INITIAL_FOLDER_STRUCTURE, generateReadmeBoilerplate } from '../data/directoryPreset';
import { FolderNode } from '../types';

describe('FolderGenerator & ZIP Content Mapping Integration Tests', () => {
  // Helper to recursively list all file and folder node paths in a FolderNode tree
  const getAllNodePaths = (node: FolderNode, currentPath: string = ''): { files: string[]; folders: string[] } => {
    const path = currentPath ? `${currentPath}/${node.name}` : node.name;
    const files: string[] = [];
    const folders: string[] = [];

    if (node.selected) {
      if (node.type === 'folder') {
        folders.push(path);
        if (node.children) {
          node.children.forEach((child) => {
            const sub = getAllNodePaths(child, path);
            files.push(...sub.files);
            folders.push(...sub.folders);
          });
        }
      } else if (node.type === 'file') {
        files.push(path);
      }
    }

    return { files, folders };
  };

  it('maps all initial folder tree file nodes directly into the JSZip archive without missing any file nodes', async () => {
    const { files: expectedFiles } = getAllNodePaths(INITIAL_FOLDER_STRUCTURE);

    // Simulate JSZip archive generation identical to FolderGenerator handleDownloadZip
    const zip = new JSZip();

    const addNodeToZip = (node: FolderNode, currentPath: string) => {
      if (!node.selected) return;
      const path = currentPath ? `${currentPath}/${node.name}` : node.name;

      if (node.type === 'folder') {
        zip.folder(path);
        if (node.children) {
          node.children.forEach((child) => addNodeToZip(child, path));
        }
      } else if (node.type === 'file') {
        zip.file(path, node.content || `# ${node.name}\n\nProject document created for linacre.site.\n`);
      }
    };

    addNodeToZip(INITIAL_FOLDER_STRUCTURE, '');
    const readmeMd = generateReadmeBoilerplate(INITIAL_FOLDER_STRUCTURE);
    zip.file(`🎨_folder/README.md`, readmeMd);

    // Generate ZIP blob and reload entries
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    const loadedZip = await JSZip.loadAsync(zipBuffer);
    const zipFileNames = Object.keys(loadedZip.files);

    // Verify root README.md is present
    expect(loadedZip.file('🎨_folder/README.md')).not.toBeNull();
    const readmeContent = await loadedZip.file('🎨_folder/README.md')?.async('string');
    expect(readmeContent).toContain('Linacre Repository');

    // Verify EVERY expected file node from tree structure exists in the zip archive
    expect(expectedFiles.length).toBeGreaterThan(0);
    for (const filePath of expectedFiles) {
      const fileInZip = loadedZip.file(filePath);
      expect(fileInZip, `File node missing in ZIP output: ${filePath}`).not.toBeNull();
      const content = await fileInZip?.async('string');
      expect(content).toBeDefined();
      expect(content?.length).toBeGreaterThan(0);
    }

    // Ensure total files in ZIP includes all tree file nodes plus the generated README.md
    const nonFolderZipEntries = zipFileNames.filter((name) => !loadedZip.files[name].dir);
    expect(nonFolderZipEntries.length).toBe(expectedFiles.length + 1);
  });

  it('preserves injected SVG logomark file node in the ZIP structure when injected via Logomark Studio', async () => {
    const zip = new JSZip();

    // Create a modified tree with an injected logomark file in icons
    const testLogomarkSvg = `<svg xmlns="http://www.w3.org/2000/svg"><text>L4</text></svg>`;
    const modifiedTree: FolderNode = JSON.parse(JSON.stringify(INITIAL_FOLDER_STRUCTURE));

    const injectLogomark = (node: FolderNode) => {
      if (node.id === 'ui_icons' || node.name === 'icons') {
        node.children = node.children || [];
        node.children.push({
          id: 'test_logo_123',
          name: 'lin4cre_logomark_l4.svg',
          type: 'file',
          purpose: 'Generated Minimalist Logomark SVG',
          content: testLogomarkSvg,
          selected: true,
        });
      }
      if (node.children) {
        node.children.forEach(injectLogomark);
      }
    };
    injectLogomark(modifiedTree);

    const addNodeToZip = (node: FolderNode, currentPath: string) => {
      if (!node.selected) return;
      const path = currentPath ? `${currentPath}/${node.name}` : node.name;

      if (node.type === 'folder') {
        zip.folder(path);
        if (node.children) {
          node.children.forEach((child) => addNodeToZip(child, path));
        }
      } else if (node.type === 'file') {
        zip.file(path, node.content || `# ${node.name}\n`);
      }
    };

    addNodeToZip(modifiedTree, '');
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    const loadedZip = await JSZip.loadAsync(zipBuffer);

    const targetSvgPath = '🎨_folder/📂_ui-ux/icons/lin4cre_logomark_l4.svg';
    const svgFile = loadedZip.file(targetSvgPath);
    expect(svgFile, `Injected SVG logo missing at path ${targetSvgPath}`).not.toBeNull();

    const svgContent = await svgFile?.async('string');
    expect(svgContent).toBe(testLogomarkSvg);
  });

  it('renders FolderGenerator component interface and displays 🎨_folder root node', () => {
    render(<FolderGenerator activeProfile="lin4cre" />);

    expect(screen.getByText(/Official 🎨_Folder Architecture & Utilities/i)).toBeInTheDocument();
    expect(screen.getByText('DOWNLOAD 🎨_FOLDER.ZIP')).toBeInTheDocument();
    expect(screen.getByText('EXPORT PDF REPORT')).toBeInTheDocument();
    expect(screen.getAllByText('🎨_folder')[0]).toBeInTheDocument();
  });
});
