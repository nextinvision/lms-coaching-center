// Export Service - Complete implementation for PDF/Excel/CSV export
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportService = {
    /**
     * Export attendance report to PDF
     */
    async exportAttendanceToPDF(data: any[]): Promise<Blob> {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Attendance Report', 14, 20);

        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Prepare table data
        const tableData = data.map((row) => [
            row['Batch Name'] || '',
            row['Student Name'] || '',
            row['Total Days'] || '0',
            row['Present Days'] || '0',
            row['Absent Days'] || '0',
            row['Attendance Percentage'] || '0%',
        ]);

        // Add table
        autoTable(doc, {
            head: [
                [
                    'Batch Name',
                    'Student Name',
                    'Total Days',
                    'Present',
                    'Absent',
                    'Attendance %',
                ],
            ],
            body: tableData,
            startY: 35,
            theme: 'striped',
            headStyles: {
                fillColor: [59, 130, 246], // Blue
                textColor: 255,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 40 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 30, halign: 'center' },
            },
        });

        // Add footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        return doc.output('blob');
    },

    /**
     * Export attendance report to Excel
     */
    async exportAttendanceToExcel(data: any[]): Promise<Blob> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Set column widths
        worksheet.columns = [
            { header: 'Batch Name', key: 'batchName', width: 25 },
            { header: 'Student Name', key: 'studentName', width: 30 },
            { header: 'Total Days', key: 'totalDays', width: 12 },
            { header: 'Present Days', key: 'presentDays', width: 12 },
            { header: 'Absent Days', key: 'absentDays', width: 12 },
            { header: 'Attendance %', key: 'attendancePercentage', width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3B82F6' },
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 25;

        // Add data rows
        data.forEach((row) => {
            worksheet.addRow({
                batchName: row['Batch Name'],
                studentName: row['Student Name'],
                totalDays: row['Total Days'],
                presentDays: row['Present Days'],
                absentDays: row['Absent Days'],
                attendancePercentage: row['Attendance Percentage'],
            });
        });

        // Apply borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                // Center align numeric columns
                if (rowNumber > 1 && Number(cell.col) >= 3) {
                    cell.alignment = { horizontal: 'center' };
                }
            });
        });

        // Add summary row
        const summaryRow = worksheet.addRow({});
        summaryRow.getCell(1).value = 'Total Records:';
        summaryRow.getCell(2).value = data.length;
        summaryRow.font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    },

    /**
     * Export attendance report to CSV
     */
    async exportAttendanceToCSV(data: any): Promise<string> {
        // Simple CSV export
        if (!data || data.length === 0) {
            return '';
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map((row: any) =>
                headers
                    .map((header) => {
                        const value = row[header];
                        return typeof value === 'string'
                            ? `"${value.replace(/"/g, '""')}"`
                            : value;
                    })
                    .join(',')
            ),
        ];

        return csvRows.join('\n');
    },

    /**
     * Export performance report to PDF
     */
    async exportPerformanceToPDF(data: any[]): Promise<Blob> {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text('Performance Report', 14, 20);

        // Add generation date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Prepare table data
        const tableData = data.map((row) => [
            row['Batch Name'] || '',
            row['Student Name'] || '',
            row['Total Tests'] || '0',
            row['Average Marks'] || '0%',
            row['Highest Marks'] || '0%',
            row['Lowest Marks'] || '0%',
        ]);

        // Add table
        autoTable(doc, {
            head: [
                [
                    'Batch Name',
                    'Student Name',
                    'Total Tests',
                    'Average',
                    'Highest',
                    'Lowest',
                ],
            ],
            body: tableData,
            startY: 35,
            theme: 'striped',
            headStyles: {
                fillColor: [59, 130, 246],
                textColor: 255,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 40 },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' },
            },
        });

        // Add footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        return doc.output('blob');
    },

    /**
     * Export performance report to Excel
     */
    async exportPerformanceToExcel(data: any[]): Promise<Blob> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Performance Report');

        // Set column widths
        worksheet.columns = [
            { header: 'Batch Name', key: 'batchName', width: 25 },
            { header: 'Student Name', key: 'studentName', width: 30 },
            { header: 'Total Tests', key: 'totalTests', width: 12 },
            { header: 'Average Marks', key: 'averageMarks', width: 15 },
            { header: 'Highest Marks', key: 'highestMarks', width: 15 },
            { header: 'Lowest Marks', key: 'lowestMarks', width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3B82F6' },
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 25;

        // Add data rows
        data.forEach((row) => {
            worksheet.addRow({
                batchName: row['Batch Name'],
                studentName: row['Student Name'],
                totalTests: row['Total Tests'],
                averageMarks: row['Average Marks'],
                highestMarks: row['Highest Marks'],
                lowestMarks: row['Lowest Marks'],
            });
        });

        // Apply borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };

                // Center align numeric columns
                if (rowNumber > 1 && Number(cell.col) >= 3) {
                    cell.alignment = { horizontal: 'center' };
                }
            });
        });

        // Add summary row
        const summaryRow = worksheet.addRow({});
        summaryRow.getCell(1).value = 'Total Records:';
        summaryRow.getCell(2).value = data.length;
        summaryRow.font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    },

    /**
     * Export performance report to CSV
     */
    async exportPerformanceToCSV(data: any): Promise<string> {
        // Simple CSV export
        if (!data || data.length === 0) {
            return '';
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map((row: any) =>
                headers
                    .map((header) => {
                        const value = row[header];
                        return typeof value === 'string'
                            ? `"${value.replace(/"/g, '""')}"`
                            : value;
                    })
                    .join(',')
            ),
        ];

        return csvRows.join('\n');
    },
};


