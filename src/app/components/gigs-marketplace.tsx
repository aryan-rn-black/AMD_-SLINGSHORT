import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import type { Screen } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface GigsMarketplaceProps {
  setActiveScreen: (s: Screen) => void;
}

interface Gig {
  id: string;
  title: string;
  employer: string;
  employerAvatar: string;
  location: string;
  salary: number;
  salaryDisplay: string;
  type: string;
  description: string;
  postedTime: string;
  tags: string[];
  applicants: number;
  category: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

const filterCategories = [
  {
    id: "retail-sales",
    name: "Retail & Sales",
    subcategories: [
      "Sales Associate",
      "Cashier",
      "Stock Clerk",
      "Visual Merchandiser",
      "Retail Worker",
      "Store Supervisor",
    ],
  },
  {
    id: "restaurant-hospitality",
    name: "Restaurant & Hospitality",
    subcategories: [
      "Server",
      "Bartender",
      "Barista",
    ],
    additionalText: "Busser, Host/Hostess, Food Runner, Banquet Server, Cafe Manager, etc.",
  },
  {
    id: "delivery-logistics",
    name: "Delivery & Logistics",
    subcategories: [
      "Delivery Driver (Bike/Car)",
      "Warehouse Associate",
      "Forklift Operator",
      "Courier",
      "Logistics Coordinator",
      "Fleet Manager",
      "Package Handler",
    ],
  },
  {
    id: "general-service",
    name: "General Service & Support",
    subcategories: [
      "Customer Service Representative",
      "Administrative Assistant",
      "Janitor / Custodian",
      "Maintenance Technician",
      "Security Guard",
      "Data Entry Clerk",
      "Receptionist",
    ],
  },
  {
    id: "food-service",
    name: "Food Service Production",
    subcategories: [
      "Line Cook",
      "Prep Cook",
      "Baker",
      "Kitchen Helper",
      "Food Assembler (Packaging)",
      "Butcher",
      "Pastry Chef",
    ],
  },
];

export function GigsMarketplace({ setActiveScreen }: GigsMarketplaceProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 50]);
  const [customSalary, setCustomSalary] = useState("");
  const [allGigsData, setAllGigsData] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  // Load gigs from database on mount
  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async () => {
    try {
      const response = await fetch(`${API_BASE}/gigs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      
      if (data.success && data.gigs && data.gigs.length > 0) {
        // Transform database gigs to match our interface
        const transformedGigs = data.gigs.map((gig: any) => ({
          id: gig.id,
          title: gig.title,
          employer: gig.employer,
          employerAvatar: gig.employerAvatar || "",
          location: gig.location || "Not specified",
          salary: parseSalaryToNumber(gig.salary),
          salaryDisplay: gig.salary || "Negotiable",
          type: gig.type || "One-time",
          description: gig.description,
          postedTime: gig.postedTime || "Just posted",
          tags: Array.isArray(gig.tags) ? gig.tags : [],
          applicants: gig.applicants || 0,
          category: gig.category || "General Service & Support",
        }));
        
        setAllGigsData(transformedGigs);
        setFilteredGigs(transformedGigs);
      } else {
        setAllGigsData([]);
        setFilteredGigs([]);
      }
    } catch (error) {
      console.error("Error loading gigs:", error);
      setAllGigsData([]);
      setFilteredGigs([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse salary string to number
  const parseSalaryToNumber = (salaryStr: string): number => {
    if (!salaryStr) return 0;
    // Extract numbers from salary string like "₹500/hour" or "₹12,000-15,000/month"
    const match = salaryStr.match(/₹?(\d+)[,.]?(\d*)/);
    if (match) {
      const num = parseInt(match[1]);
      // Convert to thousands for consistency
      if (salaryStr.includes('/hour')) return Math.floor(num / 100); // rough conversion
      if (salaryStr.includes('/month')) return Math.floor(num / 1000);
      if (salaryStr.includes('/day')) return Math.floor(num / 30);
      return num;
    }
    return 0;
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    let filtered = [...allGigsData];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((gig) => selectedCategories.includes(gig.category));
    }

    // Filter by location
    if (locationSearch.trim()) {
      filtered = filtered.filter((gig) =>
        gig.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Filter by salary range (in thousands)
    filtered = filtered.filter((gig) => gig.salary >= salaryRange[0] && gig.salary <= salaryRange[1]);

    setFilteredGigs(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Custom Header for Gigs Page */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen("marketplace")}
              className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-700" />
            </button>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700 }} className="text-gray-900">Available Gigs & Jobs</h1>
              <p className="text-gray-600 text-[13px] mt-1">Find local opportunities in your area</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 xl:w-80 shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-purple-200 shadow-lg p-4 sm:p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900 mb-6">
                Filter
              </h2>

              {/* Category Section */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-3">
                  CATEGORY
                </h3>
                <Accordion type="multiple" defaultValue={["retail-sales", "restaurant-hospitality"]} className="w-full">
                  {filterCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border-b border-gray-200">
                      <AccordionTrigger className="text-[13px] text-gray-700 hover:no-underline py-3">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <div className="space-y-2.5">
                          {category.subcategories.map((sub) => (
                            <div key={sub} className="flex items-center space-x-2">
                              <Checkbox
                                id={sub}
                                checked={selectedCategories.includes(sub)}
                                onCheckedChange={() => toggleCategory(sub)}
                              />
                              <label
                                htmlFor={sub}
                                className="text-[12px] text-gray-600 cursor-pointer leading-tight"
                              >
                                {sub}
                              </label>
                            </div>
                          ))}
                          {category.additionalText && (
                            <p className="text-[11px] text-gray-500 italic mt-3 leading-relaxed">
                              {category.additionalText}
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Location Section */}
              <div className="mb-6">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-3">
                  LOCATION
                </h3>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter location"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-9 bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Salary Expectation Section */}
              <div className="mb-4">
                <h3 style={{ fontSize: 14, fontWeight: 600 }} className="text-gray-700 mb-4">
                  SALARY EXPECTATION (in thousands)
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-[12px] text-gray-600 mb-2">
                    <span>Min</span>
                    <span>Max</span>
                  </div>
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    min={0}
                    max={50}
                    step={1}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-[13px] text-purple-700" style={{ fontWeight: 600 }}>
                    <span>₹{salaryRange[0]}k</span>
                    <span>₹{salaryRange[1]}k</span>
                  </div>
                </div>
                <Input
                  type="text"
                  placeholder="Custom"
                  value={customSalary}
                  onChange={(e) => setCustomSalary(e.target.value)}
                  className="bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Action Button */}
              <button 
                onClick={applyFilters}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white py-3 rounded-lg text-[14px] transition-all shadow-md mt-4" 
                style={{ fontWeight: 600 }}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content - Gig Cards */}
          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900 mb-1">
                Available Gigs
              </h2>
              <p className="text-gray-600 text-[14px]">
                Local opportunities ({filteredGigs.length} results)
              </p>
            </div>

            {filteredGigs.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-[16px]">No gigs match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGigs.map((gig) => (
                  <div
                    key={gig.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-5 hover:bg-white hover:shadow-xl transition-all border border-purple-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }} className="text-gray-900">
                          {gig.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-[10px] text-white" style={{ fontWeight: 600 }}>
                            {gig.employer[0]}
                          </div>
                          <span className="text-[13px] text-gray-500">{gig.employer}</span>
                        </div>
                      </div>
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200"
                        style={{ fontWeight: 500 }}
                      >
                        {gig.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-[12px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {gig.location}
                      </span>
                      <span className="text-green-600" style={{ fontWeight: 600 }}>
                        {gig.salaryDisplay}
                      </span>
                      <span className="text-gray-400">{gig.postedTime}</span>
                    </div>

                    <p className="text-[13px] text-gray-600 mb-3 leading-relaxed">{gig.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {gig.tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{gig.applicants} applicants</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg text-[12px] hover:bg-purple-50 transition-colors" style={{ fontWeight: 500 }}>
                          Contact
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg text-[12px] transition-colors shadow-sm" style={{ fontWeight: 600 }}>
                          Apply Now
                        </button>
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