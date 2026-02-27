// Data for Citizen Satisfaction Dashboard

export type Feedback = {
    id: string;
    name: string;
    time: string;
    district: string;
    rating: number;
    comment: string;
    tags: string[];
    escalated?: boolean;
    category: string;
};

export type Department = {
    id: string;
    name: string;
    rating: number;
};

export type Keyword = {
    label: string;
    change?: number;
};

export const kpis = [
    {
        title: "Average CSAT Score",
        value: "4.2",
        sub: "/ 5.0",
        change: "+3.2%",
        changePositive: true,
        iconStars: 4,
    },
    {
        title: "Total Feedback Entries",
        value: "1,240",
        change: "+12%",
        changePositive: true,
    },
    {
        title: "Resolution Rate",
        value: "88%",
        change: "-0.5%",
        changePositive: false,
    },
];

export const feedbacks: Feedback[] = [
    {
        id: "1",
        name: "Eleanor Rigby",
        time: "2 hours ago",
        district: "District 4",
        rating: 4,
        comment:
            "The new park lighting on Main Street is fantastic. I feel much safer walking home at night now. Thank you for addressing our concerns!",
        tags: ["Public Safety", "Infrastructure"],
        category: "Infrastructure",
    },
    {
        id: "2",
        name: "John Harrison",
        time: "5 hours ago",
        district: "District 2",
        rating: 2,
        comment:
            "Waste collection has been delayed twice this week in our neighborhood. The smell is becoming an issue. Please update on the schedule.",
        tags: ["Waste Mgmt"],
        escalated: true,
        category: "Waste Mgmt",
    },
    {
        id: "3",
        name: "Sarah Jenkins",
        time: "1 day ago",
        district: "District 1",
        rating: 5,
        comment:
            "The online portal for reporting issues is so easy to use now. I reported a pothole and it was fixed within 48 hours. Amazing service!",
        tags: ["Digital Gov", "Infrastructure"],
        category: "Digital Gov",
    },
];

export const departments: Department[] = [
    { id: "pkr", name: "Parks & Recreation", rating: 4.8 },
    { id: "plb", name: "Public Library", rating: 4.6 },
    { id: "cpl", name: "City Planning", rating: 3.9 },
    { id: "trns", name: "Transportation", rating: 3.5 },
];

export const keywords: Keyword[] = [
    { label: "Safety", change: 14 },
    { label: "Potholes" },
    { label: "Parks", change: 8 },
    { label: "Traffic", change: -5 },
    { label: "Collection" },
    { label: "Lighting" },
    { label: "Response Time", change: 12 },
];
