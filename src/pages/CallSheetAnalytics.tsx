import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Download,
  Search,
  Filter,
  X,
  BarChart3,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CREW_ROLES = [
  "Camera Operator",
  "Producer",
  "Audio Engineer",
  "Lighting Technician",
  "Director",
  "Assistant Director",
  "Grip",
  "Gaffer",
  "Sound Mixer",
  "Production Assistant",
];

const PROGRAMS = [
  "Morning Show",
  "Evening News",
  "Weekend Edition",
  "Special Report",
  "Documentary Series",
  "Live Events",
];

const TIME_PERIODS = [
  { label: "24 hours", value: 1 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "12 months", value: 365 },
];

export default function CallSheetAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<number>(30);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleProgramToggle = (program: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(program) ? prev.filter((p) => p !== program) : [...prev, program]
    );
  };

  const handleClearFilters = () => {
    setDateRange(undefined);
    setSelectedRoles([]);
    setSelectedPrograms([]);
    setSearchQuery("");
  };

  const handleExport = () => {
    setIsLoading(true);
    // Simulate export
    setTimeout(() => {
      setIsLoading(false);
      // Export logic would go here
    }, 1500);
  };

  const hasActiveFilters =
    dateRange || selectedRoles.length > 0 || selectedPrograms.length > 0 || searchQuery;

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Call Sheet Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze call sheet performance and crew assignments
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={isLoading}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Exporting..." : "Export to Excel"}
          </Button>
        </div>

        {/* Time Period Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          {TIME_PERIODS.map((period) => (
            <Button
              key={period.value}
              variant={selectedTimePeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimePeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Filters Bar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                {showFilters ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className={cn("space-y-4", !showFilters && "hidden lg:block")}>
            {/* First Row: Date Range and Search */}
            <div className="grid gap-4 md:grid-cols-2">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                className="w-full"
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all fields (title, location, crew, program...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Second Row: Multi-selects */}
            <div className="grid gap-4 md:grid-cols-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span>
                      {selectedRoles.length === 0
                        ? "Select Crew Roles"
                        : `${selectedRoles.length} role(s) selected`}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background">
                  {CREW_ROLES.map((role) => (
                    <DropdownMenuCheckboxItem
                      key={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => handleRoleToggle(role)}
                    >
                      {role}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span>
                      {selectedPrograms.length === 0
                        ? "Select Programs"
                        : `${selectedPrograms.length} program(s) selected`}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background">
                  {PROGRAMS.map((program) => (
                    <DropdownMenuCheckboxItem
                      key={program}
                      checked={selectedPrograms.includes(program)}
                      onCheckedChange={() => handleProgramToggle(program)}
                    >
                      {program}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {dateRange && (
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Date Range
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setDateRange(undefined)}
                    />
                  </Badge>
                )}
                {selectedRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {role}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRoleToggle(role)}
                    />
                  </Badge>
                ))}
                {selectedPrograms.map((program) => (
                  <Badge key={program} variant="secondary" className="gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {program}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleProgramToggle(program)}
                    />
                  </Badge>
                ))}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    <Search className="h-3 w-3" />
                    "{searchQuery}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-7 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Content - Placeholder */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Call Sheets</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+12% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Crew Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Crew Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5</div>
              <p className="text-xs text-muted-foreground">Per call sheet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">On-time completions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Area - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Call Sheet Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Charts and detailed analytics will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
