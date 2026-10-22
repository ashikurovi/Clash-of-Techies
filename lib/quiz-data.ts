export interface Question {
  id: number
  category: "Hardware" | "Networking" | "Software Engineering"
  q: string
  o: string[]
  a: number
}

export interface UserData {
  n: string
  r: string
  dept?: string
}

export type QuizState = "landing" | "quiz" | "completed"

export interface TopicInfo {
  id: string
  title: string
  titleEn: string
  badge: string
  description: string
  iconName: "Cpu" | "Network" | "Code2" | "Lightbulb"
  color: string
  bgColor: string
  borderColor: string
  items: string[]
}

export const QUIZ_CONFIG = {
  title: "Clash of Techies",
  season: "2026",
  tagline: "পলিটেকনিক শিক্ষার্থীদের সর্ববৃহৎ টেক ও কোডিং মেধা অন্বেষণ প্রতিযোগিতা",
  organizers: [
    {
      name: "Polytechnic Coders",
      subtitle: "By Programming Hero",
      logo: "/polytechnic-coders-logo.png",
      tag: "Organizer",
    },
    {
      name: "CPI Timeline",
      subtitle: "Chittagong Polytechnic Institute",
      logo: "/cpi-timeline-logo.png",
      tag: "Organizer",
    },
  ],
  bannerImage: "/clash-of-techies-banner.png",
  totalQuestions: 30,
  durationMinutes: 20,
  durationSeconds: 20 * 60,
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbzn8kQh6EIfR1TVV7rF42awHFwMnx4tXxVTlKZ6nUjzhWqwr8hkPsMbNLFlE1FFSL_HVg/exec",
}

export const TOPICS_DATA: TopicInfo[] = [
  {
    id: "hardware",
    title: "হার্ডওয়্যার ও কম্পিউটার আর্কিটেকচার",
    titleEn: "Hardware & Computer Architecture",
    badge: "১০টি প্রশ্ন",
    description: "প্রসেসর, মেমোরি হাইরার্কি, মাদারবোর্ড আর্কিটেকচার এবং মডার্ন স্টোরেজ টেকনোলজি।",
    iconName: "Cpu",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    items: ["CPU Architecture & ALU", "Cache & Registers", "ROM/BIOS & RAM", "NVMe SSD & System Bus", "Motherboard Form Factor"],
  },
  {
    id: "networking",
    title: "কম্পিউটার নেটওয়ার্কিং",
    titleEn: "Computer Networking",
    badge: "১০টি প্রশ্ন",
    description: "নেটওয়ার্ক প্রটোকল, OSI মডেল, আইপি অ্যাড্রেসিং, রাউটিং ও সিকিউর ট্রান্সমিশন।",
    iconName: "Network",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    items: ["OSI 7-Layer Model", "IPv4 Addressing & Classes", "TCP vs UDP Protocols", "DNS, DHCP & HTTPS", "Routers & Network Hardware"],
  },
  {
    id: "software",
    title: "সফটওয়্যার ইঞ্জিনিয়ারিং ও প্রোগ্রামিং",
    titleEn: "Software Engineering & Programming",
    badge: "১০টি প্রশ্ন",
    description: "সফটওয়্যার ডেভেলপমেন্ট মেথডোলজি, গিট ভার্সন কন্ট্রোল, ওওপি ও সিস্টেম ডিজাইন।",
    iconName: "Code2",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    items: ["SDLC & Agile Sprint", "Git Version Control", "OOP Fundamentals", "REST API & MVC Pattern", "Database Indexing & Big-O"],
  },
  {
    id: "logic",
    title: "প্রবলেম সলভিং ও টেকনোলজি লজিক",
    titleEn: "Problem Solving & Tech Logic",
    badge: "বোনাস স্কিল",
    description: "অ্যালগরিদমিক থিংকিং, টাইম কমপ্লেক্সিটি এবং মডার্ন টেকনোলজি অ্যানালিটিক্স।",
    iconName: "Lightbulb",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    items: ["Algorithmic Thinking", "Time Complexity O(n)", "Debugging Mindset", "Industry Best Practices"],
  },
]

