// src/types/index.ts
export type Role = '' | 'PCA' | 'HHA' | 'RN'| 'Office Coordinator' | 'DPS' | 'Therapist - PT' | 'Therapist - OT' | 'Therapist - RT' | 'Field RN';

export interface UserData {
  name: string;
  photo: File | null;
  // Keep this temporarily so the current preview doesn't break — we'll remove it
  // in the next step when we update the preview.
  staffType?: string;
  role: Role;             // NEW
}

export const getStaffType = (role: Role) =>
  role === 'RN' || role === 'DPS' || role === 'Therapist - PT' || role === 'Therapist - OT' || role === 'Therapist - RT' || role === 'Field RN'
    ? 'MEDICAL STAFF'
    : role === 'PCA' || role === 'HHA' || role === 'Office Coordinator'
    ? 'NON-MEDICAL STAFF'
    : '';
