import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function usePageLoading() {
    const { status } = useSession();
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        setIsPageLoading(status === "loading");
    }, [status]);

    return { isPageLoading };
}
