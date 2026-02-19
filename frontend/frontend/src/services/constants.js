export const AUDIT_STATUS = {
    approved: { key: 'approved', label: 'Approved', variant: 'success' },
    flagged: { key: 'flagged', label: 'Flagged', variant: 'warning' },
    hold: { key: 'hold', label: 'Hold', variant: 'primary' },
    rejected: { key: 'rejected', label: 'Rejected', variant: 'danger' }
};

export const EXPENSE_CATEGORIES = {
    food: { key: 'food', label: 'Food' },
    travel: { key: 'travel', label: 'Travel' },
    office_supplies: { key: 'office_supplies', label: 'Office Supplies' },
    accommodation: { key: 'accommodation', label: 'Accommodation' },
    miscellaneous: { key: 'miscellaneous', label: 'Miscellaneous' },
    other: { key: 'other', label: 'Others' },
};

export const FILE_SETTINGS = {
    MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
};
export const MODULES = {
    bfsi: "BFSI (Banking & Financial Services)",
    insurance: "Insurance",
    health: "Health Care",
    supply_chain: "Manufacturing / Supply Chain"
}
export const TAXONOMY_DATA = {
    expense:{
        food:{
            label:"Food",
        },
        travel:{
            label:"Travel",
        },
        office_supplies:{
            label:"Office Supplies",
        },
        accommodation:{
            label:"Accommodation",
        },
        miscellaneous:{
            label:"Miscellaneous",
        },
        other:{
            label:"Others",
        },
    },
    bfsi: {
        transaction_type: {
            label: "Transaction Type",
            subCategories: [
                { key: "card", label: "Card" },
                { key: "wire", label: "Wire" },
                { key: "ach", label: "ACH" },
            ]
        },
        merchant_category: {
            label: "Merchant Category",
            subCategories: [
                { key: "travel", label: "Travel" },
                { key: "utilities", label: "Utilities" },
                { key: "retail", label: "Retail" }
            ]
        },
        regulatory_flags: {
            label: "Regulatory Flags",
            subCategories: [
                { key: "aml", label: "AML" },
                { key: "kyc", label: "KYC" },
                { key: "sox", label: "SOX" },
            ]
        },
    },
    insurance: {
        claim_type: {
            label: "Claim Type",
            subCategories: [
                { key: "health", label: "Health" },
                { key: "auto", label: "Auto" },
                { key: "property", label: "Property" }
            ]
        },
        coverage_category: {
            label: "Coverage Category",
            subCategories: [
                { key: "in_network", label: 'In Network' },
                { key: "out_of_network", label: "Out of Category" }
            ]
        },
        claim_severity: {
            label: "Claim Severity",
            subCategories: [
                { key: "minor", label: 'Minor' },
                { key: "major", label: "Major" },
                { key: "catastrophic", label: "CataStrophic" }
            ]
        }
    },
    health:{
        treatment_category:{
            label:"Treatment Category",
            subCategories:[
                {key:"consultation",label:"Consultation"},
                {key:"surgery",label:"Surgery"},
                {key:"medication",label:"Medication"}
            ]
        },
        provider_type:{
            label:"Provider Type",
            subCategories:[
                {key:"hospital",label:"Hospital"},
                {key:"clinic",label:"Clinic"},
                {key:"lab",label:"Lab"}
            ]
        },
        compilance_code:{
            label:"Complilance Code",
            subCategories:[
                {key:"icd",label:"ICD"},
                {key:"cpt",label:"CPT"}
            ]
        }
    },
    supply_chain:{
        purchase_type:{
            label:"Purchase Type",
            subCategories:[
                {key:"raw_materials",label:"Raw Materials"},
                {key:"services",label:"Services"}
            ]
        },
        supplier_risk:{
            label:"Supplier Risk",
            subCategories:[
                {key:"approved",label:"Approved"},
                {key:"watchlist",label:"WatchList"}
            ]
        }
    }
};
