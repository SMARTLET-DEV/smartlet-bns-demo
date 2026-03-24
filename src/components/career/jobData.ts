export interface JobPosition {
  id: string;
  department: string;
  title: string;
  location: string;
  type: string;
  officeHours: string;
  salary: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  email: string;
  postedDate: string;
  note?: string;
}

export const jobPositions: JobPosition[] = [
    {
        id: "customer-support-executive",
        department: "Operations",
        title: "Customer Support Executive",
        location: "Banani, Dhaka",
        type: "Full-time",
        officeHours: "12 PM – 8 PM",
        salary: "25,000 BDT (Negotiable)",
        overview:
      "We're looking for an enthusiastic and dedicated Customer/Admin Support Executive to join our team. The ideal candidate will be a great communicator with strong attention to detail, capable of handling client communication, assisting with services, and managing sensitive data with accuracy.",
        responsibilities: [
            "Communicate effectively with clients in both Bangla and English",
            "Manage critical and sensitive data entry with high accuracy",
            "Coordinate between clients and internal teams to ensure smooth service delivery",
            "Assist the Admin team with daily operational and customer support tasks",
        ],
        qualifications: [
            "Excellent verbal communication in Bangla and English",
            "Strong attention to detail and organizational skills",
            "Ability to handle sensitive data responsibly",
            "Friendly, professional attitude and a proactive approach to problem-solving",
        ],
        benefits: ["Subsidized lunch and snacks"],
        email: "careers@opendoor.com.bd",
        postedDate: "November 2024",
    },
    {
        id: "letting-expert",
        department: "Sales",
        title: "Letting Expert",
        location: "Banani, Dhaka",
        type: "Full-time",
        officeHours: "11 AM – 7 PM",
        salary: "30,000 BDT",
        overview:
      "We're looking for a confident, energetic, and people-oriented Letting Expert to join our team. The ideal candidate will communicate effortlessly, understand people well, and represent OPENDOOR professionally during property visits, discussions, and negotiations. This role is field-facing and key to ensuring clients experience a smooth, guided, and trustworthy renting journey.",
        responsibilities: [
            "Communicate effectively with clients in both Bangla and English",
            "Conduct property viewings and guide clients with clarity and professionalism",
            "Build strong rapport with tenants, homeowners, and partners",
            "Assist clients throughout the letting and closing process",
            "Maintain organized records of interactions, visits, and client requirements",
            "Coordinate with internal teams to ensure a smooth and efficient client experience",
            "Work towards closing deals to achieve sales targets and earn quarterly bonuses",
        ],
        qualifications: [
            "Excellent verbal communication skills in Bangla and English",
            "Strong interpersonal and social skills; able to confidently guide clients in person",
            "Professional appearance, friendly attitude, and strong people skills",
            "Ability to work effectively in a fast-paced startup environment",
            "Preferred: NSU, BRAC, IBA, or individuals with strong drive and resilience",
            "Self-motivated, energetic, and willing to take full ownership of responsibilities",
        ],
        benefits: ["Quarterly sales bonus on successful deal closures"],
        email: "careers@opendoor.com.bd",
        postedDate: "November 2024",
        note: "May require occasional availability on Fridays (with prior notice)",
    },
];

export const getJobById = (id: string): JobPosition | undefined => {
    return jobPositions.find((job) => job.id === id);
};
