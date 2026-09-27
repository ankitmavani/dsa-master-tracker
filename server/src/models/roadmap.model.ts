export interface YoutubePlaylist {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  channel: string;
}

export interface Book {
  id: string;
  title: string;
  url: string;
  cover: string;
  author: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  links: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  type: "problem" | "learning";
  totalDays: number;
  color: string;
  icon: string;

  youtubePlaylists: YoutubePlaylist[];
  books: Book[];
  notes: Note[];

  createdAt: Date;
}
