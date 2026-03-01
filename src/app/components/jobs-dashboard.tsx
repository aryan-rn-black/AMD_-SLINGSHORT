import { useState, useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { Screen } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface JobsDashboardProps {
  setActiveScreen: (s: Screen) => void;
}

interface Job {
  id: string;
  company: string;
  logo?: string;
  companyLogo?: string;
  title: string;
  description: string;
  location: string;
  experience?: string;
  salary?: number | string;
  type: string;
  category?: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

const allJobs = [
  {
    id: "1",
    company: "Microsoft",
    logo: "MS",
    title: "Cyber Security Intern",
    description: "Focus on identity management and encryption protocols. Work with Azure Security Center and implement security best practices across enterprise systems.",
    location: "Remote",
    experience: "Entry Level",
    salary: 70,
    type: "Internship",
    category: "Cybersecurity",
  },
  {
    id: "2",
    company: "Google Cloud",
    logo: "GC",
    title: "Cloud Computing Engineer",
    description: "Manage scalable DevOps infrastructure using Kubernetes and Terraform. Design and implement cloud-native solutions for enterprise clients.",
    location: "Mountain View, CA",
    experience: "Mid Level",
    salary: 140,
    type: "Full-time",
    category: "Infrastructure",
  },
  {
    id: "3",
    company: "Amazon Web Services",
    logo: "AWS",
    title: "Senior Backend Developer",
    description: "Build highly scalable microservices architecture. Work with distributed systems, databases, and cloud infrastructure at massive scale.",
    location: "Seattle, WA",
    experience: "Senior Level",
    salary: 175,
    type: "Full-time",
    category: "Software Development",
  },
  {
    id: "4",
    company: "Meta",
    logo: "FB",
    title: "AI Research Scientist",
    description: "Conduct cutting-edge research in machine learning and artificial intelligence. Publish papers and develop novel algorithms for computer vision and NLP.",
    location: "Menlo Park, CA",
    experience: "Senior Level",
    salary: 200,
    type: "Full-time",
    category: "AI & Data",
  },
  {
    id: "5",
    company: "Apple",
    logo: "AP",
    title: "iOS Developer",
    description: "Develop next-generation iOS applications. Work with SwiftUI and create seamless user experiences for millions of users worldwide.",
    location: "Cupertino, CA",
    experience: "Mid Level",
    salary: 150,
    type: "Full-time",
    category: "Software Development",
  },
  {
    id: "6",
    company: "Tesla",
    logo: "TS",
    title: "Embedded Systems Engineer",
    description: "Design and implement embedded software for autonomous driving systems. Work on real-time operating systems and safety-critical applications.",
    location: "Austin, TX",
    experience: "Senior Level",
    salary: 165,
    type: "Full-time",
    category: "Infrastructure",
  },
  {
    id: "7",
    company: "Netflix",
    logo: "NF",
    title: "Data Analyst",
    description: "Analyze user behavior and content performance. Create insights that drive content strategy and improve user engagement.",
    location: "Los Gatos, CA",
    experience: "Mid Level",
    salary: 120,
    type: "Full-time",
    category: "AI & Data",
  },
  {
    id: "8",
    company: "Stripe",
    logo: "ST",
    title: "Security Engineer",
    description: "Protect payment infrastructure and customer data. Implement security measures and conduct penetration testing.",
    location: "Remote",
    experience: "Mid Level",
    salary: 155,
    type: "Full-time",
    category: "Cybersecurity",
  },
  {
    id: "9",
    company: "Salesforce",
    logo: "SF",
    title: "Junior Software Engineer",
    description: "Join our engineering team to build cloud-based CRM solutions. Learn from experienced engineers and contribute to large-scale projects.",
    location: "San Francisco, CA",
    experience: "Entry Level",
    salary: 95,
    type: "Full-time",
    category: "Software Development",
  },
  {
    id: "10",
    company: "IBM",
    logo: "IBM",
    title: "Healthcare IT Consultant",
    description: "Implement healthcare technology solutions. Work with hospitals and medical facilities to optimize their IT infrastructure.",
    location: "Boston, MA",
    experience: "Mid Level",
    salary: 110,
    type: "Full-time",
    category: "Healthcare Administration",
  },
];

const professionCategories = [
  {
    id: "tech-digital",
    name: "Technology & Digital",
    subcategories: [
      "Software Development",
      "AI & Data",
      "Cybersecurity",
      "Infrastructure",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare & Wellness",
    subcategories: [
      "Medical Practitioner",
      "Nursing",
      "Healthcare Administration",
      "Mental Health",
    ],
  },
  {
    id: "commerce",
    name: "Commerce & Finance",
    subcategories: [
      "Financial Analysis",
      "Accounting",
      "Investment Banking",
      "E-commerce",
    ],
  },
  {
    id: "marketing",
    name: "Marketing & Creative",
    subcategories: [
      "Digital Marketing",
      "Content Creation",
      "Graphic Design",
      "Brand Strategy",
    ],
  },
  {
    id: "education",
    name: "Education & HR",
    subcategories: [
      "Teaching",
      "Corporate Training",
      "Talent Acquisition",
      "Learning & Development",
    ],
  },
  {
    id: "industrial",
    name: "Industrial",
    subcategories: [
      "Manufacturing",
      "Supply Chain",
      "Quality Assurance",
      "Operations Management",
    ],
  },
];

export function JobsDashboard({ setActiveScreen }: JobsDashboardProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 250]);
  const [customSalary, setCustomSalary] = useState("");
  const [allJobsData, setAllJobsData] = useState<Job[]>(allJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(allJobs);
  const [loading, setLoading] = useState(true);

  // Load jobs from database on mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/jobs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      
      if (data.success && data.jobs && data.jobs.length > 0) {
        // Transform database jobs to match our interface
        const transformedJobs = data.jobs.map((job: any) => ({
          id: job.id,
          company: job.company,
          logo: job.logo || job.company.substring(0, 2).toUpperCase(),
          companyLogo: job.companyLogo,
          title: job.title,
          description: job.description,
          location: job.location || "Not specified",
          experience: job.experience || "Not specified",
          salary: parseSalary(job.salary),
          type: job.type || "Full-time",
          category: job.category || "Software Development",
        }));
        
        // Combine database jobs with default jobs
        const combinedJobs = [...transformedJobs, ...allJobs];
        setAllJobsData(combinedJobs);
        setFilteredJobs(combinedJobs);
      } else {
        setAllJobsData(allJobs);
        setFilteredJobs(allJobs);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      // Fallback to default jobs if fetch fails
      setAllJobsData(allJobs);
      setFilteredJobs(allJobs);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse salary string to number
  const parseSalary = (salaryStr: string): number => {
    if (!salaryStr) return 0;
    // Extract numbers from salary string like "$80,000 - $100,000" or "$100k"
    const match = salaryStr.match(/\$?(\d+)[,.]?(\d*)/);
    if (match) {
      const num = parseInt(match[1]);
      // If it's already in thousands (e.g., "100k")
      if (salaryStr.toLowerCase().includes('k')) return num;
      // If it's a full number, convert to thousands
      return Math.floor(num / 1000);
    }
    return 0;
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    let filtered = [...allJobsData];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((job) => selectedCategories.includes(job.category || ""));
    }

    // Filter by location
    if (locationSearch.trim()) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Filter by experience level
    if (experienceLevel) {
      const experienceMap: Record<string, string> = {
        entry: "Entry Level",
        mid: "Mid Level",
        senior: "Senior Level",
        executive: "Executive",
      };
      filtered = filtered.filter((job) => job.experience === experienceMap[experienceLevel]);
    }

    // Filter by salary range
    filtered = filtered.filter((job) => {
      const salary = typeof job.salary === 'number' ? job.salary : parseSalary(job.salary);
      return salary >= salaryRange[0] && salary <= salaryRange[1];
    });

    setFilteredJobs(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveScreen("dashboard")}
              className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-700" />
            </button>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900 sm:text-[28px]">
                Jobs
              </h1>
              <p className="text-gray-600 text-[12px] sm:text-[13px]">Find your next career opportunity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-72 xl:w-80 shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-purple-200 shadow-lg p-6 sticky top-24">
              <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900 mb-6">
                Filters
              </h2>

              {/* Profession Category */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-3">
                  PROFESSION CATEGORY
                </h3>
                <Accordion type="multiple" defaultValue={["tech-digital"]} className="w-full">
                  {professionCategories.map((category) => (
                    <AccordionItem 
                      key={category.id} 
                      value={category.id} 
                      className="border-b border-gray-200"
                    >
                      <AccordionTrigger className="text-[13px] text-gray-700 hover:no-underline py-3">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2.5">
                          {category.subcategories.map((sub) => (
                            <div key={sub} className="flex items-center space-x-2.5">
                              <Checkbox
                                id={sub}
                                checked={selectedCategories.includes(sub)}
                                onCheckedChange={() => toggleCategory(sub)}
                                className="border-gray-400"
                              />
                              <label
                                htmlFor={sub}
                                className="text-[12px] text-gray-600 cursor-pointer leading-tight"
                              >
                                {sub}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-3">
                  LOCATION
                </h3>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., Remote, Indore, Not Applicable"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-3">
                  EXPERIENCE LEVEL
                </h3>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">All levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Salary Filter */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-4">
                  SALARY (in thousands)
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-[12px] text-gray-600 mb-3">
                    <span>Min</span>
                    <span>Max</span>
                  </div>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    min={0}
                    max={250}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-[14px] text-purple-600" style={{ fontWeight: 600 }}>
                    <span>${salaryRange[0]}k</span>
                    <span>${salaryRange[1]}k</span>
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder="Custom Salary"
                  value={customSalary}
                  onChange={(e) => setCustomSalary(e.target.value)}
                  className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Apply Filters Button */}
              <button 
                onClick={applyFilters}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white py-3 rounded-lg text-[14px] transition-all shadow-md" 
                style={{ fontWeight: 600 }}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content - Job Postings */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900 mb-1">
                Job Postings (Personalized for you)
              </h2>
              <p className="text-gray-600 text-[14px]">
                Searched Jobs ({filteredJobs.length} results)
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-[16px]">No jobs match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 hover:bg-white hover:border-purple-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-md">
                        <span style={{ fontSize: 20, fontWeight: 700 }} className="text-white">
                          {job.logo}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <p className="text-[14px] text-gray-600">{job.company}</p>
                          </div>
                          <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg text-[14px] transition-all shadow-md" style={{ fontWeight: 600 }}>
                            Apply
                          </button>
                        </div>

                        <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[12px]">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full border border-pink-200">
                            {job.type}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                            {job.experience}
                          </span>
                          <span className="text-green-600" style={{ fontWeight: 600 }}>
                            ${job.salary}k/year
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}