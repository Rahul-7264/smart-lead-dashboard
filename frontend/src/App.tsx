import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/leads";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("Website");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await axios.get(API_URL);
      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add or Update Lead
  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          name,
          email,
          status,
          source,
        });

        setEditingId(null);
      } else {
        await axios.post(API_URL, {
          name,
          email,
          status,
          source,
        });
      }

      setName("");
      setEmail("");
      setStatus("New");
      setSource("Website");

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert("Error adding lead");
    }
  };

  // Delete Lead
  const deleteLead = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Lead
  const editLead = (lead: Lead) => {
    setEditingId(lead._id);
    setName(lead.name);
    setEmail(lead.email);
    setStatus(lead.status);
    setSource(lead.source);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["Name", "Email", "Status", "Source"];

    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "leads.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Dashboard Stats
  const totalLeads = leads.length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "Qualified"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;

  const indexOfFirstLead = indexOfLastLead - leadsPerPage;

  const currentLeads = filteredLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold">Smart Leads Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Export CSV
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div
        className={`p-6 rounded-xl shadow-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="grid md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg text-black"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg text-black"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded-lg text-black"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border p-3 rounded-lg text-black"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <button
            onClick={handleSubmit}
            className={`text-white px-4 py-3 rounded-lg ${
              editingId ? "bg-yellow-500" : "bg-green-600"
            }`}
          >
            {editingId ? "Update Lead" : "Add Lead"}
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div
        className={`p-6 rounded-xl shadow-lg mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg text-black"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-3 rounded-lg text-black"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div
          className={`p-6 rounded-xl shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold">Total Leads</h2>
          <p className="text-5xl mt-4 font-bold">{totalLeads}</p>
        </div>

        <div
          className={`p-6 rounded-xl shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold">Qualified Leads</h2>
          <p className="text-5xl mt-4 font-bold">{qualifiedLeads}</p>
        </div>

        <div
          className={`p-6 rounded-xl shadow-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold">Contacted Leads</h2>
          <p className="text-5xl mt-4 font-bold">{contactedLeads}</p>
        </div>
      </div>

      {/* Table */}
      <div
        className={`rounded-xl shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentLeads.map((lead) => (
              <tr
                key={lead._id}
                className="border-b border-gray-300 hover:bg-gray-100 hover:text-black transition"
              >
                <td className="p-4">{lead._id.slice(-5)}</td>

                <td className="p-4">{lead.name}</td>

                <td className="p-4">{lead.email}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                      lead.status === "New"
                        ? "bg-blue-500"
                        : lead.status === "Contacted"
                        ? "bg-yellow-500"
                        : lead.status === "Qualified"
                        ? "bg-green-600"
                        : "bg-red-500"
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="p-4">{lead.source}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => editLead(lead)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={
            currentPage === totalPages || totalPages === 0
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;