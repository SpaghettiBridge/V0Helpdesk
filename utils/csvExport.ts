import { Ticket } from '../types';

export function exportToCSV(tickets: Ticket[], fileName: string, startDate?: string, endDate?: string) {
  const headers = ['Ticket #', 'Priority', 'Category', 'Title', 'Description', 'Status', 'Created By', 'Assigned Agent', 'Date Created', 'Service'];
  
  const csvContent = [
    headers.join(','),
    ...tickets.map(ticket => [
      ticket.number,
      ticket.priority,
      `${ticket.mainCategory}${ticket.subCategory ? ` - ${ticket.subCategory}` : ''}`,
      `"${ticket.title.replace(/"/g, '""')}"`,
      `"${ticket.description.replace(/"/g, '""')}"`,
      ticket.status,
      ticket.createdBy,
      ticket.assignedAgent || 'Unassigned',
      new Date(ticket.createdAt).toLocaleString(),
      ticket.service
    ].join(','))
  ].join('\n');

  let dateRangeString = '';
  if (startDate && endDate) {
    dateRangeString = `_${startDate}_to_${endDate}`;
  } else if (startDate) {
    dateRangeString = `_from_${startDate}`;
  } else if (endDate) {
    dateRangeString = `_until_${endDate}`;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}${dateRangeString}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

