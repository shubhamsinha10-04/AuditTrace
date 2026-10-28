// Enterprise Audit Engagements & Controls Mock Data
// Modeled after KPMG / PwC ITGC & Fixed Asset Physical Inspections

export const INITIAL_AUDITS = [
  {
    id: 'AUD-2026-081',
    code: 'AUD-081',
    title: 'IT Infrastructure & Physical Security Audit',
    client: 'Acuity Financial Holdings Ltd.',
    engagementType: 'SOC 2 & ISO 27001 Inspection',
    auditor: 'AUD-8824 (A. Harrison, CISA)',
    auditorTitle: 'Senior Field Lead - Risk Advisory',
    status: 'In Progress', // 'Draft' | 'In Progress' | 'In Review' | 'Synced'
    riskLevel: 'High',      // 'Low' | 'Medium' | 'High'
    dueDate: '2026-11-04',
    location: 'Tower 1, Floors 14-16, Financial District, NY',
    gpsReference: { latitude: 40.712776, longitude: -74.005974, altitude: 22.4 },
    lastModified: '2026-10-27T16:45:00Z',
    isSynced: false,
    controls: [
      // Domain 1: Physical Security
      {
        id: 'SEC-01',
        domain: 'Physical Security',
        title: 'Perimeter Biometric Dual-Factor Entry Verification',
        requirement: 'Enforce biometric scan (fingerprint/iris) + encrypted RFID badge reader at all server room ingress points.',
        criticality: 'High',
        status: 'pass', // 'pass' | 'fail' | 'flag' | 'untested'
        notes: 'Tested primary entrance to Data Hall A. Dual-factor requirement enforced; access log entry reflected in SIEM within 3 seconds.',
        evidence: [
          {
            id: 'EVD-081-01',
            type: 'photo',
            caption: 'Biometric Scanner & Mantrap Entry Terminal A',
            uri: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
            timestamp: '2026-10-27T14:15:22.410Z',
            gps: { latitude: 40.712792, longitude: -74.005988, altitude: 22.4, accuracy: 1.8 },
            auditorId: 'AUD-8824',
            controlRef: 'SEC-01',
            sha256Hash: '4a6b29f9e208b087f9859f518e11b3d6872583d7890efd019f37c35d1234abcd',
            tamperVerified: true,
          }
        ],
        signatures: [
          {
            id: 'SIG-081-01',
            signerName: 'Marcus Brody',
            signerRole: 'Director of Physical Facilities',
            signedAt: '2026-10-27T14:30:00Z',
            status: 'Confirmed'
          }
        ]
      },
      {
        id: 'SEC-02',
        domain: 'Physical Security',
        title: 'CCTV Optical Coverage & 90-Day Retention Compliance',
        requirement: 'Zero blindspots along server rack aisles; cameras must maintain minimum 1080p recording archived for 90 days.',
        criticality: 'Medium',
        status: 'flag',
        notes: 'Camera 4B near Row 6 suffers from an optical glare blindspot during overhead LED cycles. Facilities ticket #4182 submitted for angle recalibration.',
        evidence: [
          {
            id: 'EVD-081-02',
            type: 'photo',
            caption: 'CCTV Camera 4B View with Row 6 Glare Blindspot',
            uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            timestamp: '2026-10-27T14:48:10.120Z',
            gps: { latitude: 40.712788, longitude: -74.005995, altitude: 22.1, accuracy: 2.1 },
            auditorId: 'AUD-8824',
            controlRef: 'SEC-02',
            sha256Hash: '8f92b451120aa785d034ee78912cf519098bcad1928374aae5612349876efcda',
            tamperVerified: true,
          }
        ],
        signatures: []
      },
      {
        id: 'SEC-03',
        domain: 'Physical Security',
        title: 'Visitor Escort & Manual Logbook Registry Verification',
        requirement: 'Third-party vendors must sign physical ledger, wear designated high-vis guest badges, and remain accompanied at all times.',
        criticality: 'Medium',
        status: 'pass',
        notes: 'Sampled October 2026 contractor log entries. All 18 guest sign-ins had corresponding employee escorts and departure timestamps.',
        evidence: [],
        signatures: []
      },
      {
        id: 'SEC-04',
        domain: 'Physical Security',
        title: 'Clean Desk & Terminal Screen Lock Inspection',
        requirement: 'Trading terminals and operations stations must auto-lock after 180 seconds; no exposed credentials or paper working notes.',
        criticality: 'High',
        status: 'fail',
        notes: 'Found two active trading terminals in Operations Pod B left unlocked and unattended for over 8 minutes. Escalated directly to CISO on-duty.',
        evidence: [
          {
            id: 'EVD-081-03',
            type: 'photo',
            caption: 'Unattended Unlocked Terminal in Pod B',
            uri: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            timestamp: '2026-10-27T15:10:44.890Z',
            gps: { latitude: 40.712810, longitude: -74.005960, altitude: 22.0, accuracy: 1.5 },
            auditorId: 'AUD-8824',
            controlRef: 'SEC-04',
            sha256Hash: '3c89f012de947518923bb61093847ca019283584739281726354892019283746',
            tamperVerified: true,
          }
        ],
        signatures: []
      },

      // Domain 2: Asset Tagging & Hardware
      {
        id: 'AST-01',
        domain: 'Asset Tagging',
        title: 'Fixed Asset Barcode / RFID Tag Reconciliation',
        requirement: '100% of physical rack blade servers and SAN enclosures must possess legible tamper-evident enterprise asset barcodes matching SAP register.',
        criticality: 'High',
        status: 'pass',
        notes: 'Sampled 40 chassis in Racks 1-8. Barcode tags scanned accurately against Master Asset Register V4.1 without discrepancy.',
        evidence: [
          {
            id: 'EVD-081-04',
            type: 'photo',
            caption: 'Rack 4 Dell PowerEdge Asset Tag Barcode Cross-Check',
            uri: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
            timestamp: '2026-10-27T15:35:12.750Z',
            gps: { latitude: 40.712790, longitude: -74.005970, altitude: 22.4, accuracy: 1.6 },
            auditorId: 'AUD-8824',
            controlRef: 'AST-01',
            sha256Hash: 'b5a2c41890128374650192837465910283746581920394857162534891029384',
            tamperVerified: true,
          }
        ],
        signatures: []
      },
      {
        id: 'AST-02',
        domain: 'Asset Tagging',
        title: 'Detection of Unsanctioned Rogue Hardware & Taps',
        requirement: 'No unauthorized USB storage dongles, rogue wireless APs, or unmanaged switches connected to core distribution racks.',
        criticality: 'High',
        status: 'pass',
        notes: 'Full visual and RF scan of server aisle 2 complete. No unauthorized peripherals or foreign adapters detected.',
        evidence: [],
        signatures: []
      },
      {
        id: 'AST-03',
        domain: 'Asset Tagging',
        title: 'Decommissioned Storage Media Secure Quarantine',
        requirement: 'Drives pending physical degaussing or shredding must be kept in dual-custody fireproof safe with chain-of-custody log.',
        criticality: 'Medium',
        status: 'flag',
        notes: 'Seven SAS SSDs found in unsealed staging bin awaiting safe transfer. Safe custodian was offsite at time of inspection.',
        evidence: [],
        signatures: []
      },

      // Domain 3: Network Controls & Environmental
      {
        id: 'NET-01',
        domain: 'Network Controls',
        title: 'FM-200 Clean Agent Fire Suppression Inspection',
        requirement: 'Suppressant tank cylinder pressure gauges must register in certified green operating range (360 PSI ± 5%).',
        criticality: 'High',
        status: 'pass',
        notes: 'Inspected Main Hall cylinder bank #1 & #2. Pressure verified at 362 PSI. Hydrostatic test certification valid through March 2028.',
        evidence: [
          {
            id: 'EVD-081-05',
            type: 'photo',
            caption: 'FM-200 Fire Suppression Pressure Gauge Verification',
            uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            timestamp: '2026-10-27T16:12:05.320Z',
            gps: { latitude: 40.712770, longitude: -74.005955, altitude: 22.3, accuracy: 1.4 },
            auditorId: 'AUD-8824',
            controlRef: 'NET-01',
            sha256Hash: '9182374650192837465819203948571625348910293847561928374650192837',
            tamperVerified: true,
          }
        ],
        signatures: []
      },
      {
        id: 'NET-02',
        domain: 'Network Controls',
        title: 'CRAC Unit Temperature & Humidity Redundancy',
        requirement: 'Aisle temperature 20°C - 23°C, relative humidity 45% - 55%; N+1 redundant cooling online.',
        criticality: 'Medium',
        status: 'pass',
        notes: 'Cold aisle temperature recorded at 21.4°C with 48% RH. Unit CRAC-03 successfully simulated failover switch.',
        evidence: [],
        signatures: []
      },
      {
        id: 'NET-03',
        domain: 'Network Controls',
        title: 'Physical Air-Gap & Patch Cabling Discipline',
        requirement: 'Production and DMZ network fiber cables must maintain distinct visual sheath color coding and tamper-evident tags.',
        criticality: 'Medium',
        status: 'untested',
        notes: '',
        evidence: [],
        signatures: []
      }
    ]
  },
  {
    id: 'AUD-2026-094',
    code: 'AUD-094',
    title: 'Fixed Asset Physical Verification - Warehouse B',
    client: 'Apex Global Supply Chain Corp',
    engagementType: 'Year-End Physical Asset Audit',
    auditor: 'AUD-8824 (A. Harrison, CISA)',
    auditorTitle: 'Senior Field Lead - Risk Advisory',
    status: 'Draft',
    riskLevel: 'Medium',
    dueDate: '2026-11-12',
    location: 'Building B4, Logistics Hub, Chicago IL',
    gpsReference: { latitude: 41.878113, longitude: -87.629799, altitude: 181.0 },
    lastModified: '2026-10-26T11:20:00Z',
    isSynced: false,
    controls: [
      {
        id: 'SEC-10',
        domain: 'Physical Security',
        title: 'Perimeter Fence & Gate Access Automated Logging',
        requirement: 'Heavy vehicle freight gates must log RFID transponders and conduct optical license plate capture.',
        criticality: 'Medium',
        status: 'pass',
        notes: 'Barrier arm gate #2 logged 45 freight trucks correctly over test period.',
        evidence: [],
        signatures: []
      },
      {
        id: 'AST-11',
        domain: 'Asset Tagging',
        title: 'Forklift & Autonomous Guided Vehicle (AGV) Serial Check',
        requirement: 'Verify engine serial numbers and battery lifecycle certificates for 12 Crown AGV units.',
        criticality: 'High',
        status: 'untested',
        notes: '',
        evidence: [],
        signatures: []
      },
      {
        id: 'AST-12',
        domain: 'Asset Tagging',
        title: 'High-Value Tier 1 Electronics Cage Physical Count',
        requirement: '100% manual barcode scan of quarantined microchips and GPU inventory pallets.',
        criticality: 'High',
        status: 'untested',
        notes: '',
        evidence: [],
        signatures: []
      },
      {
        id: 'NET-10',
        domain: 'Network Controls',
        title: 'Industrial Wi-Fi 6 Mesh Outdoor AP Enclosure Sealing',
        requirement: 'Ensure NEMA 4X weatherproofing seals on high-bay wireless bridge antennas.',
        criticality: 'Low',
        status: 'pass',
        notes: 'Weatherproofing intact on Antenna Mast 1 through 4.',
        evidence: [],
        signatures: []
      }
    ]
  },
  {
    id: 'AUD-2026-042',
    code: 'AUD-042',
    title: 'SOC 2 Type II Environmental & Disaster Readiness',
    client: 'Skyline Cloud Services LLC',
    engagementType: 'Annual AICPA SOC 2 Type II Attestation',
    auditor: 'AUD-4412 (S. Vance, CISSP)',
    auditorTitle: 'Principal Auditor',
    status: 'Synced',
    riskLevel: 'Low',
    dueDate: '2026-10-20',
    location: 'Ashburn DC Facility #3, VA',
    gpsReference: { latitude: 39.043756, longitude: -77.487442, altitude: 88.0 },
    lastModified: '2026-10-20T17:00:00Z',
    isSynced: true,
    controls: [
      {
        id: 'SEC-20',
        domain: 'Physical Security',
        title: 'Multi-Tenant Mantrap Anti-Tailgating Sensors',
        requirement: 'Weight sensors inside mantrap chamber must reject entry if weight exceeds registered user ± 15kg.',
        criticality: 'High',
        status: 'pass',
        notes: 'Tested with simulation weight. Anti-tailgating alarm tripped within 500ms.',
        evidence: [],
        signatures: []
      },
      {
        id: 'NET-21',
        domain: 'Network Controls',
        title: 'Dual Diesel Generator 48-Hour Full-Load Fuel Reserves',
        requirement: 'Fuel tanks must register at minimum 90% capacity with valid annual fuel-polishing log.',
        criticality: 'High',
        status: 'pass',
        notes: 'Tanks A & B both verified at 94.2% capacity. Fuel testing lab report dated Sept 15, 2026.',
        evidence: [],
        signatures: []
      }
    ]
  },
  {
    id: 'AUD-2026-118',
    code: 'AUD-118',
    title: 'Sarbanes-Oxley (SOX) ITGC Compliance Walkthrough',
    client: 'Meridian Pharmaceuticals Inc.',
    engagementType: 'SOX Section 404 IT General Controls',
    auditor: 'AUD-8824 (A. Harrison, CISA)',
    auditorTitle: 'Senior Field Lead - Risk Advisory',
    status: 'In Review',
    riskLevel: 'High',
    dueDate: '2026-11-01',
    location: 'Global IT Center, Boston MA',
    gpsReference: { latitude: 42.360082, longitude: -71.058880, altitude: 12.0 },
    lastModified: '2026-10-25T19:30:00Z',
    isSynced: false,
    controls: [
      {
        id: 'SEC-30',
        domain: 'Physical Security',
        title: 'Tape Backup Offsite Transport Chain-of-Custody',
        requirement: 'Locked Iron Mountain transport bins must possess tamper seals with matching dispatch manifests.',
        criticality: 'High',
        status: 'flag',
        notes: 'Seal #8841-B recorded on manifest had minor adhesive tear; security officer provided replacement sign-off affidavit.',
        evidence: [],
        signatures: []
      },
      {
        id: 'AST-31',
        domain: 'Asset Tagging',
        title: 'Laboratory HPLC System Controller Physical Access',
        requirement: 'High-performance liquid chromatography workstations must be segregated in locked analytical suite.',
        criticality: 'High',
        status: 'pass',
        notes: 'RFID access restricted solely to Level 3 certified lab toxicologists.',
        evidence: [],
        signatures: []
      }
    ]
  }
];

export const AUDIT_DOMAINS = [
  'All Domains',
  'Physical Security',
  'Asset Tagging',
  'Network Controls'
];

export const SAMPLE_CAPTURE_PRESETS = [
  {
    title: 'Biometric Access Terminal',
    domain: 'Physical Security',
    caption: 'Dual-Factor Scanner Mantrap Gate',
    uri: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Server Rack Barcode Asset Tag',
    domain: 'Asset Tagging',
    caption: 'Chassis Blade Serial & Barcode Tag',
    uri: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Fire Suppression Pressure Gauge',
    domain: 'Network Controls',
    caption: 'FM-200 Suppressant Cylinder Gauge',
    uri: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Unlocked Trader Terminal',
    domain: 'Physical Security',
    caption: 'Unattended Workstation Screen Violation',
    uri: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'CCTV Blindspot Observation',
    domain: 'Physical Security',
    caption: 'Overhead Optical Flare Angle',
    uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  }
];
