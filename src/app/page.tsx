"use client";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Idle");

  const [formData, setFormData] = useState({
    name: "Gustavo Demo",
    phone: "584125559999",
    message: "Hola! Quiero información.",
  });

  async function simulateMessage() {
    setStatus("Sending...");

    const fakePayload = {
      waId: formData.phone,
      senderName: formData.name,
      text: formData.message,
    };

    try {
      const res = await fetch("/api/receive-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fakePayload),
      });

      if (res.ok) {
        setStatus(`✅ Success! Added note to ${formData.name}`);
      } else {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        setStatus("❌ Error: Check Console (F12)");
      }
    } catch (e) {
      console.error(e);
      setStatus("❌ Network Error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">WhatsApp Simulator</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full p-2 border rounded border-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number (ID)</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 block w-full p-2 border rounded border-gray-300" />
            <p className="text-xs text-gray-500 mt-1">Change this to create a NEW contact.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="mt-1 block w-full p-2 border rounded border-gray-300" rows={3} />
          </div>

          <button onClick={simulateMessage} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition duration-200">
            Send Simulated Message
          </button>
        </div>

        <p className="mt-6 text-center font-bold text-gray-800">{status}</p>
      </div>
    </div>
  );
}
