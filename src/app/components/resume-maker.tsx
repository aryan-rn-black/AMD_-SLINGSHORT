import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Plus, Trash2, Save, Eye, Edit3, Sparkles } from "lucide-react";
import type { Screen } from "./types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface ResumeMakerProps {
  setActiveScreen: (screen: Screen) => void;
  userId: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

const emptyResume: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

export function ResumeMaker({ setActiveScreen, userId }: ResumeMakerProps) {
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/resume/${userId}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      
      // Handle 404 gracefully - user doesn't have a resume yet
      if (response.status === 404) {
        console.log("No existing resume found, starting with empty template");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resume fetch HTTP error:", response.status, errorText);
        // Don't throw - let user create a new resume
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      // If resume exists, load it; otherwise use empty resume
      if (data.success && data.resume) {
        setResume(data.resume);
      } else {
        // Resume doesn't exist yet - that's ok, user will create one
        console.log("No existing resume found, starting with empty template");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      // Even if fetch fails, we can still let user create a resume
      // Don't show error to user - just log it
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/resume/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(resume),
      });
      const data = await response.json();
      if (data.success) {
        alert("Resume saved successfully!");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResume({
        ...resume,
        skills: [...resume.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index),
    });
  };

  const addCertification = () => {
    setResume({
      ...resume,
      certifications: [
        ...resume.certifications,
        {
          id: Date.now().toString(),
          name: "",
          issuer: "",
          date: "",
        },
      ],
    });
  };

  const removeCertification = (id: string) => {
    setResume({
      ...resume,
      certifications: resume.certifications.filter((cert) => cert.id !== id),
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResume({
      ...resume,
      certifications: resume.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a description for your resume");
      return;
    }

    setAiGenerating(true);
    try {
      const response = await fetch(`${API_BASE}/resume/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          userInfo: resume.personalInfo,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI generation HTTP error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.success && data.resumeData) {
        setResume(data.resumeData);
        setShowAIDialog(false);
        setAiPrompt("");
        alert("Resume generated successfully! Review and edit as needed.");
      } else {
        alert(data.error || "Failed to generate resume. Please try again.");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Failed to generate resume. Please check your connection and try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Generation Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900">
                Generate Resume with AI
              </h2>
            </div>
            <p className="text-[14px] text-gray-600 mb-4">
              Describe your professional background, skills, and experience. Our AI will generate a complete resume for you!
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              placeholder="Example: I'm a software engineer with 5 years of experience in React and Node.js. I've worked at tech startups building web applications. I have a Bachelor's degree in Computer Science from Stanford University. My skills include JavaScript, TypeScript, React, Node.js, MongoDB, and AWS..."
              disabled={aiGenerating}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAIDialog(false);
                  setAiPrompt("");
                }}
                disabled={aiGenerating}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-[14px] disabled:opacity-50"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={generateWithAI}
                disabled={aiGenerating || !aiPrompt.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-[14px] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                {aiGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Resume
                  </>
                )}
              </button>
            </div>
            <p className="text-[12px] text-gray-500 mt-3 text-center">
              💡 Tip: Be specific about your roles, achievements, and technologies used for better results
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveScreen("dashboard")}
                className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700 }} className="text-gray-900">
                  Resume Maker
                </h1>
                <p className="text-[13px] text-gray-500">Create your professional resume</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAIDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  AI Generate
                </span>
              </button>
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  {isPreview ? "Edit" : "Preview"}
                </span>
              </button>
              <button
                onClick={saveResume}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  {saving ? "Saving..." : "Save"}
                </span>
              </button>
              <button
                onClick={downloadResume}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  Download PDF
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {!isPreview ? (
          // Edit Mode
          <div className="space-y-6">
            {/* Personal Info */}
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={resume.personalInfo.fullName}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, fullName: e.target.value },
                    })
                  }
                  placeholder="John Doe"
                />
                <Input
                  label="Email"
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, email: e.target.value },
                    })
                  }
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone"
                  value={resume.personalInfo.phone}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, phone: e.target.value },
                    })
                  }
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  label="Location"
                  value={resume.personalInfo.location}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, location: e.target.value },
                    })
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="mt-4">
                <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                  Professional Summary
                </label>
                <textarea
                  value={resume.personalInfo.summary}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, summary: e.target.value },
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief summary of your professional background and career goals..."
                />
              </div>
            </Section>

            {/* Experience */}
            <Section
              title="Work Experience"
              action={
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[14px] text-gray-700" style={{ fontWeight: 600 }}>
                        Experience Entry
                      </h4>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        placeholder="Company Name"
                      />
                      <Input
                        label="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        placeholder="Job Title"
                      />
                      <Input
                        label="Start Date"
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                      <Input
                        label="End Date"
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-[13px] text-gray-700">
                        I currently work here
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))}
                {resume.experience.length === 0 && (
                  <p className="text-[13px] text-gray-500 text-center py-4">
                    No work experience added yet. Click "Add" to get started.
                  </p>
                )}
              </div>
            </Section>

            {/* Education */}
            <Section
              title="Education"
              action={
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[14px] text-gray-700" style={{ fontWeight: 600 }}>
                        Education Entry
                      </h4>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University Name"
                      />
                      <Input
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                      <Input
                        label="Field of Study"
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                        placeholder="Computer Science"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Start"
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        />
                        <Input
                          label="End"
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                        Additional Details
                      </label>
                      <textarea
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="GPA, honors, relevant coursework..."
                      />
                    </div>
                  </div>
                ))}
                {resume.education.length === 0 && (
                  <p className="text-[13px] text-gray-500 text-center py-4">
                    No education added yet. Click "Add" to get started.
                  </p>
                )}
              </div>
            </Section>

            {/* Skills */}
            <Section title="Skills">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a skill (e.g., React, TypeScript)"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-[14px]"
                    style={{ fontWeight: 600 }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg"
                    >
                      <span className="text-[13px]" style={{ fontWeight: 500 }}>
                        {skill}
                      </span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="hover:text-purple-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {resume.skills.length === 0 && (
                  <p className="text-[13px] text-gray-500 text-center py-2">
                    No skills added yet.
                  </p>
                )}
              </div>
            </Section>

            {/* Certifications */}
            <Section
              title="Certifications"
              action={
                <button
                  onClick={addCertification}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-[13px]"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[14px] text-gray-700" style={{ fontWeight: 600 }}>
                        Certification
                      </h4>
                      <button
                        onClick={() => removeCertification(cert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        label="Certification Name"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder="AWS Certified Developer"
                      />
                      <Input
                        label="Issuing Organization"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                      />
                      <Input
                        label="Date Obtained"
                        type="month"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                {resume.certifications.length === 0 && (
                  <p className="text-[13px] text-gray-500 text-center py-4">
                    No certifications added yet. Click "Add" to get started.
                  </p>
                )}
              </div>
            </Section>
          </div>
        ) : (
          // Preview Mode
          <div
            ref={printRef}
            className="bg-white shadow-lg rounded-lg p-12 max-w-4xl mx-auto print:shadow-none print:rounded-none"
          >
            <ResumePreview resume={resume} />
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[13px] text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function ResumePreview({ resume }: { resume: ResumeData }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-6">
        <h1 style={{ fontSize: 32, fontWeight: 700 }} className="text-gray-900 mb-2">
          {resume.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[14px] text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>•</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>•</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.personalInfo.summary && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-2">
            Professional Summary
          </h2>
          <p className="text-[14px] text-gray-700 leading-relaxed">
            {resume.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-[14px] text-gray-700">{exp.company}</p>
                  </div>
                  <p className="text-[13px] text-gray-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-[14px] text-gray-600 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-[14px] text-gray-700">{edu.institution}</p>
                  </div>
                  <p className="text-[13px] text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                {edu.description && (
                  <p className="text-[14px] text-gray-600 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-[13px]"
                style={{ fontWeight: 500 }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }} className="text-gray-900 mb-3">
            Certifications
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }} className="text-gray-900">
                    {cert.name}
                  </h3>
                  <p className="text-[14px] text-gray-600">{cert.issuer}</p>
                </div>
                <p className="text-[13px] text-gray-600">{cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}