export const REGISTRATION_LOCK_TIME_TODAY = "2026-10-22T18:00:00+06:00"
export const REGISTRATION_REOPEN_TIME = "2026-10-23T20:00:00+06:00"
export const REGISTRATION_UNLOCK_TIME = REGISTRATION_REOPEN_TIME // legacy compatibility

export const COMPETITION_SCHEDULE = {
  date: "23rd October, 2026",
  dateBn: "২৩ অক্টোবর, ২০২৬",
  time: "08:00 PM",
  timeBn: "রাত ০৮:০০ টা",
  format: "Quiz",
  formatBn: "অনলাইন টেক কুইজ",
  lockTimeToday: REGISTRATION_LOCK_TIME_TODAY,
  reopenTime: REGISTRATION_REOPEN_TIME,
  unlockTime: REGISTRATION_REOPEN_TIME,
}

export const PRIZES_DATA = [
  {
    rank: "১ম স্থান",
    title: "Champion (চ্যাম্পিয়ন)",
    mainPrize: "Mini UPS",
    mainPrizeBn: "মিনি ইউপিএস (Mini UPS)",
    badgeColor: "from-amber-400 to-yellow-500 text-slate-950",
    borderGlow: "border-amber-500/50 shadow-amber-500/20",
    icon: "Trophy",
    gifts: [
      "Mini UPS (মিনি ইউপিএস)",
      "চ্যাম্পিয়ন গোল্ডেন ক্রেস্ট ও মেডেল",
      "অফিসিয়াল সার্টিফিকেট অব এক্সিলেন্স",
      "ChipkaChipki স্পেশাল গিফট ভাউচার",
    ],
  },
  {
    rank: "২য় স্থান",
    title: "1st Runners-up (১ম রানার আপ)",
    mainPrize: "Power Bank",
    mainPrizeBn: "পাওয়ার ব্যাংক (Power Bank)",
    badgeColor: "from-purple-500 to-violet-600 text-white",
    borderGlow: "border-purple-500/40 shadow-purple-500/15",
    icon: "Medal",
    gifts: [
      "Power Bank (পাওয়ার ব্যাংক)",
      "রানার-আপ সম্মাননা ক্রেস্ট ও মেডেল",
      "অফিসিয়াল সার্টিফিকেট অব অ্যাচিভমেন্ট",
      "ChipkaChipki স্পেশাল গিফট ভাউচার",
    ],
  },
  {
    rank: "৩য় স্থান",
    title: "2nd Runners-up (২য় রানার আপ)",
    mainPrize: "Headphone",
    mainPrizeBn: "হেডফোন (Headphone)",
    badgeColor: "from-rose-500 to-red-600 text-white",
    borderGlow: "border-rose-500/40 shadow-rose-500/15",
    icon: "Award",
    gifts: [
      "Headphone (হেডফোন)",
      "সম্মাননা ক্রেস্ট ও মেডেল",
      "অফিসিয়াল সার্টিফিকেট অব মেরিট",
      "ChipkaChipki স্পেশাল গিফট ভাউচার",
    ],
  },
]

export const SPECIAL_GIFT = {
  sponsor: "ChipkaChipki",
  title: "Special Gift from ChipkaChipki",
  titleBn: "ChipkaChipki-এর পক্ষ থেকে স্পেশাল গিফট",
  prize: "Gift Voucher",
  prizeBn: "গিফট ভাউচার (Gift Voucher)",
  description: "প্রতিযোগীদের জন্য থাকছে ChipkaChipki-এর সৌজন্যে বিশেষ আকর্ষণীয় গিফট ভাউচার!",
}

