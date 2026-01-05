import { useState, useCallback } from "react";

const useToggle = (initial = false) => {
  const [on, setOn] = useState<boolean>(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, toggle, setOn };
};

export default useToggle;
