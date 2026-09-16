"use client";

import { Button } from"@/components/ui/button";
import { Loading02Icon } from "hugeicons-react";
import { useFormStatus } from"react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-11  shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all font-medium text-sm mt-4"
    >
      {pending ? (
        <>
          <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : ("Sign In to Dashboard"
      )}
    </Button>
  );
}
