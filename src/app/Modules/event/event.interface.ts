export interface IEvent {
  _id?: string;

  title: string;
  slug: string; 

  shortDescription: string; 
  description: string; 

  date: {
    startDate: Date;
    endDate?: Date; 
  };

  time?: {
    startTime?: string; 
    endTime?: string;   
  };

  location: {
    address: string;
    city?: string;
    country?: string;
    mapLink?: string;
  };

  coverPhoto: string; 
  gallery?: string[]; 

  category?: string; 
  tags?: string[]; 

  isOnline?: boolean; 
  registrationLink?: string;

  status: "UPCOMING" | "ONGOING" | "COMPLETED";

  createdAt?: Date;
  updatedAt?: Date;
}
