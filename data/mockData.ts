import { ViewType } from '../types';

// ==========================================
// ENUMS & TYPES (Local for Mock Data)
// ==========================================

export type ROStatus = 
  | 'Appointment' 
  | 'Checked-In' 
  | 'Diagnosis' 
  | 'Approval Pending' 
  | 'Parts Hold' 
  | 'Working' 
  | 'Ready' 
  | 'Closed';

export type TechStatus = 'Working' | 'Idle' | 'Lunch' | 'Leave';

// ==========================================
// 0. CONFIGURABLE MODELS (NEW FOR DIGITAL SHOWROOM)
// ==========================================

export const MOCK_CONFIGURABLE_MODELS = [
    {
        id: 'MOD-GV80',
        name: 'Genesis GV80',
        year: 2025,
        tagline: 'Boundless Luxury',
        basePrice: 57700,
        assets: {
            exterior: [
                'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2574&auto=format&fit=crop', // Front 3/4
                'https://images.unsplash.com/photo-1632245889029-e413148862e7?q=80&w=2574&auto=format&fit=crop', // Side
                'https://images.unsplash.com/photo-1627454819213-17793a8d1d86?q=80&w=2574&auto=format&fit=crop', // Rear
            ],
            interior: [
                'https://images.unsplash.com/photo-1542228262-3d663b306a53?q=80&w=2670&auto=format&fit=crop', // Cockpit
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop', // Seats
            ]
        },
        // Detailed Configuration Options
        configOptions: {
            engines: [
                { id: 'eng_25', name: '2.5L Turbo I4', price: 0, specs: '300 HP / 311 lb-ft' },
                { id: 'eng_35', name: '3.5L Twin-Turbo V6', price: 7500, specs: '375 HP / 391 lb-ft' }
            ],
            transmissions: [
                { id: 'trans_rwd', name: 'Rear Wheel Drive', price: 0, specs: 'Standard RWD' },
                { id: 'trans_awd', name: 'All Wheel Drive', price: 2500, specs: 'Active AWD with LSD' }
            ],
            colors: [
                { id: 'c1', name: 'Uyuni White', hex: '#F2F2F2', price: 575, type: 'Pearl' },
                { id: 'c2', name: 'Vik Black', hex: '#1A1A1A', price: 575, type: 'Metallic' },
                { id: 'c3', name: 'Cardiff Green', hex: '#2F4F4F', price: 575, type: 'Metallic' },
                { id: 'c4', name: 'Matterhorn White', hex: '#E0E0E0', price: 1500, type: 'Matte' }
            ],
            interiors: [
                { id: 'int_blk', name: 'Obsidian Black', hex: '#111111', price: 0, material: 'Leatherette' },
                { id: 'int_bei', name: 'Vanilla Beige', hex: '#EDD9B6', price: 0, material: 'Leatherette' },
                { id: 'int_red', name: 'Sevilla Red', hex: '#5D2121', price: 1500, material: 'Nappa Leather' },
                { id: 'int_brn', name: 'Ultramarine Blue', hex: '#2A3B4C', price: 1500, material: 'Nappa Leather' }
            ],
            wheels: [
                { id: 'w1', name: '19" Standard Alloy', price: 0, image: 'https://images.unsplash.com/photo-1583096057075-8797b5e43e26?auto=format&fit=crop&q=80&w=200' },
                { id: 'w2', name: '20" Sport Alloy', price: 1200, image: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=200' },
                { id: 'w3', name: '22" Dark Sputtering', price: 2500, image: 'https://images.unsplash.com/photo-1611821064430-0d41765a610d?auto=format&fit=crop&q=80&w=200' }
            ],
            packages: [
                { id: 'pkg_pop', name: 'Prestige Package', price: 1200, features: 'Heads-up Display, Remote Park' },
                { id: 'pkg_conv', name: 'Convenience Package', price: 1800, features: 'Ergo Motion Seat, Surround View' },
                { id: 'pkg_wint', name: 'Winter Package', price: 650, features: 'Heated Steering Wheel, Rear Heated Seats' }
            ]
        },
        // Legacy flat structure for list view compatibility
        trims: [
            { id: 't1', name: 'Standard', price: 0, features: ['2.5L Turbo', 'Leatherette', '19" Alloys'] },
            { id: 't2', name: 'Advanced', price: 6500, features: ['Panoramic Roof', 'Leather Seating', 'Surround View'] },
            { id: 't3', name: 'Prestige', price: 11200, features: ['3.5L Twin-Turbo', 'Nappa Leather', '22" Alloys', 'Remote Park'] }
        ],
        colors: [
             { id: 'c1', name: 'Uyuni White', hex: '#F2F2F2', price: 575, type: 'Pearl' },
             { id: 'c2', name: 'Vik Black', hex: '#1A1A1A', price: 575, type: 'Metallic' },
             { id: 'c3', name: 'Cardiff Green', hex: '#2F4F4F', price: 575, type: 'Metallic' },
             { id: 'c4', name: 'Matterhorn White', hex: '#E0E0E0', price: 1500, type: 'Matte' }
        ],
        wheels: [
            { id: 'w1', name: '19" Standard Alloy', price: 0, image: 'https://images.unsplash.com/photo-1583096057075-8797b5e43e26?auto=format&fit=crop&q=80&w=200' },
            { id: 'w2', name: '20" Sport Alloy', price: 1200, image: 'https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&q=80&w=200' },
            { id: 'w3', name: '22" Dark Sputtering', price: 2500, image: 'https://images.unsplash.com/photo-1611821064430-0d41765a610d?auto=format&fit=crop&q=80&w=200' }
        ]
    },
    {
        id: 'MOD-911',
        name: 'Porsche 911',
        year: 2024,
        tagline: 'Timeless Machine',
        basePrice: 114400,
        assets: {
            exterior: [
                'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1611859328053-37207044254f?q=80&w=2574&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2574&auto=format&fit=crop',
            ],
            interior: [
                'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=2670&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1493238792015-1a419bac32d3?q=80&w=2670&auto=format&fit=crop'
            ]
        },
        configOptions: {
            engines: [
                { id: 'eng_30', name: '3.0L Twin-Turbo Flat-6', price: 0, specs: '379 HP / 331 lb-ft' },
                { id: 'eng_30s', name: '3.0L S Tune', price: 14500, specs: '443 HP / 390 lb-ft' }
            ],
            transmissions: [
                { id: 'trans_pdk', name: '8-Speed PDK', price: 0, specs: 'Dual Clutch Automatic' },
                { id: 'trans_man', name: '7-Speed Manual', price: 0, specs: 'No Cost Option' }
            ],
            colors: [
                { id: 'c1', name: 'Guards Red', hex: '#CC0000', price: 0, type: 'Standard' },
                { id: 'c2', name: 'Racing Yellow', hex: '#FFCC00', price: 0, type: 'Standard' },
                { id: 'c3', name: 'Gentian Blue', hex: '#003399', price: 840, type: 'Metallic' }
            ],
            interiors: [
                { id: 'int_blk', name: 'Standard Black', hex: '#111111', price: 0, material: 'Sport-Tex' },
                { id: 'int_red', name: 'Bordeaux Red', hex: '#660000', price: 4260, material: 'Leather' }
            ],
            wheels: [
                { id: 'w1', name: 'Carrera', price: 0, image: 'https://images.unsplash.com/photo-1615758362628-98e945c92843?auto=format&fit=crop&q=80&w=200' },
                { id: 'w2', name: 'RS Spyder', price: 2540, image: 'https://images.unsplash.com/photo-1594957388701-447551062c3e?auto=format&fit=crop&q=80&w=200' }
            ],
            packages: [
                { id: 'pkg_prem', name: 'Premium Package', price: 5350, features: 'Bose, Surround View, Lane Change' },
                { id: 'pkg_sport', name: 'Sport Chrono', price: 2790, features: 'Launch Control, Mode Switch' }
            ]
        },
        // Legacy
        trims: [
            { id: 't1', name: 'Carrera', price: 0, features: ['379 hp', 'PASM', '19"/20" Wheels'] },
            { id: 't2', name: 'Carrera S', price: 16800, features: ['443 hp', 'Torque Vectoring', '20"/21" Wheels'] },
            { id: 't3', name: 'Turbo S', price: 98000, features: ['640 hp', 'Ceramic Brakes', 'Active Aero'] }
        ],
        colors: [
             { id: 'c1', name: 'Guards Red', hex: '#CC0000', price: 0, type: 'Standard' },
             { id: 'c2', name: 'Racing Yellow', hex: '#FFCC00', price: 0, type: 'Standard' },
             { id: 'c3', name: 'Gentian Blue', hex: '#003399', price: 840, type: 'Metallic' },
             { id: 'c4', name: 'Chalk', hex: '#D6D6D6', price: 3270, type: 'Special' }
        ],
        wheels: [
            { id: 'w1', name: 'Carrera', price: 0, image: 'https://images.unsplash.com/photo-1615758362628-98e945c92843?auto=format&fit=crop&q=80&w=200' },
            { id: 'w2', name: 'RS Spyder', price: 2540, image: 'https://images.unsplash.com/photo-1594957388701-447551062c3e?auto=format&fit=crop&q=80&w=200' },
            { id: 'w3', name: 'Exclusive Design', price: 4100, image: 'https://images.unsplash.com/photo-1628588880628-e438d1796c89?auto=format&fit=crop&q=80&w=200' }
        ]
    }
];

// ==========================================
// 1. SERVICE REPAIR ORDERS (ROs)
// ==========================================

export const MOCK_ROS = [
  {
    id: 'RO-24-1042',
    customerName: 'Sarah Connor',
    vehicle: '2021 BMW X5 M50i',
    vin: '5UXJU2C09M9B12345',
    status: 'Approval Pending',
    promiseTime: '2023-10-27T16:00:00',
    advisor: 'Mike Ross',
    technician: 'Alex Smith',
    totalEstimate: 1250.00,
    concern: 'Customer states: Brakes squeaking loudly when stopping from high speed.',
    stage: 'Estimate Review',
    color: 'yellow'
  },
  {
    id: 'RO-24-1043',
    customerName: 'John Wick',
    vehicle: '1969 Ford Mustang Boss 429',
    vin: '9F02Z100001',
    status: 'Parts Hold',
    promiseTime: '2023-10-28T10:00:00',
    advisor: 'Harvey Specter',
    technician: 'Marcus F.',
    totalEstimate: 4500.00,
    concern: 'Clutch slipping, need thorough inspection.',
    stage: 'Parts Ordering',
    color: 'red'
  },
  {
    id: 'RO-24-1044',
    customerName: 'Ellen Ripley',
    vehicle: '2023 Toyota Tundra TRD Pro',
    vin: '5TFWW5F16PX009988',
    status: 'Diagnosis',
    promiseTime: '2023-10-27T14:30:00',
    advisor: 'Mike Ross',
    technician: 'Sarah J.',
    totalEstimate: 185.00,
    concern: 'Check engine light on. VSC Trac Off light flashing.',
    stage: 'Tech Inspection',
    color: 'blue'
  },
  {
    id: 'RO-24-1045',
    customerName: 'Marty McFly',
    vehicle: '1981 DeLorean DMC-12',
    vin: 'SCEDT26T1BD001234',
    status: 'Working',
    promiseTime: '2023-10-27T17:00:00',
    advisor: 'Doc Brown',
    technician: 'Alex Smith',
    totalEstimate: 8500.00,
    concern: 'Electrical system fluctuating at 88mph.',
    stage: 'Active Repair',
    color: 'green'
  },
  {
    id: 'RO-24-1046',
    customerName: 'Tony Stark',
    vehicle: '2024 Audi e-tron GT',
    vin: 'WA1AAAAA8M8005544',
    status: 'Ready',
    promiseTime: '2023-10-27T11:00:00',
    advisor: 'Pepper P.',
    technician: 'Jarvis AI',
    totalEstimate: 0.00,
    concern: 'Software update recall and detail.',
    stage: 'Pickup',
    color: 'green'
  },
  {
    id: 'RO-24-1047',
    customerName: 'Bruce Wayne',
    vehicle: '2022 Lamborghini Urus',
    vin: 'ZHWUA1ZCXMLA00777',
    status: 'Checked-In',
    promiseTime: '2023-10-29T09:00:00',
    advisor: 'Alfred P.',
    technician: 'TBD',
    totalEstimate: 850.00,
    concern: '10,000 mile scheduled maintenance.',
    stage: 'Dispatch',
    color: 'gray'
  },
  {
    id: 'RO-24-1048',
    customerName: 'Walter White',
    vehicle: '2004 Pontiac Aztek',
    vin: '3G2DA12E94S100200',
    status: 'Appointment',
    promiseTime: '2023-10-30T08:00:00',
    advisor: 'Jesse P.',
    technician: 'TBD',
    totalEstimate: 120.00,
    concern: 'Windshield crack repair.',
    stage: 'Pre-Arrival',
    color: 'gray'
  },
  {
    id: 'RO-24-1049',
    customerName: 'Dominic Toretto',
    vehicle: '1970 Dodge Charger R/T',
    vin: 'XS29L9B100000',
    status: 'Working',
    promiseTime: '2023-10-27T15:00:00',
    advisor: 'Mia T.',
    technician: 'Marcus F.',
    totalEstimate: 2200.00,
    concern: 'Supercharger belt replacement and tune.',
    stage: 'Active Repair',
    color: 'green'
  },
  {
    id: 'RO-24-1050',
    customerName: 'Diana Prince',
    vehicle: '2020 Mercedes-Benz G63 AMG',
    vin: 'WDB9999991A999999',
    status: 'Approval Pending',
    promiseTime: '2023-10-27T13:00:00',
    advisor: 'Mike Ross',
    technician: 'Sarah J.',
    totalEstimate: 3400.00,
    concern: 'Found leaking strut during inspection.',
    stage: 'Estimate Review',
    color: 'yellow'
  },
  {
    id: 'RO-24-1051',
    customerName: 'Peter Parker',
    vehicle: '2018 Honda Civic Type R',
    vin: 'JHMFC123456000000',
    status: 'Checked-In',
    promiseTime: '2023-10-27T12:00:00',
    advisor: 'Tony S.',
    technician: 'TBD',
    totalEstimate: 150.00,
    concern: 'Oil change and tire rotation.',
    stage: 'Dispatch',
    color: 'gray'
  },
  // --- Historical ROs for James Miller ---
  {
    id: 'RO-23-8821',
    customerName: 'James Miller',
    vehicle: '1964 Aston Martin DB5',
    vin: 'DB5-007-US',
    status: 'Closed',
    promiseTime: '2023-08-15T10:00:00',
    advisor: 'Quincy Jones',
    technician: 'R. Money',
    totalEstimate: 15400.00,
    concern: 'Engine knocking at idle. Oil leak.',
    stage: 'Delivered',
    color: 'gray'
  },
  {
    id: 'RO-23-9912',
    customerName: 'James Miller',
    vehicle: '2023 Land Rover Defender 110',
    vin: 'LR-DEF-007-US',
    status: 'Closed',
    promiseTime: '2023-09-20T14:00:00',
    advisor: 'Quincy Jones',
    technician: 'Tom S.',
    totalEstimate: 450.00,
    concern: 'Routine 5k Service. Tire rotation.',
    stage: 'Delivered',
    color: 'gray'
  }
];

// ==========================================
// 2. CRM LEADS
// ==========================================

export const MOCK_LEADS = [
  {
    id: 'LEAD-901',
    name: 'James Miller',
    interestModel: 'Aston Martin DB12',
    leadScore: 98, // Hot
    lastContact: '2 hours ago',
    status: 'Negotiation',
    source: 'Showroom Visit'
  },
  {
    id: 'LEAD-902',
    name: 'Ethan Hunt',
    interestModel: 'BMW M5 CS',
    leadScore: 75, // Warm
    lastContact: '1 day ago',
    status: 'Test Drive',
    source: 'Web Inquiry'
  },
  {
    id: 'LEAD-903',
    name: 'Natalie Rushman',
    interestModel: 'Porsche Taycan Turbo S',
    leadScore: 88, // Hot
    lastContact: '3 days ago',
    status: 'Financial Review',
    source: 'Referral'
  },
  {
    id: 'LEAD-904',
    name: 'Steve Rogers',
    interestModel: 'Chevrolet Corvette C8',
    leadScore: 45, // Cold/Warm
    lastContact: '1 week ago',
    status: 'Initial Contact',
    source: 'Phone Up'
  },
  {
    id: 'LEAD-905',
    name: 'Clark Kent',
    interestModel: 'Rivian R1T',
    leadScore: 60, // Warm
    lastContact: '5 hours ago',
    status: 'Vehicle Inquiry',
    source: 'Aggregator'
  }
];

// ==========================================
// 2.5 CUSTOMER DATABASE (For Customer 360 View)
// ==========================================

export const MOCK_CUSTOMERS = [
  {
    id: 'CUST-007',
    name: 'James Miller',
    email: 'james.miller@example.com',
    phone: '(202) 555-0199',
    address: '123 Maple Ave, Springfield, IL',
    tier: 'VIP Platinum',
    status: 'Active',
    ltv: 245000,
    vehicles: ['Aston Martin DB5', 'Land Rover Defender'],
    tags: ['Service Loyalist', 'Classic Collector'],
    lastVisit: 'Oct 24, 2023',
    sentiment: 'Happy'
  },
  {
    id: 'CUST-008',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    phone: '(212) 555-1000',
    address: '10880 Malibu Point, Malibu, CA',
    tier: 'VIP Platinum',
    status: 'Active',
    ltv: 850000,
    vehicles: ['Audi e-tron GT', 'Audi R8', 'Acura NSX'],
    tags: ['High Net Worth', 'Tech Enthusiast', 'Early Adopter'],
    lastVisit: 'Oct 20, 2023',
    sentiment: 'Neutral'
  },
  {
    id: 'CUST-009',
    name: 'Sarah Connor',
    email: 'sarah.connor@gmail.com',
    phone: '(310) 555-2029',
    address: '404 Desert Rd, Los Angeles, CA',
    tier: 'Gold',
    status: 'At Risk',
    ltv: 45000,
    vehicles: ['BMW X5 M50i'],
    tags: ['Service Due', 'Complaint Open'],
    lastVisit: 'Yesterday',
    sentiment: 'Frustrated'
  },
  {
    id: 'CUST-010',
    name: 'Walter White',
    email: 'walter.white@chem.net',
    phone: '(505) 555-1234',
    address: '308 Negra Arroyo Lane, Albuquerque, NM',
    tier: 'Silver',
    status: 'Inactive',
    ltv: 12000,
    vehicles: ['Pontiac Aztek', 'Chrysler 300'],
    tags: ['Budget Conscious'],
    lastVisit: '3 Months ago',
    sentiment: 'Happy'
  },
  {
    id: 'CUST-011',
    name: 'Diana Prince',
    email: 'diana.prince@museum.org',
    phone: '(202) 555-8888',
    address: '2200 Pennsylvania Ave, Washington, DC',
    tier: 'VIP Gold',
    status: 'Active',
    ltv: 160000,
    vehicles: ['Mercedes-Benz G63 AMG'],
    tags: ['Diplomat'],
    lastVisit: 'Oct 22, 2023',
    sentiment: 'Happy'
  }
];

// ==========================================
// 3. TECHNICIANS
// ==========================================

export const MOCK_TECHS = [
  {
    id: 'T-101',
    name: 'Alex Smith',
    initials: 'AS',
    status: 'Working' as TechStatus,
    efficiency: 115, // High performer
    currentRO: 'RO-24-1045',
    skillLevel: 'Master'
  },
  {
    id: 'T-102',
    name: 'Marcus Fenix',
    initials: 'MF',
    status: 'Working' as TechStatus,
    efficiency: 92,
    currentRO: 'RO-24-1049',
    skillLevel: 'A-Tech'
  },
  {
    id: 'T-103',
    name: 'Sarah Johnson',
    initials: 'SJ',
    status: 'Idle' as TechStatus,
    efficiency: 104,
    currentRO: null,
    skillLevel: 'B-Tech'
  },
  {
    id: 'T-104',
    name: 'Gordon Freeman',
    initials: 'GF',
    status: 'Lunch' as TechStatus,
    efficiency: 99,
    currentRO: null,
    skillLevel: 'Diagnostician'
  }
];

// ==========================================
// 4. INVENTORY
// ==========================================

export const MOCK_INVENTORY = [
  {
    stockId: 'STK-24-001',
    year: 2024,
    make: 'BMW',
    model: 'X7',
    trim: 'M60i',
    price: 108000,
    status: 'In Stock',
    daysInStock: 12,
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=300'
  },
  {
    stockId: 'STK-24-002',
    year: 2023,
    make: 'Porsche',
    model: '911',
    trim: 'Carrera S',
    price: 135000,
    status: 'In Stock',
    daysInStock: 45,
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=300'
  },
  {
    stockId: 'STK-24-003',
    year: 2024,
    make: 'Mercedes-Benz',
    model: 'S-Class',
    trim: 'S 580',
    price: 128000,
    status: 'In Transit',
    daysInStock: 0,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=300'
  },
  {
    stockId: 'STK-24-004',
    year: 2021,
    make: 'Land Rover',
    model: 'Range Rover',
    trim: 'Autobiography',
    price: 95000,
    status: 'Sold',
    daysInStock: 5,
    image: 'https://images.unsplash.com/photo-1605218427306-633ba88c9712?auto=format&fit=crop&q=80&w=300'
  },
  {
    stockId: 'STK-24-005',
    year: 2024,
    make: 'Audi',
    model: 'RS6 Avant',
    trim: 'Performance',
    price: 145000,
    status: 'In Stock',
    daysInStock: 2,
    image: 'https://images.unsplash.com/photo-1603584173870-7b299f589c76?auto=format&fit=crop&q=80&w=300'
  }
];

// ==========================================
// 5. CUSTOMER 360 (Mock for Detail View)
// ==========================================

export const MOCK_CUSTOMER_PROFILE = {
    id: 'CUST-007',
    name: 'James Miller',
    email: 'james.miller@example.com',
    phone: '(202) 555-0199',
    address: '123 Maple Ave, Springfield, IL',
    ltv: 245000, // Lifetime Value
    nps: 10,
    tier: 'VIP Platinum',
    sentiment: 'Happy',
    tags: ['Luxury Buyer', 'Performance', 'High Risk Driver'],
    preferences: {
        contactMethod: 'Encrypted Email',
        color: 'Silver Birch',
        bodyStyle: 'Coupe',
        features: ['Premium Sound', 'Armor Plating']
    },
    garage: [
        {
            year: 1964,
            make: 'Aston Martin',
            model: 'DB5',
            vin: 'DB5-007-US',
            status: 'Service Due',
            warranty: 'Expired',
            image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=200'
        },
        {
            year: 2023,
            make: 'Land Rover',
            model: 'Defender 110',
            vin: 'LR-DEF-007-US',
            status: 'Active',
            warranty: 'Active (2 Years left)',
            image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=200'
        }
    ],
    // New Fields
    opportunities: [
        { id: 'OPP-101', model: '2024 Aston Martin Valhalla', stage: 'Deposit Taken', value: 850000, probability: 90, date: '2023-10-15' }
    ],
    aiInsights: [
        { type: 'Service', label: 'Suggest Winter Tires', reason: 'Season change & Defender tires > 25k miles', priority: 'High', action: 'Send Quote' },
        { type: 'Sales', label: 'DB5 Valuation', reason: 'Vintage market up 12% this month', priority: 'Medium', action: 'Email Appraisal' }
    ]
};

export const MOCK_TIMELINE = [
    {
        id: 'evt-1',
        type: 'VISIT',
        title: 'Showroom Visit',
        description: 'Test drove Aston Martin DB12. Expressed interest in custom modifications.',
        date: 'Today, 10:30 AM',
        user: 'M. Lee',
        category: 'SALES'
    },
    {
        id: 'evt-declined',
        type: 'SERVICE_DECLINED',
        title: 'Declined Brake Service',
        description: 'Customer declined front rotor replacement on Defender 110. Cited "Can wait until next month".',
        date: 'Yesterday, 4:15 PM',
        user: 'Q. Jones',
        category: 'SERVICE',
        amount: 850.00
    },
    {
        id: 'evt-2',
        type: 'CALL',
        title: 'Outbound Call',
        description: 'Follow-up on previous service experience. Customer is happy with the repair.',
        date: 'Oct 24, 2:15 PM',
        user: 'Q. Jones',
        category: 'COMMS'
    },
    {
        id: 'evt-3',
        type: 'EMAIL',
        title: 'Quote Sent',
        description: 'Sent pricing for ballistic glass upgrade package.',
        date: 'Oct 22, 9:45 AM',
        user: 'M. Lee',
        category: 'SALES'
    },
    {
        id: 'evt-4',
        type: 'SERVICE_RO',
        title: 'RO Closed #9988',
        description: 'Routine maintenance and gadget calibration completed.',
        date: 'Sep 15, 2023',
        user: 'Service Dept',
        category: 'SERVICE',
        roId: 'RO-23-9988'
    },
    {
        id: 'evt-5',
        type: 'VEHICLE_PURCHASE',
        title: 'Vehicle Purchased',
        description: 'Took delivery of 2023 Land Rover Defender 110.',
        date: 'Jan 10, 2023',
        user: 'Sales Manager',
        category: 'SALES'
    }
];

// ==========================================
// 6. ACTIVITIES (Calendar & Tasks)
// ==========================================

// Helper to get date string relative to today
const getDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
};

