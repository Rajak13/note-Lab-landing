import React, { createContext, useContext, useState, useEffect } from 'react';

const FolderContext = createContext(null);

export const COLOR_PALETTE = [
  { id: 'coral', name: 'Coral', hex: '#C94A3C' },
  { id: 'emerald', name: 'Emerald', hex: '#059669' },
  { id: 'indigo', name: 'Indigo', hex: '#4F46E5' },
  { id: 'amber', name: 'Amber', hex: '#D97706' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#D946EF' },
  { id: 'sapphire', name: 'Sapphire', hex: '#2563EB' },
];

const INITIAL_FOLDERS = [];

export function FolderProvider({ children }) {
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('notelab-folders');
    if (!saved) return INITIAL_FOLDERS;
    try {
      const parsed = JSON.parse(saved);
      // Remove legacy hardcoded initial folder IDs if present
      const cleaned = parsed.filter(f => !['folder-1', 'folder-2', 'folder-3', 'folder-4'].includes(f.id));
      return cleaned;
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  const [activeFolderId, setActiveFolderId] = useState('folder-1');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('notelab-folders', JSON.stringify(folders));
  }, [folders]);

  const createFolder = (name, color = '#C94A3C', parentId = null) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      color,
      parentId: parentId || null,
      starred: false,
      children: [],
    };

    if (!parentId) {
      setFolders((prev) => [...prev, newFolder]);
    } else {
      setFolders((prev) =>
        prev.map((f) => {
          if (f.id === parentId) {
            return { ...f, children: [...(f.children || []), newFolder] };
          }
          return f;
        })
      );
    }
  };

  const moveFolder = (folderId, newParentId = null) => {
    setFolders((prev) => {
      let targetFolder = null;

      const removeRecursive = (list) => {
        return list.filter((item) => {
          if (item.id === folderId) {
            targetFolder = { ...item, parentId: newParentId };
            return false;
          }
          if (item.children && item.children.length > 0) {
            item.children = removeRecursive(item.children);
          }
          return true;
        });
      };

      const cleanedList = removeRecursive(JSON.parse(JSON.stringify(prev)));
      if (!targetFolder) return prev;

      if (!newParentId) {
        return [...cleanedList, targetFolder];
      }

      return cleanedList.map((f) => {
        if (f.id === newParentId) {
          return { ...f, children: [...(f.children || []), targetFolder] };
        }
        return f;
      });
    });
  };

  const updateFolderColor = (folderId, newColor) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          return { ...f, color: newColor };
        }
        if (f.children) {
          return {
            ...f,
            children: f.children.map((c) => (c.id === folderId ? { ...c, color: newColor } : c)),
          };
        }
        return f;
      })
    );
    if (selectedFile && selectedFile.id === folderId) {
      setSelectedFile((prev) => (prev ? { ...prev, color: newColor } : null));
    }
  };

  const toggleStarFolder = (folderId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          return { ...f, starred: !f.starred };
        }
        return f;
      })
    );
  };

  const renameFolder = (folderId, newName) => {
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();
    setFolders((prev) => {
      const updateRecursive = (list) => {
        return list.map((item) => {
          if (item.id === folderId) {
            return { ...item, name: cleanName };
          }
          if (item.children && item.children.length > 0) {
            return { ...item, children: updateRecursive(item.children) };
          }
          return item;
        });
      };
      return updateRecursive(prev);
    });
    if (selectedFile && selectedFile.id === folderId) {
      setSelectedFile((prev) => (prev ? { ...prev, name: cleanName } : null));
    }
  };

  const deleteFolder = (folderId) => {
    let deletedName = null;
    const findName = (list) => {
      for (const item of list) {
        if (item.id === folderId) return item.name;
        if (item.children) {
          const res = findName(item.children);
          if (res) return res;
        }
      }
      return null;
    };
    deletedName = findName(folders);

    setFolders((prev) => {
      const deleteRecursive = (list) => {
        return list
          .filter((item) => item.id !== folderId)
          .map((item) => ({
            ...item,
            children: item.children ? deleteRecursive(item.children) : [],
          }));
      };
      return deleteRecursive(prev);
    });

    if (activeFolderId === folderId) {
      setActiveFolderId(null);
    }
    if (selectedFile && selectedFile.id === folderId) {
      setSelectedFile(null);
      setInspectorOpen(false);
    }
    return deletedName;
  };

  const openInspector = (fileOrFolder) => {
    setSelectedFile(fileOrFolder);
    setInspectorOpen(true);
  };

  const closeInspector = () => {
    setInspectorOpen(false);
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        activeFolderId,
        setActiveFolderId,
        createFolder,
        moveFolder,
        renameFolder,
        updateFolderColor,
        toggleStarFolder,
        deleteFolder,
        selectedFile,
        openInspector,
        closeInspector,
        inspectorOpen,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolders must be used within a FolderProvider');
  }
  return context;
}
