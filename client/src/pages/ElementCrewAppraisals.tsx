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
        <header className="w-full h-[67px] bg-[url(/figmaAssets/group.png)] bg-cover">
          <div className="flex items-center h-full">
            <img
              className="w-14 h-10 ml-2.5 mt-2.5"
              alt="Logo"
              src="/figmaAssets/group-2.png"
            />
            <img
              className="w-[87px] h-[65px] ml-[133px]"
              alt="Group"
              src="/figmaAssets/group-4.png"
            />

            <nav className="flex ml-[40px] mt-[38px]">
              <div className="text-[#4f5863] text-[10px] font-normal font-['Mulish',Helvetica]">
                Crewing
              </div>
              <div className="text-slate-50 text-[10px] font-normal font-['Roboto',Helvetica] ml-[80px]">
                Appraisals
              </div>
              <div className="text-[#4f5863] text-[11px] font-normal font-['Mulish',Helvetica] ml-[89px]">
                Admin
              </div>
            </nav>

            <img
              className="w-[38px] h-[37px] absolute top-2.5 right-[38px]"
              alt="User"
              src="/figmaAssets/group-3.png"
            />
          </div>
        </header>

        {/* Left sidebar */}
        <aside className="w-[67px] h-[834px] bg-[url(/figmaAssets/group-1.png),_url(/figmaAssets/group-6.png)] bg-no-repeat bg-[position:0_66px,_0_145px] absolute left-0 top-[66px]">
          <div className="w-3.5 h-3 absolute top-[116px] left-7 text-[#eff9fe] text-[10px] font-normal font-['Roboto',Helvetica]">
            All
          </div>
        </aside>

        {/* Main content */}
        <main className="absolute top-[67px] left-[67px] w-[calc(100%-67px)] h-[calc(100%-67px)]">
          <div className="p-6">
            <h1 className="font-['Mulish',Helvetica] font-bold text-black text-[22px] mb-6">
              Crew Appraisals
            </h1>

            {/* Filters */}
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

            <div className="absolute right-6 top-[85px] flex items-center">
              <Button
                variant="outline"
                className="h-10 border-[#e1e8ed] text-[#16569e] flex items-center gap-2"
              >
                <FilterIcon className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </Button>
            </div>

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
