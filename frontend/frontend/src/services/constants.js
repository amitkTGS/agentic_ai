export const AUDIT_STATUS = {
    approved: { key: 'approved', label: 'Approved', variant: 'success' },
    flagged: { key: 'flagged', label: 'Flagged', variant: 'warning' },
    pending: { key: 'pending', label: 'Pending', variant: 'secondary' },
};

export const EXPENSE_CATEGORIES = {
    food: { key: 'food', label: 'Food & Dining' },
    travel: { key: 'travel', label: 'Travel & Transport' },
    software: { key: 'software', label: 'Software & Tools' },
    others: { key: 'others', label: 'Others' },
};

export const FILE_SETTINGS = {
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
};