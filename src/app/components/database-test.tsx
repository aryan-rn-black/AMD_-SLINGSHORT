import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RefreshCw, Database, Server, Lock } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface ConnectionTest {
  name: string;
  status: "pending" | "success" | "error";
  message: string;
  duration?: number;
}

export function DatabaseTest({ onClose }: { onClose: () => void }) {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: "Server Health Check", status: "pending", message: "Testing..." },
    { name: "Database Connection", status: "pending", message: "Testing..." },
    { name: "Posts API", status: "pending", message: "Testing..." },
    { name: "Jobs API", status: "pending", message: "Testing..." },
    { name: "Gigs API", status: "pending", message: "Testing..." },
    { name: "Resume API", status: "pending", message: "Testing..." },
  ]);
  const [testing, setTesting] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cfc924af`;

  const runTests = async () => {
    setTesting(true);
    const newTests = [...tests];

    // Test 1: Health Check
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/health`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      newTests[0] = {
        name: "Server Health Check",
        status: data.status === "ok" ? "success" : "error",
        message: data.status === "ok" ? `Server is running (${duration}ms)` : "Server not responding",
        duration,
      };
    } catch (error) {
      newTests[0] = {
        name: "Server Health Check",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    // Test 2: Database Connection (Stats endpoint)
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      newTests[1] = {
        name: "Database Connection",
        status: data.success ? "success" : "error",
        message: data.success
          ? `Database connected (${duration}ms) - ${data.stats.totalPosts} posts found`
          : "Database connection failed",
        duration,
      };
    } catch (error) {
      newTests[1] = {
        name: "Database Connection",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    // Test 3: Posts API
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/posts/professional`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      newTests[2] = {
        name: "Posts API",
        status: data.success ? "success" : "error",
        message: data.success
          ? `Working (${duration}ms) - ${data.posts?.length || 0} professional posts`
          : "Posts API error",
        duration,
      };
    } catch (error) {
      newTests[2] = {
        name: "Posts API",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    // Test 4: Jobs API
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/jobs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      newTests[3] = {
        name: "Jobs API",
        status: data.success ? "success" : "error",
        message: data.success
          ? `Working (${duration}ms) - ${data.jobs?.length || 0} jobs`
          : "Jobs API error",
        duration,
      };
    } catch (error) {
      newTests[3] = {
        name: "Jobs API",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    // Test 5: Gigs API
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/gigs`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      newTests[4] = {
        name: "Gigs API",
        status: data.success ? "success" : "error",
        message: data.success
          ? `Working (${duration}ms) - ${data.gigs?.length || 0} gigs`
          : "Gigs API error",
        duration,
      };
    } catch (error) {
      newTests[4] = {
        name: "Gigs API",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    // Test 6: Resume API
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE}/resume/demo-user-001`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const duration = Date.now() - start;
      const data = await response.json();
      
      // 404 is ok for resume (means no resume yet)
      newTests[5] = {
        name: "Resume API",
        status: response.status === 404 || data.success ? "success" : "error",
        message:
          response.status === 404
            ? `Working (${duration}ms) - No resume found (expected)`
            : data.success
            ? `Working (${duration}ms) - Resume found`
            : "Resume API error",
        duration,
      };
    } catch (error) {
      newTests[5] = {
        name: "Resume API",
        status: "error",
        message: `Failed: ${error}`,
      };
    }
    setTests([...newTests]);

    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const allPassed = tests.every((test) => test.status === "success");
  const anyFailed = tests.some((test) => test.status === "error");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }} className="text-gray-900">
                  Database Connection Test
                </h2>
                <p className="text-[13px] text-gray-500">
                  Testing all backend API endpoints
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="text-gray-500 text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Connection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Server className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-[14px] text-blue-900" style={{ fontWeight: 600 }}>
                  API Endpoint
                </p>
                <p className="text-[13px] text-blue-700 font-mono mt-1 break-all">
                  {API_BASE}
                </p>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all ${
                  test.status === "success"
                    ? "bg-green-50 border-green-200"
                    : test.status === "error"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {test.status === "pending" && (
                    <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mt-0.5" />
                  )}
                  {test.status === "success" && (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  {test.status === "error" && (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-[15px] ${
                        test.status === "success"
                          ? "text-green-900"
                          : test.status === "error"
                          ? "text-red-900"
                          : "text-gray-700"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {test.name}
                    </p>
                    <p
                      className={`text-[13px] mt-1 ${
                        test.status === "success"
                          ? "text-green-700"
                          : test.status === "error"
                          ? "text-red-700"
                          : "text-gray-600"
                      }`}
                    >
                      {test.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {!testing && (
            <div
              className={`border-t pt-4 ${
                allPassed
                  ? "border-green-200"
                  : anyFailed
                  ? "border-red-200"
                  : "border-gray-200"
              }`}
            >
              <div
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  allPassed
                    ? "bg-green-50"
                    : anyFailed
                    ? "bg-red-50"
                    : "bg-gray-50"
                }`}
              >
                {allPassed ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : anyFailed ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <RefreshCw className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p
                    className={`text-[15px] ${
                      allPassed ? "text-green-900" : anyFailed ? "text-red-900" : "text-gray-700"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {allPassed
                      ? "✓ All systems operational"
                      : anyFailed
                      ? "⚠ Some tests failed"
                      : "Testing in progress..."}
                  </p>
                  <p
                    className={`text-[13px] mt-1 ${
                      allPassed ? "text-green-700" : anyFailed ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    {allPassed
                      ? "Your In-Folio backend is connected and working perfectly!"
                      : anyFailed
                      ? "Some endpoints are not responding correctly. Check the details above."
                      : "Please wait while we verify your database connection..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={runTests}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
              <span className="text-[14px]" style={{ fontWeight: 600 }}>
                Run Tests Again
              </span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-[14px]"
              style={{ fontWeight: 600 }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
