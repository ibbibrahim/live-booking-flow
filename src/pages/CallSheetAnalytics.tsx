import { useState, useMemo } from "react";
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
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockCallSheets, getUniqueCrewRoles, getCrewMembersByRole, getAllCrewMembers } from "@/data/mockCallSheets";

const TIME_PERIODS = [
  { label: "24 hours", value: 1 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "12 months", value: 365 },
];

export default function CallSheetAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCrewMembers, setSelectedCrewMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<number>(30);
  const [crewSearchQuery, setCrewSearchQuery] = useState("");
  const [openCrewDropdown, setOpenCrewDropdown] = useState(false);

  // Get unique crew roles from mock data
  const CREW_ROLES = useMemo(() => getUniqueCrewRoles(), []);

  // Get crew members based on selected roles
  const availableCrewMembers = useMemo(() => {
    if (selectedRoles.length === 0) {
      return getAllCrewMembers();
    }
    
    const members = new Set<string>();
    selectedRoles.forEach(role => {
      getCrewMembersByRole(role).forEach(name => members.add(name));
    });
    return Array.from(members).sort();
  }, [selectedRoles]);

  // Filter crew members by search query
  const filteredCrewMembers = useMemo(() => {
    if (!crewSearchQuery) return availableCrewMembers;
    return availableCrewMembers.filter(name =>
      name.toLowerCase().includes(crewSearchQuery.toLowerCase())
    );
  }, [availableCrewMembers, crewSearchQuery]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCrewMemberToggle = (name: string) => {
    setSelectedCrewMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleClearFilters = () => {
    setDateRange(undefined);
    setSelectedRoles([]);
    setSelectedCrewMembers([]);
    setSearchQuery("");
    setCrewSearchQuery("");
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
    dateRange || selectedRoles.length > 0 || selectedCrewMembers.length > 0 || searchQuery;

  // Filter call sheets based on all criteria
  const filteredCallSheets = useMemo(() => {
    return mockCallSheets.filter(sheet => {
      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        const sheetDate = new Date(sheet.date);
        if (dateRange.from && sheetDate < dateRange.from) return false;
        if (dateRange.to && sheetDate > dateRange.to) return false;
      }

      // Search query filter (searches all fields)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = `${sheet.title} ${sheet.program} ${sheet.location} ${sheet.status} ${sheet.crew.map(c => `${c.name} ${c.role}`).join(' ')}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Role filter
      if (selectedRoles.length > 0) {
        const hasRole = sheet.crew.some(member => selectedRoles.includes(member.role));
        if (!hasRole) return false;
      }

      // Crew member filter
      if (selectedCrewMembers.length > 0) {
        const hasCrewMember = sheet.crew.some(member => selectedCrewMembers.includes(member.name));
        if (!hasCrewMember) return false;
      }

      return true;
    });
  }, [dateRange, searchQuery, selectedRoles, selectedCrewMembers]);

  // Calculate analytics based on filtered data
  const analytics = useMemo(() => {
    const totalCallSheets = filteredCallSheets.length;
    const uniqueCrewMembers = new Set<string>();
    let totalCrewSize = 0;
    let totalDuration = 0;
    let completedCount = 0;

    filteredCallSheets.forEach(sheet => {
      sheet.crew.forEach(member => uniqueCrewMembers.add(member.name));
      totalCrewSize += sheet.crewSize;
      totalDuration += sheet.duration;
      if (sheet.status === 'Completed') completedCount++;
    });

    const avgCrewSize = totalCallSheets > 0 ? (totalCrewSize / totalCallSheets).toFixed(1) : '0';
    const completionRate = totalCallSheets > 0 ? Math.round((completedCount / totalCallSheets) * 100) : 0;
    const avgDuration = totalCallSheets > 0 ? (totalDuration / totalCallSheets).toFixed(1) : '0';

    return {
      totalCallSheets,
      uniqueCrewMembers: uniqueCrewMembers.size,
      avgCrewSize,
      completionRate,
      avgDuration,
    };
  }, [filteredCallSheets]);

  // Calculate detailed crew member statistics when members are selected
  const crewMemberDetailedStats = useMemo(() => {
    if (selectedCrewMembers.length === 0) return null;

    // Individual stats for each selected member
    const individualStats = selectedCrewMembers.map(memberName => {
      const memberSheets = filteredCallSheets.filter(sheet =>
        sheet.crew.some(crew => crew.name === memberName)
      );

      const totalAssignments = memberSheets.length;
      const totalHoursWorked = memberSheets.reduce((sum, sheet) => sum + sheet.duration, 0);
      const avgDurationPerCallsheet = totalAssignments > 0 ? totalHoursWorked / totalAssignments : 0;

      // Get all roles this member worked in
      const roles = new Set<string>();
      memberSheets.forEach(sheet => {
        sheet.crew.forEach(crew => {
          if (crew.name === memberName) {
            roles.add(crew.role);
          }
        });
      });

      return {
        name: memberName,
        totalAssignments,
        totalHoursWorked,
        avgDurationPerCallsheet,
        roles: Array.from(roles),
      };
    });

    // Combined stats for all selected members
    const combinedTotalHours = individualStats.reduce((sum, stat) => sum + stat.totalHoursWorked, 0);
    const avgHoursPerMember = combinedTotalHours / selectedCrewMembers.length;

    return {
      individualStats,
      combinedTotalHours,
      avgHoursPerMember,
    };
  }, [filteredCallSheets, selectedCrewMembers]);

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

              <Popover open={openCrewDropdown} onOpenChange={setOpenCrewDropdown}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span>
                      {selectedCrewMembers.length === 0
                        ? "Select Crew Members"
                        : `${selectedCrewMembers.length} member(s) selected`}
                    </span>
                    <Filter className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-background" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search crew members..." 
                      value={crewSearchQuery}
                      onValueChange={setCrewSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No crew member found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCrewMembers.map((name) => (
                          <CommandItem
                            key={name}
                            onSelect={() => handleCrewMemberToggle(name)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className={cn(
                                "h-4 w-4 border rounded flex items-center justify-center",
                                selectedCrewMembers.includes(name) && "bg-primary border-primary"
                              )}>
                                {selectedCrewMembers.includes(name) && (
                                  <div className="h-2 w-2 bg-primary-foreground rounded-sm" />
                                )}
                              </div>
                              <span>{name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                {selectedCrewMembers.map((name) => (
                  <Badge key={name} variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCrewMemberToggle(name)}
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

        {/* Analytics Content - Dynamic Cards */}
        {selectedCrewMembers.length === 0 ? (
          // General Analytics
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Call Sheets</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCallSheets}</div>
                <p className="text-xs text-muted-foreground">
                  {hasActiveFilters ? 'Matching filters' : 'All call sheets'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Crew Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueCrewMembers}</div>
                <p className="text-xs text-muted-foreground">Across all departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Crew Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgCrewSize}</div>
                <p className="text-xs text-muted-foreground">Per call sheet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                <p className="text-xs text-muted-foreground">On-time completions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgDuration}h</div>
                <p className="text-xs text-muted-foreground">Per call sheet</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Crew Member Detailed Statistics */}
        {crewMemberDetailedStats && (
          <>
            {/* Combined Stats */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Combined Statistics ({selectedCrewMembers.length} {selectedCrewMembers.length === 1 ? 'Member' : 'Members'})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Aggregated work hours and performance metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Hours Worked (Combined)</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">{crewMemberDetailedStats.combinedTotalHours.toFixed(1)}h</div>
                    <p className="text-xs text-muted-foreground">
                      Across all selected crew members
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Hours per Member</span>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">{crewMemberDetailedStats.avgHoursPerMember.toFixed(1)}h</div>
                    <p className="text-xs text-muted-foreground">
                      {crewMemberDetailedStats.combinedTotalHours.toFixed(1)}h ÷ {selectedCrewMembers.length} members
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Member Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Individual Member Statistics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown for each selected crew member
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crewMemberDetailedStats.individualStats.map((stat, index) => (
                    <div
                      key={stat.name}
                      className={cn(
                        "border rounded-lg p-4 space-y-3 transition-colors hover:bg-accent/50",
                        index !== crewMemberDetailedStats.individualStats.length - 1 && "mb-4"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{stat.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {stat.roles.map((role) => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Member {index + 1} of {selectedCrewMembers.length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Total Assignments</span>
                          </div>
                          <div className="text-2xl font-bold">{stat.totalAssignments}</div>
                          <p className="text-xs text-muted-foreground">Call sheets worked</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Total Hours</span>
                          </div>
                          <div className="text-2xl font-bold">{stat.totalHoursWorked.toFixed(1)}h</div>
                          <p className="text-xs text-muted-foreground">Time worked</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Average Duration</span>
                          </div>
                          <div className="text-2xl font-bold">{stat.avgDurationPerCallsheet.toFixed(1)}h</div>
                          <p className="text-xs text-muted-foreground">Per call sheet</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Main Analytics Area - Call Sheets List */}
        <Card>
          <CardHeader>
            <CardTitle>Call Sheet Timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredCallSheets.length} call sheet{filteredCallSheets.length !== 1 ? 's' : ''} found
            </p>
          </CardHeader>
          <CardContent>
            {filteredCallSheets.length > 0 ? (
              <div className="space-y-4">
                {filteredCallSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{sheet.title}</h3>
                        <p className="text-sm text-muted-foreground">{sheet.program}</p>
                      </div>
                      <Badge
                        variant={
                          sheet.status === 'Completed'
                            ? 'default'
                            : sheet.status === 'In Progress'
                            ? 'secondary'
                            : sheet.status === 'Scheduled'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {sheet.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(sheet.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{sheet.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Crew Size</p>
                        <p className="font-medium">{sheet.crewSize} members</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{sheet.duration}h</p>
                      </div>
                    </div>
                    {selectedCrewMembers.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Selected crew on this call sheet:</p>
                        <div className="flex flex-wrap gap-2">
                          {sheet.crew
                            .filter(member => selectedCrewMembers.includes(member.name))
                            .map((member, idx) => (
                              <Badge key={idx} variant="secondary">
                                {member.name} - {member.role}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                No call sheets match the current filters
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
