/**
 * Excel utilities for BookParcel
 * - generateSampleExcel: download a blank template the user fills out
 * - parseExcelFile: read an uploaded xlsx/csv and return rows as shipment data
 * - exportShipmentsToExcel: bulk export a list of shipments to xlsx
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const EXCEL_COLUMNS = [
  'Receiver Name',
  'Receiver Phone',
  'Receiver Address',
  'Receiver City',
  'Item Type',
  'Quantity',
  'Weight (kg)',
  'COD Amount (Rs)',
  'Courier (tcs/leopards/trax/mp)',
  'Special Instruction',
];

export const CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad',
  'Multan','Peshawar','Quetta','Sialkot','Gujranwala',
  'Hyderabad','Bahawalpur','Abbottabad','Sukkur','Sargodha',
];

/** Download a blank template with headers and 3 example rows */
export function generateSampleExcel() {
  const sampleRows = [
    ['Ali Khan', '03001234567', 'House 12, Street 4', 'Karachi', 'Clothing', 2, 0.5, 1500, 'tcs', ''],
    ['Sara Ahmed', '03219876543', 'Flat 7, Block B', 'Lahore', 'Electronics', 1, 1.2, 5000, 'leopards', 'Fragile'],
    ['', '', '', '', '', '', '', '', '', ''],
  ];

  const ws = XLSX.utils.aoa_to_sheet([EXCEL_COLUMNS, ...sampleRows]);
  ws['!cols'] = EXCEL_COLUMNS.map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shipments');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'subak-raftar-template.xlsx');
}

/** Parse an uploaded file into rows of shipment-ready objects */
export interface ExcelRow {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  itemType: string;
  quantity: number;
  weight: number;
  codAmount: number;
  provider: string;
  specialInstruction: string;
  _valid: boolean;
  _errors: string[];
}

export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][];

        // Skip header row
        const dataRows = rows.slice(1).filter(r => r.some(cell => String(cell).trim()));

        const parsed: ExcelRow[] = dataRows.map((r) => {
          const errors: string[] = [];
          const name = String(r[0] || '').trim();
          const phone = String(r[1] || '').trim();
          const address = String(r[2] || '').trim();
          const city = String(r[3] || '').trim();
          const provider = String(r[8] || 'tcs').toLowerCase().trim();

          if (!name) errors.push('Receiver Name required');
          if (!phone || !/^03\d{9}$/.test(phone)) errors.push('Phone must be 03XXXXXXXXX format');
          if (!address) errors.push('Address required');
          if (!city) errors.push('City required');
          if (!['tcs','leopards','trax','mp'].includes(provider)) errors.push(`Unknown courier: ${provider}`);

          return {
            receiverName: name,
            receiverPhone: phone,
            receiverAddress: address,
            receiverCity: city,
            itemType: String(r[4] || '').trim(),
            quantity: Number(r[5]) || 1,
            weight: Number(r[6]) || 0.5,
            codAmount: Number(r[7]) || 0,
            provider,
            specialInstruction: String(r[9] || '').trim(),
            _valid: errors.length === 0,
            _errors: errors,
          };
        });
        resolve(parsed);
      } catch (err) {
        reject(new Error('Could not read file. Make sure it is a valid .xlsx or .csv file.'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsArrayBuffer(file);
  });
}

/** Export a list of booked shipments to Excel (Save Sheet) */
export function exportShipmentsToExcel(shipments: any[], filename = 'shipments-export.xlsx') {
  const headers = ['Tracking No', 'Receiver', 'Phone', 'City', 'Item', 'COD (Rs)', 'Status', 'Courier', 'Date'];
  const rows = shipments.map(s => [
    s.providerTrackingNo,
    s.receiver?.name,
    s.receiver?.phone,
    s.receiver?.city,
    s.itemType || '',
    s.codAmount || 0,
    s.status,
    s.provider?.toUpperCase(),
    new Date(s.createdAt).toLocaleDateString('en-PK'),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = headers.map(() => ({ wch: 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Shipments');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}
