// Mascot
export interface IMascot {
  name: string;
  currentOutfit: string;
  unlockedOutfits: string[];
  reactions: {
    [key: string]: {
      animation: string;
      sound?: string;
      message?: string;
    };
  };
}
