import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form } from "@shared/schema";

export const AdminModule = (): JSX.Element => {
  const [location] = useLocation();
  const [selectedAdminPage, setSelectedAdminPage] = useState("forms");

  // Fetch forms data from API
  const { data: formsData = [], isLoading, error } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
    enabled: selectedAdminPage === "forms",
  });

  const handleEditClick = (form: Form) => {
    console.log("Edit form:", form);
    // TODO: Open form editing modal
  };

  const renderFormsTable = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-['Mulish',Helvetica] font-bold text-black text-[22px] ml-[19px] mr-[19px]">
          Forms Configuration
        </h1>
        <Button
          variant="outline"
          className="h-10 border-[#e1e8ed] text-[#16569e] flex items-center gap-2 ml-[19px] mr-[19px]"
        >
          <span className="text-sm">Back</span>
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="text-[#4f5863] text-sm">Loading forms...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500 text-sm">Error loading forms. Please try again.</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <Card className="border-0 shadow-none bg-[#f7fafc] rounded-lg">
          <CardContent className="p-4 bg-[#f7fafc]">
            <Table className="bg-white rounded-lg shadow-md overflow-hidden">
              <TableHeader className="bg-[#52baf3]">
                <TableRow>
                  <TableHead className="text-white text-xs font-normal">
                    Form
                  </TableHead>
                  <TableHead className="text-white text-xs font-normal">
                    Version No
                  </TableHead>
                  <TableHead className="text-white text-xs font-normal">
                    Version Date
                  </TableHead>
                  <TableHead className="text-white text-xs font-normal w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {formsData.map((form, index) => (
                  <TableRow
                    key={form.id}
                    className="border-b border-gray-200 bg-white hover:bg-gray-50"
                  >
                    <TableCell className="text-[#4f5863] text-[13px] font-normal py-3">
                      {form.name}
                    </TableCell>
                    <TableCell className="text-[#4f5863] text-[13px] font-normal">
                      {form.versionNo}
                    </TableCell>
                    <TableCell className="text-[#4f5863] text-[13px] font-normal">
                      {form.versionDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleEditClick(form)}
                        >
                          <EditIcon className="h-[18px] w-[18px] text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isLoading && !error && (
        <div className="mt-4 text-xs font-normal font-['Mulish',Helvetica] text-black">
          {formsData.length > 0 ? `1 to ${formsData.length} of ${formsData.length}` : "0 to 0 of 0"}
        </div>
      )}
    </div>
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
              <Link href="/">
                <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#E8E8E8] border-r border-gray-300 cursor-pointer hover:bg-gray-300">
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
              </Link>

              {/* Appraisals Section */}
              <Link href="/">
                <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#E8E8E8] border-r border-gray-300 cursor-pointer hover:bg-gray-300">
                  <div className="w-6 h-6 mb-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#6B7280"/>
                      <path d="M14 2V8H20" fill="#6B7280"/>
                      <path d="M16 11H8V13H16V11Z" fill="#6B7280"/>
                      <path d="M16 15H8V17H16V15Z" fill="#6B7280"/>
                    </svg>
                  </div>
                  <div className="text-[#4f5863] text-[10px] font-normal font-['Roboto',Helvetica]">
                    Appraisals
                  </div>
                </div>
              </Link>

              {/* Admin Section (Active) */}
              <div className="flex flex-col items-center justify-center w-[100px] h-[67px] bg-[#5DADE2] border-r border-gray-300">
                <div className="w-6 h-6 mb-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L15.09 8.26L23 9L17 14.74L18.18 22.02L12 19L5.82 22.02L7 14.74L1 9L8.91 8.26L12 1Z" fill="white"/>
                  </svg>
                </div>
                <div className="text-white text-[10px] font-normal font-['Mulish',Helvetica]">
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
          {/* Forms Section (Active) */}
          <div 
            className={`w-full h-[79px] flex flex-col items-center justify-center cursor-pointer ${
              selectedAdminPage === "forms" ? "bg-[#52baf3]" : "bg-[#16569e] hover:bg-[#1e5fa8]"
            }`}
            onClick={() => setSelectedAdminPage("forms")}
          >
            <div className="w-6 h-6 mb-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="white"/>
                <path d="M14 2V8H20" fill="white"/>
                <path d="M16 11H8V13H16V11Z" fill={selectedAdminPage === "forms" ? "#52baf3" : "white"}/>
                <path d="M16 15H8V17H16V15Z" fill={selectedAdminPage === "forms" ? "#52baf3" : "white"}/>
              </svg>
            </div>
            <div className="text-white text-[10px] font-normal font-['Roboto',Helvetica]">
              Forms
            </div>
          </div>
          
          {/* Dark blue section for future admin pages */}
          <div className="w-full h-[calc(100%-79px)] bg-[#16569e]">
          </div>
        </aside>

        {/* Main content */}
        <main className="absolute top-[67px] left-[67px] w-[calc(100%-67px)] h-[calc(100%-67px)]">
          {selectedAdminPage === "forms" && renderFormsTable()}
        </main>
      </div>
    </div>
  );
};