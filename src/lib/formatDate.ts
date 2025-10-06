/**
 * Formata uma data para o formato brasileiro (DD/MM/AAAA)
 * @param date - Data a ser formatada
 * @returns String com data formatada
 */
export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data para o formato brasileiro com horário (DD/MM/AAAA HH:mm)
 * @param date - Data a ser formatada
 * @returns String com data e hora formatada
 */
export const formatDateTime = (date: Date): string => {
  const formattedDate = formatDate(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${formattedDate} ${hours}:${minutes}`;
};