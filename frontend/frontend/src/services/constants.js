export const AUDIT_STATUS = {
    approved: { key: 'approved', label: 'Approved', variant: 'success' },
    flagged: { key: 'flagged', label: 'Flagged', variant: 'warning' },
    hold:{key:'hold',label:'Hold',variant:'primary'},
    rejected:{key:'rejected',label:'Rejected',variant:'danger'}
};

export const EXPENSE_CATEGORIES = {
    food: { key: 'food', label: 'Food' },
    travel: { key: 'travel', label: 'Travel' },
    office_supplies: { key: 'office_supplies', label: 'Office Supplies' },
    accommodation:{key:'accommodation',label:'Accommodation'},
    miscellaneous:{key:'miscellaneous',label:'miscellaneous'},
    other: { key: 'other', label: 'Others' },
};

export const FILE_SETTINGS = {
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
};