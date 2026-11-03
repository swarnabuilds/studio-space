"use client";

import React, { useState } from "react";
import { 
  Camera, 
  DollarSign, 
  MapPin, 
  Tag, 
  FileText, 
  Image as ImageIcon, 
  PlusCircle, 
  Loader2,
  Users,
  Maximize2,
  Phone,
  Mail,
  CheckSquare,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function AddStudioPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const amenities = formData.getAll("amenities");

    // Form data to Object formatting
    const studioData = {
      name: formData.get("name"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      location: formData.get("location"),
      image: formData.get("image"),
      capacity: Number(formData.get("capacity")),
      areaSize: Number(formData.get("areaSize")),
      rating: formData.get("rating") ? Number(formData.get("rating")) : 5.0,
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
      amenities: amenities,
      description: formData.get("description"),
    };

    try {
      // POST API Call with Headers & Method
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/studio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studioData),
      });

      const data = await res.json();

      if (res.ok && (data.insertedId || data.success)) {
        toast.add({
          title: "Studio Published Successfully! 🎉",
          description: "Your studio listing has been saved to database.",
        });
        form.reset(); // Form clear kora
      } else {
        toast.add({
          title: "Failed to Add Studio",
          description: data.message || "Something went wrong while saving.",
        });
      }
    } catch (err) {
      console.error("API POST Error:", err);
      toast.add({
        title: "Network Error",
        description: "Could not connect to the backend server (http://localhost:5000).",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/40">
            <PlusCircle className="h-5 w-5" />
          </div>
          Add New Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Provide complete specifications and details for your creative space.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400 uppercase border-b border-slate-800/60 pb-2">
            1. Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Studio Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-purple-400" /> Studio Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Neon Vibe Audio Stage"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple-400" /> Category
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              >
                <option value="" disabled>Select studio type</option>
                <option value="photography">Photography Studio</option>
                <option value="filmmaking">Film & Video Stage</option>
                <option value="podcasting">Podcast Booth</option>
                <option value="music">Music & Sound Studio</option>
                <option value="workshop">Workshop & Classroom</option>
                <option value="dance">Dance & Rehearsal</option>
              </select>
            </div>

            {/* Price Per Hour */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-purple-400" /> Hourly Rate ($)
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                placeholder="e.g. 75"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-purple-400" /> Location / Address
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Banani Road 11, Dhaka"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Studio Specifications & Media */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400 uppercase border-b border-slate-800/60 pb-2">
            2. Space Specifications & Media
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-purple-400" /> Max Capacity
              </label>
              <input
                type="number"
                name="capacity"
                required
                placeholder="e.g. 15"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Area Size */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-purple-400" /> Area Size (Sq Ft)
              </label>
              <input
                type="number"
                name="areaSize"
                placeholder="e.g. 1200"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Initial Rating */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-purple-400" /> Initial Rating
              </label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="1"
                max="5"
                placeholder="e.g. 4.9"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

          </div>

          {/* Image URL */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-purple-400" /> Main Image Cover URL
            </label>
            <input
              type="url"
              name="image"
              required
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

        {/* Section 3: Amenities & Gear */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400 uppercase border-b border-slate-800/60 pb-2 flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4" /> 3. Available Amenities & Equipment
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {[
              "High-Speed Wi-Fi",
              "Soundproofing",
              "Professional Lighting",
              "Air Conditioning",
              "Green Screen / Cyclorama",
              "Podcast Microphones",
              "Dressing / Makeup Room",
              "Free Parking Onsite",
              "4K Camera Gear",
              "Control Room Setup",
              "Audio Mixing Console",
              "Refreshments & Coffee"
            ].map((item) => (
              <label key={item} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="amenities"
                  value={item}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500/40 h-4 w-4"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Contact & Description */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-purple-400 uppercase border-b border-slate-800/60 pb-2">
            4. Host Contact & Description
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-purple-400" /> Host Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                required
                placeholder="swarnasutradhar89@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-purple-400" /> Host Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="contactPhone"
                required
                placeholder="+880 1700-000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-400" /> Studio Description & Rules
            </label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder="Describe acoustics, gear specs, house rules, booking guidelines..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" /> Publish Studio Listing
              </>
            )}
          </Button>
        </div>

      </form>

    </div>
  );
}