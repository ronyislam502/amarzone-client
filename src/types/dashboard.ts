export type TDashboardDateRange = "today" | "7_days" | "30_days" | "90_days" | "12_months" | "custom";

export interface TDashboardOverviewCards {
  totalRevenue: number;
  marketplaceCommission?: number;
  vendorEarnings?: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
}

export interface TDashboardUsers {
  totalUsers: number;
  totalCustomers: number;
  totalVendors: number;
  activeVendors: number;
  suspendedVendors: number;
  blockedUsers: number;
  newUsersThisMonth: number;
}

export interface TDashboardProducts {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  bestSellerProducts: number;
  categoriesCount: number;
  brandsCount: number;
}

export interface TDashboardInventory {
  totalInventory: number;
  lowStockProducts: number;
  outOfStockInventory: number;
}

export interface TDashboardPayments {
  totalSuccessfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
}

export interface TDashboardOrderPerMonth {
  year: number;
  month: number;
  count: number;
}

export interface TDashboardRevenuePerMonth {
  year: number;
  month: number;
  revenue: number;
}

export interface TDashboardDailyMetric {
  date: string;
  count?: number;
  revenue?: number;
}

export interface TDashboardOrdersAnalytics {
  ordersPerMonth: TDashboardOrderPerMonth[];
  revenuePerMonth: TDashboardRevenuePerMonth[];
  ordersPerDay: Array<{ date: string; count: number }>;
  revenuePerDay: Array<{ date: string; revenue: number }>;
}

export interface TTopSellingProduct {
  _id: string;
  totalSold: number;
  title: string;
  thumbnail?: string;
  asin?: string;
}

export interface TTopSellingCategory {
  _id: string;
  categoryName: string;
  totalQuantity: number;
}

export interface TTopSellingDepartment {
  _id: string;
  departmentName: string;
  totalQuantity: number;
}

export interface TTopVendor {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
  name: string;
  email: string;
}

export interface TTopCustomer {
  _id: string;
  totalSpent: number;
  totalOrders: number;
  name: string;
  email: string;
}

export interface TDashboardTopLists {
  topSellingProducts: TTopSellingProduct[];
  topSellingCategories: TTopSellingCategory[];
  topSellingDepartments?: TTopSellingDepartment[];
  topVendors: TTopVendor[];
  topCustomers: TTopCustomer[];
}

export interface TDashboardReviews {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number | string, number>;
}

export interface TDashboardMarketplaceHealth {
  activeSlaViolations: number;
  suspendedVendors: number;
  fraudAlerts: number;
  openDisputes: number;
  pendingRefunds: number;
}

export interface TDashboardChartPoint {
  label: string;
  value: number;
}

export interface TCategorySalesPoint {
  category: string;
  sales: number;
}

export interface TDepartmentSalesPoint {
  department: string;
  sales: number;
}

export interface TStatusCountPoint {
  status: string;
  count: number;
}

export interface TDashboardCharts {
  revenueChart?: TDashboardChartPoint[];
  ordersChart?: TDashboardChartPoint[];
  userGrowthChart?: TDashboardChartPoint[];
  categorySalesChart?: TCategorySalesPoint[];
  departmentSalesChart?: TDepartmentSalesPoint[];
  paymentStatusPieChart?: TStatusCountPoint[];
  orderStatusPieChart?: TStatusCountPoint[];
}

export interface TRecentOrder {
  _id: string;
  orderNo?: string;
  totalPrice?: number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
  customer?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  vendor?: {
    _id?: string;
    name?: string;
    email?: string;
  };
}

export interface TDashboardStatsData {
  overviewCards: TDashboardOverviewCards;
  users: TDashboardUsers;
  products: TDashboardProducts;
  inventory: TDashboardInventory;
  payments: TDashboardPayments;
  ordersAnalytics: TDashboardOrdersAnalytics;
  topLists: TDashboardTopLists;
  reviews: TDashboardReviews;
  marketplaceHealth: TDashboardMarketplaceHealth;
  charts: TDashboardCharts;
  recentActivities?: {
    recentOrders?: TRecentOrder[];
    recentRefunds?: Record<string, unknown>[];
    recentDisputes?: Record<string, unknown>[];
    recentVendors?: Record<string, unknown>[];
    recentCustomers?: Record<string, unknown>[];
  };
}

export interface TDashboardStatsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TDashboardStatsData;
}
