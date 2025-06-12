import { lazy, Suspense, type ReactNode } from "react";
import RecordBox from "../components/RecordBox";
import { ErrorBoundary } from "react-error-boundary";
import type { IconType } from "react-icons/lib";
import Title from "../../../components/Title";
import { IoCashOutline } from "react-icons/io5";
const LazyTotalSales = lazy(
  () => import("./components/reports-page/report-stats/TotalSales")
);
const LazyTotalProductSold = lazy(
  () => import("./components/reports-page/report-stats/TotalProductsSold")
);
const LazyBestSeller = lazy(
  () => import("./components/reports-page/report-stats/BestSellerProduct")
);
const LazyLeastSeller = lazy(
  () => import("./components/reports-page/report-stats/LeastSellerProduct")
);
const LazyHighestRatingCashier = lazy(
  () => import("./components/reports-page/report-stats/HighestRatingCashier")
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
    <div className="grid grid-cols-2 lg:grid-rows-5 lg:grid-cols-4 justify-center items-center gap-2 h-auto overflow-y-auto pt-2">
      <Title title="Reports" />
      <ReportStat value="" label="Total Sales" Icon={IoCashOutline}>
        <LazyTotalSales />
      </ReportStat>
      <ReportStat value="" label="Total Products Sold">
        <LazyTotalProductSold />
      </ReportStat>
      <ReportStat value="" label="Best Seller Product">
        <LazyBestSeller />
      </ReportStat>
      <ReportStat value="" label="Least Seller Product">
        <LazyLeastSeller />
      </ReportStat>
      <ReportStat
        value=""
        label="Top 3 Highest Rating Cashier"
        className="row-span-3"
      >
        <LazyHighestRatingCashier />
      </ReportStat>
    </div>
  );
}

export default Reports;
