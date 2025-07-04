import {
  EditIcon,
  EyeIcon,
  FilterIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { AppraisalForm } from "./AppraisalForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ElementCrewAppraisals = (): JSX.Element => {
  const [selectedCrewMember, setSelectedCrewMember] = useState<any>(null);
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const handleEditClick = (crewMember: any) => {
    setSelectedCrewMember(crewMember);
    setShowAppraisalForm(true);
  };

  const handleCloseForm = () => {
    setShowAppraisalForm(false);
    setSelectedCrewMember(null);
  };

  // Crew data for the table
  const crewData = [
    {
      id: "2025-05-14",
      name: { first: "James", middle: "Michael", last: "" },
      rank: "Master",
      nationality: "British",
      vessel: "MT Sail One",
      vesselType: "Oil Tanker",
      signOn: "01-Feb-2025",
      appraisalType: "End of Contract",
      appraisalDate: "06-Jun-2025",
      competenceRating: { value: "4.9", color: "bg-[#286e34] text-white" },
      behavioralRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      overallRating: { value: "4.7", color: "bg-[#286e34] text-white" },
    },
    {
      id: "2025-03-12",
      name: { first: "Anna", middle: "Marie", last: "Johnson" },
      rank: "Chief Engineer",
      nationality: "British",
      vessel: "MT Sail Ten",
      vesselType: "LPG Tanker",
      signOn: "01-Jan-2025",
      appraisalType: "Mid Term",
      appraisalDate: "07-May-2025",
      competenceRating: { value: "3.5", color: "bg-[#814c02] text-white" },
      behavioralRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      overallRating: { value: "4", color: "bg-[#286e34] text-white" },
    },
    {
      id: "2025-02-12",
      name: { first: "David", middle: "Lee", last: "Brown" },
      rank: "Able Seaman",
      nationality: "Indian",
      vessel: "MT Sail Two",
      vesselType: "Container",
      signOn: "01-Feb-2025",
      appraisalType: "Special",
      appraisalDate: "06-Jun-2025",
      competenceRating: { value: "2.5", color: "bg-[#811f1a] text-white" },
      behavioralRating: { value: "3.5", color: "bg-[#814c02] text-white" },
      overallRating: { value: "3", color: "bg-[#814c02] text-white" },
    },
    {
      id: "2025-05-14",
      name: { first: "Emily", middle: "Grace", last: "Davis" },
      rank: "Chief Mate",
      nationality: "Indian",
      vessel: "MT Sail Five",
      vesselType: "Bulk",
      signOn: "01-Jan-2025",
      appraisalType: "Probation",
      appraisalDate: "07-May-2025",
      competenceRating: { value: "3.5", color: "bg-[#814c02] text-white" },
      behavioralRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      overallRating: { value: "4", color: "bg-[#286e34] text-white" },
    },
    {
      id: "2025-03-12",
      name: { first: "John", middle: "Paul", last: "Williams" },
      rank: "Electrician",
      nationality: "Indian",
      vessel: "MT Sail Eight",
      vesselType: "Bulk",
      signOn: "01-Feb-2025",
      appraisalType: "Appraiser S/Off",
      appraisalDate: "06-Jun-2025",
      competenceRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      behavioralRating: { value: "2.5", color: "bg-[#811f1a] text-white" },
      overallRating: { value: "3.1", color: "bg-[#814c02] text-white" },
    },
    {
      id: "2025-02-12",
      name: { first: "Sophia", middle: "Rose", last: "Clark" },
      rank: "Second Officer",
      nationality: "Philippines",
      vessel: "MT Sail Three",
      vesselType: "Oil Tanker",
      signOn: "01-Jan-2025",
      appraisalType: "End of Contract",
      appraisalDate: "07-May-2025",
      competenceRating: { value: "1.2", color: "bg-[#811f1a] text-white" },
      behavioralRating: { value: "2", color: "bg-[#811f1a] text-white" },
      overallRating: { value: "1.7", color: "bg-[#811f1a] text-white" },
    },
    {
      id: "2025-05-14",
      name: { first: "Liam", middle: "James", last: "" },
      rank: "Bosun",
      nationality: "Philippines",
      vessel: "MT Sail Eleven",
      vesselType: "Oil Tanker",
      signOn: "01-Feb-2025",
      appraisalType: "Mid Term",
      appraisalDate: "06-Jun-2025",
      competenceRating: { value: "2.5", color: "bg-[#811f1a] text-white" },
      behavioralRating: { value: "3.5", color: "bg-[#814c02] text-white" },
      overallRating: { value: "3", color: "bg-[#814c02] text-white" },
    },
    {
      id: "2025-03-12",
      name: { first: "Olivia", middle: "Mae", last: "Walker" },
      rank: "Third Engineer",
      nationality: "Philippines",
      vessel: "MT Sail Four",
      vesselType: "Bulk",
      signOn: "01-Jan-2025",
      appraisalType: "Special",
      appraisalDate: "07-May-2025",
      competenceRating: { value: "3.5", color: "bg-[#814c02] text-white" },
      behavioralRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      overallRating: { value: "4.1", color: "bg-[#286e34] text-white" },
    },
    {
      id: "2025-02-12",
      name: { first: "Noah", middle: "Alexander", last: "" },
      rank: "Cook",
      nationality: "Philippines",
      vessel: "MV Sail Seven",
      vesselType: "Bulk",
      signOn: "01-Feb-2025",
      appraisalType: "Probation",
      appraisalDate: "06-Jun-2025",
      competenceRating: { value: "4.5", color: "bg-[#286e34] text-white" },
      behavioralRating: { value: "2.5", color: "bg-[#811f1a] text-white" },
      overallRating: { value: "3.1", color: "bg-[#814c02] text-white" },
    },
    {
      id: "2025-02-12",
      name: { first: "Mia", middle: "Lily", last: "Scott" },
      rank: "Steward",
      nationality: "Philippines",
      vessel: "MT Sail Thirteen",
      vesselType: "Oil Tanker",
      signOn: "01-Jan-2025",
      appraisalType: "Appraiser S/Off",
      appraisalDate: "07-May-2025",
      competenceRating: { value: "1.2", color: "bg-[#811f1a] text-white" },
      behavioralRating: { value: "2.6", color: "bg-[#811f1a] text-white" },
      overallRating: { value: "2", color: "bg-[#811f1a] text-white" },
    },
  ];

  // Rating badge component
  const RatingBadge = ({ value, color }: { value: string; color: string }) => (
    <Badge className={`rounded-md px-2.5 py-1 font-bold ${color}`}>
      {value}
    </Badge>
  );

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="overflow-hidden bg-[url(/figmaAssets/vector.svg)] bg-[100%_100%] w-[1440px] h-[900px] relative">
        {/* Header */}
        <header className="w-full h-[67px] bg-[#E8E8E8] border-b-2 border-[#5DADE2]">
          <div className="flex items-center h-full">
            {/* Logo */}
            <div className="flex items-center ml-4">
              <img
                className="w-14 h-10"
                alt="Logo"
                src="/figmaAssets/group-2.png"
              />
            </div>

            {/* Navigation Menu */}
            <nav className="flex ml-8">
              {/* Crewing Section */}
              <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#E8E8E8] border-r border-gray-300">
                <div className="w-6 h-6 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" fill="#6B7280"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" fill="#6B7280"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" fill="#6B7280"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" fill="#6B7280"/>
                  </svg>
                </div>
                <div className="text-[#4f5863] text-[10px] font-normal font-['Mulish',Helvetica]">
                  Crewing
                </div>
              </div>

              {/* Appraisals Section (Active) */}
              <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#5DADE2] border-r border-gray-300">
                <div className="w-6 h-6 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="white"/>
                    <path d="M14 2V8H20" fill="white"/>
                    <path d="M16 11H8V13H16V11Z" fill="#5DADE2"/>
                    <path d="M16 15H8V17H16V15Z" fill="#5DADE2"/>
                  </svg>
                </div>
                <div className="text-white text-[10px] font-normal font-['Roboto',Helvetica]">
                  Appraisals
                </div>
              </div>

              {/* Admin Section */}
              <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#E8E8E8]">
                <div className="w-6 h-6 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L15.09 8.26L23 9L17 14.74L18.18 22.02L12 19L5.82 22.02L7 14.74L1 9L8.91 8.26L12 1Z" fill="#6B7280"/>
                  </svg>
                </div>
                <div className="text-[#4f5863] text-[10px] font-normal font-['Mulish',Helvetica]">
                  Admin
                </div>
              </div>
            </nav>

            {/* User Profile */}
            <div className="absolute top-2.5 right-[38px]">
              <img
                className="w-[38px] h-[37px]"
                alt="User"
                src="/figmaAssets/group-3.png"
              />
            </div>
          </div>
        </header>

        {/* Left sidebar */}
        <aside className="w-[67px] absolute left-0 top-[66px] h-[calc(100vh-66px)]">
          {/* Light blue section with icon and "All" text */}
          <div className="w-full h-[79px] flex flex-col items-center justify-center bg-[#52baf3]">
            <div className="w-6 h-6 mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                <path d="M19 15L19.74 17.74L22 18L19.74 18.26L19 21L18.26 18.26L16 18L18.26 17.74L19 15Z" fill="white"/>
                <path d="M5 6L5.5 7.5L7 8L5.5 8.5L5 10L4.5 8.5L3 8L4.5 7.5L5 6Z" fill="white"/>
              </svg>
            </div>
            <div className="text-white text-[10px] font-normal font-['Roboto',Helvetica]">
              All
            </div>
          </div>
          
          {/* Dark blue section */}
          <div className="w-full h-[calc(100%-79px)] bg-[#16569e]">
          </div>
        </aside>

        {/* Main content */}
        <main className="absolute top-[67px] left-[67px] w-[calc(100%-67px)] h-[calc(100%-67px)]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-['Mulish',Helvetica] font-bold text-black text-[22px]">
                Crew Appraisals
              </h1>
              <Button
                variant="outline"
                className="h-10 border-[#e1e8ed] text-[#16569e] flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="flex gap-2 mb-6">
              <div className="relative w-[298px]">
                <Input
                  className="h-8 pl-10 text-[#8798ad] text-xs"
                  placeholder="SearchIcon Name"
                />
                <SearchIcon className="w-4 h-4 absolute left-3 top-2 text-[#8798ad]" />
              </div>

              <Select>
                <SelectTrigger className="w-[150px] h-8 bg-white text-[#8a8a8a] text-xs">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
                  <SelectItem value="able-seaman">Able Seaman</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[150px] h-8 bg-white text-[#8a8a8a] text-xs">
                  <SelectValue placeholder="Vessel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil-tanker">Oil Tanker</SelectItem>
                  <SelectItem value="lpg-tanker">LPG Tanker</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="bulk">Bulk</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[150px] h-8 bg-white text-[#8a8a8a] text-xs">
                  <SelectValue placeholder="Nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="british">British</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="philippines">Philippines</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[150px] h-8 bg-white text-[#8a8a8a] text-xs">
                  <SelectValue placeholder="Appraisal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="end-of-contract">
                    End of Contract
                  </SelectItem>
                  <SelectItem value="mid-term">Mid Term</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="probation">Probation</SelectItem>
                  <SelectItem value="appraiser-s-off">
                    Appraiser S/Off
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[150px] h-8 bg-white text-[#8a8a8a] text-xs">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (4-5)</SelectItem>
                  <SelectItem value="medium">Medium (3-4)</SelectItem>
                  <SelectItem value="low">Low (1-3)</SelectItem>
                </SelectContent>
              </Select>

              <Button className="h-8 w-20 bg-[#16569e] hover:bg-[#0d4a8f] text-[11px]">
                Apply
              </Button>

              <Button
                variant="outline"
                className="h-8 w-20 text-[#8798ad] text-xs border-[#e1e8ed]"
              >
                Clear
              </Button>
              </div>
            )}



            {/* Table */}
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#16569e]">
                    <TableRow>
                      <TableHead className="text-white text-xs font-normal">
                        Crew ID
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Name
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Rank
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Nationality
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Vessel
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Vessel Type
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Sign-On
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Appraisal Type
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal text-center">
                        Appraisal
                        <br />
                        Date
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal text-center">
                        Competence
                        <br />
                        Rating
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal text-center">
                        Behavioral
                        <br />
                        Rating
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal">
                        Overall Rating
                      </TableHead>
                      <TableHead className="text-white text-xs font-normal w-24">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crewData.map((crew, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-200"
                      >
                        <TableCell className="text-[#4f5863] text-[13px] font-normal py-3">
                          {crew.id}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.name.first} {crew.name.middle} {crew.name.last}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.rank}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.nationality}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.vessel}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.vesselType}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.signOn}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal">
                          {crew.appraisalType}
                        </TableCell>
                        <TableCell className="text-[#4f5863] text-[13px] font-normal text-center">
                          {crew.appraisalDate}
                        </TableCell>
                        <TableCell className="text-center">
                          <RatingBadge
                            value={crew.competenceRating.value}
                            color={crew.competenceRating.color}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <RatingBadge
                            value={crew.behavioralRating.value}
                            color={crew.behavioralRating.color}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <RatingBadge
                            value={crew.overallRating.value}
                            color={crew.overallRating.color}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <EyeIcon className="h-[18px] w-[18px] text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEditClick(crew)}
                            >
                              <EditIcon className="h-[18px] w-[18px] text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <Trash2Icon className="h-[18px] w-[18px] text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-4 text-xs font-normal font-['Mulish',Helvetica] text-black">
              0 to 0 of 0
            </div>
          </div>
        </main>
      </div>
      {/* Appraisal Form Modal */}
      {showAppraisalForm && (
        <AppraisalForm
          crewMember={selectedCrewMember}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