export const RULES_DATA = [
  {
    title: "সম্পূর্ণ অনলাইন প্রতিযোগিতা",
    desc: "যেকোনো স্মার্টফোন, ল্যাপটপ বা ডেস্কটপ ব্রাউজার থেকে সরাসরি অংশগ্রহণ করা যাবে।",
  },
  {
    title: "মোট ২০ মিনিট সময়সীমা",
    desc: "৩০টি প্রশ্নের জন্য ২০ মিনিট বরাদ্দ। সময় শেষ হওয়ার সাথে সাথে অটো-সাবমিট হয়ে যাবে।",
  },
  {
    title: "ওয়ান-টাইম অপশন সিলেকশন",
    desc: "প্রতিটি প্রশ্নের উত্তর একবার নির্বাচন করলে তা তাৎক্ষণিক লক হয়ে যাবে, সাবধানে উত্তর দিন।",
  },
  {
    title: "স্মার্ট অ্যান্টি-চিট সিকিউরিটি",
    desc: "পরীক্ষা চলাকালীন ২ বারের বেশি ট্যাব পরিবর্তন বা মিনিমাইজ করলে কুইজ সরাসরি সাবমিট হবে।",
  },
  {
    title: "টাই-ব্রেকিং রুলস",
    desc: "সমান স্কোর অর্জনকারীদের মধ্যে দ্রুততম সময়ে সাবমিটকারীকে মেধা তালিকায় অগ্রাধিকার দেওয়া হবে।",
  },
]

