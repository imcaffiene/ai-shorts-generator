import { Tooltip, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

interface TooltipCreditsProps {
  credits: number;
}

/**
 * TooltipCredits Component - Displays user credit balance with pricing access
 * 
 * Features:
 * - Shows credit count with lightning bolt icon
 * - Tooltip displays remaining credits and pricing button
 * - Optimized for performance and accessibility
 * - Uses Next.js client-side navigation for better UX
 */
export default function TooltipCredits({ credits }: TooltipCreditsProps) {
  const router = useRouter();


  const handlePricingNavigation = useCallback(() => {
    router.push("/pricing");
  }, [router]);


  const tooltipContent = useMemo(() => (
    <div className="flex flex-col items-center gap-2 p-2">
      <span className="text-sm font-medium">
        You currently have <strong>{credits}</strong> credit{credits !== 1 ? 's' : ''} left
      </span>

      <Button
        variant="flat"
        size="sm"
        onPress={handlePricingNavigation}
        className="bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] to-[#1C2D70] font-medium cursor-pointer text-xs py-1 px-3 min-w-[80px] transition-opacity duration-200"
        aria-label="Navigate to pricing page to purchase more credits"
      >
        Get More
      </Button>
    </div>
  ), [credits, handlePricingNavigation]);

  const creditStatus = useMemo(() => {
    if (credits === 0) return { color: "#FF4444", message: "No credits remaining" };
    if (credits <= 5) return { color: "#FF8800", message: "Low credits" };
    return { color: "#FFD700", message: `${credits} credits available` };
  }, [credits]);

  return (
    <Tooltip
      size="sm"
      showArrow
      delay={200}
      closeDelay={100}
      classNames={{
        base: [
          "before:bg-neutral-400 dark:before:bg-white",
        ],
        content: [
          "py-2 px-4 shadow-xl border border-gray-200 dark:border-gray-700",
          "text-black bg-gradient-to-br from-white to-neutral-100 dark:from-gray-800 dark:to-gray-700 dark:text-white rounded-2xl"
        ],
      }}
      content={tooltipContent}
      placement="bottom"
    >
      <Button
        variant="flat"
        size="sm"
        className={`flex items-center gap-2 min-w-fit px-3 py-1 transition-all duration-200 ${credits === 0
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:scale-105 hover:shadow-sm'
          }`}
        aria-label={creditStatus.message}
        disabled={false}
      >
        {/* Lightning bolt icon with dynamic color based on credit status */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ color: creditStatus.color }}
          className="flex-shrink-0"
        >
          <path d="M13.2319 2.28681C13.5409 2.38727 13.75 2.6752 13.75 3.00005V9.25005H19C19.2821 9.25005 19.5403 9.40834 19.6683 9.65972C19.7963 9.9111 19.7725 10.213 19.6066 10.4412L11.6066 21.4412C11.4155 21.7039 11.077 21.8137 10.7681 21.7133C10.4591 21.6128 10.25 21.3249 10.25 21.0001V14.7501H5C4.71791 14.7501 4.45967 14.5918 4.33167 14.3404C4.20366 14.089 4.22753 13.7871 4.39345 13.5589L12.3935 2.55892C12.5845 2.2962 12.923 2.18635 13.2319 2.28681Z" />
        </svg>

        <span
          className={`text-sm font-medium ${credits === 0 ? 'text-red-600 dark:text-red-400' :
            credits <= 5 ? 'text-orange-600 dark:text-orange-400' :
              'text-gray-800 dark:text-gray-200'
            }`}
        >
          {credits}
        </span>
      </Button>
    </Tooltip>
  );
}
