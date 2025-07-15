export type Database = {
  public: {
    Tables: {
      registered_users: {
        Row: {
          id: number;
          created_at: string; 
          email: string | null;
          approved: boolean | null;
        };
        Insert: {
          email?: string | null;
          approved?: boolean | null;
          created_at?: string;
          id?: number;
        };
        Update: {
          email?: string | null;
          approved?: boolean | null;
          created_at?: string;
          id?: number;
        };
      };
    };
  };
};
