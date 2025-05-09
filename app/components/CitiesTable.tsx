'use client';

import { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { useInView } from 'react-intersection-observer';
import { City } from '../types';
import { useWeatherStore } from '../store/weatherStore';
import Link from 'next/link';
import { ArrowUp,
  ArrowDown,Search 
 } from 'lucide-react';
 import { Row } from '@tanstack/react-table';

const columnHelper = createColumnHelper<City>();

// Define a number sorting function
const numberSort = (rowA: Row<City>, rowB: Row<City>, columnId: string) => {
  const a = rowA.getValue(columnId);
  const b = rowB.getValue(columnId);

  const numA = typeof a === 'number' ? a : Number(a) || 0;
  const numB = typeof b === 'number' ? b : Number(b) || 0;

  return numA - numB;
};

const columns = [
  columnHelper.accessor('geoname_id', {
    header: 'Geoname ID',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('name', {
    header: 'City Name',
    cell: (info) => (
      <Link
        href={`/weather/${encodeURIComponent(info.getValue())}`}
        className="text-blue-600 hover:text-blue-800"
        target="_blank"
      >
        {info.getValue()}
      </Link>
    ),
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('country', {
    header: 'Country',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('ascii_name', {
    header: 'ASCII Name',
    sortingFn: 'alphanumeric',
    cell: (info) => (
      <div style={{ width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('alternate_names', {
    header: 'Alternate Names',
    sortingFn: 'alphanumeric',
    cell: (info) => (
      <div style={{ width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('population', {
    header: 'Population',
    sortingFn: numberSort,  // Use the custom number sort function
  }),
  columnHelper.accessor('dem', {
    header: 'Digital Elevation Model',
    sortingFn: numberSort,  // Use the custom number sort function
  }),
  columnHelper.accessor('timezone', {
    header: 'Timezone',
    sortingFn: 'alphanumeric',
    cell: (info) => (
      <div style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {info.getValue()}
      </div>
    ),
  }),
];

export default function CitiesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { cities, setCities } = useWeatherStore();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);  // Loading state
  const { ref, inView } = useInView();

  const table = useReactTable({
    data: cities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);  // Set loading to true while fetching
      try {
        const response = await fetch(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchTerm}&rows=20&start=${(page - 1) * 20}`
        );
        const data = await response.json();
        const newCities: City[] = data.records.map((record: any) => ({
          geoname_id: record.fields.geoname_id,
          name: record.fields.name,
          country: record.fields.cou_name_en,
          ascii_name: record.fields.ascii_name,
          alternate_names: record.fields.alternate_names,
          population: record.fields.population,
          dem: record.fields.dem,
          timezone: record.fields.timezone,
          country_code: record.fields.country_code,
          latitude: record.fields.coordinates[0],
          longitude: record.fields.coordinates[1],
        }));
        
        if (page === 1) {
          setCities(newCities);
        } else {
          setCities([...cities, ...newCities]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);  // Set loading to false once done
      }
    };

    fetchCities();
  }, [searchTerm, page]);

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg  from-blue-400 to-purple-500 ">
      <p className='text-black text-3xl font-bold mb-6 text-gray-800'>Cities Explorer</p>
        <div className="relative">
    <input
      type="text"
      placeholder="Search cities..."
      className="w-full p-2 pl-10 mb-4 border rounded text-gray-900 bg-white"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setPage(1);
      }}
    />
    <Search className="absolute left-3 top-[40%] transform -translate-y-1/2 w-5 h-5 text-gray-500" />
    </div>
     
<div className="overflow-x-auto ">
  <table className="min-w-full ">
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={`px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 
                ${header.column.getIsSorted() ? 'text-blue-500' : ''}`} // Add glow effect
              onClick={header.column.getToggleSortingHandler()}
            >
              <div className="flex items-center space-x-1">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                <span className="text-gray-400">
                  {header.column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="w-4 h-4 text-blue-500" />
                  ) : header.column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="w-4 h-4 text-blue-500" />
                  ) : null}
                </span>
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody className="bg-white">
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-900"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
      {loading && <div className="text-center text-gray-500">Loading...</div>} {/* Loading Indicator */}
      <div ref={ref} className="h-10" />
    </div>
  );
}
