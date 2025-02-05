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
    sender: "Sarah Johnson",
    amount: "$50.00",
    messageVideo: new File([], "birthday-wishes.mp4"),
    date: new Date("2024-02-14"),
    memories: [
      {
        id: "1",
        imageUrl: "/placeholder.svg",
        caption: "Remember our amazing day at the beach? Happy Birthday! 🎉",
        date: new Date("2024-02-14")
      },
      {
        id: "2",
        imageUrl: "/placeholder.svg",
        caption: "That time we went hiking! 🏔️",
        date: new Date("2024-02-13")
      }
    ]
  },
  "gift-2": {
    id: "gift-2",
    sender: "Mike Anderson",
    amount: "$100.00",
    messageVideo: new File([], "graduation-congrats.mp4"),
    date: new Date("2024-01-01"),
    memories: [
      {
        id: "3",
        imageUrl: "/placeholder.svg",
        caption: "Congratulations on your graduation! 🎓",
        date: new Date("2024-01-01")
      }
    ]
  }
};