export interface DemoGift {
  id: string;
  sender: string;
  amount: string;
  messageVideo: File;
  date: Date;
  memories: {
    id: string;
    imageUrl: string;
    caption: string;
    date: Date;
  }[];
}

export const demoGifts: Record<string, DemoGift> = {
  "gift-1": {
    id: "gift-1",
    sender: "John Doe",
    amount: "50",
    messageVideo: new File([], "mock-video.mp4"),
    date: new Date("2024-02-14"),
    memories: [
      {
        id: "1",
        imageUrl: "/placeholder.svg",
        caption: "Remember this day?",
        date: new Date("2024-02-14")
      }
    ]
  },
  "gift-2": {
    id: "gift-2",
    sender: "Jane Smith",
    amount: "100",
    messageVideo: new File([], "mock-video.mp4"),
    date: new Date("2024-01-01"),
    memories: [
      {
        id: "2",
        imageUrl: "/placeholder.svg",
        caption: "Such a great moment!",
        date: new Date("2024-01-01")
      }
    ]
  }
};