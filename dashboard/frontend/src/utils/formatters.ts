export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export const formatDate = (date: string) => new Date(date).toLocaleDateString();
