export interface Lesson {
    id: string;
    title: string;
    duration: string;
    content: string;
    keyPoints: string[];
    quiz?: QuizQuestion[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export interface Module {
    id: string;
    title: string;
    icon: string;
    color: string;
    bg: string;
    border: string;
    description: string;
    lessons: Lesson[];
    totalDuration: string;
}

export interface Chapter {
    id: string;
    title: string;
    content: string;
    readingTime: string;
}

export const featuredGuide = {
    id: 'warrior-manual',
    title: 'The Sickle Cell Warrior Manual',
    description: 'Your comprehensive guide to managing high-altitude travel and cold weather crises safely.',
    chapters: [
        {
            id: 'intro',
            title: 'Introduction to Crisis Management',
            readingTime: '2 min',
            content: 'Crisis management begins with awareness. Understanding your bodies warning signs is the first step in prevention. This manual covers the essential protocols for maintaining safety in challenging environments.'
        },
        {
            id: 'altitude',
            title: 'High-Altitude Travel Safety',
            readingTime: '3 min',
            content: 'At high altitudes, lower oxygen levels can trigger sickling. Always consult your hematologist before mountain travel or flights. Stay hydrated and realize that supplemental oxygen may be necessary.'
        },
        {
            id: 'cold-weather',
            title: 'Cold Weather Protocols',
            readingTime: '2 min',
            content: 'Cold temperatures cause blood vessels to constrict, which can lead to a vaso-occlusive crisis. Layering clothing, using hand warmers, and avoiding sudden temperature changes are vital strategies.'
        },
        {
            id: 'emergency',
            title: 'Emergency Response Planning',
            readingTime: '2 min',
            content: 'Have a pre-written emergency plan. This should include your current medications, baseline hemoglobin levels, and contact information for your specialist.'
        },
        {
            id: 'med-kit',
            title: 'Travel Medication Kit',
            readingTime: '1 min',
            content: 'Your kit should include prescribed pain relief, folic acid, and any antibiotics you take regularly. Ensure you have enough for your entire trip plus extra in case of delays.'
        },
        {
            id: 'communication',
            title: 'Communication with Medical Teams',
            readingTime: '2 min',
            content: 'When seeking care away from home, clearly communicate that you have Sickle Cell Disease. Provide your specialists contact details and your emergency plan immediately.'
        }
    ]
};

export const modules: Module[] = [
    {
        id: 'genetics-101',
        title: 'Genetics 101',
        icon: 'biotech',
        color: '#3b82f6',
        bg: '#eff6ff',
        border: '#dbeafe',
        description: 'Deep dive into the science of inheritance and trait expression.',
        totalDuration: '25 min',
        lessons: [
            {
                id: 'inheritance',
                title: 'Understanding Inheritance',
                duration: '6 min',
                content: 'Sickle cell disease is inherited in an autosomal recessive pattern. This means a child must receive two copies of the sickle cell gene—one from each parent—to have the disease.',
                keyPoints: ['Autosomal recessive inheritance', 'Carrier vs Disease status', 'Punnett square basics']
            },
            {
                id: 'trait-vs-disease',
                title: 'Trait vs. Disease',
                duration: '5 min',
                content: 'Carrying one sickle cell gene is known as sickle cell trait. Usually, people with the trait do not have symptoms of the disease but can pass the gene to their children.',
                keyPoints: ['HbAS vs HbSS', 'Trait symptoms are rare', 'Genetic screening importance']
            }
        ]
    },
    {
        id: 'pain-mgmt',
        title: 'Pain Management',
        icon: 'favorite',
        color: '#f43f5e',
        bg: '#fff1f2',
        border: '#fecdd3',
        description: 'Comprehensive strategies for handling chronic and acute pain.',
        totalDuration: '40 min',
        lessons: [
            {
                id: 'pain-types',
                title: 'Recognizing Pain Types',
                duration: '7 min',
                content: 'Pain in Sickle Cell can be acute (crisis) or chronic. Acute pain is often sharp and sudden, while chronic pain may be a daily dull ache due to bone or organ damage.',
                keyPoints: ['Acute vs Chronic pain', 'Vaso-occlusive crises', 'Bone infarction']
            }
        ]
    },
    {
        id: 'hydration',
        title: 'Hydration Science',
        icon: 'water-drop',
        color: '#0ea5e9',
        bg: '#f0f9ff',
        border: '#bae6fd',
        description: 'The critical role of fluid intake in preventing crises.',
        totalDuration: '15 min',
        lessons: [
            {
                id: 'fluid-mechanics',
                title: 'Fluid Mechanics',
                duration: '5 min',
                content: 'Proper hydration keeps blood moving smoothly. When dehydrated, blood becomes thicker, increasing the risk of sickled cells getting stuck in vessels.',
                keyPoints: ['Blood viscosity', 'Daily fluid targets', 'Electrolyte balance']
            }
        ]
    },
    {
        id: 'crisis-prevention',
        title: 'Crisis Prevention',
        icon: 'shield',
        color: '#10b981',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        description: 'Lifestyle adjustments to minimize risk and stay healthy.',
        totalDuration: '30 min',
        lessons: [
            {
                id: 'trigger-id',
                title: 'Trigger Identification',
                duration: '8 min',
                content: 'Common triggers include extreme temperatures, stress, dehydration, and high altitudes. Identifying your personal triggers is key to a healthy life.',
                keyPoints: ['Stress management', 'Temperature regulation', 'Infection prevention']
            }
        ]
    }
];
