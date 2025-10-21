export type BookingType = 'Incoming Feed' | 'Guest for iNEWS Rundown';

export type WorkflowState = 
  | 'Draft'
  | 'Submitted'
  | 'With NOC'
  | 'Clarification Requested'
  | 'Resources Added'
  | 'With Ingest'
  | 'Completed'
  | 'Not Done';

export type Role = 'Booking' | 'NOC' | 'Ingest' | 'Admin';

export type Priority = 'Normal' | 'High' | 'Urgent';

export type Language = 'English' | 'Arabic';

export type SourceType = 'vMix' | 'SRT' | 'Satellite';

export type YesNo = 'Yes' | 'No';

export type ReturnPath = 'Enabled' | 'Disabled';

export type KeyFill = 'None' | 'Key' | 'Fill';

export interface BaseRequest {
  id: string;
  bookingType: BookingType;
  title: string;
  programSegment: string;
  airDateTime: string;
  language: Language;
  priority: Priority;
  nocRequired: YesNo;
  resourcesNeeded: string;
  newsroomTicket: string;
  complianceTags: string;
  notes: string;
  state: WorkflowState;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomingFeedRequest extends BaseRequest {
  bookingType: 'Incoming Feed';
  sourceType: SourceType;
  vmixInputNumber?: string;
  returnPath: ReturnPath;
  keyFill: KeyFill;
}

export interface GuestRundownRequest extends BaseRequest {
  bookingType: 'Guest for iNEWS Rundown';
  guestName: string;
  guestContact: string;
  inewsRundownId: string;
  storySlug: string;
  rundownPosition: string;
}

export type WorkflowRequest = IncomingFeedRequest | GuestRundownRequest;

export interface WorkflowTransition {
  id: string;
  requestId: string;
  fromState: WorkflowState;
  toState: WorkflowState;
  actor: string;
  role: Role;
  notes: string;
  timestamp: string;
}

export interface ResourceAllocation {
  id: string;
  requestId: string;
  resourceType: string;
  details: string;
  allocatedBy: string;
  allocatedAt: string;
}

export interface Notification {
  id: string;
  requestId: string;
  recipient: Role;
  message: string;
  read: boolean;
  createdAt: string;
}
