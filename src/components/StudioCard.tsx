import React from "react";
import Link from "next/link";
import { MapPin, Users, DollarSign, Star, Trash2, Edit3, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudioCardProps {
  studio: {
    _id: string;
    name: string;
    category: string;
    price: number;
    location: string;
    image: string;
    capacity: number;
    rating?: number;
  };
  onDelete?: (id: string) => void; // Delete action handler
}

export default function StudioCard({ studio, onDelete }: StudioCardProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/50 transition-all group flex flex-col justify-between">
      <div>
        {/* Studio Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={studio.image || "https://images.unsplash.com/photo-..."}
            alt={studio.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {studio.category}
          </span>
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{studio.rating || "5.0"}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {studio.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span className="line-clamp-1">{studio.location}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              <span>Max Capacity: {studio.capacity} People</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="p-5 pt-0 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Rate</span>
          <span className="text-lg font-bold text-white flex items-center">
            <DollarSign className="h-4 w-4 text-purple-400" />
            {studio.price} <span className="text-xs text-slate-400 font-normal ml-1">/ hour</span>
          </span>
        </div>

        {/* Action Buttons Container (Details, Edit, Delete ekti row-te) */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80">
          
          {/* View Details */}
          <Link href={`/studios/${studio._id}`} className="col-span-1">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2 px-1 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-1">
              <Eye className="h-3.5 w-3.5" /> Details
            </Button>
          </Link>

          {/* Edit Studio */}
          <Link href={`/edit-studio/${studio._id}`} className="col-span-1">
            <Button variant="outline" className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-xs py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1">
              <Edit3 className="h-3.5 w-3.5 text-purple-400" /> Edit
            </Button>
          </Link>

          {/* Delete Studio Button */}
          {onDelete ? (
            <Button
              onClick={() => onDelete(studio._id)}
              variant="outline"
              className="w-full border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          ) : (
            <div className="col-span-1"></div> // Jodi onDelete prop na thake tahole space maintain korbe
          )}

        </div>
      </div>
    </div>
  );
}