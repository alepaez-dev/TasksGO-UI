import { useState } from 'react';

export function usePendingAction(action: () => Promise<void>) {
  const [pending, setPending] = useState(false);

  function run() {
    if (pending) return;
    setPending(true);
    void action().finally(() => setPending(false));
  }

  return { pending, run };
}
