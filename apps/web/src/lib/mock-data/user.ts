import type { User } from "#lib/types"

export const mockUser: User = {
  id: "user-001",
  name: "Alex Morgan",
  email: "alex@example.com",
}

export function getMockUser(): User {
  return mockUser
}
