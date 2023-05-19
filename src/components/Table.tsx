import React from 'react';
import { Column, useTable } from 'react-table';

interface TableProps {
  columns: any[];
  data: any[]; // Replace 'any' with the appropriate type for your data
}

function Table({ columns, data }: TableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} className="w-full border-collapse">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="border-b-2 border-gray-300"
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="py-2 px-3 text-left font-semibold"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={i % 2 === 0 ? 'bg-gray-100' : ''}
            >
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className="py-2 px-3 text-sm">
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
