export type User = {
  id: string;
  email: string;
  role: 'loan_officer';
  companyName: string;
  phoneNumber: string;
  location: string;
  subscriptionTier: 'basic' | 'premium';
  quotaRemaining: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LoanEstimate = {
  id: string;
  borrowerId: string;
  loanAmount: number;
  propertyValue: number;
  location: string;
  loanTerm: number;
  borrowerNotes?: string;
  status: 'open' | 'assigned' | 'closed';
  createdAt: Date;
  updatedAt: Date;
};

export type Bid = {
  id: string;
  loanEstimateId: string;
  loanOfficerId: string;
  amount: number;
  status: 'active' | 'won' | 'lost';
  createdAt: Date;
  updatedAt: Date;
};

export type Lead = {
  id: string;
  loanEstimateId: string;
  loanOfficerId: string;
  borrowerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'closed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'new_estimate' | 'outbid' | 'won_bid' | 'lead_update';
  message: string;
  read: boolean;
  createdAt: Date;
};
