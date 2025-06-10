import { lazy, Suspense, type ReactNode } from "react";
import RecordBox from "../components/RecordBox";
import { ErrorBoundary } from "react-error-boundary";
import type { IconType } from "react-icons/lib";
import Title from "../../../components/Title";

const LazyTotalSales = lazy(
  () => import("./components/reports-page/report-stats/TotalSales")
);
type ReportStatProps = {
  children: ReactNode;
  label: string;
  value: string;
  Icon?: IconType;
  className?: string;
};
function ReportStat({ children, ...props }: ReportStatProps) {
  return (
    <Suspense fallback={<RecordBox {...props} isLoading={true} />}>
      <ErrorBoundary fallback={<RecordBox {...props} isLoading={true} />}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}
function Reports() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 justify-center items-center gap-2 h-auto lg:h-full overflow-y-auto">
      <Title title="Reports" />
      <ReportStat value="" label="Total Sales">
        <LazyTotalSales />
      </ReportStat>
    </div>
  );
}

export default Reports;
