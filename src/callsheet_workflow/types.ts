export type CallsheetStatus = 
  | 'New' 
  | 'PendingTechnical' 
  | 'PendingRequesterApproval' 
  | 'ClarificationRequested' 
  | 'Completed';

export type RoleType = 'Callsheet' | 'TechnicalStore';

export interface CallsheetRequest {
  id: number;
  title: string;
  date: string;
  createdBy: string;
  driverNeeded: boolean;
  equipmentRequested: string[];
  equipmentAssigned: string[];
  status: CallsheetStatus;
  lastActionBy: RoleType;
  lastComment: string;
}
