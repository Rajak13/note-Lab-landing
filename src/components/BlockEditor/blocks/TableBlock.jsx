import React, { useState } from 'react';
import styles from '../BlockEditor.module.css';

function AddColIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * TableBlock — editable 2D data grid for trial results, temperatures, and yields.
 * Starts with a header row + 2 data rows, 3 columns.
 */
export default function TableBlock({ block, onChange }) {
  const defaultTable = {
    headers: ['Trial', 'Temperature (°C)', 'Yield (%)'],
    rows: [
      ['1', '60', '85.4'],
      ['2', '65', '91.2'],
    ],
  };

  const [tableData, setTableData] = useState(
    (() => {
      try {
        return block.content ? JSON.parse(block.content) : defaultTable;
      } catch {
        return defaultTable;
      }
    })()
  );

  const update = (next) => {
    setTableData(next);
    onChange(JSON.stringify(next));
  };

  const updateHeader = (colIdx, value) => {
    const next = { ...tableData, headers: [...tableData.headers] };
    next.headers[colIdx] = value;
    update(next);
  };

  const updateCell = (rowIdx, colIdx, value) => {
    const next = {
      ...tableData,
      rows: tableData.rows.map((r, ri) =>
        ri === rowIdx ? r.map((c, ci) => (ci === colIdx ? value : c)) : r
      ),
    };
    update(next);
  };

  const addRow = () => {
    const next = {
      ...tableData,
      rows: [...tableData.rows, new Array(tableData.headers.length).fill('')],
    };
    update(next);
  };

  const addCol = () => {
    const next = {
      headers: [...tableData.headers, 'Column'],
      rows: tableData.rows.map((r) => [...r, '']),
    };
    update(next);
  };

  return (
    <div className={styles.tableBlock}>
      <div className={styles.tableLabel}>Data Table</div>
      <div className={styles.tableScrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {tableData.headers.map((h, ci) => (
                <th key={ci}>
                  <input
                    className={styles.tableHeaderCell}
                    value={h}
                    onChange={(e) => updateHeader(ci, e.target.value)}
                  />
                </th>
              ))}
              <th className={styles.tableAddCol}>
                <button type="button" className={styles.tableAddColBtn} onClick={addCol} title="Add column">
                  <AddColIcon />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <input
                      className={styles.tableCell}
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                    />
                  </td>
                ))}
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className={styles.tableAddRowBtn} onClick={addRow}>
        <AddColIcon /> Add Row
      </button>
    </div>
  );
}
