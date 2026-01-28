import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type RegisterRequest } from "@shared/schema";
import { z } from "zod";

export function useRegisterUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      // Runtime validation before sending
      const validated = api.users.register.input.parse(data);

      const res = await fetch(api.users.register.path, {
        method: api.users.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 409) {
          const errorData = await res.json();
          // Try to parse with known error schemas
          const validationError = api.users.register.responses[400].safeParse(errorData);
          if (validationError.success) throw new Error(validationError.data.message);
          
          const conflictError = api.users.register.responses[409].safeParse(errorData);
          if (conflictError.success) throw new Error(conflictError.data.message);
        }
        throw new Error("Registration failed");
      }

      const responseData = await res.json();
      return api.users.register.responses[201].parse(responseData);
    },
    onSuccess: () => {
      // Invalidate any user-related queries if we had them (e.g., current session)
      // For now, just a placeholder as we mostly redirect
    },
  });
}
