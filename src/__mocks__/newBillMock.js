export const newBillMock = {
  data: {
    email: "test@test.com",
    type: "Transport",
    name: "Taxi ride",
    amount: 50,
    date: "2023-06-01",
    vat: "10",
    pct: 20,
    commentary: "Business trip",
    fileUrl: "https://example.com/test.jpg",
    fileName: "test.jpg",
    status: "pending",
  },
  store: {
    bills: jest.fn(() => ({
      create: jest.fn().mockResolvedValue({
        fileUrl: "https://example.com/test.jpg",
        key: "1234",
      }),
      update: jest.fn().mockResolvedValue({}),
    })),
  },
};