export const MOCK_ACTIVITIES = [
    {
        id: 'ACT-001',
        type: 'TEST_DRIVE',
        title: 'Test Drive: BMW X5',
        date: getDate(0), // Today
        time: '10:00',
        duration: 60,
        status: 'PLANNED',
        customerName: 'Sarah Connor',
        priority: 'HIGH'
    },
    {
        id: 'ACT-002',
        type: 'MEETING',
        title: 'Sales Staff Meeting',
        date: getDate(0), // Today
        time: '08:30',
        duration: 30,
        status: 'COMPLETED',
        customerName: 'Internal',
        priority: 'NORMAL'
    },
    {
        id: 'ACT-003',
        type: 'CALL',
        title: 'Follow-up: Lease Renewal',
        date: getDate(0), // Today
        time: '14:00',
        duration: 15,
        status: 'PLANNED',
        customerName: 'Diana Prince',
        priority: 'NORMAL'
    },
    {
        id: 'ACT-004',
        type: 'SERVICE_APPT',
        title: 'RO Review: Aston Martin',
        date: getDate(1), // Tomorrow
        time: '11:00',
        duration: 45,
        status: 'PLANNED',
        customerName: 'James Miller',
        priority: 'HIGH'
    },
    {
        id: 'ACT-005',
        type: 'TASK',
        title: 'Prepare Monthly Report',
        date: getDate(-1), // Yesterday (Overdue)
        time: '09:00',
        duration: 60,
        status: 'OVERDUE',
        customerName: 'Admin',
        priority: 'HIGH'
    },
    {
        id: 'ACT-006',
        type: 'TEST_DRIVE',
        title: 'Test Drive: Audi e-tron',
        date: getDate(2), // +2 Days
        time: '15:30',
        duration: 60,
        status: 'PLANNED',
        customerName: 'Tony Stark',
        priority: 'NORMAL'
    },
    {
        id: 'ACT-007',
        type: 'CALL',
        title: 'Service Feedback Call',
        date: getDate(0), // Today
        time: '16:00',
        duration: 15,
        status: 'PLANNED',
        customerName: 'Walter White',
        priority: 'NORMAL'
    },
    {
        id: 'ACT-008',
        type: 'MEETING',
        title: 'Inventory Review',
        date: getDate(3),
        time: '09:00',
        duration: 60,
        status: 'PLANNED',
        customerName: 'Sales Team',
        priority: 'NORMAL'
    }
];