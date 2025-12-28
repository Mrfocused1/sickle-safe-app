export interface FundingOpportunity {
    id: string;
    title: string;
    organization: string;
    type: 'grant' | 'benefit' | 'emergency_aid' | 'support_service';
    category: string;
    description: string;
    eligibility: string[];
    amount?: string;
    applicationUrl?: string;
    requiresAIHelper: boolean;
    color: string;
    icon: string;
}

export const FUNDING_OPPORTUNITIES: FundingOpportunity[] = [
    {
        id: 'pip-uk',
        title: 'Personal Independence Payment (PIP)',
        organization: 'Department for Work and Pensions',
        type: 'benefit',
        category: 'Government Benefit',
        description: 'A benefit for people aged 16 to 64 who have a long-term health condition or disability. It is not means-tested.',
        eligibility: [
            'Aged 16 to 64',
            'Long-term health condition (like Sickle Cell)',
            'Difficulty with daily living or mobility'
        ],
        amount: '£28.70 to £184.30 per week',
        applicationUrl: 'https://www.gov.uk/pip',
        requiresAIHelper: true,
        color: '#3b82f6',
        icon: 'account-balance'
    },
    {
        id: 'sctsp-emergency',
        title: 'Emergency Financial Support',
        organization: 'Sickle Cell & Thalassaemia Support Project',
        type: 'emergency_aid',
        category: 'Emergency Support',
        description: 'Small grants and support for individuals or families facing temporary crisis or extreme financial hardship.',
        eligibility: [
            'Diagnosed with Sickle Cell or Thalassaemia',
            'Living in the UK',
            'Experiencing financial crisis'
        ],
        amount: 'Varies by need',
        applicationUrl: 'https://sctsp.org.uk',
        requiresAIHelper: true,
        color: '#ef4444',
        icon: 'emergency'
    },
    {
        id: 'roald-dahl-grant',
        title: 'Marvellous Family Grants',
        organization: "Roald Dahl's Marvellous Children's Charity",
        type: 'grant',
        category: 'Children Charity',
        description: 'Providing grants for families who have a child with a serious, long-term health condition (up to 25 years old).',
        eligibility: [
            'Under 25 years old',
            'Seriously ill child',
            'Low income / proof of hardship'
        ],
        amount: 'Up to £500',
        applicationUrl: 'https://www.roalddahlcharity.org',
        requiresAIHelper: true,
        color: '#a855f7',
        icon: 'card-giftcard'
    },
    {
        id: 'dla-child',
        title: 'Disability Living Allowance (DLA)',
        organization: 'UK Government',
        type: 'benefit',
        category: 'Child Benefit',
        description: 'Help with the extra costs of looking after a child who is under 16 and has difficulties walking or needs more looking after than a child of the same age without a disability.',
        eligibility: [
            'Child under 16',
            'Daily care needs higher than peers',
            'Resident in UK'
        ],
        amount: '£28.70 to £184.30 per week',
        applicationUrl: 'https://www.gov.uk/disability-living-allowance-children',
        requiresAIHelper: true,
        color: '#10b981',
        icon: 'child-care'
    },
    {
        id: 'turn2us-search',
        title: 'Search for Local Grants',
        organization: 'Turn2us',
        type: 'support_service',
        category: 'Grant Search',
        description: 'A comprehensive national database to search for local and regional grants based on your postcode and background.',
        eligibility: [
            'Open to all'
        ],
        applicationUrl: 'https://grants-search.turn2us.org.uk',
        requiresAIHelper: false,
        color: '#f59e0b',
        icon: 'search'
    }
];
