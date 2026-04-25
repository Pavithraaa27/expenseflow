import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import SubmitExpense from './pages/submit-expense';
import EmployeeDashboard from './pages/employee-dashboard';
import ExpenseHistory from './pages/expense-history';
import ManagerApprovalQueue from './pages/manager-approval-queue';
import Register from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define  route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/submit-expense" element={<SubmitExpense />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/expense-history" element={<ExpenseHistory />} />
        <Route path="/manager-approval-queue" element={<ManagerApprovalQueue />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