export const questions: Question[] = [
  // --- 1 to 10: Hardware & Computer Architecture ---
  {
    id: 1,
    category: "Hardware",
    q: "CPU-র কোন অংশ গাণিতিক ও যৌক্তিক সিদ্ধান্ত গ্রহণের কাজ সম্পন্ন করে?",
    o: ["Control Unit (CU)", "Arithmetic Logic Unit (ALU)", "Cache Memory", "Registers"],
    a: 1,
  },
  {
    id: 2,
    category: "Hardware",
    q: "কম্পিউটারের কোন মেমোরিটি Volatile বা বিদ্যুৎ সংযোগ বিচ্ছিন্ন হলে ডাটা মুছে যায়?",
    o: ["ROM", "RAM", "Hard Disk Drive", "Flash Drive"],
    a: 1,
  },
  {
    id: 3,
    category: "Hardware",
    q: "কম্পিউটার চালু করার প্রাথমিক নির্দেশাবলী (Bootstrapping) কোন চিপে স্থায়ীভাবে সংরক্ষিত থাকে?",
    o: ["CMOS / BIOS ROM", "DDR RAM", "SATA SSD", "GPU VRAM"],
    a: 0,
  },
  {
    id: 4,
    category: "Hardware",
    q: "একটি প্রসেসরের গতি (Clock Speed) সাধারণত কোন এককে পরিমাপ করা হয়?",
    o: ["Megabytes (MB)", "Gigahertz (GHz)", "Nanoseconds (ns)", "Bits per second (bps)"],
    a: 1,
  },
  {
    id: 5,
    category: "Hardware",
    q: "SSD (Solid State Drive) -তে দ্রুত ডাটা রিড/রাইট করার জন্য কোন প্রযুক্তি ব্যবহৃত হয়?",
    o: ["Magnetic Platter", "NAND Flash Memory", "Optical Laser", "Dynamic RAM"],
    a: 1,
  },
  {
    id: 6,
    category: "Hardware",
    q: "মাদারবোর্ডে প্রসেসর এবং দ্রুতগতির মেমোরির মধ্যে ডাটা আদান-প্রদান সমন্বয় করে কোনটি?",
    o: ["Northbridge / System Bus", "Southbridge", "SATA Cable", "PCI Slot"],
    a: 0,
  },
  {
    id: 7,
    category: "Hardware",
    q: "আধুনিক ডেডিকেটেড গ্রাফিক্স কার্ড (GPU) মাদারবোর্ডের কোন স্লটে সংযুক্ত করা হয়?",
    o: ["PCIe x16", "SATA 3.0", "AGP 1x", "IDE Port"],
    a: 0,
  },
  {
    id: 8,
    category: "Hardware",
    q: "কম্পিউটার প্রসেসরের সবচেয়ে দ্রুতগতির ইন্টারনাল মেমোরি কোনটি?",
    o: ["Registers ও L1 Cache", "L3 Cache", "DDR4 RAM", "NVMe SSD"],
    a: 0,
  },
  {
    id: 9,
    category: "Hardware",
    q: "কম্পিউটার পাওয়ার সাপ্লাই ইউনিট (SMPS) এর মূল কাজ কী?",
    o: ["AC কারেন্টকে DC কারেন্টে রূপান্তর করা", "DC কারেন্টকে AC কারেন্টে রূপান্তর করা", "ইন্টারনেট ব্যান্ডউইথ নিয়ন্ত্রণ করা", "প্রসেসর ফ্রিকোয়েন্সি বৃদ্ধি করা"],
    a: 0,
  },
  {
    id: 10,
    category: "Hardware",
    q: "নিচের কোনটি মাদারবোর্ডের সাইজ বা ফর্ম ফ্যাক্টর (Form Factor) নির্দেশ করে?",
    o: ["ATX / Micro-ATX", "DDR5", "TCP/IP", "NVMe Protocol"],
    a: 0,
  },

  // --- 11 to 20: Computer Networking ---
  {
    id: 11,
    category: "Networking",
    q: "নেটওয়ার্কিংয়ের আদর্শ OSI মডেলে মোট কয়টি লেয়ার (Layers) রয়েছে?",
    o: ["৫টি লেয়ার", "৬টি লেয়ার", "৭টি লেয়ার", "৪টি লেয়ার"],
    a: 2,
  },
  {
    id: 12,
    category: "Networking",
    q: "ভিন্ন ভিন্ন নেটওয়ার্ককে সংযুক্ত করতে এবং ডেটা প্যাকেট রাউটিং করতে কোন ডিভাইস ব্যবহৃত হয়?",
    o: ["Network Hub", "Network Switch", "Router", "Repeater"],
    a: 2,
  },
  {
    id: 13,
    category: "Networking",
    q: "একটি আদর্শ IPv4 অ্যাড্রেস কত বিট (Bits) নিয়ে গঠিত হয়?",
    o: ["১৬ বিট", "৩২ বিট", "৬৪ বিট", "১২৮ বিট"],
    a: 1,
  },
  {
    id: 14,
    category: "Networking",
    q: "ডোমেইন নামকে (যেমন: www.google.com) আইপি অ্যাড্রেসে রূপান্তর করে কোন প্রটোকল?",
    o: ["DNS (Domain Name System)", "DHCP", "FTP", "SNMP"],
    a: 0,
  },
  {
    id: 15,
    category: "Networking",
    q: "নিচের কোনটি কানেকশন-লেস (Connectionless) এবং দ্রুতগতির ট্রান্সপোর্ট লেয়ার প্রটোকল?",
    o: ["TCP", "UDP (User Datagram Protocol)", "HTTP", "SSH"],
    a: 1,
  },
  {
    id: 16,
    category: "Networking",
    q: "কোন প্রটোকলের মাধ্যমে ক্লায়েন্ট ডিভাইস লোকাল নেটওয়ার্কে স্বয়ংক্রিয়ভাবে IP Address পায়?",
    o: ["DHCP", "DNS", "ARP", "ICMP"],
    a: 0,
  },
  {
    id: 17,
    category: "Networking",
    q: "সুরক্ষিতভাবে (Encrypted) ওয়েব ব্রাউজ করতে ডিফল্টভাবে কোন পোর্ট এবং প্রটোকল ব্যবহৃত হয়?",
    o: ["HTTP (Port 80)", "HTTPS (Port 443)", "FTP (Port 21)", "Telnet (Port 23)"],
    a: 1,
  },
  {
    id: 18,
    category: "Networking",
    q: "নেটওয়ার্ক ইন্টারফেস কার্ড (NIC) এর স্থায়ী হার্ডওয়্যার অ্যাড্রেসকে কী বলা হয়?",
    o: ["Logical IP Address", "MAC Address (Physical)", "Port Number", "Subnet Mask"],
    a: 1,
  },
  {
    id: 19,
    category: "Networking",
    q: "IP Address 192.168.1.1 কোন আইপি অ্যাড্রেস ক্লাসের (IP Class) আওতাভুক্ত?",
    o: ["Class A", "Class B", "Class C", "Class D"],
    a: 2,
  },
  {
    id: 20,
    category: "Networking",
    q: "একটি রিমোট হোস্ট বা সার্ভারের সাথে নেটওয়ার্ক সংযোগ পরীক্ষা করতে কোন কমান্ড ব্যবহার করা হয়?",
    o: ["ping", "mkdir", "ipconfig /release", "netstat -stop"],
    a: 0,
  },

  // --- 21 to 30: Software Engineering ---
  {
    id: 21,
    category: "Software Engineering",
    q: "সফটওয়্যার ডেভেলপমেন্ট লাইফ সাইকেলে (SDLC) 'Waterfall Model' এর প্রধান বৈশিষ্ট্য কোনটি?",
    o: ["ধাপে ধাপে ক্রমানুসারে কাজ সম্পন্ন হয় (Sequential)", "প্রতি সপ্তাহে স্প্রিন্ট রিলিজ হয়", "কোনো ডকুমেন্টেশনের প্রয়োজন হয় না", "ক্লায়েন্ট প্রতিদিন রিকোয়ারমেন্ট পরিবর্তন করতে পারে"],
    a: 0,
  },
  {
    id: 22,
    category: "Software Engineering",
    q: "Git ভার্সন কন্ট্রোল সিস্টেমে একটি নতুন ব্রাঞ্চ তৈরি করার সঠিক কমান্ড কোনটি?",
    o: ["git branch <branch-name>", "git commit -m <message>", "git push origin main", "git init -new"],
    a: 0,
  },
  {
    id: 23,
    category: "Software Engineering",
    q: "অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিংয়ে (OOP) একটি ক্লাস অন্য ক্লাসের বৈশিষ্ট্য ও মেথড গ্রহণ করাকে কী বলে?",
    o: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    a: 1,
  },
  {
    id: 24,
    category: "Software Engineering",
    q: "Agile মেথডোলজিতে নির্দিষ্ট সময়ের (সাধারণত ১-৪ সপ্তাহ) সংক্ষিপ্ত কর্মচক্রকে কী বলা হয়?",
    o: ["Sprint", "Milestone", "Waterfall Phase", "Epic Timeline"],
    a: 0,
  },
  {
    id: 25,
    category: "Software Engineering",
    q: "সফটওয়্যারের সবচেয়ে ক্ষুদ্রতম ইউনিট বা স্বতন্ত্র ফাংশন টেস্ট করাকে কী টেস্টিং বলা হয়?",
    o: ["Unit Testing", "System Testing", "Integration Testing", "Acceptance Testing"],
    a: 0,
  },
  {
    id: 26,
    category: "Software Engineering",
    q: "RESTful API ডিজাইনে ডাটাবেজে নতুন রিসোর্স তৈরি (Create) করার জন্য কোন HTTP মেথড ব্যবহৃত হয়?",
    o: ["GET", "POST", "PUT", "DELETE"],
    a: 1,
  },
  {
    id: 27,
    category: "Software Engineering",
    q: "সফটওয়্যার ইঞ্জিনিয়ারিংয়ে 'DRY' প্রিন্সিপালের পূর্ণ রূপ কী?",
    o: ["Don't Repeat Yourself", "Do Repeat Yesterday", "Data Ready Yield", "Deploy Rapidly Yearly"],
    a: 0,
  },
  {
    id: 28,
    category: "Software Engineering",
    q: "ডাটাবেজ টেবিল থেকে দ্রুত ডাটা খোঁজার (Query Performance বাড়ানোর) জন্য কী তৈরি করা হয়?",
    o: ["Trigger", "Index", "Foreign Key", "Stored Procedure"],
    a: 1,
  },
  {
    id: 29,
    category: "Software Engineering",
    q: "সফটওয়্যার আর্কিটেকচারাল প্যাটার্ন 'MVC' এর পূর্ণরূপ কী?",
    o: ["Model View Controller", "Main Virtual Component", "Multi Version Code", "Modern Variable Class"],
    a: 0,
  },
  {
    id: 30,
    category: "Software Engineering",
    q: "একটি অ্যালগরিদমের কার্যক্ষমতা ও সময় জটিলতা (Time Complexity) প্রকাশের স্ট্যান্ডার্ড নোটেশন কোনটি?",
    o: ["Big-O Notation [O(n)]", "Binary Code", "Bytecode Format", "ASCII Value"],
    a: 0,
  },
]
